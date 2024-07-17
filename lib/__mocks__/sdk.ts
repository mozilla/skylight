export const fakeDashboardElements = [
  {
    query: {
      id: "test_query_0",
      model: "test model",
      view: "test view",
      client_id: "test_client_id_0",
    },
  },
  {
    query: {
      id: "test_query_1",
      model: "test model",
      view: "test view",
      client_id: "test_client_id_1",
    },
  },
];
export const fakeFilters = { "event_counts.message_id": "%test_query_0%" };
export const fakeQuery = {
  id: "test_query",
};
export const fakeQueryResult = [
  {
    primary_rate: 0.123456789,
    impressions: 12899,
    "event_counts.user_count": {
      action: {
        " Impression": 12899,
        " Primary": 1592,
        Other: 2588,
      },
    },
  },
];

export function getLookerSDK(): any {
  return "mocked SDK";
}

export const SDK = {
  dashboard_dashboard_elements: () => fakeDashboardElements,
  search_dashboard_elements: () => fakeDashboardElements,
  create_query: () => fakeQuery,
  run_query: () => fakeQueryResult,
  ok: (apiMethod: any) => {
    return apiMethod;
  },
};
