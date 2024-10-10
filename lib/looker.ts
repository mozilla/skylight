import { IDashboardElement, IWriteQuery } from "@looker/sdk";
import { SDK } from "./sdk";
import { getDashboardIdForTemplate } from "./messageUtils";
import { getLookerSubmissionTimestampDateFilter } from "./lookerUtils";

export type CTRData = {
  ctrPercent: number;
  impressions: number;
};

export async function getAWDashboardElement0(
  template: string,
): Promise<IDashboardElement> {
  const dashboardId = getDashboardIdForTemplate(template);

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

export async function runQueryForTemplate(
  template: string,
  filters: any,
  startDate?: string | null,
  endDate?: string | null,
): Promise<any> {
  const element0 = await getAWDashboardElement0(template);

  const origQuery = element0.query as IWriteQuery;

  // take the query from the original dashboard
  const newQueryBody = structuredClone(origQuery);
  delete newQueryBody.client_id; // must be unique per-query

  const submission_timestamp_date = getLookerSubmissionTimestampDateFilter(
    startDate,
    endDate,
  );

  // override the filters
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
  template: string,
  channel?: string,
  experiment?: string,
  branch?: string,
  startDate?: string | null,
  endDate?: string | null,
): Promise<CTRData | undefined> {
  // XXX the filters are currently defined to match the filters in getDashboard.
  // It would be more ideal to consider a different approach when definining
  // those filters to sync up the data in both places.
  let queryResult;
  if (template === "infobar") {
    queryResult = await runQueryForTemplate(
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
 * array and for ids with substring "test".
 */
export function cleanLookerData(data: any) {
  let cleanData = JSON.parse(JSON.stringify(data)).filter((messageDef: any) => {
    const removeMessages = ["undefined", "", "n/a", null, "DEFAULT_ID"];
    return (
      !removeMessages.includes(
        messageDef[
          "messaging_system.metrics__text2__messaging_system_message_id"
        ],
      ) &&
      !messageDef[
        "messaging_system.metrics__text2__messaging_system_message_id"
      ]
        .toLowerCase()
        .includes("test")
    );
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
export function mergeLookerData(originalData: any, newLookerData: any) {
  for (let i = 0; i < newLookerData.length; i++) {
    if (
      !originalData.find(
        (x: any) =>
          x.id ===
          newLookerData[i][
            "messaging_system.metrics__text2__messaging_system_message_id"
          ],
      )
    ) {
      // `hidePreview` is added because the message data from Looker does not
      // have enough information to enable message previews correctly and we
      // must manually hide the previews for now.
      let clean_looker_object = {
        id: newLookerData[i][
          "messaging_system.metrics__text2__messaging_system_message_id"
        ],
        template:
          newLookerData[i][
            "messaging_system.metrics__string__messaging_system_ping_type"
          ],
        hidePreview: true,
      };

      // Update templates for RTAMO messages
      if (clean_looker_object.id.includes("RTAMO")) {
        clean_looker_object.template = "rtamo";
      }

      // Update template for FOCUS_PROMO message
      if (clean_looker_object.id === "FOCUS_PROMO") {
        clean_looker_object.template = "pb_newtab";
      }

      // Update template for MILESTONE_MESSAGE message
      if (clean_looker_object.id === "MILESTONE_MESSAGE") {
        clean_looker_object.template = "milestone_message";
      }

      // Update templates for feature callout messages
      if (clean_looker_object.template === null) {
        clean_looker_object.template = "feature_callout";
      }

      originalData.push(clean_looker_object);
    }
  }
  return originalData;
}
