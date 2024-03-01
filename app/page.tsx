import { types } from "@mozilla/nimbus-shared";
import { BranchInfo, ExperimentAndBranchInfo, ExperimentInfo, experimentColumns, FxMSMessageInfo, fxmsMessageColumns } from "./columns";
import { getDashboard, getDisplayNameForTemplate, getTemplateFromMessage, _isAboutWelcomeTemplate } from "../lib/messageUtils.ts";
import { _substituteLocalizations } from "../lib/experimentUtils.ts";

import { MessageTable } from "./message-table";
import {
  getProposedEndDate,
  usesMessagingFeatures,
} from "../lib/experimentUtils.ts";
import Link from "next/link";

function _substituteLocalizations(values, localizations) {
  // If the recipe is not localized, we don't need to do anything.
  // Likewise, if the value we are attempting to localize is not an object,
  // there is nothing to localize.
  if (
    typeof localizations === "undefined" ||
    typeof values !== "object" ||
    values === null
  ) {
    return values;
  }

  if (Array.isArray(values)) {
    return values.map((value) =>
      _substituteLocalizations(value, localizations),
    );
  }

  const substituted = Object.assign({}, values);

  for (const [key, value] of Object.entries(values)) {
    if (
      key === "$l10n" &&
      typeof value === "object" &&
      value !== null &&
      value?.id
    ) {
      return localizations[value.id];
    }

    substituted[key] = _substituteLocalizations(value, localizations);
  }

  return substituted;
}

function getASRouterLocalColumnFromJSON(messageDef: any): FxMSMessageInfo {
  let fxmsMsgInfo: FxMSMessageInfo = {
    product: "Desktop",
    release: "Fx 123",
    id: messageDef.id,
    template: messageDef.template,
    topic: messageDef.provider,
    surface: getDisplayNameForTemplate(getTemplateFromMessage(messageDef)),
    segment: 'some segment',
    metrics: 'some metrics',
    ctrPercent: .5, // getMeFromLooker
    ctrPercentChange: 2, // getMeFromLooker
    previewLink: `about:messagepreview?json=${encodeURIComponent(btoa(
      JSON.stringify(messageDef),
    ))}`,
  };

  fxmsMsgInfo.ctrDashboardLink = getDashboard(messageDef.template, messageDef.id);

  return fxmsMsgInfo
}

let columnsShown = false;

type NimbusExperiment = types.experiments.NimbusExperiment;

function getBranchInfosFromExperiment(recipe: NimbusExperiment): BranchInfo[] {
  // console.log(`-in gBCFE for experiment ${recipe.slug}, branches = `);
  // console.table(recipe.branches);
  let branchInfos: BranchInfo[] = recipe.branches.map((branch: any) => {
    let branchInfo: BranchInfo = {
      product: 'Desktop',
      id: branch.slug,
      isBranch: true
    };

    // XXX should look at all the messages
    const value = branch.features[0].value;

    // XXX in this case we're really passing a feature value. Hmm....
    const template = getTemplateFromMessage(value);
    branch.template = template;
    branchInfo.template = template;
    branchInfo.surface = getDisplayNameForTemplate(template);

    switch (template) {
      case "feature_callout":
        // XXX should iterate over all screens
        branchInfo.id = value.content.screens[0].id;
        break;

      case 'infobar':
        branchInfo.id = value.messages[0].id;
        branchInfo.ctrDashboardLink = getDashboard(template, branchInfo.id);
        branchInfo.previewLink = `about:messagepreview?json=${encodeURIComponent(btoa(
          JSON.stringify(_substituteLocalizations(value.content, recipe.localizations))))}`;
        break;

      case 'toast_notification':
        if (!value?.id) {
          console.warn("value.id, v = ", value);
          return branchInfo;
        }
        branchInfo.id = value.content.tag;
        break;

      case 'spotlight':
        branchInfo.id = value.id;
        branchInfo.previewLink = `about:messagepreview?json=${encodeURIComponent(btoa(
          JSON.stringify(_substituteLocalizations(value, recipe.localizations))
        ))}`;
        break;

      case 'multi':
        // XXX only does first message
	    const firstMessage = value.messages[0]
        if (!('content' in firstMessage)) {
      	  console.warn('template "multi" first message does not contain content key; details not rendered')
      	  return branchInfo
        }

	      // XXX only does first screen
        branchInfo.id = firstMessage.content.screens[0].id

        // XXX assumes previewable message (currently spotlight or infobar) 
        branchInfo.previewLink =
          `about:messagepreview?json=${encodeURIComponent(btoa(
            JSON.stringify(_substituteLocalizations(value.messages[0], recipe.localizations))
          ))}`;
        break;

      case 'momentsUpdate':
        console.warn(`we don't fully support ${template} messages yet`);
        return branchInfo;

      default:
        if (!value?.messages) {
          console.log("v.messages is null")
          console.log(", v= ", value);
          return branchInfo;
        }
        branchInfo.id = value.messages[0].id;
        break;
    }

    branchInfo.ctrDashboardLink = getDashboard(branch.template, branchInfo.id)

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

function getExperimentAndBranchInfoFromRecipe(recipe: NimbusExperiment): ExperimentAndBranchInfo[] {
  // console.log("in gECFJ");
  if (recipe.isRollout) {
    return [];
  };

  let experimentInfo: ExperimentInfo = {
    startDate: recipe.startDate || null,
    endDate:
      recipe.endDate ||
      getProposedEndDate(recipe.startDate, recipe.proposedDuration) ||
      null,
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

  let branchInfos: BranchInfo[] = getBranchInfosFromExperiment(recipe);
  // console.log("branchInfos[] = ");
  // console.log(branchInfos);

  let experimentAndBranchInfos: ExperimentAndBranchInfo[] = [];
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

  let messages: FxMSMessageInfo[] = 
    json_data.map((messageDef: any): FxMSMessageInfo => getASRouterLocalColumnFromJSON(messageDef));

  return messages;
}

async function getDesktopExperimentsFromServer(): Promise<NimbusExperiment[]> {
  const response = await fetch(
    "https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/nimbus-desktop-experiments/records",
    {
      credentials: "omit",
    },
  );
  const responseJSON = await response.json();
  const experiments: NimbusExperiment[] = await responseJSON.data;

  return experiments;
}

async function getDesktopExperimentAndBranchInfo(experiments: NimbusExperiment[]): Promise<ExperimentAndBranchInfo[]> {
  const messagingExperiments = (experiments as Array<NimbusExperiment>).filter(
    recipe => usesMessagingFeatures(recipe));

  let info : ExperimentAndBranchInfo[] = messagingExperiments
    .map((experimentDef: NimbusExperiment): ExperimentAndBranchInfo[] =>
      getExperimentAndBranchInfoFromRecipe(experimentDef))
    .flat(1);

  return info
}

async function getExperimentAndBranchInfoFromServer(): Promise<ExperimentAndBranchInfo[]> {
  const info : ExperimentAndBranchInfo[] =
    await getDesktopExperimentAndBranchInfo(
      await getDesktopExperimentsFromServer()
    );

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
        <h4 className="scroll-m-20 text-3xl font-semibold text-center py-4">
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
        <MessageTable
          columns={experimentColumns}
          data={experimentAndBranchInfo}
        />
      </div>
    </div>
  );
}
