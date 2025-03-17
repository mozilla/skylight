import { Dashboard } from "@/app/dashboard";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {

  console.log("searchParams: ", searchParams);

  let platform;
  if (typeof searchParams.platform === 'string') {
    platform = searchParams.platform as string;
  }
  return (
    <Dashboard platform={platform ? platform : "desktop"} />
  );
}

