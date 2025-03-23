import { types } from "@mozilla/nimbus-shared";
import {
  RecipeOrBranchInfo,
  experimentColumns,
  FxMSMessageInfo,
  fxmsMessageColumns,
} from "./columns";
import {
  cleanLookerData,
  getCTRPercentData,
  mergeLookerData,
  runLookQuery,
} from "@/lib/looker.ts";
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
import { Platform } from "@/lib/types";

export const isLookerEnabled = process.env.IS_LOOKER_ENABLED === "true";

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
export function compareDatesFn(a: NimbusRecipe, b: NimbusRecipe): number {
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

let columnsShown = false;

type NimbusExperiment = types.experiments.NimbusExperiment;

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

export async function getMsgRolloutCollection(
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

interface ReleasedTableProps {
  platform: string;
  localData: FxMSMessageInfo[];
}

const ReleasedTable = async ({ platform, localData }: ReleasedTableProps) => {
  return (
    <div>
      <h5
        id="firefox"
        data-testid="firefox"
        className="scroll-m-20 text-xl font-semibold text-center pt-6 flex items-center justify-center gap-x-1"
      >
        {platform} Messages Released on Firefox
        <InfoPopover
          content="All messages listed in this table are in the release channel and are either currently live or have been live on Firefox at one time."
          iconStyle="h-7 w-7 p-1 rounded-full cursor-pointer border-0 bg-slate-100 hover:bg-slate-200"
        />
      </h5>
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
    </div>
  );
};

interface DashboardProps {
  platform?: Platform;
  localData?: FxMSMessageInfo[];
  experimentAndBranchInfo: any[];
  totalExperiments: number;
  msgRolloutInfo: any[];
  totalRolloutExperiments: number;
}

export const Dashboard = async ({
  platform = "Desktop",
  localData,
  experimentAndBranchInfo,
  totalExperiments,
  msgRolloutInfo,
  totalRolloutExperiments,
}: DashboardProps) => {
  return (
    <div role="main" data-testid="dashboard">
      <div className="sticky top-0 z-50 bg-background flex justify-between px-20 py-8">
        <h4 className="scroll-m-20 text-3xl font-semibold">Skylight</h4>
        <MenuButton isComplete={false} />
      </div>

      {localData
        ? <ReleasedTable platform={platform as string} localData={localData} /> : null}

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4">
        Current {platform} Message Rollouts
      </h5>
      <h5
        id="live_rollouts"
        data-testid="live_rollouts"
        className="scroll-m-20 text-sm text-center"
      >
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

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4">
        Current {platform} Message Experiments
      </h5>
      <h5
        id="live_experiments"
        data-testid="live_experiments"
        className="scroll-m-20 text-sm text-center"
      >
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
};
