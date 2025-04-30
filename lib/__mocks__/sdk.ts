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
    "event_counts.user_count": {
      action: {
        " Impression": 12899,
        " Primary": 1592,
        Other: 2588,
      },
    },
  },
];
export const fakeInfobarQueryResult = [
  {
    primary_rate: 0.123456789,
    "messaging_system.ping_count": {
      "messaging_system.metrics__string__messaging_system_event": {
        IMPRESSION: 8765,
      },
    },
  },
];
export const fakeAndroidQueryResult = [
  {
    primary_rate: 0.123456789,
    "events.client_count": {
      "events.event_name": {
        message_shown: 1289,
        message_clicked: 159,
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
  run_query: (params: any) => {
    const filters = params.filters || {};

    // Test for Android survey query
    if (
      filters["events.event_category"] === "messaging" ||
      filters["events.sample_id"] === "to 10"
    ) {
      return fakeAndroidQueryResult;
    }

    // Test for infobar template
    if (
      filters[
        "messaging_system.metrics__string__messaging_system_ping_type"
      ] === "infobar"
    ) {
      return fakeInfobarQueryResult;
    }

    // Default desktop query
    return fakeQueryResult;
  },
  ok: (apiMethod: any) => {
    return apiMethod;
  },
};
