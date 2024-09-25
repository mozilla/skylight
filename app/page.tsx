import { types } from "@mozilla/nimbus-shared";
import {
  RecipeOrBranchInfo,
  experimentColumns,
  FxMSMessageInfo,
  fxmsMessageColumns,
} from "./columns";
import { getCTRPercentData, runLookQuery } from "@/lib/looker.ts";
import {
  getDashboard,
  getSurfaceDataForTemplate,
  getTemplateFromMessage,
  _isAboutWelcomeTemplate,
  maybeCreateWelcomePreview,
  getPreviewLink,
  messageHasMicrosurvey,
  compareSurfacesFn,
} from "../lib/messageUtils.ts";

import { NimbusRecipeCollection } from "../lib/nimbusRecipeCollection";
import { _substituteLocalizations } from "../lib/experimentUtils.ts";

import { NimbusRecipe } from "../lib/nimbusRecipe.ts";
import { MessageTable } from "./message-table";

import { MenuButton } from "@/components/ui/menubutton.tsx";
import { InfoPopover } from "@/components/ui/infopopover.tsx";
import { Timeline } from "@/components/ui/timeline.tsx";

const isLookerEnabled = process.env.IS_LOOKER_ENABLED === "true";

const hidden_message_impression_threshold =
  process.env.HIDDEN_MESSAGE_IMPRESSION_THRESHOLD;

/**
 * A sorting function to sort messages by their start dates in descending order.
 * If one or both of the recipes is missing a start date, they will be ordered
 * identically since there's not enough information to properly sort them by
 * date.
 *
 * @param a Nimbus recipe to compare with `b`.
 * @param b Nimbus recipe to compare with `a`.
 * @returns -1 if the start date for message a is after the start date for
 *          message b, zero if they're equal, and 1 otherwise.
 */
function compareDatesFn(a: NimbusRecipe, b: NimbusRecipe): number {
  if (a._rawRecipe.startDate && b._rawRecipe.startDate) {
    if (a._rawRecipe.startDate > b._rawRecipe.startDate) {
      return -1;
    } else if (a._rawRecipe.startDate < b._rawRecipe.startDate) {
      return 1;
    }
  }

  // a must be equal to b
  return 0;
}

