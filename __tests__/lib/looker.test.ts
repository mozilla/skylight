import {
  fakeDashboardElements,
  fakeFilters,
  fakeQueryResult,
} from "@/lib/__mocks__/sdk";
import * as looker from "@/lib/looker";

jest.mock("../../lib/sdk");

describe("Looker", () => {
  it("should return the first dashboard element", async () => {
    const template = "test_template";
    const element = await looker.getAWDashboardElement0(template);

    expect(element).toEqual(fakeDashboardElements[0]);
  });

  it("should return the query results", async () => {
    const template = "test_template";
    const queryResult = await looker.runQueryForTemplate(template, fakeFilters);

    expect(queryResult).toEqual(fakeQueryResult);
  });

  it("should return the CTR percent of the primary rate", async () => {
    const id = "test_query_0";
    const template = "test_template";

    const ctrPercentData = await looker.getCTRPercentData(id, template);

    expect(ctrPercentData?.ctrPercent).toEqual(12.35);
    expect(ctrPercentData?.impressions).toEqual(12899);
  });
});
