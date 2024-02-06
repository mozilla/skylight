import { types } from "@mozilla/nimbus-shared";
import { BranchInfo,ExperimentAndBranchInfo, ExperimentInfo, experimentColumns, FxMSMessageInfo, fxmsMessageColumns } from "./columns";
import { getDisplayNameForTemplate, getTemplateFromMessage } from "../lib/messageUtils.ts";
import { Base64 } from 'js-base64';

import { MessageTable } from "./message-table";
import { usesMessagingFeatures } from "../lib/experimentUtils.ts";
import Link from "next/link";

function getASRouterLocalColumnFromJSON(messageDef: any) : FxMSMessageInfo {
  return {
    product: 'Desktop',
    release: 'Fx 123',
    id: messageDef.id,
    template: messageDef.template,
    topic: messageDef.provider,
    surface: getDisplayNameForTemplate(getTemplateFromMessage(messageDef)),
    segment: 'some segment',
    metrics: 'some metrics',
    ctrPercent: .5, // getMeFromLooker
    ctrPercentChange: 2, // getMeFromLooker
    ctrDashboardLink: `https://mozilla.cloud.looker.com/dashboards/1471?Message+ID=%25${messageDef.id?.toUpperCase()}%25`,
    previewLink: `about:messagepreview?json=${btoa(JSON.stringify(messageDef))}`,
  }
}

let columnsShown = false;

type NimbusExperiment = types.experiments.NimbusExperiment;

function getBranchInfosFromExperiment(recipe: NimbusExperiment) : BranchInfo[] {
  // console.log(`-in gBCFE for experiment ${recipe.slug}, branches = `);
  // console.table(recipe.branches);
  let branchInfos : BranchInfo[] = recipe.branches.map((branch: any) => {
    let branchInfo : BranchInfo = {
      product : 'Desktop',
      id : branch.slug,
      isBranch: true
    };

    // XXX should look at all the messages
    const value = branch.features[0].value;

    // XXX in this case we're really passing a feature value. Hmm....
    const template = getTemplateFromMessage(value);
    branchInfo.template = template;
    branchInfo.surface = getDisplayNameForTemplate(template);

    switch(template) {
      case 'feature_callout':
        // XXX should iterate over all screens
        branchInfo.id = value.content.screens[0].id;
        break;
      case 'toast_notification':
        if (!value?.id) {
          console.warn("value.id, v = ", value);
          return branchInfo;
        }
        branchInfo.id = value.content.tag;
        break;

      case 'multi':
        // XXX only does first messages
        // XXX get schema here instead of using any

        // const screen0 : any = value.messages[0].content.screens[0];
        // branchInfo.id = screen0.id
        const message0 : any = value.messages[0];

        // XXX don't assume spotlight in multi -- problemw ith mluti layer templates (multi, spotlight, multistage)
        branchInfo.template = 'spotlight';

        // XXX assumes previewable message (spotight?)
        console.log("message0Json = ")
        let message0Json = JSON.stringify(message0, null, 2);
        console.log("message0Json");
        branchInfo.previewLink =
          `about:messagepreview?json=${Base64.encode(message0Json)}`
        break

      case 'momentsUpdate':
        console.warn(`we don't fully support ${template} messages yet"`);
        return branchInfo;

      default:
        if (!value?.messages) {
          console.log ("v.messages is null, v= ", value);
          return branchInfo;
        }
        branchInfo.id = value.messages[0].id;
        break;
      };

    // XXX we don't support dashboards for these yet
    if (template != 'toast_notification' ) {
      // XXX currently doesn't filter to only get experiment and branch
      // so problems can happen if message ID reused
      branchInfo.ctrDashboardLink =
        `https://mozilla.cloud.looker.com/dashboards/1471?Message+ID=%25${branchInfo.id?.toUpperCase()}%25`;
    }

    if (!value.content) {
      console.log ("v.content is null, v= ", value);
      return branchInfo;
    }

    // console.log("branchInfo = ");
    // console.log(branchInfo);
    return branchInfo;
  });

  return branchInfos;
}

