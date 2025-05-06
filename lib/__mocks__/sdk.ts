declare global {
  var __sdkMockInitialized: boolean;
  var __sdkMockExports: any;
  var __sdkMockState: {
    currentPlatform: string | null;
    currentTemplate: string | null;
  };
}

// XXX This avoids multiple instantiations of the mock using global state,
// which is icky. We should refactor to allow multiple instantiations to work
// correctly
(() => {
  if (global.__sdkMockInitialized) {
    return;
  }

  global.__sdkMockInitialized = true;

  // Initialize the global state object
  global.__sdkMockState = {
    currentPlatform: null,
    currentTemplate: null,
  };
})();

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
        CLICK: 1082,
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

export function setMockPlatform(platform: string | null): void {
  global.__sdkMockState.currentPlatform = platform;
}

export function setMockTemplate(template: string | null): void {
  global.__sdkMockState.currentTemplate = template;
}

export function resetMockState(): void {
  global.__sdkMockState.currentPlatform = null;
  global.__sdkMockState.currentTemplate = null;
}

const getCurrentState = () => ({
  platform: global.__sdkMockState.currentPlatform,
  template: global.__sdkMockState.currentTemplate,
});

export const SDK = {
  dashboard_dashboard_elements: () => fakeDashboardElements,
  search_dashboard_elements: () => fakeDashboardElements,
  create_query: () => fakeQuery,
  run_query: (...args: any[]) => {
    const state = getCurrentState();

    switch (state.platform) {
      case "fenix":
        if (state.template === "survey") {
          return fakeAndroidQueryResult;
        }
        return fakeAndroidQueryResult;
      
      case "firefox-desktop":
        if (state.template === "infobar") {
          return fakeInfobarQueryResult;
        }
        return fakeQueryResult;
      
      default:
        throw new Error(
          "SDK mock usage bug: run_query called without platform set",
        );
    }
  },
  ok: <T>(apiMethod: T): T => apiMethod,
};

export function getLookerSDK(): any {
  return "mocked SDK";
}

// Store exports in global for reuse in subsequent imports
global.__sdkMockExports = module.exports;
