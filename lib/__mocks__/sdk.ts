// Add TypeScript declarations for global state variables
declare global {
  var __sdkMockInitialized: boolean;
  var __sdkMockExports: any;
}

// Prevents multiple instantiations of the mock, which causes
// confusing issues using a guarded IIFE.
//
// XXX We'd do better to refactor things to avoid the multiple instantiations
// entirely. One option would be to pull the state out into a separate module
// imported into the SDK mock file.

(() => {
  if (global.__sdkMockInitialized) {
    return;
  }

  global.__sdkMockInitialized = true;

  const t = Date.now();
  console.log("sdk.ts mock instantiated");
  console.log("t = " + t);
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

// Module level state variables
let currentPlatform: string | null = null;
let currentTemplate: string | null = null;

export function setMockPlatform(platform: string | null): void {
  currentPlatform = platform;
}

export function setMockTemplate(template: string | null): void {
  currentTemplate = template;
}

export function resetMockState(): void {
  currentPlatform = null;
  currentTemplate = null;
}

export const SDK = {
  dashboard_dashboard_elements: () => fakeDashboardElements,
  search_dashboard_elements: () => fakeDashboardElements,
  create_query: () => fakeQuery,
  run_query: () => {
    if (currentPlatform === "fenix") {
      return fakeAndroidQueryResult;
    }

    if (currentTemplate === "infobar") {
      return fakeInfobarQueryResult;
    }

    return fakeQueryResult;
  },
  ok: <T>(apiMethod: T): T => apiMethod,
};

export function getLookerSDK(): any {
  return "mocked SDK";
}

// Store exports in global for reuse in subsequent imports
global.__sdkMockExports = module.exports;
