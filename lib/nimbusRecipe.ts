import { types } from "@mozilla/nimbus-shared";
import { BranchInfo, RecipeInfo, RecipeOrBranchInfo } from "../app/columns.jsx";
import {
  getDashboard,
  getSurfaceDataForTemplate,
  getPreviewLink,
  getTemplateFromMessage,
} from "../lib/messageUtils.ts";
import {
  getProposedEndDate,
  MESSAGING_EXPERIMENTS_DEFAULT_FEATURES,
  _substituteLocalizations,
  formatDate,
} from "../lib/experimentUtils.ts";
import { getExperimentLookerDashboardDate } from "./lookerUtils.ts";

type NimbusExperiment = types.experiments.NimbusExperiment;

type DocumentationLink = {
  title: string;
  link: string;
};

function isMessagingFeature(featureId: string): boolean {
  return MESSAGING_EXPERIMENTS_DEFAULT_FEATURES.includes(featureId);
}

// Get the first messaging feature object in a branch.
// XXX should handle the cases where there are none
function getFirstMessagingFeature(branch: any): any {
  const index = branch.features.findIndex((feature: any) =>
    isMessagingFeature(feature.featureId),
  );

  return branch.features[index];
}

/**
 * @returns true if branchInfo has a microsurvey. Currently, we are
 * doing a heuristic check over the branchInfo id, slug, description,
 * and userFacingName for the 'survey' substring.
 */
function _branchInfoHasMicrosurvey(branchInfo: BranchInfo): boolean {
  if (
    branchInfo.id.toLowerCase().includes("survey") ||
    branchInfo.slug.toLowerCase().includes("survey") ||
    (branchInfo.description &&
      branchInfo.description.toLowerCase().includes("survey")) ||
    (branchInfo.userFacingName &&
      branchInfo.userFacingName.toLowerCase().includes("survey"))
  ) {
    return true;
  }
  return false;
}

type NimbusRecipeType = {
  _rawRecipe: NimbusExperiment;
  _isCompleted: boolean;

  getRecipeInfo(): RecipeInfo;
  getRecipeOrBranchInfos(): RecipeOrBranchInfo[];
  getBranchInfo(branch: any): BranchInfo;
  getBranchInfos(): BranchInfo[];
  getBranchScreenshotsLink(branchSlug: string): string;
  usesMessagingFeatures(): boolean;
  isExpRecipe(): boolean;
  getBranchRecipeLink(branchSlug: string): string;
};

export class NimbusRecipe implements NimbusRecipeType {
  _rawRecipe;
  _isCompleted;

  constructor(recipe: NimbusExperiment, isCompleted: boolean = false) {
    this._rawRecipe = recipe;
    this._isCompleted = isCompleted;
  }

