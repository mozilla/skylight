import { Dashboard } from "@/app/dashboard";
import { fetchData } from "@/app/fetchData";

const platform = "firefox-desktop";

export default async function Page() {
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
      localData={localData}
      experimentAndBranchInfo={experimentAndBranchInfo}
      totalExperiments={totalExperiments}
      msgRolloutInfo={msgRolloutInfo}
      totalRolloutExperiments={totalRolloutExperiments}
    />
  );
}
