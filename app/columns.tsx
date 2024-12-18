"use client";
import { types } from "@mozilla/nimbus-shared";
import { ColumnDef, Row } from "@tanstack/react-table";
import { NimbusRecipe } from "@/lib/nimbusRecipe";
import { PreviewLinkButton } from "@/components/ui/previewlinkbutton";
import {
  ChevronsUpDown,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";
import { PrettyDateRange } from "./dates";
import { InfoPopover } from "@/components/ui/infopopover";
import { getSurfaceDataForTemplate } from "@/lib/messageUtils";
import { HIDE_DASHBOARD_EXPERIMENTS } from "@/lib/experimentUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function SurfaceTag(template: string, surface: string) {
  const { tagColor, docs } = getSurfaceDataForTemplate(template);
  const anchorTagClassName =
    "text-primary visited:text-primary hover:text-secondary hover:bg-opacity-80 cursor-pointer hover:no-underline ";
  const surfaceTagClassName =
    "text-xs/[180%] text-nowrap px-2 py-1 inline rounded-md " + tagColor;

  if (docs) {
    return (
      <a
        className={anchorTagClassName + surfaceTagClassName}
        href={docs}
        target="_blank"
        rel="noreferrer"
      >
        {surface}
      </a>
    );
  } else {
    return <div className={surfaceTagClassName}>{surface}</div>;
  }
}

function OffsiteLink(href: string, linkText: any) {
  return (
    <a
      href={href}
      className="text-xs/[180%] whitespace-nowrap"
      target="_blank"
      rel="noreferrer"
    >
      {linkText}
      <svg
        fill="none"
        viewBox="0 0 8 8"
        className="inline h-[1.1rem] w-[1.1rem] px-1"
        aria-hidden="true"
      >
        <path
          clipRule="evenodd"
          d="m1.71278 0h.57093c.31531 0 .57092.255837.57092.571429 0 .315591-.25561.571431-.57092.571431h-.57093c-.31531 0-.57093.25583-.57093.57143v4.57142c0 .3156.25562.57143.57093.57143h4.56741c.31531 0 .57093-.25583.57093-.57143v-.57142c0-.3156.25561-.57143.57092-.57143.31532 0 .57093.25583.57093.57143v.57142c0 .94678-.76684 1.71429-1.71278 1.71429h-4.56741c-.945943 0-1.71278-.76751-1.71278-1.71429v-4.57142c0-.946778.766837-1.71429 1.71278-1.71429zm5.71629 0c.23083.0002686.43879.13963.52697.353143.02881.069172.04375.143342.04396.218286v2.857141c0 .31559-.25561.57143-.57093.57143-.31531 0-.57092-.25584-.57092-.57143v-1.47771l-1.88006 1.88171c-.14335.14855-.35562.20812-.55523.15583-.19962-.0523-.35551-.20832-.40775-.40811-.05225-.19979.00727-.41225.15569-.55572l1.88006-1.88171h-1.47642c-.31531 0-.57093-.25584-.57093-.571431 0-.315592.25562-.571429.57093-.571429z"
          fill="#5e5e72"
          fillRule="evenodd"
        ></path>
      </svg>
    </a>
  );
}

// This type is used to define the shape of our data.
// NOTE: ctrPercent is undefined by default until set using getCTRPercent. It is
// made optional to help determine what's displayed in the Metrics column.
export type FxMSMessageInfo = {
  product: "Desktop" | "Android";
  id: string;
  template: string;
  surface: string;
  segment: string;
  ctrPercent?: number;
  ctrPercentChange?: number;
  ctrDashboardLink?: string;
  previewLink?: string;
  metrics: string;
  impressions?: number;
  hasMicrosurvey?: boolean;
  hidePreview?: boolean;
};

type NimbusExperiment = types.experiments.NimbusExperiment;

export type RecipeInfo = {
  product: "Desktop" | "Android";
  id: string;
  template?: string;
  surface?: string;
  segment?: string;
  ctrPercent?: number;
  ctrPercentChange?: number;
  ctrDashboardLink?: string;
  previewLink?: string;
  metrics?: string;
  experimenterLink?: string;
  startDate: string | null;
  endDate: string | null;
  userFacingName?: string;
  nimbusExperiment: NimbusExperiment;
  isBranch?: boolean;
  branches: BranchInfo[]; // XXX rename this to branchInfos to avoid confusion with the branches property inside NimbusExperiment
  hasMicrosurvey?: boolean;
  experimentBriefLink?: string;
};