async function getASRouterLocalColumnFromJSON(
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

let columnsShown = false;

type NimbusExperiment = types.experiments.NimbusExperiment;

/**
 * Removes any messages inside `data` for ids specified in the removeMessages
 * array and for ids with substring "test".
 */
function cleanData(data: any) {
  let clean_data = JSON.parse(JSON.stringify(data)).filter(
    (messageDef: any) => {
      const removeMessages = [
        "undefined",
        "",
        "test-id",
        "n/a",
        null,
        "DEFAULT_ID",
      ];
      return (
        !removeMessages.includes(
          messageDef[
            "messaging_system.metrics__text2__messaging_system_message_id"
          ],
        ) &&
        !messageDef[
          "messaging_system.metrics__text2__messaging_system_message_id"
        ]
          .toLowerCase()
          .includes("test")
      );
    },
  );
  return clean_data;
}

/**
 * Appends any messages from `newLookerData` into `originalData` with an id
 * that does not already exist in `originalData`. Updates the templates for
 * any message that need some clean up.
 *
 * The message data in `newLookerData` has properties
 * "messaging_system.metrics__text2__messaging_system_message_id" and
 * "messaging_system.metrics__string__messaging_system_ping_type" to represent
 * the message id and template. Before appending these messages into
 * `originalData`, we must clean up the objects to have properties "id" and
 * "template" instead, and exclude any other properties that do not currently
 * provide any value.
 */
function mergeData(originalData: any, newLookerData: any) {
  for (let i = 0; i < newLookerData.length; i++) {
    if (
      !originalData.find(
        (x: any) =>
          x.id ===
          newLookerData[i][
            "messaging_system.metrics__text2__messaging_system_message_id"
          ],
      )
    ) {
      // `hidePreview` is added because the message data from Looker does not
      // have enough information to enable message previews correctly and we
      // must manually hide the previews for now.
      let clean_looker_object = {
        id: newLookerData[i][
          "messaging_system.metrics__text2__messaging_system_message_id"
        ],
        template:
          newLookerData[i][
            "messaging_system.metrics__string__messaging_system_ping_type"
          ],
        hidePreview: true,
      };

      // Update templates for RTAMO messages
      if (clean_looker_object.id.includes("RTAMO")) {
        clean_looker_object.template = "rtamo";
      }

      // Update template for FOCUS_PROMO message
      if (clean_looker_object.id === "FOCUS_PROMO") {
        clean_looker_object.template = "pb_newtab";
      }

      // Update template for MILESTONE_MESSAGE message
      if (clean_looker_object.id === "MILESTONE_MESSAGE") {
        clean_looker_object.template = "milestone_message";
      }

      // Update templates for feature callout messages
      if (clean_looker_object.template === null) {
        clean_looker_object.template = "feature_callout";
      }

      originalData.push(clean_looker_object);
    }
  }
  return originalData;
}

/**
 * Reads in message data from lib/asrouter-local-prod-messages/data.json and
 * appends any message data collected from Looker that does not already exist
 * (ie. no duplicate message ids). The Looker message data is also cleaned up
 * to match the message data objects from asrouter, remove any test messages,
 * and update templates.
 */
async function mergeLookerData() {
  const fs = require("fs");

  // Get existing message data
  let result = fs.readFileSync(
    "lib/asrouter-local-prod-messages/data.json",
    "utf8",
  );
  let json_result = JSON.parse(result);

  // Get Looker message data (taken from the Look query
  // https://mozilla.cloud.looker.com/looks/2162)
  const lookId = "2162";
  let looker_data = await runLookQuery(lookId);

  // Clean and merge Looker data with existing data
  let json_looker_data = cleanData(looker_data);
  mergeData(json_result, json_looker_data);

  // Update data.json with new Looker data to cache the Looker data which will
  // be generated at build time
  fs.writeFileSync(
    "lib/asrouter-local-prod-messages/data.json",
    JSON.stringify(json_result),
  );
}

async function getASRouterLocalMessageInfoFromFile(): Promise<
  FxMSMessageInfo[]
> {
  const fs = require("fs");

  let data = fs.readFileSync(
    "lib/asrouter-local-prod-messages/data.json",
    "utf8",
  );
  let json_data = JSON.parse(data);
  let messages = await Promise.all(
    json_data.map(async (messageDef: any): Promise<FxMSMessageInfo> => {
      return await getASRouterLocalColumnFromJSON(messageDef);
    }),
  );

  return messages;
}

async function getMsgExpRecipeCollection(
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

async function getMsgRolloutCollection(
  recipeCollection: NimbusRecipeCollection,
): Promise<NimbusRecipeCollection> {
  const msgRolloutRecipeCollection = new NimbusRecipeCollection();
  msgRolloutRecipeCollection.recipes = recipeCollection.recipes
    .filter((recipe) => recipe.usesMessagingFeatures() && !recipe.isExpRecipe())
    .sort(compareDatesFn);
  console.log(
    "msgRolloutRecipeCollection.length = ",
    msgRolloutRecipeCollection.recipes.length,
  );

  return msgRolloutRecipeCollection;
}

export default async function Dashboard() {
  // Check to see if Auth is enabled
  const isAuthEnabled = process.env.IS_AUTH_ENABLED === "true";

  const recipeCollection = new NimbusRecipeCollection();
  await recipeCollection.fetchRecipes();
  console.log("recipeCollection.length = ", recipeCollection.recipes.length);

  // Update and merge Looker data
  if (isLookerEnabled) {
    await mergeLookerData();
  }

  // XXX await Promise.allSettled for all three loads concurrently
  const localData = (await getASRouterLocalMessageInfoFromFile()).sort(
    compareSurfacesFn,
  );
  const msgExpRecipeCollection =
    await getMsgExpRecipeCollection(recipeCollection);
  const msgRolloutRecipeCollection =
    await getMsgRolloutCollection(recipeCollection);

  // Get in format useable by MessageTable
  const experimentAndBranchInfo: RecipeOrBranchInfo[] = isLookerEnabled
    ? // Update branches inside recipe infos with CTR percents
      await msgExpRecipeCollection.getExperimentAndBranchInfos()
    : msgExpRecipeCollection.recipes.map((recipe: NimbusRecipe) =>
        recipe.getRecipeInfo(),
      );

  const totalExperiments = msgExpRecipeCollection.recipes.length;

  const msgRolloutInfo: RecipeOrBranchInfo[] = isLookerEnabled
    ? // Update branches inside recipe infos with CTR percents
      await msgRolloutRecipeCollection.getExperimentAndBranchInfos()
    : msgRolloutRecipeCollection.recipes.map((recipe: NimbusRecipe) =>
        recipe.getRecipeInfo(),
      );

  const totalRolloutExperiments = msgRolloutRecipeCollection.recipes.length;

  return (
    <div>
      <div className="sticky top-0 z-50 bg-background flex justify-between px-20 py-8">
        <h4 className="scroll-m-20 text-3xl font-semibold">Skylight</h4>
        <MenuButton isComplete={false} />
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4 flex items-center justify-center gap-x-1">
        Desktop Messages Released on Firefox
        <InfoPopover
          content="All messages listed in this table are in the release channel and are either currently live or have been live on Firefox at one time."
          iconStyle="h-7 w-7 p-1 rounded-full cursor-pointer border-0 bg-slate-100 hover:bg-slate-200"
        />
      </h5>
      <h5 className="scroll-m-20 text-sm text-center">(Partial List)</h5>
      <div className="sticky top-24 z-10 bg-background py-2 flex justify-center">
        <Timeline active="firefox" />
      </div>

      <div className="container mx-auto py-10">
        <MessageTable
          columns={fxmsMessageColumns}
          data={localData}
          canHideMessages={true}
          impressionsThreshold={hidden_message_impression_threshold}
        />
      </div>

      <h5
        id="live_rollouts"
        className="scroll-m-20 text-xl font-semibold text-center pt-4"
      >
        Current Desktop Message Rollouts
      </h5>
      <h5 className="scroll-m-20 text-sm text-center">
        Total: {totalRolloutExperiments}
      </h5>
      <div className="sticky top-24 z-10 bg-background py-2 flex justify-center">
        <Timeline active="rollout" />
      </div>
      <div className="container mx-auto py-10">
        <MessageTable
          columns={experimentColumns}
          data={msgRolloutInfo}
          defaultExpanded={true}
        />
      </div>

      <h5
        id="live_experiments"
        className="scroll-m-20 text-xl font-semibold text-center pt-4"
      >
        Current Desktop Message Experiments
      </h5>
      <h5 className="scroll-m-20 text-sm text-center">
        Total: {totalExperiments}
      </h5>
      <div className="sticky top-24 z-10 bg-background py-2 flex justify-center">
        <Timeline active="experiment" />
      </div>
      <div className="space-y-5 container mx-auto py-10">
        <MessageTable
          columns={experimentColumns}
          data={experimentAndBranchInfo}
          defaultExpanded={true}
        />
      </div>
    </div>
  );
}
