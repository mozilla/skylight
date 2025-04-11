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
 * @param startDate The date that the Looker submission timestamp date filter
 *        will start at if it's defined.
 * @param endDate Either the calculated proposed end date or the actual end
 *        date that the Looker submission timestamp date filter will end at
 *        if it's defined. endDate should be one day ahead of the actual date
 *        because Looker date filters don't include the end date.
 * @param isCompleted True if the experiment is completed.
 * @returns The submission timestamp date filter to be used in the Looker dashboard links.
 */
export function getLookerSubmissionTimestampDateFilter(
  startDate?: string | null,
  endDate?: string | null,
  isCompleted?: boolean,
): string {
  if (isCompleted && startDate && endDate) {
    // This case covers completed experiments with defined startDate and
    // endDate from the Experimenter API, with the endDate being today or earlier.
    return `${startDate} to ${endDate}`;
  } else if (startDate) {
    // This case covers experiments that haven't reached their proposed end date.
    // This case also covers experiments that are still ongoing past their proposed
    // to prevent issues with the Looker dashboards showing no data for to dates in
    // the future.
    return `${startDate} to today`;
  } else {
    // This case covers any messages with undefined startDate and endDate.

    // Showing the last 30 complete days to ensure the dashboard isn't
    // including today which has no data yet.
    return "30 day ago for 30 day";
  }
}
