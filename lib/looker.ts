import { NodeSettingsIniFile, NodeSession } from "@looker/sdk-node"
import { Looker40SDK as LookerSDK, IDashboardElement, IWriteQuery } from "@looker/sdk"

/**
 *
 * @type {string} Local configuration file name, one directory above
 */
const localConfig = "/Users/dmosedale/s/skylight/"

const SDK = getAuthenticatedLookerSDK();

export async function getAWDashboardElement0(): Promise<IDashboardElement> {
  const dashboardId = "1471";
//  await(getDBFilters())

  const elements: IDashboardElement[] = await SDK.ok(SDK.dashboard_dashboard_elements(dashboardId));
  return elements[0];
}

export async function runEventCountQuery(filters): Promise<any>{

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

  console.log("filters: ", filters)
  console.log("newQueryBody.filters: ", newQueryBody.filters)


  const newQuery = await SDK.ok(SDK.create_query(newQueryBody));
  const result = await SDK.ok(SDK.run_query({
      query_id: newQuery.id,
      result_format: "json"
    }))

  console.log("newQueryBody.filters: ", newQueryBody.filters)
  console.log(" newQuery result: ", result)
  return result
}

function getAuthenticatedLookerSDK(): LookerSDK {

  // taken from MIT-licensed: https://github.com/looker-open-source/sdk-examples/blob/master/typescript/downloadTile.ts

  /**
   *
   * @type {NodeSettingsIniFile} Settings retrieved from the configuration file
   */
  const settings = new NodeSettingsIniFile(localConfig);

  /**
   * Automatic authentication support for the Node SDK
   * @type {NodeSession} Initialized node-based session manager
   */
  const session = new NodeSession(settings);

  /**
   * Initialized SDK object
   * @type {LookerSDK} SDK object configured for use with Node
   */
  const sdk = new LookerSDK(session);

  return sdk;
}
