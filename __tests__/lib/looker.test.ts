jest.mock("../../lib/sdk");

// These are part of the mock control API, so this rule doesn't make sense
// here.
// eslint-disable-next-line jest/no-mocks-import
import {
  fakeDashboardElements,
  fakeFilters,
  fakeQueryResult,
  setMockPlatform,
  setMockTemplate,
  resetMockState,
} from "@/lib/__mocks__/sdk";
import * as looker from "@/lib/looker";
import { ExperimentFakes } from "../ExperimentFakes.mjs";

describe("Looker", () => {
  // Reset mock state after each test
  afterEach(() => {
    resetMockState();
  });

  it("should return the first dashboard element", async () => {
    setMockPlatform("firefox-desktop");
    const template = "test_template";

    const element = await looker.getDashboardElement0(template);

    expect(element).toEqual(fakeDashboardElements[0]);
  });

  it("should return the query results", async () => {
    setMockPlatform("firefox-desktop");
    const template = "test_template";

    const queryResult = await looker.runQueryForSurface(template, fakeFilters);

    expect(queryResult).toEqual(fakeQueryResult);
  });

  describe("getSafeUctrPercent", () => {
    it("should correctly format a UCTR percentage to 2 decimal places", () => {
      expect(looker.getSafeUctrPercent(0.123456789)).toEqual(12.35);
      expect(looker.getSafeUctrPercent(0.1)).toEqual(10);
      expect(looker.getSafeUctrPercent(0.123)).toEqual(12.3);
      expect(looker.getSafeUctrPercent(0.1235)).toEqual(12.35);
    });

    it("should handle zero value", () => {
      expect(looker.getSafeUctrPercent(0)).toEqual(0);
    });
  });

  describe("getUCTRPercentData", () => {
    it("should return the UCTR percent for a desktop message with standard template", async () => {
      const template = "test_template";
      const platform = "firefox-desktop";
      const id = "test_query_0";
      setMockPlatform(platform);
      setMockTemplate(template);

      const uctrPercentData = await looker.getUCTRPercentData(
        id,
        platform,
        template,
      );

      expect(uctrPercentData?.uctrPercent).toEqual(12.35);
      expect(uctrPercentData?.impressions).toEqual(12899);
    });

    it("should return the UCTR percent for a desktop message with infobar template", async () => {
      const id = "test_query_0";
      const platform = "firefox-desktop";
      const template = "infobar";
      setMockPlatform(platform);
      setMockTemplate(template);

      const uctrPercentData = await looker.getUCTRPercentData(
        id,
        platform,
        template,
      );

      expect(uctrPercentData?.uctrPercent).toEqual(12.35);
      expect(uctrPercentData?.impressions).toEqual(8765);
    });

    it("should return the UCTR percent for an android message with survey template and extrapolate impressions", async () => {
      const id = "test_query_0";
      const platform = "fenix";
      const template = "survey";
      setMockPlatform(platform);
      setMockTemplate(template);

      const uctrPercentData = await looker.getUCTRPercentData(
        id,
        platform,
        template,
      );

      expect(uctrPercentData?.uctrPercent).toEqual(12.35);
      expect(uctrPercentData?.impressions).toEqual(12890); // 1289 * 10 (extrapolated)
    });

    it("should return undefined for a standard android message (non-survey template)", async () => {
      const id = "test_query_0";
      const platform = "fenix";
      const template = "test_template"; // non-survey template
      setMockPlatform(platform);
      setMockTemplate(template);

      const uctrPercentData = await looker.getUCTRPercentData(
        id,
        platform,
        template,
      );

      // For non-survey Android templates, we expect undefined
      expect(uctrPercentData).toBeUndefined();
    });
  });

  it("should clean up the Look query data to remove any invalid message ids or test ids", () => {
    setMockPlatform("firefox-desktop");
    const data = [
      {
        "messaging_system.metrics__text2__messaging_system_message_id":
          "undefined",
        "messaging_system.metrics__string__messaging_system_ping_type": "cfr",
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": "CFR",
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id":
          "REAL-MESSAGE-ID",
        "messaging_system.metrics__string__messaging_system_ping_type": "cfr",
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": "CFR",
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id": "",
        "messaging_system.metrics__string__messaging_system_ping_type": "cfr",
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": "CFR",
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id": "n/a",
        "messaging_system.metrics__string__messaging_system_ping_type": "cfr",
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": "CFR",
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id":
          "DEFAULT_ID",
        "messaging_system.metrics__string__messaging_system_ping_type": "cfr",
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": "CFR",
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id": null,
        "messaging_system.metrics__string__messaging_system_ping_type": "cfr",
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": "CFR",
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id":
          "TEST-MESSAGE-ID",
        "messaging_system.metrics__string__messaging_system_ping_type": "cfr",
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": "CFR",
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id": "test",
        "messaging_system.metrics__string__messaging_system_ping_type": "cfr",
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": "CFR",
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id":
          "CFR-MESSAGE",
        "messaging_system.metrics__string__messaging_system_ping_type": "cfr",
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": "CFR",
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id": "a",
        "messaging_system.metrics__string__messaging_system_ping_type": "cfr",
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": "CFR",
        count_of_messaging_system_client_id: 1,
      },
    ];

    const cleanData = looker.cleanLookerData(data);

    expect(cleanData.length).toEqual(2);
    expect(
      cleanData[0][
        "messaging_system.metrics__text2__messaging_system_message_id"
      ],
    ).toEqual("REAL-MESSAGE-ID");
    expect(
      cleanData[1][
        "messaging_system.metrics__text2__messaging_system_message_id"
      ],
    ).toEqual("CFR-MESSAGE");
  });

  it("should merge the Looker data correctly by only appending non-duplicate ids and updating the correct templates", () => {
    setMockPlatform("firefox-desktop");
    const rawRecipe1 = ExperimentFakes.recipe("MSG_1");
    const rawRecipe2 = ExperimentFakes.recipe("MSG_2");
    const rawRecipe3 = ExperimentFakes.recipe("MSG_3");
    const lookerData = [
      {
        "messaging_system.metrics__text2__messaging_system_message_id": "MSG_1",
        "messaging_system.metrics__string__messaging_system_ping_type": "cfr",
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": "CFR",
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id":
          "NEW_MSG_1",
        "messaging_system.metrics__string__messaging_system_ping_type": "cfr",
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": "CFR",
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id":
          "RTAMO_MSG",
        "messaging_system.metrics__string__messaging_system_ping_type": null,
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": null,
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id":
          "FOCUS_PROMO",
        "messaging_system.metrics__string__messaging_system_ping_type": null,
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": null,
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id":
          "MILESTONE_MESSAGE",
        "messaging_system.metrics__string__messaging_system_ping_type": null,
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": null,
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id": "MSG_2",
        "messaging_system.metrics__string__messaging_system_ping_type": null,
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": null,
        count_of_messaging_system_client_id: 1,
      },
      {
        "messaging_system.metrics__text2__messaging_system_message_id":
          "FEATURE_CALLOUT_MSG",
        "messaging_system.metrics__string__messaging_system_ping_type": null,
        "messaging_system.metrics__string__messaging_system_event_source": null,
        "messaging_system.metrics__string__messaging_system_source": null,
        count_of_messaging_system_client_id: 1,
      },
    ];
    const originalData = [rawRecipe1, rawRecipe2, rawRecipe3];

    looker.mergeLookerData(originalData, lookerData);

    expect(originalData.length).toEqual(8);
    expect(originalData[4].id).toEqual("RTAMO_MSG");
    expect(originalData[4].template).toEqual("rtamo");
    expect(originalData[5].id).toEqual("FOCUS_PROMO");
    expect(originalData[5].template).toEqual("pb_newtab");
    expect(originalData[6].id).toEqual("MILESTONE_MESSAGE");
    expect(originalData[6].template).toEqual("milestone_message");
    expect(originalData[7].id).toEqual("FEATURE_CALLOUT_MSG");
    expect(originalData[7].template).toEqual("feature_callout");
  });
});