  /**
   * @returns an array of BranchInfo objects, one per branch in this recipe
   */
  getBranchInfo(branch: any): BranchInfo {
    let branchInfo: BranchInfo = {
      product: "Desktop",
      id: branch.slug,
      isBranch: true,
      // The raw experiment data can be automatically serialized to
      // the client by NextJS (but classes can't), and any
      // needed NimbusRecipe class rewrapping can be done there.
      nimbusExperiment: this._rawRecipe,
      slug: branch.slug,
      screenshots: branch.screenshots,
      description: branch.description,
    };

    // XXX right now we don't support more than one messaging feature
    const feature = getFirstMessagingFeature(branch);

    // XXX in this case we're really passing a feature value. Hmm....
    // about:welcome is special and doesn't use the template property,
    // so we have to assign it directly to treatment branches. The
    // control branch doesn't have a message, so we don't want to assign
    // a surface to it.
    let template;
    if (feature.featureId === "aboutwelcome" && branch.slug != "control") {
      // XXXdmose nasty hack to prevent what I'm calling
      // "non-messaging-aboutwelcome" features from breaking
      // Skylight completely. Need to talk to Jason and Meg to
      // understand more details and figure out what to do here...
      if (Object.keys(feature.value).length <= 1) {
        branchInfo.template = branch.template = "non-messaging-aboutwelcome";
        return branchInfo;
      }

      template = "aboutwelcome";
    } else if (
      feature.featureId === "whatsNewPage" &&
      branch.slug != "control"
    ) {
      // XXX whatsNewPage doesn't have a template property so we need to
      // assign it directly in order for it to display a surface
      template = "whatsNewPage";
    } else {
      template = getTemplateFromMessage(feature.value);
    }

    branch.template = template;
    branchInfo.template = template;
    branchInfo.surface = getSurfaceDataForTemplate(template).surface;
    branchInfo.hasMicrosurvey = _branchInfoHasMicrosurvey(branchInfo);

    switch (template) {
      case "aboutwelcome":
        branchInfo.id = feature.value.id;
        // Only create a preview object if there's something to preview
        if (feature.value.hasOwnProperty("screens")) {
          // featureValue will become the "content" object in a spotlight JSON
          let spotlightFake = {
            id: this._rawRecipe.id,
            template: "spotlight",
            targeting: true,
            content: feature.value,
          };
          // Add the modal property to the spotlight to mimic about:welcome
          spotlightFake.content.modal = "tab";
          // The recipe might have a backdrop, but if not, fall back to the default
          spotlightFake.content.backdrop =
            feature.value.backdrop ||
            "var(--mr-welcome-background-color) var(--mr-welcome-background-gradient)";
          // Localize the recipe if necessary.
          let localizedWelcome = _substituteLocalizations(
            spotlightFake,
            this._rawRecipe.localizations?.[
              Object.keys(this._rawRecipe.localizations)[0]
            ],
          );

          branchInfo.previewLink = getPreviewLink(localizedWelcome);
        }
        break;

      case "feature_callout":
        // XXX should iterate over all screens
        //
        // NOTE: Some branches have incorrect ":treatment-a" attached to the end
        // of the id, which is breaking the Looker dashboard links
        // (see https://bugzilla.mozilla.org/show_bug.cgi?id=1902424).
        // The problem was in the recipe JSON in Experimenter, likely a user error
        // during experiment creation that involved some cloning or copy/paste.
        //
        // XXX consider pulling branch ids from somewhere else that is validated
        // by Experimenter, to avoid similar user errors in branch ids.
        branchInfo.id = feature.value.content.screens[0].id.split(":")[0];
        // Localize the feature callout if necessary
        let localizedFeatureCallout = _substituteLocalizations(
          feature.value,
          this._rawRecipe.localizations?.[
            Object.keys(this._rawRecipe.localizations)[0]
          ],
        );
        // Use the localized object to generate the previewlink
        branchInfo.previewLink = getPreviewLink(localizedFeatureCallout);
        break;

      case "infobar":
        branchInfo.id = feature.value.id;
        // Localize the recipe if necessary.
        // XXX [Object.keys(recipe.localizations)[0]] accesses the first locale inside the localization object.
        // We'll probably want to add a dropdown component that allows us to choose a locale from the available ones, to pass to this function.
        let localizedInfobar = _substituteLocalizations(
          feature.value.content,
          this._rawRecipe.localizations?.[
            Object.keys(this._rawRecipe.localizations)[0]
          ],
        );
        branchInfo.previewLink = getPreviewLink(localizedInfobar);
        break;

      case "toast_notification":
        if (!feature.value?.id) {
          console.warn("value.id, v = ", feature.value);
          return branchInfo;
        }
        branchInfo.id = feature.value.content.tag;
        break;

      case "spotlight":
        branchInfo.id = feature.value.id;
        // Localize the recipe if necessary.
        let localizedSpotlight = _substituteLocalizations(
          feature.value,
          this._rawRecipe.localizations?.[
            Object.keys(this._rawRecipe.localizations)[0]
          ],
        );
        branchInfo.previewLink = getPreviewLink(localizedSpotlight);
        break;

      case "multi":
        // XXX only does first messages
        const firstMessage = feature.value.messages[0];
        if (!("content" in firstMessage)) {
          // console.warn(
          //   'template "multi" first message does not contain content key details not rendered',
          // );
          return branchInfo;
        }

        // XXX only does first screen
        branchInfo.id = firstMessage.content.screens[0].id;
        // Localize the recipe if necessary.
        let localizedMulti = _substituteLocalizations(
          feature.value.messages[0],
          this._rawRecipe.localizations?.[
            Object.keys(this._rawRecipe.localizations)[0]
          ],
        );
        // XXX assumes previewable message (spotight?)
        branchInfo.previewLink = getPreviewLink(localizedMulti);
        break;

      case "momentsUpdate":
        console.warn(`we don't fully support moments messages yet`);
        return branchInfo;

      default:
        if (!feature.value?.messages) {
          // console.log("v.messages is null");
          // console.log(", feature.value = ", feature.value);
          return branchInfo;
        }
        branchInfo.id = feature.value.messages[0].id;
        break;
    }

    const proposedEndDate = getExperimentLookerDashboardDate(
      branchInfo.nimbusExperiment.startDate,
      branchInfo.nimbusExperiment.proposedDuration,
    );
    let formattedEndDate;
    if (branchInfo.nimbusExperiment.endDate) {
      formattedEndDate = formatDate(branchInfo.nimbusExperiment.endDate, 1);
    }
    branchInfo.ctrDashboardLink = getDashboard(
      branch.template,
      branchInfo.id,
      undefined,
      branchInfo.nimbusExperiment.slug,
      branch.slug,
      branchInfo.nimbusExperiment.startDate,
      branchInfo.nimbusExperiment.endDate ? formattedEndDate : proposedEndDate,
      this._isCompleted,
    );
    // if (!feature.value.content) {
    //   console.log("v.content is null");
    //   console.log("v= ", value)
    // }

    // console.log("branchInfo = ")
    // console.log(branchInfo)
    return branchInfo;
  }

