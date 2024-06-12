import {
  fakeDashboardElements,
  fakeFilters,
  fakeQueryResult,
} from "@/lib/__mocks__/sdk";
import * as looker from "@/lib/looker";

jest.mock("../../lib/sdk");

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

describe("Looker", () => {
  it("should return the first dashboard element", async () => {
    const element = await looker.getAWDashboardElement0();

    expect(element).toEqual(fakeDashboardElements[0]);
  });

  it("should return the query results", async () => {
    const queryResult = await looker.runEventCountQuery(fakeFilters);

    expect(queryResult).toEqual(fakeQueryResult);
  });

  it("should return the CTR percent of the primary rate", async () => {
    const id = "test_query_0";
    const template = "test_template";

    const ctrPercent = await looker.getCTRPercent(id, template);

    expect(ctrPercent).toEqual(12.3);
  });
});