export type BranchInfo = {
  product: "Desktop" | "Android";
  id: string;
  slug: string;
  surface?: string;
  segment?: string;
  ctrPercent?: number;
  ctrPercentChange?: number;
  ctrDashboardLink?: string;
  previewLink?: string;
  metrics?: string;
  experimenterLink?: string;
  startDate?: string;
  endDate?: string;
  userFacingName?: string;
  nimbusExperiment: NimbusExperiment;
  isBranch?: boolean;
  template?: string;
  screenshots?: string[];
  description?: string;
  impressions?: number;
  hasMicrosurvey?: boolean;
};

export type RecipeOrBranchInfo = RecipeInfo | BranchInfo;

/**
 * @returns an OffsiteLink linking to the Looker dashboard link if it exists,
 * labelled with either the CTR percent or "Dashboard"
 */
function showCTRMetrics(
  ctrDashboardLink?: string,
  ctrPercent?: number,
  impressions?: number,
) {
  if (ctrDashboardLink && ctrPercent !== undefined && impressions) {
    return (
      <div>
        {OffsiteLink(
          ctrDashboardLink,
          <>
            {ctrPercent + "% CTR"} <br />
            {impressions.toLocaleString() +
              " impression" +
              (impressions > 1 ? "s" : "")}
          </>,
        )}
      </div>
    );
  } else if (ctrDashboardLink) {
    return OffsiteLink(ctrDashboardLink, "Dashboard");
  }
}

const previewURLInfoButton = (
  <InfoPopover
    content={
      <p>
        To make the Preview URLs work, load <code>about:config</code> in Firefox
        and set{" "}
        <code>browser.newtabpage.activity-stream.asrouter.devtoolsEnabled</code>{" "}
        to true; Firefox 128 or newer is required.
      </p>
    }
    iconStyle="ml-1 h-6 w-6 p-1 rounded-full cursor-pointer bg-gray-200/70 hover:text-slate-400/70 hover:bg-gray-300/70 border-0"
  />
);

const microsurveyBadge = (
  <div className="inline px-2 py-1 bg-slate-300 text-foreground text-3xs rounded-md font-medium">
    Microsurvey
  </div>
);

function experimentBriefTooltip(link: string) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            className="flex items-center justify-center rounded-md text-primary hover:text-primary/80 visited:text-inherit"
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            <FileText size={14} />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>See experiment brief</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function filterBySurface(
  row: Row<RecipeOrBranchInfo>,
  filterValue: string,
): boolean {
  if (row.original.surface) {
    return row.original.surface
      .toLowerCase()
      .includes(filterValue.toLowerCase());
  }
  return false;
}

