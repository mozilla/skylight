import { IDashboardElement, IWriteQuery } from "@looker/sdk";
import { SDK } from "./sdk";
import { getDashboardIdForTemplate } from "./messageUtils";
import { getLookerSubmissionTimestampDateFilter } from "./lookerUtils";
import { Platform } from "./types";

export type CTRData = {
  ctrPercent: number;
  impressions: number;
};

export async function getDashboardElement0(
  platform: Platform,
  template: string,
): Promise<IDashboardElement> {
  let dashboardId;
  switch (platform) {
    case "fenix":
      dashboardId = "2303";
      break;
    default:
      dashboardId = getDashboardIdForTemplate(template);
  }

  // XXX maybe switch this out for the more performant dashboard_element (see
  // https://mozilla.cloud.looker.com/extensions/marketplace_extension_api_explorer::api-explorer/4.0/methods/Dashboard/dashboard_element
  // for more info).

  const elements: IDashboardElement[] = await SDK.ok(
    // XXX whether search_dashboard_elements is a net win here isn't
    // clear, but the code is working, so I'm inclined to leave it alone for now.
    SDK.search_dashboard_elements({
      dashboard_id: dashboardId,
      title: "CTR and User Profiles Impressed",
      fields: "query",
    }),
  );

  return elements[0];
}

/**
 * @returns the query results in JSON format for the Look query with lookId
 */
export async function runLookQuery(lookId: string): Promise<string> {
  const results = await SDK.ok(
    SDK.run_look({
      look_id: lookId,
      result_format: "json",
    }),
  );

  return results;
}

/**
 * @param platform the message platform
 * @param template the message template
 * @param filters an object containing any filters used in the Looker query (eg. channel, templates, experiment, branch)
 * @param startDate the experiment start date
 * @param endDate the experiment proposed end date
 * @returns the result of the query that is created by the given filters and filter_expression, and the appropriate template and submission timestamp
 */
export async function runQueryForTemplate(
  platform: Platform,
  template: string,
  filters: any,
  startDate?: string | null,
  endDate?: string | null,
): Promise<any> {
  const element0 = await getDashboardElement0(platform, template);

  const origQuery = element0.query as IWriteQuery;

  // take the query from the original dashboard
  const newQueryBody = structuredClone(origQuery);
  delete newQueryBody.client_id; // must be unique per-query

  const submission_timestamp_date = getLookerSubmissionTimestampDateFilter(
    startDate,
    endDate,
  );

  // override the filters
  switch (platform) {
    case "fenix":
      newQueryBody.filters = Object.assign(
        {
          "events.submission_date": submission_timestamp_date,
        },
        filters,
      );
      break;
    default:
      if (template === "infobar") {
        newQueryBody.filters = Object.assign(
          {
            "messaging_system.submission_date": submission_timestamp_date,
          },
          filters,
        );
      } else {
        newQueryBody.filters = Object.assign(
          {
            "event_counts.submission_timestamp_date": submission_timestamp_date,
          },
          filters,
        );
      }
  }

  const newQuery = await SDK.ok(SDK.create_query(newQueryBody));
  const result = await SDK.ok(
    SDK.run_query({
      query_id: newQuery.id!,
      result_format: "json",
    }),
  );

  return result;
}

/**
 * @param id the events_count.message_id required for running the looker
 * query to retrieve CTR metrics
 * @param platform the message platform
 * @param template the message template
 * @param channel the normalized channel
 * @param experiment the experiment slug
 * @param branch the branch slug
 * @param startDate the experiment start date
 * @param endDate the experiment proposed end date
 * @returns a CTR percent value for a message if the Looker query results are
 * defined
 */
export async function getCTRPercentData(
  id: string,
  platform: Platform,
  template: string,
  channel?: string,
  experiment?: string,
  branch?: string,
  startDate?: string | null,
  endDate?: string | null,
): Promise<CTRData | undefined> {
  switch (platform) {
    case "fenix":
      return getAndroidCTRPercentData(
        id,
        platform,
        template,
        channel,
        experiment,
        branch,
        startDate,
        endDate,
      );
    default:
      return getDesktopCTRPercentData(
        id,
        platform,
        template,
        channel,
        experiment,
        branch,
        startDate,
        endDate,
      );
  }
}

export async function getAndroidCTRPercentData(
  id: string,
  platform: Platform,
  template: string,
  channel?: string,
  experiment?: string,
  branch?: string,
  startDate?: string | null,
  endDate?: string | null,
): Promise<CTRData | undefined> {
  // XXX the filters are currently defined to match the filters in getDashboard.
  // It would be more ideal to consider a different approach when definining
  // those filters to sync up the data in both places. Non-trivial changes to
  // this code are worth applying some manual performance checking.
  let queryResult;
  if (template === "survey") {
    queryResult = await runQueryForTemplate(
      platform,
      template,
      {
        "events.normalized_channel": channel,
        "events_unnested_table__ping_info__experiments.key": experiment,
        "events_unnested_table__ping_info__experiments.value__branch": branch,
        "events.sample_id": "to 10", // Sample ID <= 10
        "events.event_category": "messaging", // XXX
        "events_unnested_table__event_extra.value": id.slice(0, -5) + "%",
      },
      startDate,
      endDate,
    );
    if (queryResult.length > 0) {
      // CTR percents will have 2 decimal places since this is what is expected
      // from Experimenter analyses.
      let impressions;
      if (template === "survey") {
        impressions =
          queryResult[0]["events.client_count"]["events.event_name"][
            "message_shown"
          ];
      }

      return {
        ctrPercent: Number(
          Number(queryResult[0].primary_rate * 100).toFixed(2),
        ),
        impressions: impressions * 10, // We need to extrapolate real numbers for the 10% sample
      };
    }
  }
}

