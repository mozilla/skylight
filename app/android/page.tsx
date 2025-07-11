import { Dashboard } from "@/app/dashboard";
import { fetchData } from "@/app/fetchData";
import { Platform } from "@/lib/types";

const platform: Platform = "fenix";

export default async function Page() {
  // XXXdmose We're hitting Looker data limits. Ultimately, we may want an
  // ErrorBoundary here for the general case, but for now, we'll just return an
  // empty div to get things working again.
  return <div />;

  const {
    localData,
    experimentAndBranchInfo,
    totalExperiments,
    msgRolloutInfo,
    totalRolloutExperiments,
  } = await fetchData(platform);

  return (
    <Dashboard
      platform={platform}
      experimentAndBranchInfo={experimentAndBranchInfo}
      totalExperiments={totalExperiments}
      msgRolloutInfo={msgRolloutInfo}
      totalRolloutExperiments={totalRolloutExperiments}
    />
  );
}
