import {
  getExperimentLookerDashboardDate,
  getLookerSubmissionTimestampDateFilter,
} from "@/lib/lookerUtils";

describe("getExperimentLookerDashboardDate", () => {
  it("returns the correct end date when startDate and proposedDuration are defined", () => {
    const startDate = "2024-06-28";
    const proposedDuration = 10;

    const result = getExperimentLookerDashboardDate(
      startDate,
      proposedDuration,
    );

    expect(result).toEqual("2024-07-09");
  });

  it("returns null when startDate is null", () => {
    const proposedDuration = 10;

    const result = getExperimentLookerDashboardDate(null, proposedDuration);

    expect(result).toBeNull();
  });

  it("returns null when proposedDuration is undefined", () => {
    const startDate = "2024-06-28";

    const result = getExperimentLookerDashboardDate(startDate, undefined);

    expect(result).toBeNull();
  });
});

describe("getLookerSubmissionTimestampDateFilter", () => {
  it("returns the default date filter when startDate and endDate are null", () => {
    const result = getLookerSubmissionTimestampDateFilter(null, null);

    expect(result).toEqual("30 day ago for 30 day");
  });

  it("returns a date filter from the startDate to today when endDate is null", () => {
    const startDate = "2024-06-20";

    const result = getLookerSubmissionTimestampDateFilter(startDate, null);

    expect(result).toEqual("2024-06-20 to today");
  });

  it("returns a date filter from the startDate to today when startDate and endDate are defined and endDate is in the past", () => {
    const startDate = "2024-05-08";
    const endDate = "2024-06-10";

    const result = getLookerSubmissionTimestampDateFilter(startDate, endDate);

    expect(result).toEqual("2024-05-08 to today");
  });

  it("returns a date filter from the startDate to endDate when startDate and endDate are defined and endDate is in the future", () => {
    const startDate = "2024-05-08";
    const endDate = "3024-06-10";

    const result = getLookerSubmissionTimestampDateFilter(startDate, endDate);

    expect(result).toEqual("2024-05-08 to 3024-06-10");
  });

  it("returns a date filter from the startDate to endDate when startDate and endDate are defined and the message is completed", () => {
    const startDate = "2024-05-08";
    const endDate = "2024-06-10";
    const isCompleted = true;

    const result = getLookerSubmissionTimestampDateFilter(
      startDate,
      endDate,
      isCompleted,
    );

    expect(result).toEqual("2024-05-08 to 2024-06-10");
  });
});
