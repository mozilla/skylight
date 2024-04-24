import { types } from "@mozilla/nimbus-shared"
import { NimbusRecipe } from '@/lib/nimbusRecipe'
type NimbusExperiment = types.experiments.NimbusExperiment

type NimbusRecipeCollectionType = {
  recipes: Array<NimbusRecipe>
  fetchRecipes: () => Promise<Array<NimbusRecipe>>
}

export class NimbusRecipeCollection implements NimbusRecipeCollectionType {
  recipes: Array<NimbusRecipe>

  constructor() {
    this.recipes = []
  }

  async fetchRecipes() : Promise<Array<NimbusRecipe>> {
      const response = await fetch(
      process.env.RECORDS_URL as string,
      {
        credentials: "omit",
      }
    );
    const responseJSON = await response.json();
    const experiments : NimbusExperiment[] = await responseJSON.data;

    this.recipes = experiments.map(
      (nimbusExp : NimbusExperiment) => new NimbusRecipe(nimbusExp)
    )

    return this.recipes
  }
}
