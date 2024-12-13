import { types } from "@mozilla/nimbus-shared";
type NimbusExperiment = types.experiments.NimbusExperiment;

/**
 * These are the Nimbus feature IDs that correspond to messaging experiments.
 * Other Nimbus features contain specific variables whose keys are enumerated in
 * FeatureManifest.yaml. Conversely, messaging experiment features contain
 * actual messages, with the usual message keys like `template` and `targeting`.
 * @see FeatureManifest.yaml
 *
 * Copied from @see https://searchfox.org/mozilla-central/source/browser/components/newtab/lib/MessagingExperimentConstants.sys.mjs
 *
 * Should be manually update when that file changes.
 */
export const MESSAGING_EXPERIMENTS_DEFAULT_FEATURES: string[] = [
  "aboutwelcome",
  "backgroundTaskMessage", // XXX need to backport this to tree
  "cfr",
  "featureCallout",
  "fxms-message-1",
  "fxms-message-2",
  "fxms-message-3",
  "fxms-message-4",
  "fxms-message-5",
  "fxms-message-6",
  "fxms-message-7",
  "fxms-message-8",
  "fxms-message-9",
  "fxms-message-10",
  "fxms-message-11",
  "infobar",
  "moments-page",
  "pbNewtab",
  "spotlight",
  "testFeature",
  "whatsNewPage",
];

/**
 * If we have experiment dashboards with serious problems, we can hide those
 * dashboards by adding the experiment slugs to this array.
 */
export const HIDE_DASHBOARD_EXPERIMENTS: string[] = [];

/**
 *
 * @param startDate - may be null, as NimbusExperiment types allow this.
 *                    returns null in this case.
 * @param proposedDuration - may be undefined as NimbusExperiment types
 *                    allow this.  returns null in this case.
 */
export function getProposedEndDate(
  startDate: string | null,
  proposedDuration: number | undefined,
): string | null {
  if (startDate === null || proposedDuration === undefined) {
    return null;
  }

  // XXX need to verify that experimenter actually uses UTC here
  const jsDate = new Date(startDate);

  jsDate.setUTCDate(jsDate.getUTCDate() + proposedDuration);
  const formattedDate = jsDate.toISOString().slice(0, 10);

  return formattedDate;
}

/**
 *
 * @param dateString The date to format in a string.
 * @param daysToAdd Optional number of days to add from dateString. A
 *        negative value will result in days subtracted from dateString.
 * @returns The dateString + daysToAdd as a string value in ISO format.
 */
export function formatDate(dateString: string, daysToAdd: number = 0) {
  const date = new Date(dateString);
  date.setUTCDate(date.getUTCDate() + daysToAdd);
  return date.toISOString().slice(0, 10);
}

// XXX this should really be a method on NimbusRecipe, though it'll need some
// refactoring to get there.
/**
 * Do recursive locale substitution on the values, if applicable.
 *
 * If there are no localizations provided, the value will be returned as-is.
 *
 * If the value is an object containing an $l10n key, its substitution will be
 * returned.
 *
 * Otherwise, the value will be recursively substituted.
 *
 * Right now, we are manually passing the first locale out of the localization object.
 * Eventually we'll want to select a locale on the dashboard (probably with a dropdown.)
 *
 * @param values - The values to perform substitutions upon; message contents
 * @param localizations - The localization object from the recipe, contains
 *        substitutions for a specific locale. May be null.
 * @returns {any} The values, potentially locale substituted.
 */

// XXX there are some existing issues with looping over && assigning object keys in Typescript;
// using the "any" type here is a workaround for those issues.
export function _substituteLocalizations(
  values: any,
  localizations?: any,
): object {
  // If the recipe is not localized, we don't need to do anything.
  // Likewise, if the value we are attempting to localize is not an
  // object, there is nothing to localize.
  if (
    typeof localizations === "undefined" ||
    typeof values !== "object" ||
    values === null
  ) {
    return values;
  }

  if (Array.isArray(values)) {
    return values.map((value) =>
      _substituteLocalizations(value, localizations),
    );
  }

  const substituted = Object.assign({}, values);

  // Loop over "$l10n" objects in the recipe and assign the appropriate string IDs from the
  // localizations object
  for (const [key, value] of Object.entries(values)) {
    if (
      key === "$l10n" &&
      typeof value === "object" &&
      value !== null &&
      (value as any)?.id
    ) {
      return localizations[(value as any).id];
    }

    substituted[key] = _substituteLocalizations(value, localizations);
  }

  return substituted;
}
