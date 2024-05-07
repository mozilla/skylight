import { types } from "@mozilla/nimbus-shared"
import { NimbusRecipe } from "../lib/nimbusRecipe"
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
}
