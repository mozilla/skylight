import { getProposedEndDate } from "./experimentUtils";

// XXX getExperimentLookerDashboardDate and getLookerSubmissionTimestampDateFilter
// were moved to this file rather than looker.ts due to "Module not found" errors.
// These errors were likely made because looker.ts has functions that use node
// modules that should only exist in server components. But these functions are
// passed through other functions that eventually go through columns.tsx which has
// "use client". We should look for a better architectural solution regarding
// the situation with these errors for two main reasons: for separation of code
// maintainability and for pre-rendering more markup on the server for performance
// reasons.

/**
 * @returns the proposed end date used for experiment Looker dashboard links.
 *          We are adding 1 to the date because the end date in the Looker
 *          date filters are not inclusive. Returns null if either startDate
 *          is null or proposedDuration is undefined.
 */
export function getExperimentLookerDashboardDate(
  startDate: string | null,
  proposedDuration: number | undefined,
) {
  const duration = proposedDuration ? proposedDuration + 1 : undefined;
  return getProposedEndDate(startDate, duration);
}

/**
 * @returns the submission timestamp date filter to be used in the Looker dashboard links
 */
export function getLookerSubmissionTimestampDateFilter(
  startDate?: string | null,
  endDate?: string | null,
): string {
  // Showing the last 30 complete days to ensure the dashboard isn't including today which has no data yet
  let submission_timestamp_date = "30 day ago for 30 day";

  if (startDate && endDate && new Date() < new Date(endDate)) {
    submission_timestamp_date = `${startDate} to ${endDate}`;
  } else if (startDate) {
    submission_timestamp_date = `${startDate} to today`;
  }

  return submission_timestamp_date;
}
