import { IDashboardElement, IWriteQuery } from "@looker/sdk"
import { SDK } from "./sdk";
import { getDashboardIdForTemplate } from "./messageUtils";

export async function getAWDashboardElement0(template: string): Promise<IDashboardElement> {
  const dashboardId = getDashboardIdForTemplate(template);

  // XXX switch this out for the more performant dashboard_element (see
  // https://mozilla.cloud.looker.com/extensions/marketplace_extension_api_explorer::api-explorer/4.0/methods/Dashboard/dashboard_element
  // for more info).

  let elements: IDashboardElement[];
  if (template == "infobar") {
    // XXX infobar hasn't had its own overview dashboard element created yet
    // so we're still using the old code here
    elements = await SDK.ok(SDK.dashboard_dashboard_elements(dashboardId));
  } else {
    elements = await SDK.ok(
      // XXX whether search_dashboard_elements is a net win here isn't
      // clear, but the code is working, so I'm inclined to leave it alone for now.
      SDK.search_dashboard_elements(
        {
          dashboard_id: dashboardId,
          title: 'CTR and User Profiles Impressed',
          fields: 'query'
        }
      )
    )
  }

  return elements[0];
}

export async function runQueryForTemplate(template: string, filters: any, startDate?: string | null, endDate?: string | null,): Promise<any>{
  const element0 = await getAWDashboardElement0(template)

  const origQuery = element0.query as IWriteQuery

  // take the query from the original dashboard
  const newQueryBody = structuredClone(origQuery)
  delete newQueryBody.client_id // must be unique per-query

  // override the filters
  if (template === "infobar") {
    newQueryBody.filters = Object.assign(
      {
        "messaging_system.submission_date": "1 day ago for 1 day",
      },
      filters
    );
  } else {
    // Showing the last 30 complete days to ensure the dashboard isn't including today which has no data yet
    let submission_timestamp_date = "30 day ago for 30 day";
    if (startDate && endDate && (new Date() < new Date(endDate))) {
      submission_timestamp_date = `${startDate} to ${endDate}`;
    } else if (startDate) {
      submission_timestamp_date = `${startDate} to today`;
    }
    
    newQueryBody.filters = Object.assign(
      {
        "event_counts.submission_timestamp_date": submission_timestamp_date,
      },
      filters
    );
  }

  const newQuery = await SDK.ok(SDK.create_query(newQueryBody));
  const result = await SDK.ok(SDK.run_query({
      query_id: newQuery.id!,
      result_format: "json"
    }))

  return result
}

/**
 * @param id the events_count.message_id required for running the looker
 * query to retrieve CTR metrics
 * @param template the message template
 * @param channel the normalized channel
 * @param experiment the experiment slug
 * @param branch the branch slug
 * @returns a CTR percent value for a message if the Looker query results are
 * defined
 */
export async function getCTRPercent(
  id: string,
  template: string,
  channel?: string,
  experiment?: string,
  branch?: string,
  startDate?: string | null,
  endDate?: string | null
): Promise<number | undefined> {
  // XXX the filters are currently defined to match the filters in getDashboard.
  // It would be more ideal to consider a different approach when definining
  // those filters to sync up the data in both places.
  let queryResult;
  if (template === "infobar") {
    queryResult = await runQueryForTemplate(template, {
      "messaging_system.metrics__text2__messaging_system_message_id": id,
      "messaging_system.normalized_channel": channel,
      "messaging_system.metrics__string__messaging_system_ping_type": template,
      "messaging_system__ping_info__experiments.key": experiment,
      "messaging_system__ping_info__experiments.value__branch": branch,
    }, startDate, endDate);
  } else {

    queryResult = await runQueryForTemplate(template, {
      "event_counts.message_id": "%" + id + "%",
      "event_counts.normalized_channel": channel,
      "onboarding_v1__experiments.experiment": experiment,
      "onboarding_v1__experiments.branch": branch,
    }, startDate, endDate);
    console.log("queryResult: ", queryResult);
  }

  if (queryResult.length > 0) {
    // CTR percents will have 2 decimal places since this is what is expected
    // from Experimenter analyses.
    return Number(Number(queryResult[0].primary_rate * 100).toFixed(2));
  }
}
