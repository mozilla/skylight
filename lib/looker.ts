import { LookerNodeSDK } from "@looker/sdk-node"
import { IDashboardElement, IWriteQuery } from "@looker/sdk"

/**
 *
 * @type {string} Local configuration file name, one directory above
 */

console.log('LOOKER ENABLED: ', process.env.IS_LOOKER_ENABLED);

export async function getAWDashboardElement0(SDK: any): Promise<IDashboardElement> {
  const dashboardId = "1471";
//  await(getDBFilters())

  const elements: IDashboardElement[] = await SDK.ok(SDK.dashboard_dashboard_elements(dashboardId));
  return elements[0];
}

export async function runEventCountQuery(filters: any): Promise<any>{
  const SDK = LookerNodeSDK.init40()
  const me = await SDK.ok(SDK.me());

  const element0 = await getAWDashboardElement0(SDK)
  const origQuery = element0.query as IWriteQuery

  // take the query from the original dashboard
  const newQueryBody = structuredClone(origQuery)
  delete newQueryBody.client_id // must be unique per-query

  // override the filters
  newQueryBody.filters = Object.assign(
    {
      'event_counts.message_id': '%FAKESPOT_OPTIN_DEFAULT%',
      'event_counts.submission_timestamp_date': '2 days'
    },
    filters
  )

  // console.log("filters: ", filters)
  // console.log("newQueryBody.filters: ", newQueryBody.filters)

  const newQuery = await SDK.ok(SDK.create_query(newQueryBody));
  const result = await SDK.ok(SDK.run_query({
      query_id: newQuery.id!,
      result_format: "json"
    }))

  // console.log("newQueryBody.filters: ", newQueryBody.filters)
  // console.log(" newQuery result: ", result)
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

  // XXX fix issues with the infobar Looker dashboards to remove the 
  // template condition
  if (queryResult.length > 0 && template !== 'infobar') {
    return Number(Number(queryResult[0].primary_rate * 100).toFixed(1))
  }
}
