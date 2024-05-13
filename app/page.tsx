import { types } from "@mozilla/nimbus-shared";
import { BranchInfo, RecipeOrBranchInfo, experimentColumns, FxMSMessageInfo, fxmsMessageColumns } from "./columns";
import { getDashboard, getDisplayNameForTemplate, getTemplateFromMessage, _isAboutWelcomeTemplate, getPreviewLink } from "../lib/messageUtils.ts";
import { NimbusRecipeCollection } from "../lib/nimbusRecipeCollection"
import { _substituteLocalizations } from "../lib/experimentUtils.ts";

import { InfoIcon } from "@/components/ui/infoicon.tsx";
import { NimbusRecipe } from "../lib/nimbusRecipe.ts"
import { MessageTable } from "./message-table";
import Link from "next/link";

function getASRouterLocalColumnFromJSON(messageDef: any) : FxMSMessageInfo {
  let fxmsMsgInfo : FxMSMessageInfo = {
    product: 'Desktop',
    id: messageDef.id,
    template: messageDef.template,
    surface: getDisplayNameForTemplate(getTemplateFromMessage(messageDef)),
    segment: 'some segment',
    metrics: 'some metrics',
    ctrPercent: .5, // getMeFromLooker
    ctrPercentChange: 2, // getMeFromLooker
    previewLink: getPreviewLink(messageDef),
  };

  fxmsMsgInfo.ctrDashboardLink = getDashboard(messageDef.template, messageDef.id,
    "release")

  return fxmsMsgInfo
}

let columnsShown = false;

type NimbusExperiment = types.experiments.NimbusExperiment;


async function getASRouterLocalMessageInfoFromFile(): Promise<FxMSMessageInfo[]> {
  const fs = require("fs");

  let data = fs.readFileSync(
    "lib/asrouter-local-prod-messages/123-nightly-in-progress.json",
    "utf8");
  let json_data = JSON.parse(data);

  let messages : FxMSMessageInfo[] =
    json_data.map((messageDef : any) : FxMSMessageInfo => getASRouterLocalColumnFromJSON(messageDef));

  return messages;
}

async function getMsgExpRecipeCollection(): Promise<NimbusRecipeCollection> {

  const recipeCollection = new NimbusRecipeCollection()
  await recipeCollection.fetchRecipes()
  console.log('recipeCollection.length = ', recipeCollection.recipes.length)

  // XXX should move to nimbusRecipe
  function isMsgRecipe(recipe : NimbusRecipe) : boolean {
    return recipe.usesMessagingFeatures()
  }

  const msgExpRecipeCollection = new NimbusRecipeCollection()
  msgExpRecipeCollection.recipes =
    recipeCollection.recipes.filter(isMsgRecipe)
  console.log('msgExpRecipeCollection.length = ', msgExpRecipeCollection.recipes.length)

  return msgExpRecipeCollection
}

export default async function Dashboard() {
  // XXX await Promise.all for both loads concurrently
  const localData = await getASRouterLocalMessageInfoFromFile()
  const msgExpRecipeCollection = await getMsgExpRecipeCollection()

  // get in format useable by MessageTable
  const experimentAndBranchInfo : RecipeOrBranchInfo[] =
    msgExpRecipeCollection.recipes.map(
      (recipe : NimbusRecipe) => recipe.getRecipeOrBranchInfos()).flat(1)


  const totalExperiments = msgExpRecipeCollection.recipes.length

  return (
    <div>
      <div>
        <h4 className="scroll-m-20 text-3xl font-semibold text-center py-4">
          Skylight
        </h4>

        <ul className='list-[circle] mx-20 text-sm'>
          <li>
            To make the preview URLs work: load <code>about:config</code> in Firefox, and set <code>browser.newtabpage.activity-stream.asrouter.devtoolsEnabled</code> to <code>true</code>; <b>a Firefox 126 build from March 29 or newer</b> is required.
          </li>

          <li>
          Feedback of all kinds accepted in <Link href="https://mozilla.slack.com/archives/C05N15KHCLC">#skylight-messaging-system</Link>
          </li>

          <li>
            <b>(*)</b> Production Messages - Release Channel is currently a partial list. Nimbus rollouts, remote-settings messages, and a small number of others are planned.
          </li>
        </ul>
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4">
        Messages Released on Firefox
        <InfoIcon
          iconSize={16}
          content="All messages listed in this table are in the release channel and are either currently live or have been live on Firefox at one time."
        />
      </h5>
      <h5 className="scroll-m-20 text-lg font-semibold text-center">
        (Partial List) 
      </h5>

      <div className="container mx-auto py-10">
        <MessageTable columns={fxmsMessageColumns} data={localData} />
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4">
        Current Message Experiments
      </h5>
      <h5 className="scroll-m-20 text-lg font-semibold text-center">
        Total: {totalExperiments}
      </h5>

      <div className="container mx-auto py-10">
        <MessageTable columns={experimentColumns} data={experimentAndBranchInfo} />
      </div>
    </div>
  );
}
