import { types } from "@mozilla/nimbus-shared"
import { BranchInfo, RecipeInfo, RecipeOrBranchInfo } from "../app/columns.jsx"
import { getDashboard, getDisplayNameForTemplate, getPreviewLink,getTemplateFromMessage } from "../lib/messageUtils.ts";
import { getProposedEndDate, _substituteLocalizations } from "../lib/experimentUtils.ts";

type NimbusExperiment = types.experiments.NimbusExperiment

type NimbusRecipeType = {
  rawRecipe : NimbusExperiment
  // getRecipeInfo() : RecipeInfo[]
  getRecipeOrBranchInfos() : RecipeOrBranchInfo[];
  getBranchInfos() : BranchInfo[]
}

export class NimbusRecipe implements NimbusRecipeType {
  rawRecipe

  constructor(recipe : NimbusExperiment) {
    this.rawRecipe = recipe
  }

  getBranchInfos() : BranchInfo[] {
    // console.log(`-in gBCFE for experiment ${recipe.slug}, branches = `);
    // console.table(recipe.branches);
    let branchInfos : BranchInfo[] = this.rawRecipe.branches.map((branch: any) => {
      let branchInfo : BranchInfo = {
      product : 'Desktop',
      id : branch.slug,
      isBranch: true,
      recipe: this.rawRecipe,
      slug: branch.slug
      };

      // XXX should look at all the messages
      const value = branch.features[0].value;

      // XXX in this case we're really passing a feature value. Hmm....
      const template = getTemplateFromMessage(value);
      branch.template = template;
      branchInfo.template = template;
      branchInfo.surface = getDisplayNameForTemplate(template);

      switch(template) {
        case 'feature_callout':
          // XXX should iterate over all screens
          branchInfo.id = value.content.screens[0].id;
          break;


        case 'infobar':
          branchInfo.id = value.messages[0].id
          branchInfo.ctrDashboardLink = getDashboard(template, branchInfo.id)
          // Localize the recipe if necessary.
          // XXX [Object.keys(recipe.localizations)[0]] accesses the first locale inside the localization object.
          // We'll probably want to add a dropdown component that allows us to choose a locale from the available ones, to pass to this function.
          let localizedInfobar = _substituteLocalizations(value.content, this.rawRecipe.localizations?.[Object.keys(this.rawRecipe.localizations)[0]]);
          branchInfo.previewLink = getPreviewLink(localizedInfobar);
          break;

        case 'toast_notification':
          if (!value?.id) {
            console.warn("value.id, v = ", value);
            return branchInfo;
          }
          branchInfo.id = value.content.tag;
          break;

        case 'spotlight':
          branchInfo.id = value.id;
          // Localize the recipe if necessary.
          let localizedSpotlight = _substituteLocalizations(value, this.rawRecipe.localizations?.[Object.keys(this.rawRecipe.localizations)[0]]);
          branchInfo.previewLink = getPreviewLink(localizedSpotlight);
          break;

        case 'multi':
          // XXX only does first messages
          const firstMessage = value.messages[0]
          if (!('content' in firstMessage)) {
            console.warn('template "multi" first message does not contain content key; details not rendered')
            return branchInfo
          }

          // XXX only does first screen
          branchInfo.id = firstMessage.content.screens[0].id
          // Localize the recipe if necessary.
          let localizedMulti = _substituteLocalizations(value.messages[0], this.rawRecipe.localizations?.[Object.keys(this.rawRecipe.localizations)[0]]);
          // XXX assumes previewable message (spotight?)
          branchInfo.previewLink = getPreviewLink(localizedMulti);
          break;

        case 'momentsUpdate':
          console.warn(`we don't fully support ${template} messages yet`);
          return branchInfo;

        default:
          if (!value?.messages) {
            console.log("v.messages is null")
            console.log(", v= ", value);
            return branchInfo
          }
          branchInfo.id = value.messages[0].id
          break;
      };

      branchInfo.ctrDashboardLink = getDashboard(branch.template, branchInfo.id)

      if (!value.content) {
        console.log("v.content is null")
        // console.log("v= ", value)
        return branchInfo
      }

      // console.log("branchInfo = ");
      // console.log(branchInfo);
      return branchInfo;
      });
    return branchInfos;
  }

  getRecipeOrBranchInfos() : RecipeOrBranchInfo[] {
    if (this.rawRecipe.isRollout) {
      return [];
    };

    let recipeInfo : RecipeInfo = {
      startDate: this.rawRecipe.startDate || null,
      endDate:
        this.rawRecipe.endDate ||
        getProposedEndDate(this.rawRecipe.startDate, this.rawRecipe.proposedDuration) || null,
      product: 'Desktop',
      release: 'Fx Something',
      id: this.rawRecipe.slug,
      topic: 'some topic',
      segment: 'some segment',
      ctrPercent: .5, // get me from BigQuery
      ctrPercentChange: 2, // get me from BigQuery
      metrics: 'some metrics',
      experimenterLink: `https://experimenter.services.mozilla.com/nimbus/${this.rawRecipe.slug}`,
      userFacingName: this.rawRecipe.userFacingName,
      recipe: this.rawRecipe
    }

    let branchInfos : BranchInfo[] = this.getBranchInfos()
    // console.log("branchInfos[] = ");
    // console.log(branchInfos);

    let experimentAndBranchInfos : RecipeOrBranchInfo[] = [];
    experimentAndBranchInfos =
      ([recipeInfo] as RecipeOrBranchInfo[])
      .concat(branchInfos);

    // console.log("expAndBranchInfos: ");
    // console.table(experimentAndBranchInfos);

    return experimentAndBranchInfos;

  }
}