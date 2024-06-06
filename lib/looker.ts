import { LookerNodeSDK } from "@looker/sdk-node"
import { IDashboardElement, IWriteQuery } from "@looker/sdk"

/**
 *
 * @type {string} Local configuration file name, one directory above
 */
const SDK = LookerNodeSDK.init40()
const me = await SDK.ok(SDK.me());

console.log('LOOKER ENABLED: ', process.env.IS_LOOKER_ENABLED);

export async function getAWDashboardElement0(): Promise<IDashboardElement> {
  const dashboardId = "1471";
//  await(getDBFilters())

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

export async function setCTRPercent(id: string, template?: string): Promise<number|undefined> {
  const queryResult = await runEventCountQuery(
    { 'event_counts.message_id':  '%' + id + '%' }
  )
  if (queryResult.length > 0 && template !== 'infobar') {
    return Number(Number(queryResult[0].primary_rate * 100).toFixed(1))
  }
}