export const fxmsMessageColumns: ColumnDef<FxMSMessageInfo>[] = [
  {
    accessorKey: "id",
    header: "Message ID",
    cell: (props: any) => {
      return (
        <>
          <div className="font-mono text-xs inline">
            {/* Quick fix for long message IDs that can break the UI */}
            {props.row.original.id.length <= 50
              ? props.row.original.id
              : props.row.original.id.substring(0, 50) + "…"}
          </div>
          {props.row.original.hasMicrosurvey && <> {microsurveyBadge} </>}
        </>
      );
    },
  },
  {
    accessorKey: "surface",
    header: "Surface",
    cell: (props: any) => {
      return SurfaceTag(
        props.row.original.template,
        props.row.original.surface,
      );
    },
    meta: {
      filterVariant: "text",
    },
  },
  {
    //   accessorKey: "segment",
    //   header: "Segment",
    // }, {
    accessorKey: "metrics",
    header: () => (
      <div className="flex flex-row items-center">
        Metrics
        <InfoPopover
          content={
            <p>
              The CTR and impressions metrics in this table are the primary
              button clickthrough rates calculated over the <b>last 30 days</b>.
              Clicking into the CTR value will direct you to the Looker
              dashboard displaying the data.
            </p>
          }
          iconStyle="ml-1 h-6 w-6 p-1 rounded-full cursor-pointer bg-gray-200/70 hover:text-slate-400/70 hover:bg-gray-300/70 border-0"
        />
      </div>
    ),
    cell: (props: any) => {
      // XXX these dashboards are currently (incorrectly) empty.
      // Until we debug and fix, we'll hide them.
      //
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1889497
      const hideDashboardMessages = [
        "PDFJS_FEATURE_TOUR_A",
        "PDFJS_FEATURE_TOUR_B",
        "FIREFOX_VIEW_SPOTLIGHT",
        "NEWTAB_POCKET_TOPICS_SURVEY",
        "MULTISELECT_WITH_DESCRIPTIONS",
        "DEVICE_MIGRATION_BACKUP_AND_SYNC_SPOTLIGHT_SYNC_CONTENT",
        "DEVICE_MIGRATION_BACKUP_AND_SYNC_SPOTLIGHT_SYNC_AND_BACKUP_CONTENT",
      ];
      if (hideDashboardMessages.includes(props.row.original.id)) {
        return <></>;
      }

      const metrics = showCTRMetrics(
        props.row.original.ctrDashboardLink,
        props.row.original.ctrPercent,
        props.row.original.impressions,
      );
      if (metrics) {
        return metrics;
      }
      return <></>;
    },
    filterFn: (row, columnId, filterValue) => {
      if (filterValue) {
        // If the filterValue is set, then the hide message toggle must be checked.
        // This means we only want to display messages with over `filterValue`
        // impressions or messages that already don't display any impressions.
        return (
          (row.original.impressions &&
            row.original.impressions >= filterValue) ||
          !row.original.impressions
        );
      }
      return true;
    },
    meta: {
      filterVariant: "checkbox",
    },
  },
  {
    accessorKey: "previewLink",
    header: () => (
      <div className="flex flex-row items-center">
        Visuals
        {previewURLInfoButton}
      </div>
    ),
    cell: (props: any) => {
      const supportedTypes = [
        "infobar",
        "spotlight",
        "defaultaboutwelcome",
        "feature_callout",
      ];
      if (!supportedTypes.includes(props.row.original.template)) {
        return <div />;
      }

      // Hide preview URL buttons for messages where we don't have the JSON
      if (props.row.original.hidePreview) {
        return <div />;
      }

      return <PreviewLinkButton previewLink={props.row.original.previewLink} />;
    },
  },
];

