import { compareSurfacesFn } from "@/lib/messageUtils";
import { NimbusRecipe } from "@/lib/nimbusRecipe";
import { NimbusRecipeCollection } from "@/lib/nimbusRecipeCollection";
import { getASRouterLocalMessageInfoFromFile, getMsgExpRecipeCollection, getMsgRolloutCollection, isLookerEnabled } from "./dashboard";


export async function fetchData() {
  const recipeCollection = new NimbusRecipeCollection();
  await recipeCollection.fetchRecipes();
  console.log("recipeCollection.length = ", recipeCollection.recipes.length);

  const localData = (await getASRouterLocalMessageInfoFromFile()).sort(
    compareSurfacesFn
  );

  const msgExpRecipeCollection = await getMsgExpRecipeCollection(recipeCollection);
  const msgRolloutRecipeCollection = await getMsgRolloutCollection(recipeCollection);

  const experimentAndBranchInfo = isLookerEnabled
    ? await msgExpRecipeCollection.getExperimentAndBranchInfos()
    : msgExpRecipeCollection.recipes.map((recipe: NimbusRecipe) => recipe.getRecipeInfo()
    );

  const totalExperiments = msgExpRecipeCollection.recipes.length;

  const msgRolloutInfo = isLookerEnabled
    ? await msgRolloutRecipeCollection.getExperimentAndBranchInfos()
    : msgRolloutRecipeCollection.recipes.map((recipe: NimbusRecipe) => recipe.getRecipeInfo()
    );

  const totalRolloutExperiments = msgRolloutRecipeCollection.recipes.length;

  return {
    localData,
    experimentAndBranchInfo,
    totalExperiments,
    msgRolloutInfo,
    totalRolloutExperiments,
  };
}
