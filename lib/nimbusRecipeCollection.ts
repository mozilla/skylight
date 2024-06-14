import { types } from "@mozilla/nimbus-shared"
import { NimbusRecipe } from "../lib/nimbusRecipe"
import { BranchInfo, RecipeInfo, RecipeOrBranchInfo } from "@/app/columns"
import { getCTRPercent } from "./looker"

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
      async (branch: BranchInfo): Promise<BranchInfo> => {
        // We are making all branch ids upper case to make up for
        // Looker being case sensitive
        const ctrPercent = await getCTRPercent(
          branch.id.toUpperCase(),
          branch.template
        );
        if (ctrPercent) {
          branch.ctrPercent = ctrPercent;
        }
        return branch;
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
