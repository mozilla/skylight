import { fetchData, Dashboard } from "@/app/dashboard";
import { Platform } from "@/lib/types";



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
      platform="Android"
      experimentAndBranchInfo={experimentAndBranchInfo}
      totalExperiments={totalExperiments}
      msgRolloutInfo={msgRolloutInfo}
      totalRolloutExperiments={totalRolloutExperiments}
    />
  );
}
