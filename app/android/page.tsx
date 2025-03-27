import { Dashboard } from "@/app/dashboard";
import { fetchData } from "@/app/fetchData";
import { Platform } from "@/lib/types";

const platform: Platform = "fenix";

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
      experimentAndBranchInfo={experimentAndBranchInfo}
      totalExperiments={totalExperiments}
      msgRolloutInfo={msgRolloutInfo}
      totalRolloutExperiments={totalRolloutExperiments}
    />
  );
}
