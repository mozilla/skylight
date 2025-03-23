import { compareSurfacesFn } from "@/lib/messageUtils";
import { NimbusRecipe } from "@/lib/nimbusRecipe";
import { NimbusRecipeCollection } from "@/lib/nimbusRecipeCollection";
import {
  appendFxMSTelemetryData,
  compareDatesFn,
  getASRouterLocalColumnFromJSON,
  getMsgRolloutCollection,
  isLookerEnabled,
} from "@/app/dashboard";
import { FxMSMessageInfo } from "./columns";

export async function fetchData() {
  const recipeCollection = new NimbusRecipeCollection();
  await recipeCollection.fetchRecipes();
  console.log("recipeCollection.length = ", recipeCollection.recipes.length);

  const localData = (await getASRouterLocalMessageInfoFromFile()).sort(
    compareSurfacesFn,
  );

  const msgExpRecipeCollection =
    await getMsgExpRecipeCollection(recipeCollection);
  const msgRolloutRecipeCollection =
    await getMsgRolloutCollection(recipeCollection);

  const experimentAndBranchInfo = isLookerEnabled
    ? await msgExpRecipeCollection.getExperimentAndBranchInfos()
    : msgExpRecipeCollection.recipes.map((recipe: NimbusRecipe) =>
        recipe.getRecipeInfo(),
      );

  const totalExperiments = msgExpRecipeCollection.recipes.length;

  const msgRolloutInfo = isLookerEnabled
    ? await msgRolloutRecipeCollection.getExperimentAndBranchInfos()
    : msgRolloutRecipeCollection.recipes.map((recipe: NimbusRecipe) =>
        recipe.getRecipeInfo(),
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
export async function getMsgExpRecipeCollection(
  recipeCollection: NimbusRecipeCollection,
): Promise<NimbusRecipeCollection> {
  const expOnlyCollection = new NimbusRecipeCollection();
  expOnlyCollection.recipes = recipeCollection.recipes.filter((recipe) =>
    recipe.isExpRecipe(),
  );
  console.log("expOnlyCollection.length = ", expOnlyCollection.recipes.length);

  const msgExpRecipeCollection = new NimbusRecipeCollection();
  msgExpRecipeCollection.recipes = expOnlyCollection.recipes
    .filter((recipe) => recipe.usesMessagingFeatures())
    .sort(compareDatesFn);
  console.log(
    "msgExpRecipeCollection.length = ",
    msgExpRecipeCollection.recipes.length,
  );

  return msgExpRecipeCollection;
}
/**
 * @returns message data in the form of FxMSMessageInfo from
 * lib/asrouter-local-prod-messages/data.json and also FxMS telemetry data if
 * Looker credentials are enabled.
 */

export async function getASRouterLocalMessageInfoFromFile(): Promise<
  FxMSMessageInfo[]
> {
  const fs = require("fs");

  let data = fs.readFileSync(
    "lib/asrouter-local-prod-messages/data.json",
    "utf8",
  );
  let json_data = JSON.parse(data);

  if (isLookerEnabled) {
    json_data = await appendFxMSTelemetryData(json_data);
  }

  let messages = await Promise.all(
    json_data.map(async (messageDef: any): Promise<FxMSMessageInfo> => {
      return await getASRouterLocalColumnFromJSON(messageDef);
    }),
  );

  return messages;
}
