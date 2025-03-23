import {
  compareSurfacesFn,
  getDashboard,
  getPreviewLink,
  getSurfaceDataForTemplate,
  getTemplateFromMessage,
  maybeCreateWelcomePreview,
  messageHasMicrosurvey,
} from "@/lib/messageUtils";
import { NimbusRecipe } from "@/lib/nimbusRecipe";
import { NimbusRecipeCollection } from "@/lib/nimbusRecipeCollection";
import {
  compareDatesFn,
  getMsgRolloutCollection,
  isLookerEnabled,
} from "@/app/dashboard";
import { FxMSMessageInfo } from "./columns";
import {
  cleanLookerData,
  getCTRPercentData,
  mergeLookerData,
  runLookQuery,
} from "@/lib/looker.ts";
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
export async function getASRouterLocalColumnFromJSON(
  messageDef: any,
): Promise<FxMSMessageInfo> {
  let fxmsMsgInfo: FxMSMessageInfo = {
    product: "Desktop",
    id: messageDef.id,
    template: messageDef.template,
    surface: getSurfaceDataForTemplate(getTemplateFromMessage(messageDef))
      .surface,
    segment: "some segment",
    metrics: "some metrics",
    ctrPercent: undefined, // may be populated from Looker data
    ctrPercentChange: undefined, // may be populated from Looker data
    previewLink: getPreviewLink(maybeCreateWelcomePreview(messageDef)),
    impressions: undefined, // may be populated from Looker data
    hasMicrosurvey: messageHasMicrosurvey(messageDef.id),
    hidePreview: messageDef.hidePreview,
  };

  const channel = "release";

  if (isLookerEnabled) {
    const ctrPercentData = await getCTRPercentData(
      fxmsMsgInfo.id,
      fxmsMsgInfo.template,
      channel,
    );
    if (ctrPercentData) {
      fxmsMsgInfo.ctrPercent = ctrPercentData.ctrPercent;
      fxmsMsgInfo.impressions = ctrPercentData.impressions;
    }
  }

  fxmsMsgInfo.ctrDashboardLink = getDashboard(
    fxmsMsgInfo.template,
    fxmsMsgInfo.id,
    channel,
  );

  // dashboard link -> dashboard id -> query id -> query -> ctr_percent_from_lastish_day
  // console.log("fxmsMsgInfo: ", fxmsMsgInfo)
  return fxmsMsgInfo;
}

/**
 * Appends any FxMS telemetry message data from the query in Look
 * https://mozilla.cloud.looker.com/looks/2162 that does not already exist (ie.
 * no duplicate message ids) in existingMessageData and returns the result. The
 * message data is also cleaned up to match the message data objects from
 * ASRouter, remove any test messages, and update templates.
 */
export async function appendFxMSTelemetryData(existingMessageData: any) {
  // Get Looker message data (taken from the query in Look
  // https://mozilla.cloud.looker.com/looks/2162)
  const lookId = "2162";
  let lookerData = await runLookQuery(lookId);

  // Clean and merge Looker data with existing data
  let jsonLookerData = cleanLookerData(lookerData);
  let mergedData = mergeLookerData(existingMessageData, jsonLookerData);

  return mergedData;
}