export async function getDesktopCTRPercentData(
  id: string,
  platform: Platform,
  template: string,
  channel?: string,
  experiment?: string,
  branch?: string,
  startDate?: string | null,
  endDate?: string | null,
): Promise<CTRData | undefined> {
  // XXX the filters are currently defined to match the filters in getDashboard.
  // It would be more ideal to consider a different approach when definining
  // those filters to sync up the data in both places. Non-trivial changes to
  // this code are worth applying some manual performance checking.
  let queryResult;
  if (template === "infobar") {
    queryResult = await runQueryForTemplate(
      platform,
      template,
      {
        "messaging_system.metrics__text2__messaging_system_message_id": id,
        "messaging_system.normalized_channel": channel,
        "messaging_system.metrics__string__messaging_system_ping_type":
          template,
        "messaging_system__ping_info__experiments.key": experiment,
        "messaging_system__ping_info__experiments.value__branch": branch,
      },
      startDate,
      endDate,
    );
  } else {
    queryResult = await runQueryForTemplate(
      platform,
      template,
      {
        "event_counts.message_id": "%" + id + "%",
        "event_counts.normalized_channel": channel,
        "onboarding_v1__experiments.experiment": experiment,
        "onboarding_v1__experiments.branch": branch,
      },
      startDate,
      endDate,
    );
  }

  if (queryResult.length > 0) {
    // CTR percents will have 2 decimal places since this is what is expected
    // from Experimenter analyses.
    let impressions;
    if (template === "infobar") {
      impressions =
        queryResult[0]["messaging_system.ping_count"][
          "messaging_system.metrics__string__messaging_system_event"
        ]["IMPRESSION"];
    } else {
      impressions =
        queryResult[0]["event_counts.user_count"]["action"][" Impression"];
    }

    return {
      ctrPercent: Number(Number(queryResult[0].primary_rate * 100).toFixed(2)),
      impressions: impressions,
    };
  }
}

/**
 * Removes any messages inside `data` for ids specified in the removeMessages
 * array, ids with substring "test", and ids that are single characters.
 */
export function cleanLookerData(data: any): any {
  let cleanData = data.filter((messageDef: any) => {
    const removeMessages = ["undefined", "", "n/a", null, "DEFAULT_ID"];
    const messageId =
      messageDef[
        "messaging_system.metrics__text2__messaging_system_message_id"
      ];

    if (removeMessages.includes(messageId)) {
      return false;
    } else if (messageId.toLowerCase().includes("test")) {
      return false;
    } else if (messageId.length === 1) {
      return false;
    } else {
      return true;
    }
  });
  return cleanData;
}

/**
 * Appends any messages from `newLookerData` into `originalData` with an id
 * that does not already exist in `originalData`. Updates the templates for
 * any message that need some clean up.
 *
 * The message data in `newLookerData` has properties
 * "messaging_system.metrics__text2__messaging_system_message_id" and
 * "messaging_system.metrics__string__messaging_system_ping_type" to represent
 * the message id and template. Before appending these messages into
 * `originalData`, we must clean up the objects to have properties "id" and
 * "template" instead, and exclude any other properties that do not currently
 * provide any value.
 */
export function mergeLookerData(originalData: any, newLookerData: any): any {
  for (let i = 0; i < newLookerData.length; i++) {
    const lookerDataMessageId =
      newLookerData[i][
        "messaging_system.metrics__text2__messaging_system_message_id"
      ];
    const lookerDataMessageTemplate =
      newLookerData[i][
        "messaging_system.metrics__string__messaging_system_ping_type"
      ];

    // Check if the id for newLookerData[i] already exists in originalData
    if (originalData.find((x: any) => x.id === lookerDataMessageId)) {
      continue;
    }

    // `hidePreview` is added because the message data from Looker does not
    // have enough information to enable message previews correctly and we
    // must manually hide the previews for now.
    let clean_looker_object = {
      id: lookerDataMessageId,
      template: lookerDataMessageTemplate,
      hidePreview: true,
    };

    // This is a heuristic for updating templates for RTAMO messages. This can
    // fail if an RTAMO message does not happen to include this substring.
    if (clean_looker_object.id.includes("RTAMO")) {
      clean_looker_object.template = "rtamo";
    }

    // This is a specific check for updating the template for the FOCUS_PROMO
    // message.
    if (clean_looker_object.id === "FOCUS_PROMO") {
      clean_looker_object.template = "pb_newtab";
    }

    // This is a specific check for updating the template for the
    // MILESTONE_MESSAGE message.
    if (clean_looker_object.id === "MILESTONE_MESSAGE") {
      clean_looker_object.template = "milestone_message";
    }

    // This is a heuristic for updating templates for feature callouts. Most
    // messages with a null template after the other heuristics should be
    // feature callouts, but the check can still fail if we missed an edge case.
    if (clean_looker_object.template === null) {
      clean_looker_object.template = "feature_callout";
    }

    originalData.push(clean_looker_object);
  }
  return originalData;
}
