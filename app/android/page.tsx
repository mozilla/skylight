import { fetchData, Dashboard } from "@/app/dashboard";

export default async function Page() {
  const data = await fetchData();
  return <Dashboard platform={"android"} {...data} />;
}
