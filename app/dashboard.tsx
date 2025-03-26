import {
  experimentColumns,
  FxMSMessageInfo,
  fxmsMessageColumns,
} from "./columns";
import { _isAboutWelcomeTemplate } from "../lib/messageUtils.ts";

import { _substituteLocalizations } from "../lib/experimentUtils.ts";

import { MessageTable } from "./message-table";

import { MenuButton } from "@/components/ui/menubutton.tsx";
import { InfoPopover } from "@/components/ui/infopopover.tsx";
import { Timeline } from "@/components/ui/timeline.tsx";
import { Platform } from "@/lib/types";

const hidden_message_impression_threshold =
  process.env.HIDDEN_MESSAGE_IMPRESSION_THRESHOLD;

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
  platform = "firefox-desktop",
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

      {localData ? (
        <ReleasedTable platform={platform as string} localData={localData} />
      ) : null}

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