  getBranchInfos(): BranchInfo[] {
    // console.log(`in gBI for recipe ${recipe.slug}, branches = `)
    // console.table(recipe.branches)
    let branchInfos: BranchInfo[] = this._rawRecipe.branches.map(
      this.getBranchInfo,
      this,
    );
    return branchInfos;
  }

  /**
   * @returns a RecipeInfo object, for display in the experiments table
   */
  getRecipeInfo(): RecipeInfo {
    let branchInfos = this.getBranchInfos();
    let hasMicrosurvey = branchInfos.some(
      (branchInfo) => branchInfo.hasMicrosurvey === true,
    );
    if (this._rawRecipe.slug) {
      hasMicrosurvey =
        hasMicrosurvey || this._rawRecipe.slug.toLowerCase().includes("survey");
    }

    return {
      startDate: this._rawRecipe.startDate || null,
      endDate:
        this._rawRecipe.endDate ||
        getProposedEndDate(
          this._rawRecipe.startDate,
          this._rawRecipe.proposedDuration,
        ) ||
        null,
      product: "Desktop",
      id: this._rawRecipe.slug,
      segment: "some segment",
      ctrPercent: 0.5, // get me from BigQuery
      ctrPercentChange: 2, // get me from BigQuery
      metrics: "some metrics",
      experimenterLink: `https://experimenter.services.mozilla.com/nimbus/${this._rawRecipe.slug}`,
      userFacingName: this._rawRecipe.userFacingName,
      nimbusExperiment: this._rawRecipe,
      branches: branchInfos,
      hasMicrosurvey: hasMicrosurvey,
      experimentBriefLink: this.getExperimentBriefLink(
        this._rawRecipe.documentationLinks,
      ),
    };
  }

  /**
   * @returns an array of RecipeInfo and BranchInfo objects for this recipe,
   * ordered like this: [RecipeInfo, BranchInfo, BranchInfo, BranchInfo, ...]
   */
  getRecipeOrBranchInfos(): RecipeOrBranchInfo[] {
    let recipeInfo = this.getRecipeInfo();

    let branchInfos: BranchInfo[] = this.getBranchInfos();
    // console.log("branchInfos[] = ")
    // console.log(branchInfos)

    let expAndBranchInfos: RecipeOrBranchInfo[] = [];
    expAndBranchInfos = ([recipeInfo] as RecipeOrBranchInfo[]).concat(
      branchInfos,
    );

    // console.log("expAndBranchInfos: ")
    // console.table(expAndBranchInfos)

    return expAndBranchInfos;
  }

  /**
   *
   */
  usesMessagingFeatures(): boolean {
    const featureIds = this._rawRecipe?.featureIds;
    if (!featureIds) {
      return false;
    }

    return featureIds.some(isMessagingFeature);
  }

  /**
   * Given a branch slug, return a link to the Screenshots section of the
   * Experimenter page for that branch.
   */
  getBranchScreenshotsLink(branchSlug: string): string {
    const screenshotsAnchorId = `branch-${encodeURIComponent(branchSlug)}-screenshots`;

    return `https://experimenter.services.mozilla.com/nimbus/${encodeURIComponent(this._rawRecipe.slug)}/summary#${screenshotsAnchorId}`;
  }

  /**
   * @returns true if this recipe is an experiment recipe not in rollout.
   */
  isExpRecipe() {
    return !this._rawRecipe.isRollout;
  }

  /**
   * @returns a link to recipe section of the Experimenter page for that branch.
   */
  getBranchRecipeLink(branchSlug: string): string {
    return `https://experimenter.services.mozilla.com/nimbus/${encodeURIComponent(
      this._rawRecipe.slug,
    )}/summary#${branchSlug}`;
  }

  /**
   * @param documentationLinks a list of documentation links provided for this Nimbus recipe
   * @returns the first documentation link of the experiment brief Google Doc if it exists
   */
  getExperimentBriefLink(
    documentationLinks: DocumentationLink[] | undefined,
  ): string | undefined {
    if (documentationLinks) {
      const brief = documentationLinks.find(
        (documentationLink: DocumentationLink) => {
          return (
            documentationLink.title === "DESIGN_DOC" &&
            documentationLink.link.startsWith(
              "https://docs.google.com/document",
            )
          );
        },
      );
      return brief && brief.link;
    }
  }
}
