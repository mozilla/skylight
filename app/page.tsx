import { types } from "@mozilla/nimbus-shared";
import { BranchInfo, ExperimentAndBranchInfo, ExperimentInfo, experimentColumns, FxMSMessageInfo, fxmsMessageColumns } from "./columns";
import { getDisplayNameForTemplate, getTemplateFromMessage, isAboutWelcomeTemplate } from "../lib/messageUtils.ts";

import { MessageTable } from "./message-table";
import { getProposedEndDate, usesMessagingFeatures } from "../lib/experimentUtils.ts";
import Link from "next/link";

function getASRouterLocalColumnFromJSON(messageDef: any) : FxMSMessageInfo {
  let fxmsMsgInfo : FxMSMessageInfo = {
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
    previewLink: `about:messagepreview?json=${btoa(JSON.stringify(messageDef))}`,
  }

  if (isAboutWelcomeTemplate(messageDef.template)) {
    fxmsMsgInfo.ctrDashboardLink =
      `https://mozilla.cloud.looker.com/dashboards/1471?Message+ID=%25${messageDef.id?.toUpperCase()}%25`
  }

  return fxmsMsgInfo
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
    branch.template = template;
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
        branchInfo.id = value.messages[0].content.screens[0].id;

        // XXX assumes previewable message (spotight?)
        // branchInfo.previewLink =
        //   `about:messagepreview?json=${btoa(JSON.stringify(value.messages[0].content.screens[0].content))}`;

        break;

      case 'momentsUpdate':
        console.warn(`we don't fully support ${template} messages yet"`);
        return branchInfo;

      default:
        if (!value?.messages) {
          console.log("v.messages is null")
          console.log(", v= ", value);
          return branchInfo;
        }
        branchInfo.id = value.messages[0].id;
        break;
      };

    // XXX we don't support dashboards for these yet
    if (isAboutWelcomeTemplate(branch.template)) {
      // XXX currently doesn't filter to only get experiment and branch
      // so problems can happen if message ID reused
      branchInfo.ctrDashboardLink =
        `https://mozilla.cloud.looker.com/dashboards/1471?Message+ID=%25${branchInfo.id?.toUpperCase()}%25`;
    }

    if (!value.content) {
      console.log("v.content is null")
      // console.log("v= ", value)
      return branchInfo
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

  let experimentInfo : ExperimentInfo = {
    startDate: recipe.startDate || null,
    endDate:
      recipe.endDate ||
      getProposedEndDate(recipe.startDate, recipe.proposedDuration) || null,
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
  }

  let branchInfos : BranchInfo[] = getBranchInfosFromExperiment(recipe);
  // console.log("branchInfos[] = ");
  // console.log(branchInfos);

  let experimentAndBranchInfos : ExperimentAndBranchInfo[] = [];
  experimentAndBranchInfos =
    ([experimentInfo] as ExperimentAndBranchInfo[])
    .concat(branchInfos);

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
      (experimentDef : NimbusExperiment) : ExperimentAndBranchInfo[] =>
        getExperimentAndBranchInfoFromRecipe(experimentDef)).flat(1);

  return info
}

async function getExperimentAndBranchInfoFromServer(): Promise<ExperimentAndBranchInfo[]> {

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
