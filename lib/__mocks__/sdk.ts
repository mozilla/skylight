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

// Mock state that tests can set
let currentPlatform: string | null = null;
let currentTemplate: string | null = null;

// Helper functions to set the mock state
export function setMockPlatform(platform: string | null) {
  currentPlatform = platform;
}

export function setMockTemplate(template: string | null) {
  currentTemplate = template;
}

export function resetMockState() {
  currentPlatform = null;
  currentTemplate = null;
}

export function getLookerSDK(): any {
  return "mocked SDK";
}

export const SDK = {
  dashboard_dashboard_elements: () => fakeDashboardElements,
  search_dashboard_elements: () => fakeDashboardElements,
  create_query: () => fakeQuery,
  run_query: () => {
    // Choose the result based on the current mock state
    if (currentPlatform === "fenix" && currentTemplate === "survey") {
      return fakeAndroidQueryResult;
    }

    if (currentTemplate === "infobar") {
      return fakeInfobarQueryResult;
    }

    // Default response
    return fakeQueryResult;
  },
  ok: (apiMethod: any) => {
    return apiMethod;
  },
};