function getExperimentAndBranchInfoFromRecipe(recipe: NimbusExperiment) : ExperimentAndBranchInfo[] {

  // console.log("in gECFJ");
  if (recipe.isRollout) {
    return [];
  };

  let experimentInfo : ExperimentInfo[] = [{
    startDate: recipe.startDate || undefined,
    endDate: recipe.endDate || undefined, // XXX use proposed duration instead
    product: 'Desktop',
    release: 'Fx Something',
    id: recipe.slug,
    topic: 'some topic',
    segment: 'some segment',
    ctrPercent: .5, // get me from BigQuery
    ctrPercentChange: 2, // get me from BigQuery
    metrics: 'some metrics',
    experimenterLink: `https://experimenter.services.mozilla.com/nimbus/${recipe.slug}`,
    userFacingName: recipe.userFacingName,
    recipe: recipe
  }];

  let branchInfos : BranchInfo[] = getBranchInfosFromExperiment(recipe);
  // console.log("branchInfos[] = ");
  // console.log(branchInfos);

  let experimentAndBranchInfos : ExperimentAndBranchInfo[] = experimentInfo.concat(branchInfos);

  // console.log("expAndBranchInfos: ");
  // console.table(experimentAndBranchInfos);

  return experimentAndBranchInfos;
}

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

async function getDesktopExperimentsFromServer(): Promise<NimbusExperiment[]> {
  const response = await fetch(
      "https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/nimbus-desktop-experiments/records",
      {
        credentials: "omit",
      }
    );
  const responseJSON = await response.json();
  const experiments : NimbusExperiment[] = await responseJSON.data;

  return experiments;
}

async function getDesktopExperimentAndBranchInfo(experiments : NimbusExperiment[]): Promise<ExperimentAndBranchInfo[]> {

  const messagingExperiments =
    (experiments as Array<NimbusExperiment>).filter(
      recipe => usesMessagingFeatures(recipe));

  let info : ExperimentAndBranchInfo[] =
    messagingExperiments.map(
      (experimentDef : NimbusExperiment) :  ExperimentAndBranchInfo[] =>
        getExperimentAndBranchInfoFromRecipe(experimentDef)).flat(1);

  return info
}

async function getExperimentAndBranchInfoFromServer(): Promise<ExperimentInfo[]> {

  const info : ExperimentAndBranchInfo[] =
    await getDesktopExperimentAndBranchInfo(
        await getDesktopExperimentsFromServer());

  // console.table(info);
  return info;
}

export default async function Dashboard() {
  // XXX await Promise.all for both loads concurrently
  const localData = await getASRouterLocalMessageInfoFromFile()
  const experimentAndBranchInfo = await getExperimentAndBranchInfoFromServer();

  return (
    <div>
      <div>
        <h4 className="scroll-m-20 text-xl font-semibold text-center py-4">
          Skylight
        </h4>

        <ul className="list-disc mx-20 text-sm">
          <li>
            To make the preview URLs work: load <code>about:config</code> in Firefox, and set <code>browser.newtabpage.activity-stream.asrouter.devtoolsEnabled</code> to <code>true</code>
          </li>

          <li>
          Feedback of all kinds accepted in <Link href="https://mozilla.slack.com/archives/C05N15KHCLC">#skylight-messaging-system</Link>
          </li>
        </ul>
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center py-4">
          123 in-tree Production ASRouter messages
      </h5>

      <div className="container mx-auto py-10">
        <MessageTable columns={fxmsMessageColumns} data={localData} />
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center py-4">
          Desktop Messaging Experiments
      </h5>

      <div className="container mx-auto py-10">
        <MessageTable columns={experimentColumns} data={experimentAndBranchInfo} />
      </div>

    </div>
  )
}
