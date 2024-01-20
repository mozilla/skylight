"use client"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const columnHelper = createColumnHelper<Message>();

function DashboardLinkForMessageId(id: string) {
  const href = `https://mozilla.cloud.looker.com/dashboards/1471?Message+ID=%25${id?.toUpperCase()}%25`;

  return (
    <Link href={href} target="_blank" rel="noreferrer">
      Results
      <svg
        fill="none"
        viewBox="0 0 8 8"
        className="inline h-5 w-5 px-1"
        aria-hidden="true"
      >
        <path
          clipRule="evenodd"
          d="m1.71278 0h.57093c.31531 0 .57092.255837.57092.571429 0 .315591-.25561.571431-.57092.571431h-.57093c-.31531 0-.57093.25583-.57093.57143v4.57142c0 .3156.25562.57143.57093.57143h4.56741c.31531 0 .57093-.25583.57093-.57143v-.57142c0-.3156.25561-.57143.57092-.57143.31532 0 .57093.25583.57093.57143v.57142c0 .94678-.76684 1.71429-1.71278 1.71429h-4.56741c-.945943 0-1.71278-.76751-1.71278-1.71429v-4.57142c0-.946778.766837-1.71429 1.71278-1.71429zm5.71629 0c.23083.0002686.43879.13963.52697.353143.02881.069172.04375.143342.04396.218286v2.857141c0 .31559-.25561.57143-.57093.57143-.31531 0-.57092-.25584-.57092-.57143v-1.47771l-1.88006 1.88171c-.14335.14855-.35562.20812-.55523.15583-.19962-.0523-.35551-.20832-.40775-.40811-.05225-.19979.00727-.41225.15569-.55572l1.88006-1.88171h-1.47642c-.31531 0-.57093-.25584-.57093-.571431 0-.315592.25562-.571429.57093-.571429z"
          fill="#5e5e72"
          fillRule="evenodd"
        ></path>
      </svg>
    </Link>
  );
}

function ExperimentInfo(experiment: any, target:any) {
  let branchSlugs = experiment.branches.map((branch: any) => {
    const { value } = branch?.features[0];
    const { id } = value;
    return (
      <>
        <li key={branch.slug}>{branch.slug}</li>
        <ol>
          <p style={{ fontWeight: 600 }}>
            Message ID: <a href={`#devtools-hackathon-${btoa(id)}`}>{id}</a>
          </p>
          {DashboardLinkForMessageId(id)}
        </ol>
      </>
    );
  });
  return (
    <>
      <tr style={{ "borderTop": "1px solid black" }}>
        <td>{experiment.userFacingName}</td>
        <td>{experiment.userFacingDescription}</td>
        <td>
          <ul>{branchSlugs}</ul>
        </td>
      </tr>
    </>
  );
}

function Experiments({view} : {view: any}) {
  const [nimbus, setNimbus] = useState([]);
  useEffect(() => {
    fetch(
      "https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/nimbus-desktop-experiments/records",
      {
        credentials: "omit",
      }
    )
      .then(r => r.json())
      .then(j => setNimbus(j.data));
  }, []);

  const experiments = nimbus.map(experiment => {
    let id = "";
    try {
      id = atob(view);
    } catch (ex) { }
    return ExperimentInfo(experiment, id);
  });

  return (
    <>
      <h1>Nimbus Live Experiments</h1>

      <table>
        <tr style={{ "borderTop": "1px solid black" }}>
          <th>Experiments</th>
          <th>Description</th>
          <th>Branches</th>
        </tr>
        {experiments}
      </table>
    </>
  );
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Message = {
  product: 'Desktop' | 'Android'
  release: string
  id: string
  topic: string
  surface: string
  segment: string
  ctrPercent: number
  ctrPercentChange: number
  ctrDashboardLink: string
  previewLink: string
  metrics: string
}

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: "release",
    header: "Release",
  },
  {
    accessorKey: "id",
    header: "Message ID",
  },
  {
    accessorKey: "topic",
    header: "Topic",
  },
  {
    accessorKey: "surface",
    header: "Surface",
  }, {
  //   accessorKey: "segment",
  //   header: "Segment",
  // }, {
    accessorKey: "metrics",
    header: "Metrics",
    cell: (props: any) => {
      // console.log(props);
      const messageId = props.row.original.id;
      return DashboardLinkForMessageId(messageId);
    }
  }, {
    accessorKey: "previewLink",
    header: "",
    cell: (props: any) => {
      if (props.row.original.surface !== 'infobar'
          && props.row.original.surface !== 'spotlight') {
          return ( <div/> );
      }

      // unless / until we get MAKE_LINKABLE landed
      const copyPreviewLink = () => {
        return navigator.clipboard.writeText(props.row.original.previewLink);
      }

      return (
        copyPreviewLink ?
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                <Button
                  className={
                    buttonVariants({
                        variant: "secondary",
                        size: "sm",
                        className: "active:bg-slate-500 font-normal border  border-slate-700"
                    })
                  }
                  onClick={copyPreviewLink}>
                <Copy className="me-2" />
                Copy Preview URL
              </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>After clicking to copy, paste in URL bar for message preview</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        :
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          href={props.row.original.previewLink}
          target="_blank">
          Preview
        </Link> );
    }
  },
]
