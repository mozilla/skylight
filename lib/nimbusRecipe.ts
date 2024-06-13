import { types } from "@mozilla/nimbus-shared";
import { BranchInfo, RecipeInfo, RecipeOrBranchInfo } from "../app/columns.jsx";
import { getDashboard, getDisplayNameForTemplate, getPreviewLink, getTemplateFromMessage }
from "../lib/messageUtils.ts";
import { getProposedEndDate, MESSAGING_EXPERIMENTS_DEFAULT_FEATURES,_substituteLocalizations } from "../lib/experimentUtils.ts";

type NimbusExperiment = types.experiments.NimbusExperiment;

function isMessagingFeature(featureId: string): boolean {
  return MESSAGING_EXPERIMENTS_DEFAULT_FEATURES.includes(featureId)
}

// Get the first messaging feature object in a branch.
// XXX should handle the cases where there are none
function getFirstMessagingFeature(branch: any): any {
  const index = branch.features.findIndex(
    (feature: any) => isMessagingFeature(feature.featureId))

  return branch.features[index]
}

type NimbusRecipeType = {
  _rawRecipe : NimbusExperiment

  getRecipeInfo() : RecipeInfo
  getRecipeOrBranchInfos() : RecipeOrBranchInfo[]
  getBranchInfo(branch: any): BranchInfo
  getBranchInfos() : BranchInfo[]
  getBranchScreenshotsLink(branchSlug: string) : string
  usesMessagingFeatures() : boolean
  isExpRecipe(): boolean
  getBranchRecipeLink(branchSlug: string): string
}

export class NimbusRecipe implements NimbusRecipeType {
  _rawRecipe

  constructor(recipe : NimbusExperiment) {
    this._rawRecipe = recipe
  }

  /**
   * @returns an array of BranchInfo objects, one per branch in this recipe
   */
  getBranchInfo(branch: any): BranchInfo {
    let branchInfo: BranchInfo = {
        product: 'Desktop',
        id: branch.slug,
        isBranch: true,
        // The raw experiment data can be automatically serialized to
        // the client by NextJS (but classes can't), and any
        // needed NimbusRecipe class rewrapping can be done there.
        nimbusExperiment: this._rawRecipe,
        slug: branch.slug,
        screenshots: branch.screenshots,
        description: branch.description
      }

    // XXX right now we don't support more than one messaging feature
    const feature = getFirstMessagingFeature(branch)

    // XXX in this case we're really passing a feature value. Hmm....
    // about:welcome is special and doesn't use the template property,
    // so we have to assign it directly to treatment branches. The
    // control branch doesn't have a message, so we don't want to assign
    // a surface to it.
    let template;
    if (feature.featureId === "aboutwelcome" && branch.slug != 'control') {
      template = "aboutwelcome";
    } else {
      template = getTemplateFromMessage(feature.value)
    }

    branch.template = template;
    branchInfo.template = template;
    branchInfo.surface = getDisplayNameForTemplate(template);

    switch (template) {
      case "aboutwelcome":

        branchInfo.id = feature.value.id
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
          spotlightFake.content.backdrop = feature.value.backdrop ||
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

      case 'feature_callout':
        // XXX should iterate over all screens
        branchInfo.id = feature.value.content.screens[0].id
        // Localize the feature callout if necessary
        let localizedFeatureCallout = _substituteLocalizations(feature.value,
this._rawRecipe.localizations?.[Object.keys(this._rawRecipe.localizations)[0]])
        // Use the localized object to generate the previewlink
        branchInfo.previewLink = getPreviewLink(localizedFeatureCallout);
        break

      case 'infobar':
        branchInfo.id = feature.value.id
        // Localize the recipe if necessary.
        // XXX [Object.keys(recipe.localizations)[0]] accesses the first locale inside the localization object.
        // We'll probably want to add a dropdown component that allows us to choose a locale from the available ones, to pass to this function.
        let localizedInfobar =
          _substituteLocalizations(feature.value.content,
            this._rawRecipe.localizations?.[Object.keys(this._rawRecipe.localizations)[0]])
        branchInfo.previewLink = getPreviewLink(localizedInfobar)
        break

      case 'toast_notification':
        if (!feature.value?.id) {
          console.warn("value.id, v = ", feature.value)
          return branchInfo
        }
        branchInfo.id = feature.value.content.tag
        break

      case 'spotlight':
        branchInfo.id = feature.value.id
        // Localize the recipe if necessary.
        let localizedSpotlight = _substituteLocalizations(feature.value,
this._rawRecipe.localizations?.[Object.keys(this._rawRecipe.localizations)[0]])
        branchInfo.previewLink = getPreviewLink(localizedSpotlight)
        break

      case 'multi':
        // XXX only does first messages
        const firstMessage = feature.value.messages[0]
        if (!("content" in firstMessage)) {
          console.warn('template "multi" first message does not contain content key details not rendered');
          return branchInfo
        }

        // XXX only does first screen
        branchInfo.id = firstMessage.content.screens[0].id
        // Localize the recipe if necessary.
        let localizedMulti = _substituteLocalizations(feature.value.messages[0],
this._rawRecipe.localizations?.[Object.keys(this._rawRecipe.localizations)[0]])
        // XXX assumes previewable message (spotight?)
        branchInfo.previewLink = getPreviewLink(localizedMulti);
        break

      case 'momentsUpdate':
        console.warn(`we don't fully support moments messages yet`)
        return branchInfo

      default:
        if (!feature.value?.messages) {
          console.log("v.messages is null")
          console.log(", feature.value = ", feature.value)
          return branchInfo
        }
        branchInfo.id = feature.value.messages[0].id
        break
    }

    branchInfo.ctrDashboardLink =
      getDashboard(branch.template, branchInfo.id, undefined, branchInfo.nimbusExperiment.slug, branch.slug)

    if (!feature.value.content) {
      console.log("v.content is null")
      // console.log("v= ", value)
    }

    // console.log("branchInfo = ")
    // console.log(branchInfo)
    return branchInfo
  }

