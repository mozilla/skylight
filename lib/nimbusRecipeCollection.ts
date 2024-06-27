import { types } from "@mozilla/nimbus-shared"
import { NimbusRecipe } from "../lib/nimbusRecipe"
import { BranchInfo, RecipeInfo, RecipeOrBranchInfo } from "@/app/columns"
import { getCTRPercent } from "./looker"
import { getProposedEndDate } from "./experimentUtils"

type NimbusExperiment = types.experiments.NimbusExperiment

type NimbusRecipeCollectionType = {
  recipes: Array<NimbusRecipe>
  fetchRecipes: () => Promise<Array<NimbusRecipe>>
}

/**
 * @returns an array of BranchInfo with updated CTR percents for the recipe
 */
async function updateBranchesCTR(recipe: NimbusRecipe): Promise<BranchInfo[]> {
  return await Promise.all(
    recipe.getBranchInfos().map(
      async (branchInfo: BranchInfo): Promise<BranchInfo> => {
        // We are using the proposed end date + 1 as the end date because the end
        // date is not inclusive in Looker
        // XXX refactor proposedEndDate into a separate function (see https://bugzilla.mozilla.org/show_bug.cgi?id=1905204)
        const proposedEndDate = getProposedEndDate(
          branchInfo.nimbusExperiment.startDate,
          branchInfo.nimbusExperiment.proposedDuration
            ? branchInfo.nimbusExperiment.proposedDuration + 1
            : undefined
        );
        // We are making all branch ids upper case to make up for
        // Looker being case sensitive
        const ctrPercent = await getCTRPercent(
          branchInfo.id.toUpperCase(),
          branchInfo.template!,
          undefined,
          branchInfo.nimbusExperiment.slug,
          branchInfo.slug,
          branchInfo.nimbusExperiment.startDate,
          proposedEndDate
        );
        if (ctrPercent) {
          branchInfo.ctrPercent = ctrPercent;
        }
        return branchInfo;
      }
    )
  );
}

export class NimbusRecipeCollection implements NimbusRecipeCollectionType {
  recipes: Array<NimbusRecipe>

  constructor() {
    this.recipes = []
  }

  async fetchRecipes() : Promise<Array<NimbusRecipe>> {
    const experimenterUrl = `${process.env.EXPERIMENTER_API_PREFIX}${process.env.EXPERIMENTER_API_CALL}`

    // console.log("experimenterURL = ", experimenterUrl)
    const response = await fetch(experimenterUrl,
      {
        credentials: "omit",
      }
    )
    // console.log("response = ", response)
    const experiments : NimbusExperiment[] = await response.json()

    // console.log('returned experiments', experiments)
    this.recipes = experiments.map(
      (nimbusExp : NimbusExperiment) => new NimbusRecipe(nimbusExp)
    )

    return this.recipes
  }

  /**
   * @returns a list of RecipeInfo of recipes in this collection with updated
   * ctrPercent properties
   */
  async getExperimentAndBranchInfos(): Promise<RecipeOrBranchInfo[]> {
    return await Promise.all(
      this.recipes.map(
        async (recipe: NimbusRecipe): Promise<RecipeInfo> => {
          let updatedRecipe = recipe.getRecipeInfo();
          
          // Update all branches with CTR data for the recipe
          updatedRecipe.branches = await updateBranchesCTR(recipe);

          return updatedRecipe;
        }
      )
    );
  }
}