export const experimentColumns: ColumnDef<RecipeOrBranchInfo>[] = [
  {
    accessorKey: "dates",
    header: ({ table }) => (
      <div className="flex flex-row items-center gap-x-2">
        <button
          {...{
            onClick: table.getToggleAllRowsExpandedHandler(),
          }}
          data-testid="toggleAllRowsButton"
          aria-label="Toggle All Branches"
          className="p-1 rounded-full bg-gray-200/70 hover:bg-gray-300/70"
        >
          {table.getIsAllRowsExpanded() ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronsUpDown size={18} />
          )}
        </button>
        Dates
      </div>
    ),
    cell: (props: any) => {
      return (
        <div className="flex flex-row items-center gap-x-2">
          <div>
            {props.row.getCanExpand() ? (
              <button
                {...{
                  onClick: props.row.getToggleExpandedHandler(),
                  style: { cursor: "pointer" },
                }}
                data-testid="toggleBranchRowsButton"
                aria-label="Toggle Branches"
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-200"
              >
                {props.row.getIsExpanded() ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>
            ) : null}
          </div>
          <PrettyDateRange
            startDate={props.row.original.startDate}
            endDate={props.row.original.endDate}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "exp_or_branch",
    header: "",
    cell: (props: any) => {
      if (props.row.original.userFacingName) {
        return (
          <div>
            <div className="flex flex-row gap-x-2 items-center">
              {props.row.original.experimentBriefLink &&
                experimentBriefTooltip(props.row.original.experimentBriefLink)}
              {props.row.original.hasMicrosurvey && <> {microsurveyBadge} </>}
              <a
                href={props.row.original.experimenterLink}
                className="font-semibold text-sm text-primary visited:text-inherit hover:text-blue-800 no-underline"
                target="_blank"
                rel="noreferrer"
              >
                {props.row.original.userFacingName || props.row.original.id}
                <svg
                  fill="currentColor"
                  fillOpacity="0.6"
                  viewBox="0 0 8 8"
                  className="inline h-[1.2rem] w-[1.2rem] px-1"
                  aria-hidden="true"
                  style={{
                    marginInline: "0.1rem 0",
                    paddingBlock: "0 0.1rem",
                    overflow: "visible",
                  }}
                >
                  <path d="m1.71278 0h.57093c.31531 0 .57092.255837.57092.571429 0 .315591-.25561.571431-.57092.571431h-.57093c-.31531 0-.57093.25583-.57093.57143v4.57142c0 .3156.25562.57143.57093.57143h4.56741c.31531 0 .57093-.25583.57093-.57143v-.57142c0-.3156.25561-.57143.57092-.57143.31532 0 .57093.25583.57093.57143v.57142c0 .94678-.76684 1.71429-1.71278 1.71429h-4.56741c-.945943 0-1.71278-.76751-1.71278-1.71429v-4.57142c0-.946778.766837-1.71429 1.71278-1.71429zm5.71629 0c.23083.0002686.43879.13963.52697.353143.02881.069172.04375.143342.04396.218286v2.857141c0 .31559-.25561.57143-.57093.57143-.31531 0-.57092-.25584-.57092-.57143v-1.47771l-1.88006 1.88171c-.14335.14855-.35562.20812-.55523.15583-.19962-.0523-.35551-.20832-.40775-.40811-.05225-.19979.00727-.41225.15569-.55572l1.88006-1.88171h-1.47642c-.31531 0-.57093-.25584-.57093-.571431 0-.315592.25562-.571429.57093-.571429z"></path>
                </svg>
              </a>
            </div>
            <div className="font-mono text-3xs">{props.row.original.id}</div>
          </div>
        );
      }

      const recipe = new NimbusRecipe(props.row.original.nimbusExperiment);

      return (
        <div className="ps-6">
          <a
            href={recipe.getBranchRecipeLink(props.row.original.slug)}
            className="text-xs text-primary visited:text-inherit hover:text-blue-800 no-underline"
            target="_blank"
            rel="noreferrer"
          >
            {props.row.original.description || props.row.original.id}
            <svg
              fill="currentColor"
              fillOpacity="0.6"
              viewBox="0 0 8 8"
              className="inline h-[1.0rem] w-[1.0rem] px-1"
              aria-hidden="true"
              style={{ paddingBlock: "0 0.1rem", overflow: "visible" }}
            >
              <path d="m1.71278 0h.57093c.31531 0 .57092.255837.57092.571429 0 .315591-.25561.571431-.57092.571431h-.57093c-.31531 0-.57093.25583-.57093.57143v4.57142c0 .3156.25562.57143.57093.57143h4.56741c.31531 0 .57093-.25583.57093-.57143v-.57142c0-.3156.25561-.57143.57092-.57143.31532 0 .57093.25583.57093.57143v.57142c0 .94678-.76684 1.71429-1.71278 1.71429h-4.56741c-.945943 0-1.71278-.76751-1.71278-1.71429v-4.57142c0-.946778.766837-1.71429 1.71278-1.71429zm5.71629 0c.23083.0002686.43879.13963.52697.353143.02881.069172.04375.143342.04396.218286v2.857141c0 .31559-.25561.57143-.57093.57143-.31531 0-.57092-.25584-.57092-.57143v-1.47771l-1.88006 1.88171c-.14335.14855-.35562.20812-.55523.15583-.19962-.0523-.35551-.20832-.40775-.40811-.05225-.19979.00727-.41225.15569-.55572l1.88006-1.88171h-1.47642c-.31531 0-.57093-.25584-.57093-.571431 0-.315592.25562-.571429.57093-.571429z"></path>
            </svg>
          </a>
          <p className="font-mono text-3xs">{props.row.original.slug}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "surface",
    header: "Surface",
    cell: (props: any) => {
      return SurfaceTag(
        props.row.original.template,
        props.row.original.surface,
      );
    },
    filterFn: (row, columnId, filterValue) => filterBySurface(row, filterValue),
    meta: {
      filterVariant: "text",
    },
  },
  {
    //   accessorKey: "segment",
    //   header: "Segment",
    // }, {
    accessorKey: "metrics",
    header: () => (
      <div className="flex flex-row items-center">
        Metrics
        <InfoPopover
          content={
            <p>
              The CTR and impressions metrics in this table are the primary
              button clickthrough rates calculated over the{" "}
              <b>time that the experiment is live</b>. Clicking into the CTR
              value will direct you to the Looker dashboard displaying the data.
            </p>
          }
          iconStyle="ml-1 h-6 w-6 p-1 rounded-full cursor-pointer bg-gray-200/70 hover:text-slate-400/70 hover:bg-gray-300/70 border-0"
        />
      </div>
    ),
    cell: (props: any) => {
      if (
        HIDE_DASHBOARD_EXPERIMENTS.includes(
          props.row.original?.nimbusExperiment?.slug,
        )
      ) {
        return <></>;
      }

      const metrics = showCTRMetrics(
        props.row.original.ctrDashboardLink,
        props.row.original.ctrPercent,
        props.row.original.impressions,
      );
      if (metrics) {
        return metrics;
      }
      return <></>;
    },
  },
  {
    accessorKey: "other",
    header: () => (
      <div className="flex flex-row items-center">
        Visuals
        {previewURLInfoButton}
      </div>
    ),
    cell: (props: any) => {
      if (props.row.original.previewLink == undefined) {
        // XXX should figure out how to do this NimbusRecipe instantiation
        // once per row (maybe useState?)
        const recipe = new NimbusRecipe(props.row.original.nimbusExperiment);

        if (
          props.row.original.screenshots &&
          props.row.original.screenshots.length > 0
        ) {
          const branchLink = recipe.getBranchScreenshotsLink(
            props.row.original.slug,
          );
          return OffsiteLink(branchLink, "Screenshots");
        } else {
          return null;
        }
      }

      return <PreviewLinkButton previewLink={props.row.original.previewLink} />;
    },
  },
];

export const completedExperimentColumns: ColumnDef<RecipeOrBranchInfo>[] = [
  {
    accessorKey: "dates",
    header: ({ table }) => (
      <div className="flex flex-row items-center gap-x-2">
        <button
          {...{
            onClick: table.getToggleAllRowsExpandedHandler(),
          }}
          data-testid="toggleAllRowsButton"
          aria-label="Toggle All Branches"
          className="p-1 rounded-full bg-gray-200/70 hover:bg-gray-300/70"
        >
          {table.getIsAllRowsExpanded() ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronsUpDown size={18} />
          )}
        </button>
        Dates
      </div>
    ),
    cell: (props: any) => {
      return (
        <div className="flex flex-row items-center gap-x-2">
          <div>
            {props.row.getCanExpand() ? (
              <button
                {...{
                  onClick: props.row.getToggleExpandedHandler(),
                  style: { cursor: "pointer" },
                }}
                data-testid="toggleBranchRowsButton"
                aria-label="Toggle Branches"
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-200"
              >
                {props.row.getIsExpanded() ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>
            ) : null}
          </div>
          <PrettyDateRange
            startDate={props.row.original.startDate}
            endDate={props.row.original.endDate}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "exp_or_branch",
    header: "",
    cell: (props: any) => {
      if (props.row.original.userFacingName) {
        return (
          <div>
            <div className="flex flex-row gap-x-2 items-center">
              {props.row.original.experimentBriefLink &&
                experimentBriefTooltip(props.row.original.experimentBriefLink)}
              {props.row.original.hasMicrosurvey && <> {microsurveyBadge} </>}
              <a
                href={props.row.original.experimenterLink}
                className="font-semibold text-sm text-primary visited:text-inherit hover:text-blue-800 no-underline"
                target="_blank"
                rel="noreferrer"
              >
                {props.row.original.userFacingName || props.row.original.id}
                <svg
                  fill="currentColor"
                  fillOpacity="0.6"
                  viewBox="0 0 8 8"
                  className="inline h-[1.2rem] w-[1.2rem] px-1"
                  aria-hidden="true"
                  style={{
                    marginInline: "0.1rem 0",
                    paddingBlock: "0 0.1rem",
                    overflow: "visible",
                  }}
                >
                  <path d="m1.71278 0h.57093c.31531 0 .57092.255837.57092.571429 0 .315591-.25561.571431-.57092.571431h-.57093c-.31531 0-.57093.25583-.57093.57143v4.57142c0 .3156.25562.57143.57093.57143h4.56741c.31531 0 .57093-.25583.57093-.57143v-.57142c0-.3156.25561-.57143.57092-.57143.31532 0 .57093.25583.57093.57143v.57142c0 .94678-.76684 1.71429-1.71278 1.71429h-4.56741c-.945943 0-1.71278-.76751-1.71278-1.71429v-4.57142c0-.946778.766837-1.71429 1.71278-1.71429zm5.71629 0c.23083.0002686.43879.13963.52697.353143.02881.069172.04375.143342.04396.218286v2.857141c0 .31559-.25561.57143-.57093.57143-.31531 0-.57092-.25584-.57092-.57143v-1.47771l-1.88006 1.88171c-.14335.14855-.35562.20812-.55523.15583-.19962-.0523-.35551-.20832-.40775-.40811-.05225-.19979.00727-.41225.15569-.55572l1.88006-1.88171h-1.47642c-.31531 0-.57093-.25584-.57093-.571431 0-.315592.25562-.571429.57093-.571429z"></path>
                </svg>
              </a>
            </div>
            <div className="font-mono text-3xs">{props.row.original.id}</div>
          </div>
        );
      }

      const recipe = new NimbusRecipe(props.row.original.nimbusExperiment);

      return (
        <div className="ps-6">
          <a
            href={recipe.getBranchRecipeLink(props.row.original.slug)}
            className="text-xs text-primary visited:text-inherit hover:text-blue-800 no-underline"
            target="_blank"
            rel="noreferrer"
          >
            {props.row.original.description || props.row.original.id}
            <svg
              fill="currentColor"
              fillOpacity="0.6"
              viewBox="0 0 8 8"
              className="inline h-[1.0rem] w-[1.0rem] px-1"
              aria-hidden="true"
              style={{ paddingBlock: "0 0.1rem", overflow: "visible" }}
            >
              <path d="m1.71278 0h.57093c.31531 0 .57092.255837.57092.571429 0 .315591-.25561.571431-.57092.571431h-.57093c-.31531 0-.57093.25583-.57093.57143v4.57142c0 .3156.25562.57143.57093.57143h4.56741c.31531 0 .57093-.25583.57093-.57143v-.57142c0-.3156.25561-.57143.57092-.57143.31532 0 .57093.25583.57093.57143v.57142c0 .94678-.76684 1.71429-1.71278 1.71429h-4.56741c-.945943 0-1.71278-.76751-1.71278-1.71429v-4.57142c0-.946778.766837-1.71429 1.71278-1.71429zm5.71629 0c.23083.0002686.43879.13963.52697.353143.02881.069172.04375.143342.04396.218286v2.857141c0 .31559-.25561.57143-.57093.57143-.31531 0-.57092-.25584-.57092-.57143v-1.47771l-1.88006 1.88171c-.14335.14855-.35562.20812-.55523.15583-.19962-.0523-.35551-.20832-.40775-.40811-.05225-.19979.00727-.41225.15569-.55572l1.88006-1.88171h-1.47642c-.31531 0-.57093-.25584-.57093-.571431 0-.315592.25562-.571429.57093-.571429z"></path>
            </svg>
          </a>
          <p className="font-mono text-3xs">{props.row.original.slug}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "surface",
    header: "Surface",
    cell: (props: any) => {
      return SurfaceTag(
        props.row.original.template,
        props.row.original.surface,
      );
    },
    filterFn: (row, columnId, filterValue) => filterBySurface(row, filterValue),
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "metrics",
    header: () => "Metrics",
    cell: (props: any) => {
      if (
        HIDE_DASHBOARD_EXPERIMENTS.includes(
          props.row.original?.nimbusExperiment?.slug,
        )
      ) {
        return <></>;
      }

      if (props.row.original.ctrDashboardLink) {
        return OffsiteLink(props.row.original.ctrDashboardLink, "Dashboard");
      }
      return <></>;
    },
  },
  {
    accessorKey: "other",
    header: () => (
      <div className="flex flex-row items-center">
        Visuals
        {previewURLInfoButton}
      </div>
    ),
    cell: (props: any) => {
      if (props.row.original.previewLink == undefined) {
        // XXX should figure out how to do this NimbusRecipe instantiation
        // once per row (maybe useState?)
        const recipe = new NimbusRecipe(props.row.original.nimbusExperiment);

        if (
          props.row.original.screenshots &&
          props.row.original.screenshots.length > 0
        ) {
          const branchLink = recipe.getBranchScreenshotsLink(
            props.row.original.slug,
          );
          return OffsiteLink(branchLink, "Screenshots");
        } else {
          return null;
        }
      }

      return <PreviewLinkButton previewLink={props.row.original.previewLink} />;
    },
  },
];
