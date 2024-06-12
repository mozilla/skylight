import { IDashboardElement, IWriteQuery } from "@looker/sdk"
import { SDK } from "./sdk";

export async function getAWDashboardElement0(): Promise<IDashboardElement> {
  const dashboardId = "1471";

  const elements: IDashboardElement[] = await SDK.ok(SDK.dashboard_dashboard_elements(dashboardId));
  return elements[0];
}

export async function runEventCountQuery(filters: any): Promise<any>{
  const element0 = await getAWDashboardElement0()
  const origQuery = element0.query as IWriteQuery

  // take the query from the original dashboard
  const newQueryBody = structuredClone(origQuery)
  delete newQueryBody.client_id // must be unique per-query

  // override the filters
  newQueryBody.filters = Object.assign(
    {
      'event_counts.submission_timestamp_date': '2 days'
    },
    filters
  )

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
 * @returns a CTR percent value for a message if the Looker query results are
 * defined
 */
export async function getCTRPercent(id: string, template?: string): Promise<number|undefined> {
  const queryResult = await runEventCountQuery(
    { 'event_counts.message_id':  '%' + id + '%' }
  )

  // XXX fix https://bugzilla.mozilla.org/show_bug.cgi?id=1901036 to remove the 
  // infobar template condition
  if (queryResult.length > 0 && template !== 'infobar') {
    return Number(Number(queryResult[0].primary_rate * 100).toFixed(1))
  }
}
