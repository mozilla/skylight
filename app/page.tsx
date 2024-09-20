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
 * Updates the lib/looker-local-prod-messages/looker-data.json file with the
 * JSON data retrieved from the Looker query for live messages.
 */
async function updateLookerLiveMessagesList() {
  const fs = require("fs");

  // Clean up data by removing test messages
  let data = await runLookQuery();
  let clean_data = data.filter((messageDef: any) => {
    const removeMessages = [
      "undefined",
      "",
      "test-id",
      "n/a",
      null,
      "DEFAULT_ID",
    ];
    return !removeMessages.includes(
      messageDef[
        "messaging_system.metrics__text2__messaging_system_message_id"
      ],
    );
  });

  // Write clean data to looker-data.json
  let json = JSON.stringify(clean_data);
  fs.writeFileSync(
    "lib/looker-local-prod-messages/looker-data-original.json",
    json,
    "utf8",
  );
}

function mergeLookerData() {
  const fs = require("fs");

  // Existing message data
  let result = fs.readFileSync(
    "lib/asrouter-local-prod-messages/data.json",
    "utf8",
  );
  let json_result = JSON.parse(result);

  // Collect Looker message data
  let looker_data = fs.readFileSync(
    "lib/looker-local-prod-messages/looker-data-original.json",
    "utf8",
  );
  let json_looker_data = JSON.parse(looker_data);

  // Add any message data with an id that does not already exist in data.json
  for (let i = 0; i < json_looker_data.length; i++) {
    // Check that id does not already exist and does not contain a "test" substring
    if (
      !json_result.find(
        (x: any) =>
          x.id ===
          json_looker_data[i][
            "messaging_system.metrics__text2__messaging_system_message_id"
          ],
      ) &&
      !json_looker_data[i][
        "messaging_system.metrics__text2__messaging_system_message_id"
      ]
        .toLowerCase()
        .includes("test")
    ) {
      // Clean up objects to have properties `id` and `template`.
      // `hidePreview` is included because the message data from Looker
      // does not have enough information to enable message previews correctly.
      let clean_looker_object = {
        id: json_looker_data[i][
          "messaging_system.metrics__text2__messaging_system_message_id"
        ],
        template:
          json_looker_data[i][
            "messaging_system.metrics__string__messaging_system_ping_type"
          ],
        hidePreview: true,
      };

      // RTAMO checks
      if (clean_looker_object.id.includes("RTAMO")) {
        clean_looker_object.template = "rtamo";
      }

      // Feature callout checks
      if (clean_looker_object.template === null) {
        clean_looker_object.template = "feature_callout";
      }

      // FOCUS_PROMO
      if (clean_looker_object.id === "FOCUS_PROMO") {
        clean_looker_object.template = "pb_newtab";
      }

      json_result.push(clean_looker_object);
    }

    fs.writeFileSync(
      "lib/asrouter-local-prod-messages/data.json",
      JSON.stringify(json_result),
    );
  }
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
    await updateLookerLiveMessagesList();
    mergeLookerData();
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
