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
} from "../lib/messageUtils.ts";

import { NimbusRecipeCollection } from "../lib/nimbusRecipeCollection";
import { _substituteLocalizations } from "../lib/experimentUtils.ts";

import { NimbusRecipe } from "../lib/nimbusRecipe.ts";
import { MessageTable } from "./message-table";

import { MenuButton } from "@/components/ui/menubutton.tsx";
import { InfoPopover } from "@/components/ui/infopopover.tsx";
import { Timeline } from "@/components/ui/timeline.tsx";

const isLookerEnabled = process.env.IS_LOOKER_ENABLED === "true";

function compareFn(a: any, b: any) {
  if (a._rawRecipe.startDate > b._rawRecipe.startDate) {
    return -1;
  } else if (a._rawRecipe.startDate < b._rawRecipe.startDate) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

async function getASRouterLocalColumnFromJSON(
  messageDef: any,
): Promise<FxMSMessageInfo> {
  let message = {
    id: messageDef[
      "messaging_system.metrics__text2__messaging_system_message_id"
    ],
    template:
      messageDef[
        "messaging_system.metrics__string__messaging_system_ping_type"
      ],
  };

  let fxmsMsgInfo: FxMSMessageInfo = {
    product: "Desktop",
    id: message.id,
    template: message.template,
    surface: getSurfaceDataForTemplate(getTemplateFromMessage(message)).surface,
    segment: "some segment",
    metrics: "some metrics",
    ctrPercent: undefined, // may be populated from Looker data
    ctrPercentChange: undefined, // may be populated from Looker data
    previewLink: getPreviewLink(maybeCreateWelcomePreview(message)),
    impressions: undefined, // may be populated from Looker data
    hasMicrosurvey: messageHasMicrosurvey(messageDef.id),
  };

  const channel = "release";

  if (isLookerEnabled) {
    const ctrPercentData = await getCTRPercentData(
      message.id,
      fxmsMsgInfo.template,
      channel,
    );
    if (ctrPercentData) {
      fxmsMsgInfo.ctrPercent = ctrPercentData.ctrPercent;
      fxmsMsgInfo.impressions = ctrPercentData.impressions;
    }
  }

  fxmsMsgInfo.ctrDashboardLink = getDashboard(
    message.template,
    message.id,
    channel,
  );

  // dashboard link -> dashboard id -> query id -> query -> ctr_percent_from_lastish_day

  // console.log("fxmsMsgInfo: ", fxmsMsgInfo)

  return fxmsMsgInfo;
}

let columnsShown = false;

type NimbusExperiment = types.experiments.NimbusExperiment;

/**
 * Updates the lib/looker-local-prod-messages/129-nightly.json file with the
 * JSON data retrieved from the Looker query for live messages.
 */
async function updateLookerLiveMessagesList() {
  let data = await runLookQuery();
  const fs = require("fs");
  let json = JSON.stringify(data);
  fs.writeFileSync(
    "lib/looker-local-prod-mressages/129-nightly.json",
    json,
    "utf8",
  );
}

/**
 * Returns the list of live messages to display in the live message table.
 */
async function getLookerLiveMessages() {
  let data = await runLookQuery();

  let messages = await Promise.all(
    data
      .filter((messageDef: any) => {
        const removeMessages = ["undefined", "", "test-id", "n/a"];
        return !removeMessages.includes(
          messageDef[
            "messaging_system.metrics__text2__messaging_system_message_id"
          ],
        );
      })
      .map(async (messageDef: any): Promise<FxMSMessageInfo> => {
        return await getASRouterLocalColumnFromJSON(messageDef);
      }),
  );

  return messages;
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
    .sort(compareFn);
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
    .sort(compareFn);
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

  // XXX await Promise.allSettled for all three loads concurrently
  const localData = await getASRouterLocalMessageInfoFromFile();
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
        <MessageTable columns={fxmsMessageColumns} data={localData} />
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