  getBranchInfos(): BranchInfo[] {
    // console.log(`in gBI for recipe ${recipe.slug}, branches = `)
    // console.table(recipe.branches)
    let branchInfos : BranchInfo[] = this._rawRecipe.branches.map(this.getBranchInfo,
this)
    return branchInfos
  }

  /**
   * @returns a RecipeInfo object, for display in the experiments table
   */
  getRecipeInfo() : RecipeInfo {
    return {
      startDate: this._rawRecipe.startDate || null,
      endDate:
        this._rawRecipe.endDate ||
        getProposedEndDate(this._rawRecipe.startDate, this._rawRecipe.proposedDuration) ||
null,
      product: 'Desktop',
      id: this._rawRecipe.slug,
      segment: 'some segment',
      ctrPercent: 0.5, // get me from BigQuery
      ctrPercentChange: 2, // get me from BigQuery
      metrics: 'some metrics',
      experimenterLink: `https://experimenter.services.mozilla.com/nimbus/${this._rawRecipe.slug}`,
      userFacingName: this._rawRecipe.userFacingName,
      nimbusExperiment: this._rawRecipe,
      branches: this.getBranchInfos()
    };
  }

  /**
   * @returns an array of RecipeInfo and BranchInfo objects for this recipe,
   * ordered like this: [RecipeInfo, BranchInfo, BranchInfo, BranchInfo, ...]
   */
  getRecipeOrBranchInfos() : RecipeOrBranchInfo[] {
    let recipeInfo = this.getRecipeInfo()

    let branchInfos : BranchInfo[] = this.getBranchInfos()
    // console.log("branchInfos[] = ")
    // console.log(branchInfos)

    let expAndBranchInfos : RecipeOrBranchInfo[] = []
    expAndBranchInfos =
      ([recipeInfo] as RecipeOrBranchInfo[])
      .concat(branchInfos)

    // console.log("expAndBranchInfos: ")
    // console.table(expAndBranchInfos)

    return expAndBranchInfos
  }

  /**
   *
   */
  usesMessagingFeatures(): boolean {
    const featureIds = this._rawRecipe?.featureIds
    if (!featureIds) {
      return false
    }

    return featureIds.some(isMessagingFeature)
  }

  /**
   * Given a branch slug, return a link to the Screenshots section of the
   * Experimenter page for that branch.
   */
  getBranchScreenshotsLink(branchSlug: string): string {
    const screenshotsAnchorId =
      `branch-${encodeURIComponent(branchSlug)}-screenshots`

    return `https://experimenter.services.mozilla.com/nimbus/${encodeURIComponent(this._rawRecipe.slug)}/summary#${screenshotsAnchorId}`
  }

  /**
   * @returns true if this recipe is an experiment recipe not in rollout.
   */
  isExpRecipe() {
    return !this._rawRecipe.isRollout
  }

  /** 
   * @returns a link to recipe section of the Experimenter page for that branch.
   */
  getBranchRecipeLink(branchSlug: string): string {
    return `https://experimenter.services.mozilla.com/nimbus/${encodeURIComponent(
      this._rawRecipe.slug
    )}/summary#${branchSlug}`;
  }
}
