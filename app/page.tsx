import { types } from "@mozilla/nimbus-shared";
import {
  RecipeOrBranchInfo,
  experimentColumns,
  FxMSMessageInfo,
  fxmsMessageColumns,
} from "./columns";
import { getCTRPercent } from "@/lib/looker.ts";
import {
  getDashboard,
  getDisplayNameForTemplate,
  getTemplateFromMessage,
  _isAboutWelcomeTemplate,
  maybeCreateWelcomePreview,
  getPreviewLink,
} from "../lib/messageUtils.ts";

import { NimbusRecipeCollection } from "../lib/nimbusRecipeCollection";
import { _substituteLocalizations } from "../lib/experimentUtils.ts";

import { NimbusRecipe } from "../lib/nimbusRecipe.ts";
import { MessageTable } from "./message-table";

import { MenuButton } from "@/components/ui/menubutton.tsx";
import { InfoPopover } from "@/components/ui/infopopover.tsx";

const isLookerEnabled = process.env.IS_LOOKER_ENABLED === "true";

async function getASRouterLocalColumnFromJSON(
  messageDef: any,
): Promise<FxMSMessageInfo> {
  let fxmsMsgInfo: FxMSMessageInfo = {
    product: "Desktop",
    id: messageDef.id,
    template: messageDef.template,
    surface: getDisplayNameForTemplate(getTemplateFromMessage(messageDef)),
    segment: "some segment",
    metrics: "some metrics",
    ctrPercent: undefined, // may be populated from Looker data
    ctrPercentChange: undefined, // may be populated from Looker data
    previewLink: getPreviewLink(maybeCreateWelcomePreview(messageDef)),
  };

  const channel = "release";

  if (isLookerEnabled) {
    const ctrPercent = await getCTRPercent(
      messageDef.id,
      fxmsMsgInfo.template,
      channel,
    );
    if (ctrPercent) {
      fxmsMsgInfo.ctrPercent = ctrPercent;
    }
  }

  fxmsMsgInfo.ctrDashboardLink = getDashboard(
    messageDef.template,
    messageDef.id,
    channel,
  );

  // dashboard link -> dashboard id -> query id -> query -> ctr_percent_from_lastish_day

  // console.log("fxmsMsgInfo: ", fxmsMsgInfo)

  return fxmsMsgInfo;
}

let columnsShown = false;

type NimbusExperiment = types.experiments.NimbusExperiment;

async function getASRouterLocalMessageInfoFromFile(): Promise<
  FxMSMessageInfo[]
> {
  const fs = require("fs");

  let data = fs.readFileSync(
    "lib/asrouter-local-prod-messages/123-nightly-in-progress.json",
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
  msgExpRecipeCollection.recipes = expOnlyCollection.recipes.filter((recipe) =>
    recipe.usesMessagingFeatures(),
  );
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
  msgRolloutRecipeCollection.recipes = recipeCollection.recipes.filter(
    (recipe) => recipe.usesMessagingFeatures() && !recipe.isExpRecipe(),
  );
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
      <div className="flex justify-between mx-20 py-8">
        <h4 className="scroll-m-20 text-3xl font-semibold">Skylight</h4>
        <MenuButton />
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4 flex items-center justify-center">
        Desktop Messages Released on Firefox
        <InfoPopover
          iconSize={16}
          content="All messages listed in this table are in the release channel and are either currently live or have been live on Firefox at one time."
          iconStyle="ml-1 cursor-pointer"
        />
      </h5>
      <h5 className="scroll-m-20 text-sm text-center">(Partial List)</h5>

      <div className="container mx-auto py-10">
        <MessageTable columns={fxmsMessageColumns} data={localData} />
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4">
        Current Desktop Message Rollouts
      </h5>
      <h5 className="scroll-m-20 text-sm text-center">
        Total: {totalRolloutExperiments}
      </h5>
      <div className="container mx-auto py-10">
        <MessageTable
          columns={experimentColumns}
          data={msgRolloutInfo}
          defaultExpanded={true}
        />
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4">
        Current Desktop Message Experiments
      </h5>
      <h5 className="scroll-m-20 text-sm text-center">
        Total: {totalExperiments}
      </h5>

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
