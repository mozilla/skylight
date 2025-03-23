import { fetchData, Dashboard } from "@/app/dashboard";

export default async function Page() {
  const {
    localData,
    experimentAndBranchInfo,
    totalExperiments,
    msgRolloutInfo,
    totalRolloutExperiments,
  } = await fetchData();

  return (
    <Dashboard
      platform="android"
      experimentAndBranchInfo={experimentAndBranchInfo}
      totalExperiments={totalExperiments}
      msgRolloutInfo={msgRolloutInfo}
      totalRolloutExperiments={totalRolloutExperiments}
    />
  );
}
