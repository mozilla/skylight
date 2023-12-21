/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use client'

import { useEffect, useState } from "react";

// import { AboutWelcomeDefaults } from "aboutwelcome/lib/AboutWelcomeDefaults.jsm";

// Test messages added at the end of file
const TEST = {};

const FAKESPOT_MESSAGES = [
  {
    id: "FAKESPOT_OPTIN_DEFAULT",
    template: "multistage",
    backdrop: "transparent",
    aria_role: "alert",
    UTMTerm: "opt-in",
    screens: [
      {
        id: "FS_OPT_IN",
        content: {
          position: "split",
          title: { string_id: "shopping-onboarding-headline" },
          // We set the dynamic subtitle ID below at the same time as the args;
          // to prevent intermittents caused by the args loading too late.
          subtitle: { string_id: "" },
          above_button_content: [
            {
              type: "text",
              text: {
                string_id: "shopping-onboarding-body",
              },
              link_keys: ["learn_more"],
            },
            {
              type: "image",
              url: "chrome://browser/content/shopping/assets/optInLight.avif",
              darkModeImageURL:
                "chrome://browser/content/shopping/assets/optInDark.avif",
              height: "172px",
              marginInline: "24px",
            },
            {
              type: "text",
              text: {
                string_id:
                  "shopping-onboarding-opt-in-privacy-policy-and-terms-of-use2",
              },
              link_keys: ["privacy_policy", "terms_of_use"],
              font_styles: "legal",
            },
          ],
          learn_more: {
            action: {
              type: "OPEN_URL",
              data: {
                args: "https://support.mozilla.org/1/firefox/%VERSION%/%OS%/%LOCALE%/review-checker-review-quality?utm_source=review-checker&utm_campaign=learn-more&utm_medium=in-product",
                where: "tab",
              },
            },
          },
          privacy_policy: {
            action: {
              type: "OPEN_URL",
              data: {
                args: "https://www.fakespot.com/privacy-policy?utm_source=review-checker&utm_campaign=privacy-policy&utm_medium=in-product",
                where: "tab",
              },
            },
          },
          terms_of_use: {
            action: {
              type: "OPEN_URL",
              data: {
                args: "https://www.fakespot.com/terms?utm_source=review-checker&utm_campaign=terms-of-use&utm_medium=in-product",
                where: "tab",
              },
            },
          },
          primary_button: {
            should_focus_button: true,
            label: { string_id: "shopping-onboarding-opt-in-button" },
            action: {
              type: "SET_PREF",
              data: {
                pref: {
                  name: "browser.shopping.experience2023.optedIn",
                  value: 1,
                },
              },
            },
          },
          additional_button: {
            label: {
              string_id: "shopping-onboarding-not-now-button",
            },
            style: "link",
            flow: "column",
            action: {
              type: "SET_PREF",
              data: {
                pref: {
                  name: "browser.shopping.experience2023.active",
                  value: false,
                },
              },
            },
          },
        },
      },
    ],
  },
  {
    id: "SHOPPING_MICROSURVEY",
    template: "multistage",
    backdrop: "transparent",
    transitions: true,
    UTMTerm: "survey",
    screens: [
      {
        id: "SHOPPING_MICROSURVEY_SCREEN_1",
        above_button_steps_indicator: true,
        content: {
          position: "split",
          layout: "survey",
          steps_indicator: {
            string_id: "shopping-onboarding-welcome-steps-indicator-label",
          },
          title: {
            string_id: "shopping-survey-headline",
          },
          subtitle: {
            string_id: "shopping-survey-question-one",
          },
          primary_button: {
            label: {
              string_id: "shopping-survey-next-button-label",
              paddingBlock: "5px",
              marginBlock: "0 12px",
            },
            action: {
              type: "MULTI_ACTION",
              collectSelect: true,
              data: {
                actions: [],
              },
              navigate: true,
            },
            disabled: "hasActiveMultiSelect",
          },
          additional_button: {
            label: {
              string_id: "shopping-survey-terms-link",
            },
            style: "link",
            flow: "column",
            action: {
              type: "OPEN_URL",
              data: {
                args: "https://www.mozilla.org/about/legal/terms/mozilla/?utm_source=review-checker&utm_campaign=terms-of-use-screen-1&utm_medium=in-product",
                where: "tab",
              },
            },
          },
          dismiss_button: {
            action: {
              dismiss: true,
            },
            label: {
              string_id: "shopping-onboarding-dialog-close-button",
            },
          },
          tiles: {
            type: "multiselect",
            style: {
              flexDirection: "column",
              alignItems: "flex-start",
            },
            data: [
              {
                id: "radio-1",
                type: "radio",
                group: "radios",
                defaultValue: false,
                label: { string_id: "shopping-survey-q1-radio-1-label" },
              },
              {
                id: "radio-2",
                type: "radio",
                group: "radios",
                defaultValue: false,
                label: { string_id: "shopping-survey-q1-radio-2-label" },
              },
              {
                id: "radio-3",
                type: "radio",
                group: "radios",
                defaultValue: false,
                label: { string_id: "shopping-survey-q1-radio-3-label" },
              },
              {
                id: "radio-4",
                type: "radio",
                group: "radios",
                defaultValue: false,
                label: { string_id: "shopping-survey-q1-radio-4-label" },
              },
              {
                id: "radio-5",
                type: "radio",
                group: "radios",
                defaultValue: false,
                label: { string_id: "shopping-survey-q1-radio-5-label" },
              },
            ],
          },
        },
      },
      {
        id: "SHOPPING_MICROSURVEY_SCREEN_2",
        above_button_steps_indicator: true,
        content: {
          position: "split",
          layout: "survey",
          steps_indicator: {
            string_id: "shopping-onboarding-welcome-steps-indicator-label",
          },
          title: {
            string_id: "shopping-survey-headline",
          },
          subtitle: {
            string_id: "shopping-survey-question-two",
          },
          primary_button: {
            label: {
              string_id: "shopping-survey-submit-button-label",
              paddingBlock: "5px",
              marginBlock: "0 12px",
            },
            action: {
              type: "MULTI_ACTION",
              collectSelect: true,
              data: {
                actions: [],
              },
              navigate: true,
            },
            disabled: "hasActiveMultiSelect",
          },
          additional_button: {
            label: {
              string_id: "shopping-survey-terms-link",
            },
            style: "link",
            flow: "column",
            action: {
              type: "OPEN_URL",
              data: {
                args: "https://www.mozilla.org/about/legal/terms/mozilla/?utm_source=review-checker&utm_campaign=terms-of-use-screen-2&utm_medium=in-product",
                where: "tab",
              },
            },
          },
          dismiss_button: {
            action: {
              dismiss: true,
            },
            label: {
              string_id: "shopping-onboarding-dialog-close-button",
            },
          },
          tiles: {
            type: "multiselect",
            style: {
              flexDirection: "column",
              alignItems: "flex-start",
            },
            data: [
              {
                id: "radio-1",
                type: "radio",
                group: "radios",
                defaultValue: false,
                label: { string_id: "shopping-survey-q2-radio-1-label" },
              },
              {
                id: "radio-2",
                type: "radio",
                group: "radios",
                defaultValue: false,
                label: { string_id: "shopping-survey-q2-radio-2-label" },
              },
              {
                id: "radio-3",
                type: "radio",
                group: "radios",
                defaultValue: false,
                label: { string_id: "shopping-survey-q2-radio-3-label" },
              },
            ],
          },
        },
      },
    ],
  },
];

export default function Home(props) {
  return (
    <>
      <h2>Hackathon</h2>
      <details>
        <summary>Instructions</summary>
        <ul>
          <li>
            <a href="https://docs.google.com/spreadsheets/d/1y_C6wDfGt7HQmUFVWHVXM4DpPL7G-jI3wtVORGbNVx8#gid=34757717">
              Groups & Goals
            </a>
          </li>
          <li>
            Stack patches on{" "}
            <a href="https://phabricator.services.mozilla.com/D192909">
              Bug 1862323 / Phabricator D192909
            </a>
          </li>
          <li>
            Share{" "}
            <a href="https://treeherder.mozilla.org/jobs?repo=try&revision=f145d019b50a909e9ceadc8448908f95a8c37c83">
              try builds
            </a>{" "}
            with{" "}
            <code>./mach try fuzzy -q^b -xeq4/o -xq\!an -xq\!si -xq\!sy</code>{" "}
            and link{" "}
            <code>
              target.&#123;
              <a href="https://firefox-ci-tc.services.mozilla.com/api/queue/v1/task/NTuPGjfEQ_SIgfLxgSlhXQ/runs/0/artifacts/public/build/target.zip">
                zip
              </a>
              ,
              <a href="https://firefox-ci-tc.services.mozilla.com/api/queue/v1/task/AtEd4u37TGiDwEhZuHbUDA/runs/0/artifacts/public/build/target.dmg">
                dmg
              </a>
              ,
              <a href="https://firefox-ci-tc.services.mozilla.com/api/queue/v1/task/fLgJeQYvRTaKGPBieHe-SQ/runs/0/artifacts/public/build/target.tar.bz2">
                tar.bz2
              </a>
              &#125;
            </code>{" "}
            Artifacts
          </li>
          <li>
            Set{" "}
            <code>
              browser.newtabpage.activity-stream.asrouter.devtoolsEnabled
            </code>
          </li>
          <li>
            Example views:{" "}
            <a href="#devtools-hackathon-FAKESPOT_OPTIN_DEFAULT">
              FAKESPOT_OPTIN_DEFAULT
            </a>
            ,{" "}
            <a href="#devtools-hackathon-SHOPPING_MICROSURVEY">
              FAKESPOT_SURVEY
            </a>
            ,<a href="#devtools-hackathon-view2">view 2</a>,{" "}
            <a href="#devtools-hackathon-page3">page 3</a>
          </li>
        </ul>
      </details>
      <Group1 {...props} />
    </>
  );
}

function getExperimentInfo(experiment, target) {
  let branchSlugs = experiment.branches.map(branch => {
    const { value } = branch?.features[0];
    const { id } = value;
    return (
      <>
        <li key={branch.slug}>{branch.slug}</li>
        <ol>
          <p style={{ fontWeight: 600 }}>
            Message ID: <a href={`#devtools-hackathon-${btoa(id)}`}>{id}</a>
          </p>
          {id === target ? Group2(experiment.targeting) : null}
          {Group3(id)}
          {id === target ? Group4(value) : null}
        </ol>
      </>
    );
  });
  return (
    <>
      <tr style={{ "borderTop": "1px solid black" }}>
        <td>{experiment.userFacingName}</td>
        <td>{experiment.userFacingDescription}</td>
        <td>
          <ul>{branchSlugs}</ul>
        </td>
      </tr>
    </>
  );
}

function getASRouterMessages(asrouter) {
  const liveProviders = ["onboarding", "cfr"];

  let liveMessages = asrouter?.filter(message => {
    return liveProviders.includes(message.provider);
  });

  liveMessages = liveMessages.concat(FAKESPOT_MESSAGES);

  return liveMessages.map(message => {
    const screens = message.screens
      ? message.screens.map(screen => {
          return <li key={screen.id}>{screen.id}</li>;
        })
      : null;
    const contentScreens =
      message.content && message.content.screens
        ? message.content.screens.map(screen => {
            return <li key={screen.id}>{screen.id}</li>;
          })
        : null;
    return (
      <tr style={{ "borderTop": "1px solid black" }} key={message.id}>
        <td>{message.id}</td>
        <td>{message.template}</td>
        <td>
          <ul>{screens}</ul>
          <ul>{contentScreens}</ul>
        </td>
      </tr>
    );
  });
}

function Group1({ asrouter, view }) {
  const [nimbus, setNimbus] = useState([]);
  useEffect(() => {
    fetch(
      "https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/nimbus-desktop-experiments/records",
      {
        credentials: "omit",
      }
    )
      .then(r => r.json())
      .then(j => setNimbus(j.data));
  }, []);

  const experiments = nimbus.map(experiment => {
    let id = "";
    try {
      id = atob(view);
    } catch (ex) {}
    return getExperimentInfo(experiment, id);
  });

  const asRouterMessages = asrouter ? getASRouterMessages(asrouter) : null;

  return (
    <>
      <h3>Group 1: Listing</h3>
      <p>asrouter: {asrouter?.length}</p>
      <p>nimbus: {nimbus.length}</p>

      <h1>GROUP 1: Nimbus Live Experiments</h1>

      <table>
        <tr style={{ "borderTop": "1px solid black" }}>
          <th>Experiments</th>
          <th>Description</th>
          <th>Branches</th>
        </tr>
        {experiments}
      </table>

      <h1>GROUP 1: ASROUTER Messages</h1>
      <table>
        <tr style={{ "borderTop": "1px solid black" }}>
          <th>Messages</th>
          <th>Template</th>
          <th>Screens</th>
        </tr>
        {asRouterMessages}
      </table>

      <h1>Other Messages</h1>
      <table>
        <tr style={{ "borderTop": "1px solid black" }}></tr>
      </table>
    </>
  );
}

function Group2(toclean) {
  function splitLines(input) {
    const isOperator = (targeting, index) => {
      return ["&&", "||"].includes(targeting.slice(index, index + 2));
    };

    let parsedTargeting = "";

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (isOperator(input, i)) {
        const operator = input.slice(i, i + 2);
        //add a newline before the operator
        parsedTargeting += `${operator.replace(
          operator,
          `<code style="color: #E21587;">${operator}</code>`
        )}\n`;
        //skip the next character so we don't add an operator twice
        i++;
      } else {
        parsedTargeting += char;
      }
    }

    return parsedTargeting.split("\n");
  }

  const attributes = {
    activeNotifications:
      "True when an infobar style message is displayed or when the awesomebar is expanded to show a message (for example onboarding tips).",
    addonsInfo:
      "Provides information about the add-ons the user has installed.",
    addressesSaved:
      "The number of addresses the user has saved for Forms and Autofill.",
    attachedFxAOAuthClients:
      "Information about connected services associated with the FxA Account. Return an empty array if no account is found or an error occurs.",
    attributionData:
      "An object containing information on exactly how Firefox was downloaded",
    backgroundTaskName:
      "A non-empty string task name if this invocation is running in background task mode, or `null` if this invocation is not running in background task mode.",
    blockedCountByType:
      "Returns a breakdown by category of all blocked resources in the past 42 days.",
    browserSettings:
      "An object containing information about browser attribution and updates",
    creditCardsSaved:
      "The number of credit cards the user has saved for Forms and Autofill.",
    currentDate: "The current date at the moment message targeting is checked.",
    defaultPDFHandler:
      "Information about the user's default PDF handler (windows only)",
    devToolsOpenedCount: "Number of usages of the web console.",
    distributionId:
      "A string containing the id of the distribution, or the empty string if there is no distribution associated with the build.",
    doesAppNeedPin:
      "Checks if Firefox app can be and isn't pinned to OS taskbar/dock.",
    doesAppNeedPrivatePin:
      "Checks if Firefox Private Browsing Mode can be and isn't pinned to OS taskbar/dock. Currently this only works on certain Windows versions.",
    firefoxVersion: "The major Firefox version of the browser",
    fxViewButtonAreaType:
      "A string of the name of the container where the Firefox View button is shown, null if the button has been removed.",
    hasAccessedFxAPanel:
      "Boolean pref that gets set the first time the user opens the FxA toolbar panel",
    hasActiveEnterprisePolicies:
      "A boolean. `true` if any Enterprise Policies are active.",
    hasMigratedBookmarks:
      "A boolean. `true` if the user ever used the Migration Wizard to migrate bookmarks since Firefox 113 released. Available in Firefox 113+; will not be true if the user had only ever migrated bookmarks prior to Firefox 113 being released.",
    hasMigratedCSVPasswords:
      "A boolean. `true` if CSV passwords have been imported via the migration wizard since Firefox 116 released. Available in Firefox 116+; ; will not be true if the user had only ever migrated CSV passwords prior to Firefox 116 being released.",
    hasMigratedHistory:
      "A boolean. `true` if the user ever used the Migration Wizard to migrate history since Firefox 113 released. Available in Firefox 113+; will not be true if the user had only ever migrated history prior to Firefox 113 being released.",
    hasMigratedPasswords:
      "A boolean. `true` if the user ever used the Migration Wizard to migrate passwords since Firefox 113 released. Available in Firefox 113+; will not be true if the user had only ever migrated passwords prior to Firefox 113 being released.",
    hasPinnedTabs: "Does the user have any pinned tabs in any windows.",
    homePageSettings:
      "An object reflecting the current settings of the browser home page (about:home)",
    inMr2022Holdback:
      "A boolean. `true` when the user is in the Major Release 2022 holdback study.",
    isBackgroundTaskMode:
      "Checks if this invocation is running in background task mode.",
    isChinaRepack:
      "Does the user use [the partner repack distributed by Mozilla Online](https://github.com/mozilla-partners/mozillaonline), a wholly owned subsidiary of the Mozilla Corporation that operates in China.",
    isDefaultBrowser: "Is Firefox the user's default browser?",
    isDefaultHandler:
      "Is Firefox the user's default handler for various file extensions? (Windows only)",
    isDeviceMigration:
      "A boolean. `true` when [support.mozilla.org](https://support.mozilla.org) has been used to download the browser as part of a 'migration' campaign, for device migration guidance, `false` otherwise.",
    isFxAEnabled:
      "Does the user have Firefox sync enabled? The service could potentially be turned off for enterprise builds",
    isFxASignedIn: "Is the user signed in to a Firefox Account?",
    isMajorUpgrade:
      "A boolean. `true` if the browser just updated to a new major version.",
    isRTAMO:
      "A boolean. `true` when [RTAMO](first-run.md#return-to-amo-rtamo) has been used to download Firefox, `false` otherwise.",
    isWhatsNewPanelEnabled:
      "Boolean pref that controls if the What's New panel feature is enabled",
    locale:
      "The current locale of the browser including country code, e.g. `en-US`.",
    localeLanguageCode:
      "The current locale of the browser NOT including country code, e.g. `en`. This is useful for matching all countries of a particular language.",
    messageImpressions:
      "Dictionary that maps message ids to impression timestamps. Timestamps are stored in consecutive order. Can be used to detect first impression of a message, number of impressions. Can be used in targeting to show a message if another message has been seen.",
    needsUpdate: "Does the client have the latest available version installed",
    newtabSettings:
      "An object reflecting the current settings of the browser newtab page (about:newtab)",
    pinnedSites:
      "The sites (including search shortcuts) that are pinned on a user's new tab page.",
    platformName:
      "The name of the users platform: eg. linux, win, macosx, android, other",
    previousSessionEnd: "Timestamp of the previously closed session.",
    primaryResolution:
      "An object containing the available width and available height of the primary monitor in pixel values. The values take into account the existence of docks and task bars.",
    profileAgeCreated:
      "The date the profile was created as a UNIX Epoch timestamp.",
    profileAgeReset:
      "The date the profile was created as a UNIX Epoch timestamp.",
    profileRestartCount:
      "A session counter that shows how many times the browser was started.",
    providerCohorts:
      "Information about cohort settings (from prefs, including shield studies) for each provider.",
    recentBookmarks:
      "An array of GUIDs of recent bookmarks as provided by `NewTabUtils.getRecentBookmarks`",
    region:
      "Country code retrieved from `location.services.mozilla.com`. Can be an empty string if request did not finish or encountered an error.",
    screenImpressions:
      "An array that maps about:welcome screen IDs to their most recent impression timestamp. Should only be used for unique screen IDs to avoid unintentionally targeting messages with identical screen IDs.",
    searchEngines:
      "Information about the current and available search engines.",
    sync: "Information about synced devices.",
    topFrecentSites: "Information about the browser's top 25 frecent sites.",
    totalBlockedCount:
      "Total number of events from the content blocking database",
    totalBookmarksCount: "Total number of bookmarks.",
    userId:
      "A unique user id generated by Normandy (note that this is not clientId).",
    userMonthlyActivity:
      "Returns an array of entries in the form `[int, unixTimestamp]` for each day of user activity where the first entry is the total urls visited for that day.",
    userPrefersReducedMotion:
      "Checks if user prefers reduced motion as indicated by the value of a media query for `prefers-reduced-motion`.",
    useEmbeddedMigrationWizard:
      "A boolean. `true` if the user is configured to use the embedded Migration Wizard in about:welcome.",
    userPrefs:
      "Information about user facing prefs configurable from `about:preferences`.",
    usesFirefoxSync: "Does the user use Firefox sync?",
    xpinstallEnabled:
      "Pref used by system administrators to disallow add-ons from installed altogether.",
    isFirstStartup:
      "A boolean indicating whether or not the current enrollment is performed during the first startup.",
    activeExperiments: "An array of slugs of all the active experiments",
    activeRollouts: "An array of slugs of all the active rollouts",
    previousExperiments:
      "An array of slugs of all the previously active experiments",
    previousRollouts: "An array of slugs of all the previously active rollouts",
    enrollments: "",
    os: "An object containing information about the operating system that Firefox is running on.",
    version: "The full version of the Firefox installation.",
    channel: "The release channel of this Firefox installation.",
    platform:
      "The name of the users platform: eg. linux, win, macosx, android, other",
  };

  function parseLineForAttributes(targetingLine) {
    let lineAttribute;

    Object.keys(attributes).forEach(key => {
      if (targetingLine.includes(key)) {
        lineAttribute = key;
      }
    });

    return lineAttribute;
  }

  function getHumanizedComment(targetingAttribute) {
    return `${attributes[targetingAttribute]}`;
  }

  function getTargetingAttributeWithLink(targetingLine, targetingAttribute) {
    // Replace the actual inline attribute with a link to the documentation
    let link;
    if (targetingAttribute) {
      link = `https://firefox-source-docs.mozilla.org/browser/components/newtab/content-src/asrouter/docs/targeting-attributes.html#${targetingAttribute.toLowerCase()}`;
    } else {
      link = `https://firefox-source-docs.mozilla.org/browser/components/newtab/content-src/asrouter/docs/targeting-attributes.html`;
    }
    const newTargetingLine = targetingLine.replace(
      targetingAttribute,
      `<a href="${link}" target="_blank" rel="noopener noreferrer">${targetingAttribute}</a>`
    );
    return { __html: newTargetingLine };
  }

  // Check for an attribute in this line
  // If there is an attribute, get a humanized comment
  // and also replace the original line with a new line that converts the attribute to a link
  function createHumanizedTargeting(targetingLine) {
    let attribute =
      parseLineForAttributes(targetingLine) ?? "No description found!";
    let comment = getHumanizedComment(attribute);
    let newLine = getTargetingAttributeWithLink(targetingLine, attribute);

    return (
      <div>
        <p style={{ color: "#0060DF" }}>
          {"// "}
          {attribute}
          {": "}
          {comment}
        </p>
        {/* eslint-disable-next-line react/no-danger */}
        <code dangerouslySetInnerHTML={newLine}></code>
      </div>
    );
  }

  function parseTheTargeting(lines) {
    return lines.map(line => {
      return createHumanizedTargeting(line);
    });
  }

  return (
    <>
      <h3>Group 2: Friendly</h3>
      <p style={{ whiteSpace: "break-spaces", marginInline: "16px 0" }}>
        {parseTheTargeting(splitLines(toclean))}
      </p>
    </>
  );
}

function Group3(id) {
  const iconStyle = {
    paddingTop: "3px",
    width: "1em",
    height: "1em",
  };

  const href = `https://mozilla.cloud.looker.com/dashboards/1471?Message+ID=%25${id?.toUpperCase()}%25`;

  return (
    <a href={href} target="_blank" rel="noreferrer">
      Results
      <svg
        fill="none"
        viewBox="0 0 8 8"
        className="sidebar-icon-external-link"
        aria-hidden="true"
        style={iconStyle}
      >
        <path
          clipRule="evenodd"
          d="m1.71278 0h.57093c.31531 0 .57092.255837.57092.571429 0 .315591-.25561.571431-.57092.571431h-.57093c-.31531 0-.57093.25583-.57093.57143v4.57142c0 .3156.25562.57143.57093.57143h4.56741c.31531 0 .57093-.25583.57093-.57143v-.57142c0-.3156.25561-.57143.57092-.57143.31532 0 .57093.25583.57093.57143v.57142c0 .94678-.76684 1.71429-1.71278 1.71429h-4.56741c-.945943 0-1.71278-.76751-1.71278-1.71429v-4.57142c0-.946778.766837-1.71429 1.71278-1.71429zm5.71629 0c.23083.0002686.43879.13963.52697.353143.02881.069172.04375.143342.04396.218286v2.857141c0 .31559-.25561.57143-.57093.57143-.31531 0-.57092-.25584-.57092-.57143v-1.47771l-1.88006 1.88171c-.14335.14855-.35562.20812-.55523.15583-.19962-.0523-.35551-.20832-.40775-.40811-.05225-.19979.00727-.41225.15569-.55572l1.88006-1.88171h-1.47642c-.31531 0-.57093-.25584-.57093-.571431 0-.315592.25562-.571429.57093-.571429z"
          fill="#5e5e72"
          fillRule="evenodd"
        ></path>
      </svg>
    </a>
  );
}

function Group4(message) {
  const getMessage = () => message;
  return (
    <>
      <h3>Group 4: Preview</h3>
      <details>
        <summary>JSON Message</summary>
        <ul>
          <li>
            <p>{JSON.stringify(getMessage())}</p>
          </li>
        </ul>
      </details>

      <InlineMessagePreview message={getMessage()} />
      <br />
    </>
  );
}

async function addLinkElements() {
  const addStylesheet = href => {
    if (document.querySelector(`link[href="${href}"]`)) {
      return null;
    }
    const link = document.head.appendChild(document.createElement("link"));
    link.rel = "stylesheet";
    link.href = href;
    return null;
  };
  // Update styling to be compatible with about:welcome bundle
  await Promise.all(
    [
      "chrome://activity-stream/content/aboutwelcome/aboutwelcome.css",
      "chrome://global/skin/in-content/common-shared.css",
    ].map(addStylesheet)
  );
}

async function addScriptsAndRender() {
  const bundleSrc =
    "resource://activity-stream/aboutwelcome/aboutwelcome.bundle.js";
  const reactSrc = "resource://activity-stream/vendor/react.js";
  const domSrc = "resource://activity-stream/vendor/react-dom.js";
  // Add React script
  const getReactReady = () => {
    return new Promise(resolve => {
      let reactScript = document.createElement("script");
      reactScript.src = reactSrc;
      document.head.appendChild(reactScript);
      reactScript.addEventListener("load", resolve);
    });
  };
  // Add ReactDom script
  const getDomReady = () => {
    return new Promise(resolve => {
      let domScript = document.createElement("script");
      domScript.src = domSrc;
      document.head.appendChild(domScript);
      domScript.addEventListener("load", resolve);
    });
  };
  // Load React, then React Dom
  if (!document.querySelector(`[src="${reactSrc}"]`)) {
    await getReactReady();
  }
  if (!document.querySelector(`[src="${domSrc}"]`)) {
    await getDomReady();
  }
  // Load the bundle to render the content as configured.
  document.querySelector(`[src="${bundleSrc}"]`)?.remove();
  let bundleScript = document.createElement("script");
  bundleScript.src = bundleSrc;
  document.head.appendChild(bundleScript);
}

const InlineMessagePreview = props => {
  let content = props.message.content ?? props.message;
  useEffect(() => {
    const bundleSrc =
      "resource://activity-stream/aboutwelcome/aboutwelcome.bundle.js";
    if (!content) {
      return null;
    }
    let windowFuncs = {
      AWGetFeatureConfig: () => content,
      AWGetSelectedTheme: () => {},
      // Do not send telemetry if message config sets metrics as 'block'.
      AWSendEventTelemetry: () => {},
      AWSendToDeviceEmailsSupported: () => {},
      AWSendToParent: () => {},
      AWFinish: () => {},
      AWEvaluateScreenTargeting: () => {},
    };
    for (const [name, func] of Object.entries(windowFuncs)) {
      window[name] = func;
    }
    addLinkElements().then(addScriptsAndRender);
    return () => {
      for (const name of Object.keys(windowFuncs)) {
        delete window[name];
      }
      document.querySelector(`[src="${bundleSrc}"]`)?.remove();
    };
  }, [content]);
  let className = "onboardingContainer";
  if (content.tags?.includes("shopping")) {
    className += " shopping";
  }
  return (
    <div id="asrouter-preview">
      <div id="multi-stage-message-root" className={className}></div>
    </div>
  );
};

// https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/nimbus-desktop-experiments/records/addon-recommendations-in-nuo
TEST.EXPERIMENT = {
  permissions: {},
  data: {
    slug: "addon-recommendations-in-nuo",
    appId: "firefox-desktop",
    appName: "firefox_desktop",
    channel: "release",
    endDate: null,
    locales: ["en-GB", "en-CA", "en-US"],
    branches: [
      {
        slug: "control",
        ratio: 1,
        feature: {
          value: {},
          enabled: false,
          featureId: "this-is-included-for-desktop-pre-95-support",
        },
        features: [
          {
            value: {
              id: "addon-recommendations-in-nuo:control",
              screens: [
                {
                  id: "AW_WELCOME_BACK",
                  content: {
                    logo: {},
                    title: { string_id: "onboarding-device-migration-title" },
                    position: "split",
                    subtitle: {
                      string_id: "onboarding-device-migration-subtitle2",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/device-migration.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "onboarding-device-migration-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "onboarding-device-migration-primary-button-label",
                      },
                      action: {
                        data: {
                          entrypoint: "fx-device-migration-onboarding",
                          extraParams: {
                            utm_medium: "firefox-desktop",
                            utm_source: "fx-new-device-sync",
                            utm_content: "migration-onboarding",
                            utm_campaign: "migration",
                          },
                        },
                        type: "FXA_SIGNIN_FLOW",
                        navigate: "actionResult",
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-100px",
                  },
                  targeting: "isDeviceMigration",
                },
                {
                  id: "AW_EASY_SETUP",
                  content: {
                    logo: {},
                    tiles: {
                      data: [
                        {
                          id: "checkbox-1",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-set-default-checkbox-label",
                          },
                          action: { type: "SET_DEFAULT_BROWSER" },
                          defaultValue: true,
                        },
                        {
                          id: "checkbox-2",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-import-checkbox-label",
                          },
                          action: { data: {}, type: "SHOW_MIGRATION_WIZARD" },
                          defaultValue: true,
                        },
                      ],
                      type: "multiselect",
                    },
                    title: { raw: "We love keeping you safe" },
                    position: "split",
                    subtitle: {
                      raw: "Our non-profit backed browser helps stop companies from secretly following you around the web.",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-default-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-easy-setup-primary-button-label",
                      },
                      action: {
                        data: { actions: [] },
                        type: "MULTI_ACTION",
                        navigate: true,
                        collectSelect: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    secondary_button_top: {
                      label: {
                        string_id: "mr1-onboarding-sign-in-button-label",
                      },
                      action: {
                        data: {
                          where: "tab",
                          entrypoint: "activity-stream-firstrun",
                        },
                        type: "SHOW_FIREFOX_ACCOUNTS",
                        addFlowParams: true,
                      },
                    },
                    split_narrow_bkg_position: "-60px",
                  },
                  targeting:
                    "os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin && !useEmbeddedMigrationWizard",
                },
                {
                  id: "AW_EASY_SETUP_EMBEDDED",
                  content: {
                    logo: {},
                    tiles: {
                      data: [
                        {
                          id: "checkbox-1",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-set-default-checkbox-label",
                          },
                          action: { type: "SET_DEFAULT_BROWSER" },
                          defaultValue: true,
                        },
                        {
                          id: "checkbox-2",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-import-checkbox-label",
                          },
                          defaultValue: true,
                          checkedAction: {
                            data: {
                              actions: [
                                {
                                  data: {
                                    pref: {
                                      name: "showEmbeddedImport",
                                      value: true,
                                    },
                                  },
                                  type: "SET_PREF",
                                },
                              ],
                            },
                            type: "MULTI_ACTION",
                          },
                          uncheckedAction: {
                            data: {
                              actions: [
                                {
                                  data: {
                                    pref: { name: "showEmbeddedImport" },
                                  },
                                  type: "SET_PREF",
                                },
                              ],
                            },
                            type: "MULTI_ACTION",
                          },
                        },
                      ],
                      type: "multiselect",
                    },
                    title: { raw: "We love keeping you safe" },
                    position: "split",
                    subtitle: {
                      raw: "Our non-profit backed browser helps stop companies from secretly following you around the web.",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-default-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-easy-setup-primary-button-label",
                      },
                      action: {
                        data: { actions: [] },
                        type: "MULTI_ACTION",
                        navigate: true,
                        collectSelect: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    secondary_button_top: {
                      label: {
                        string_id: "mr1-onboarding-sign-in-button-label",
                      },
                      action: {
                        data: {
                          where: "tab",
                          entrypoint: "activity-stream-firstrun",
                        },
                        type: "SHOW_FIREFOX_ACCOUNTS",
                        addFlowParams: true,
                      },
                    },
                    split_narrow_bkg_position: "-60px",
                  },
                  targeting:
                    "os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin && useEmbeddedMigrationWizard",
                },
                {
                  id: "AW_PIN_FIREFOX",
                  content: {
                    logo: {},
                    title: {
                      string_id: "mr2022-onboarding-welcome-pin-header",
                    },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-onboarding-welcome-pin-subtitle",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-pintaskbar.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-pin-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id: "mr2022-onboarding-pin-primary-button-label",
                      },
                      action: {
                        type: "PIN_FIREFOX_TO_TASKBAR",
                        navigate: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    secondary_button_top: {
                      label: {
                        string_id: "mr1-onboarding-sign-in-button-label",
                      },
                      action: {
                        data: {
                          where: "tab",
                          entrypoint: "activity-stream-firstrun",
                        },
                        type: "SHOW_FIREFOX_ACCOUNTS",
                        addFlowParams: true,
                      },
                    },
                    split_narrow_bkg_position: "-155px",
                  },
                  targeting:
                    "!(os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin)",
                },
                {
                  id: "AW_LANGUAGE_MISMATCH",
                  content: {
                    logo: {},
                    title: {
                      string_id: "mr2022-onboarding-live-language-text",
                    },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-language-mismatch-subtitle",
                    },
                    hero_text: {
                      string_id: "mr2022-onboarding-live-language-text",
                      useLangPack: true,
                    },
                    background: "var(--mr-screen-background-color)",
                    progress_bar: true,
                    languageSwitcher: {
                      skip: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      cancel: {
                        string_id:
                          "onboarding-live-language-secondary-cancel-download",
                      },
                      switch: {
                        string_id: "mr2022-onboarding-live-language-switch-to",
                        useLangPack: true,
                      },
                      waiting: {
                        string_id: "onboarding-live-language-waiting-button",
                      },
                      continue: {
                        string_id:
                          "mr2022-onboarding-live-language-continue-in",
                      },
                      downloading: {
                        string_id:
                          "onboarding-live-language-button-label-downloading",
                      },
                    },
                  },
                },
                {
                  id: "AW_SET_DEFAULT",
                  content: {
                    logo: {},
                    title: {
                      string_id: "mr2022-onboarding-set-default-title",
                    },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-onboarding-set-default-subtitle",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-default-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-set-default-primary-button-label",
                      },
                      action: { type: "SET_DEFAULT_BROWSER", navigate: true },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-60px",
                  },
                  targeting:
                    "!(os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin)",
                },
                {
                  id: "AW_IMPORT_SETTINGS",
                  content: {
                    logo: {},
                    title: { string_id: "mr2022-onboarding-import-header" },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-onboarding-import-subtitle",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-import.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-import-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-import-primary-button-label-no-attribution",
                      },
                      action: {
                        data: {},
                        type: "SHOW_MIGRATION_WIZARD",
                        navigate: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-42px",
                  },
                  targeting:
                    "!(os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin) && !useEmbeddedMigrationWizard",
                },
                {
                  id: "AW_IMPORT_SETTINGS_EMBEDDED",
                  content: {
                    tiles: { type: "migration-wizard" },
                    position: "split",
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-import.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    migrate_close: { action: { navigate: true } },
                    migrate_start: { action: {} },
                    image_alt_text: {
                      string_id: "mr2022-onboarding-import-image-alt",
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    hide_secondary_section: "responsive",
                    split_narrow_bkg_position: "-42px",
                  },
                  targeting:
                    '(!(os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin) || ("messaging-system-action.showEmbeddedImport" |preferenceValue == true) && useEmbeddedMigrationWizard',
                },
                {
                  id: "AW_MOBILE_DOWNLOAD",
                  content: {
                    logo: {},
                    title: {
                      raw: "Stay encrypted when you hop between devices",
                    },
                    position: "split",
                    subtitle: {
                      raw: "When you\u2019re synced up, Firefox encrypts your passwords, bookmarks, and more. Plus you can grab tabs from your other devices.",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-mobilecrosspromo.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    hero_image: {
                      url: "chrome://activity-stream/content/data/content/assets/mobile-download-qr-new-user.svg",
                    },
                    progress_bar: true,
                    cta_paragraph: {
                      text: {
                        string_id: "mr2022-onboarding-mobile-download-cta-text",
                        string_name: "download-label",
                      },
                      action: {
                        data: {
                          args: "https://www.mozilla.org/firefox/mobile/get-app/?utm_medium=firefox-desktop&utm_source=onboarding-modal&utm_campaign=mr2022&utm_content=new-global",
                          where: "tab",
                        },
                        type: "OPEN_URL",
                      },
                    },
                    image_alt_text: {
                      string_id: "mr2022-onboarding-mobile-download-image-alt",
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-160px",
                  },
                  targeting: "!isFxASignedIn || sync.mobileDevices == 0",
                },
                {
                  id: "AW_AMO_INTRODUCE",
                  content: {
                    logo: {},
                    title: "Personalize your Firefox",
                    position: "split",
                    subtitle:
                      "Add-ons are tiny apps that run in Firefox and level up the way you browse \u2014 from ultimate privacy and safety to changing how Firefox looks and behaves.",
                    background:
                      "url('https://firefox-settings-attachments.cdn.mozilla.net/main-workspace/ms-images/74f06853-c80d-4afc-9b2f-644415c35311.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    primary_button: {
                      label: "Explore staff-recommended add-ons",
                      action: {
                        data: {
                          args: "https://addons.mozilla.org/en-US/firefox/collections/4757633/25c2b44583534b3fa8fea977c419cd/?page=1&collection_sort=-added",
                          where: "tabshifted",
                        },
                        type: "OPEN_URL",
                        navigate: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                    },
                    split_narrow_bkg_position: "-58px",
                  },
                },
                {
                  id: "AW_GRATITUDE",
                  content: {
                    logo: {},
                    title: { raw: "Firefox has your back" },
                    position: "split",
                    subtitle: {
                      raw: "Thank you for using Firefox, backed by the Mozilla Foundation. With your support, we're working to make the internet safer and more accessible for everyone.  ",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-gratitude.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-gratitude-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id: "mr2-onboarding-start-browsing-button-label",
                      },
                      action: { navigate: true },
                    },
                    split_narrow_bkg_position: "-228px",
                  },
                },
              ],
              transitions: true,
            },
            enabled: true,
            featureId: "aboutwelcome",
          },
        ],
      },
      {
        slug: "treatment-a",
        ratio: 1,
        feature: {
          value: {},
          enabled: false,
          featureId: "this-is-included-for-desktop-pre-95-support",
        },
        features: [
          {
            value: {
              id: "addon-recommendations-in-nuo:treatment-a",
              screens: [
                {
                  id: "AW_WELCOME_BACK",
                  content: {
                    logo: {},
                    title: { string_id: "onboarding-device-migration-title" },
                    position: "split",
                    subtitle: {
                      string_id: "onboarding-device-migration-subtitle",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/device-migration.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "onboarding-device-migration-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "onboarding-device-migration-primary-button-label",
                      },
                      action: {
                        data: {
                          entrypoint: "fx-device-migration-onboarding",
                          extraParams: {
                            utm_medium: "firefox-desktop",
                            utm_source: "fx-new-device-sync",
                            utm_content: "migration-onboarding",
                            utm_campaign: "migration",
                          },
                        },
                        type: "FXA_SIGNIN_FLOW",
                        navigate: "actionResult",
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-100px",
                  },
                  targeting: "isDeviceMigration",
                },
                {
                  id: "AW_EASY_SETUP",
                  content: {
                    logo: {},
                    tiles: {
                      data: [
                        {
                          id: "checkbox-1",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-set-default-checkbox-label",
                          },
                          action: { type: "SET_DEFAULT_BROWSER" },
                          defaultValue: true,
                        },
                        {
                          id: "checkbox-2",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-import-checkbox-label",
                          },
                          action: { data: {}, type: "SHOW_MIGRATION_WIZARD" },
                          defaultValue: true,
                        },
                      ],
                      type: "multiselect",
                    },
                    title: { raw: "We love keeping you safe" },
                    position: "split",
                    subtitle: {
                      raw: "Our non-profit backed browser helps stop companies from secretly following you around the web.",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-default-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-easy-setup-primary-button-label",
                      },
                      action: {
                        data: { actions: [] },
                        type: "MULTI_ACTION",
                        navigate: true,
                        collectSelect: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    secondary_button_top: {
                      label: {
                        string_id: "mr1-onboarding-sign-in-button-label",
                      },
                      action: {
                        data: {
                          where: "tab",
                          entrypoint: "activity-stream-firstrun",
                        },
                        type: "SHOW_FIREFOX_ACCOUNTS",
                        addFlowParams: true,
                      },
                    },
                    split_narrow_bkg_position: "-60px",
                  },
                  targeting:
                    "os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin && !useEmbeddedMigrationWizard",
                },
                {
                  id: "AW_EASY_SETUP_EMBEDDED",
                  content: {
                    logo: {},
                    tiles: {
                      data: [
                        {
                          id: "checkbox-1",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-set-default-checkbox-label",
                          },
                          action: { type: "SET_DEFAULT_BROWSER" },
                          defaultValue: true,
                        },
                        {
                          id: "checkbox-2",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-import-checkbox-label",
                          },
                          defaultValue: true,
                          checkedAction: {
                            data: {
                              actions: [
                                {
                                  data: {
                                    pref: {
                                      name: "showEmbeddedImport",
                                      value: true,
                                    },
                                  },
                                  type: "SET_PREF",
                                },
                              ],
                            },
                            type: "MULTI_ACTION",
                          },
                          uncheckedAction: {
                            data: {
                              actions: [
                                {
                                  data: {
                                    pref: { name: "showEmbeddedImport" },
                                  },
                                  type: "SET_PREF",
                                },
                              ],
                            },
                            type: "MULTI_ACTION",
                          },
                        },
                      ],
                      type: "multiselect",
                    },
                    title: { raw: "We love keeping you safe" },
                    position: "split",
                    subtitle: {
                      raw: "Our non-profit backed browser helps stop companies from secretly following you around the web.",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-default-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-easy-setup-primary-button-label",
                      },
                      action: {
                        data: { actions: [] },
                        type: "MULTI_ACTION",
                        navigate: true,
                        collectSelect: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    secondary_button_top: {
                      label: {
                        string_id: "mr1-onboarding-sign-in-button-label",
                      },
                      action: {
                        data: {
                          where: "tab",
                          entrypoint: "activity-stream-firstrun",
                        },
                        type: "SHOW_FIREFOX_ACCOUNTS",
                        addFlowParams: true,
                      },
                    },
                    split_narrow_bkg_position: "-60px",
                  },
                  targeting:
                    "os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin && useEmbeddedMigrationWizard",
                },
                {
                  id: "AW_PIN_FIREFOX",
                  content: {
                    logo: {},
                    title: {
                      string_id: "mr2022-onboarding-welcome-pin-header",
                    },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-onboarding-welcome-pin-subtitle",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-pintaskbar.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-pin-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id: "mr2022-onboarding-pin-primary-button-label",
                      },
                      action: {
                        type: "PIN_FIREFOX_TO_TASKBAR",
                        navigate: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    secondary_button_top: {
                      label: {
                        string_id: "mr1-onboarding-sign-in-button-label",
                      },
                      action: {
                        data: {
                          where: "tab",
                          entrypoint: "activity-stream-firstrun",
                        },
                        type: "SHOW_FIREFOX_ACCOUNTS",
                        addFlowParams: true,
                      },
                    },
                    split_narrow_bkg_position: "-155px",
                  },
                  targeting:
                    "!(os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin)",
                },
                {
                  id: "AW_LANGUAGE_MISMATCH",
                  content: {
                    logo: {},
                    title: {
                      string_id: "mr2022-onboarding-live-language-text",
                    },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-language-mismatch-subtitle",
                    },
                    hero_text: {
                      string_id: "mr2022-onboarding-live-language-text",
                      useLangPack: true,
                    },
                    background: "var(--mr-screen-background-color)",
                    progress_bar: true,
                    languageSwitcher: {
                      skip: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      cancel: {
                        string_id:
                          "onboarding-live-language-secondary-cancel-download",
                      },
                      switch: {
                        string_id: "mr2022-onboarding-live-language-switch-to",
                        useLangPack: true,
                      },
                      waiting: {
                        string_id: "onboarding-live-language-waiting-button",
                      },
                      continue: {
                        string_id:
                          "mr2022-onboarding-live-language-continue-in",
                      },
                      downloading: {
                        string_id:
                          "onboarding-live-language-button-label-downloading",
                      },
                    },
                  },
                },
                {
                  id: "AW_SET_DEFAULT",
                  content: {
                    logo: {},
                    title: {
                      string_id: "mr2022-onboarding-set-default-title",
                    },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-onboarding-set-default-subtitle",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-default-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-set-default-primary-button-label",
                      },
                      action: { type: "SET_DEFAULT_BROWSER", navigate: true },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-60px",
                  },
                  targeting:
                    "!(os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin)",
                },
                {
                  id: "AW_IMPORT_SETTINGS",
                  content: {
                    logo: {},
                    title: { string_id: "mr2022-onboarding-import-header" },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-onboarding-import-subtitle",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-import.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-import-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-import-primary-button-label-no-attribution",
                      },
                      action: {
                        data: {},
                        type: "SHOW_MIGRATION_WIZARD",
                        navigate: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-42px",
                  },
                  targeting:
                    "!(os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin) && !useEmbeddedMigrationWizard",
                },
                {
                  id: "AW_IMPORT_SETTINGS_EMBEDDED",
                  content: {
                    tiles: { type: "migration-wizard" },
                    position: "split",
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-import.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    migrate_close: { action: { navigate: true } },
                    migrate_start: { action: {} },
                    image_alt_text: {
                      string_id: "mr2022-onboarding-import-image-alt",
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    hide_secondary_section: "responsive",
                    split_narrow_bkg_position: "-42px",
                  },
                  targeting:
                    '(!(os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin) || ("messaging-system-action.showEmbeddedImport" |preferenceValue == true) && useEmbeddedMigrationWizard',
                },
                {
                  id: "AW_MOBILE_DOWNLOAD",
                  content: {
                    logo: {},
                    title: {
                      raw: "Stay encrypted when you hop between devices",
                    },
                    position: "split",
                    subtitle: {
                      raw: "When you\u2019re synced up, Firefox encrypts your passwords, bookmarks, and more. Plus you can grab tabs from your other devices.",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-mobilecrosspromo.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    hero_image: {
                      url: "chrome://activity-stream/content/data/content/assets/mobile-download-qr-new-user.svg",
                    },
                    progress_bar: true,
                    cta_paragraph: {
                      text: {
                        string_id: "mr2022-onboarding-mobile-download-cta-text",
                        string_name: "download-label",
                      },
                      action: {
                        data: {
                          args: "https://www.mozilla.org/firefox/mobile/get-app/?utm_medium=firefox-desktop&utm_source=onboarding-modal&utm_campaign=mr2022&utm_content=new-global",
                          where: "tab",
                        },
                        type: "OPEN_URL",
                      },
                    },
                    image_alt_text: {
                      string_id: "mr2022-onboarding-mobile-download-image-alt",
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-160px",
                  },
                  targeting: "!isFxASignedIn || sync.mobileDevices == 0",
                },
                {
                  id: "AW_ADDONS_PICKER",
                  content: {
                    logo: {},
                    tiles: {
                      data: [
                        {
                          id: "jid1-MnnxcxisBPnSXQ@jetpack",
                          icon: "https://addons.mozilla.org/user-media/addon_icons/506/506646-64.png?modified=mcrushed",
                          name: "Privacy Badger by EFD Technologists",
                          type: "extension",
                          action: {
                            data: {
                              url: "https://addons.mozilla.org/firefox/downloads/file/4129240/privacy_badger17-2023.6.23.xpi",
                              telemetrySource: "aboutwelcome-addon",
                            },
                            type: "INSTALL_ADDON_FROM_URL",
                          },
                          source_id: "ADD_EXTENSION_BUTTON_STAFF_1",
                          description:
                            "Automatically block invisible trackers.",
                          install_label: "Add to Firefox",
                        },
                        {
                          id: "enhancerforyoutube@maximerf.addons.mozilla.org",
                          icon: "https://addons.mozilla.org/user-media/addon_icons/700/700308-64.png?modified=4bc8e79f",
                          name: "Enhancer for YouTube by Maxine RF",
                          type: "extension",
                          action: {
                            data: {
                              url: "https://addons.mozilla.org/firefox/downloads/file/4134489/enhancer_for_youtube-2.0.119.1.xpi",
                              telemetrySource: "aboutwelcome-addon",
                            },
                            type: "INSTALL_ADDON_FROM_URL",
                          },
                          source_id: "ADD_EXTENSION_BUTTON_STAFF_2",
                          description:
                            "Manage ads, control playback speed, get keyboard shortcuts, and much more.",
                          install_label: "Add to Firefox",
                        },
                        {
                          id: "languagetool-webextension@languagetool.org",
                          icon: "https://addons.mozilla.org/user-media/addon_icons/708/708770-64.png?modified=4f881970",
                          name: "Grammar and Spell Checker by LanguageTooler",
                          type: "extension",
                          action: {
                            data: {
                              url: "https://addons.mozilla.org/firefox/downloads/file/4128570/languagetool-7.1.13.xpi",
                              telemetrySource: "aboutwelcome-addon",
                            },
                            type: "INSTALL_ADDON_FROM_URL",
                          },
                          source_id: "ADD_EXTENSION_BUTTON_STAFF_3",
                          description:
                            "Check for spelling and grammar problems anywhere on the web.",
                          install_label: "Add to Firefox",
                        },
                      ],
                      type: "addons-picker",
                    },
                    title: { raw: "Put your own spin on Firefox" },
                    position: "center",
                    subtitle: {
                      raw: "Extensions can make browsing faster, safer, or just plain fun. Find your favorites or try our top picks!",
                    },
                    progress_bar: true,
                    secondary_button: {
                      label: { raw: "Continue" },
                      style: "secondary",
                      action: { navigate: true },
                    },
                    additional_button: {
                      label: { raw: "Explore more extensions" },
                      style: "link",
                      action: {
                        data: {
                          args: "https://addons.mozilla.org",
                          where: "tab",
                        },
                        type: "OPEN_URL",
                      },
                    },
                  },
                },
                {
                  id: "AW_GRATITUDE",
                  content: {
                    logo: {},
                    title: { raw: "Firefox has your back" },
                    position: "split",
                    subtitle: {
                      raw: "Thank you for using Firefox, backed by the Mozilla Foundation. With your support, we're working to make the internet safer and more accessible for everyone.  ",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-gratitude.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-gratitude-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id: "mr2-onboarding-start-browsing-button-label",
                      },
                      action: { navigate: true },
                    },
                    split_narrow_bkg_position: "-228px",
                  },
                },
              ],
              transitions: true,
            },
            enabled: true,
            featureId: "aboutwelcome",
          },
        ],
      },
      {
        slug: "treatment-b",
        ratio: 1,
        feature: {
          value: {},
          enabled: false,
          featureId: "this-is-included-for-desktop-pre-95-support",
        },
        features: [
          {
            value: {
              id: "addon-recommendations-in-nuo:treatment-b",
              screens: [
                {
                  id: "AW_WELCOME_BACK",
                  content: {
                    logo: {},
                    title: { string_id: "onboarding-device-migration-title" },
                    position: "split",
                    subtitle: {
                      string_id: "onboarding-device-migration-subtitle",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/device-migration.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "onboarding-device-migration-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "onboarding-device-migration-primary-button-label",
                      },
                      action: {
                        data: {
                          entrypoint: "fx-device-migration-onboarding",
                          extraParams: {
                            utm_medium: "firefox-desktop",
                            utm_source: "fx-new-device-sync",
                            utm_content: "migration-onboarding",
                            utm_campaign: "migration",
                          },
                        },
                        type: "FXA_SIGNIN_FLOW",
                        navigate: "actionResult",
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-100px",
                  },
                  targeting: "isDeviceMigration",
                },
                {
                  id: "AW_EASY_SETUP",
                  content: {
                    logo: {},
                    tiles: {
                      data: [
                        {
                          id: "checkbox-1",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-set-default-checkbox-label",
                          },
                          action: { type: "SET_DEFAULT_BROWSER" },
                          defaultValue: true,
                        },
                        {
                          id: "checkbox-2",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-import-checkbox-label",
                          },
                          action: { data: {}, type: "SHOW_MIGRATION_WIZARD" },
                          defaultValue: true,
                        },
                      ],
                      type: "multiselect",
                    },
                    title: { raw: "We love keeping you safe" },
                    position: "split",
                    subtitle: {
                      raw: "Our non-profit backed browser helps stop companies from secretly following you around the web.",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-default-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-easy-setup-primary-button-label",
                      },
                      action: {
                        data: { actions: [] },
                        type: "MULTI_ACTION",
                        navigate: true,
                        collectSelect: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    secondary_button_top: {
                      label: {
                        string_id: "mr1-onboarding-sign-in-button-label",
                      },
                      action: {
                        data: {
                          where: "tab",
                          entrypoint: "activity-stream-firstrun",
                        },
                        type: "SHOW_FIREFOX_ACCOUNTS",
                        addFlowParams: true,
                      },
                    },
                    split_narrow_bkg_position: "-60px",
                  },
                  targeting:
                    "os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin && !useEmbeddedMigrationWizard",
                },
                {
                  id: "AW_EASY_SETUP_EMBEDDED",
                  content: {
                    logo: {},
                    tiles: {
                      data: [
                        {
                          id: "checkbox-1",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-set-default-checkbox-label",
                          },
                          action: { type: "SET_DEFAULT_BROWSER" },
                          defaultValue: true,
                        },
                        {
                          id: "checkbox-2",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-import-checkbox-label",
                          },
                          defaultValue: true,
                          checkedAction: {
                            data: {
                              actions: [
                                {
                                  data: {
                                    pref: {
                                      name: "showEmbeddedImport",
                                      value: true,
                                    },
                                  },
                                  type: "SET_PREF",
                                },
                              ],
                            },
                            type: "MULTI_ACTION",
                          },
                          uncheckedAction: {
                            data: {
                              actions: [
                                {
                                  data: {
                                    pref: { name: "showEmbeddedImport" },
                                  },
                                  type: "SET_PREF",
                                },
                              ],
                            },
                            type: "MULTI_ACTION",
                          },
                        },
                      ],
                      type: "multiselect",
                    },
                    title: { raw: "We love keeping you safe" },
                    position: "split",
                    subtitle: {
                      raw: "Our non-profit backed browser helps stop companies from secretly following you around the web.",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-default-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-easy-setup-primary-button-label",
                      },
                      action: {
                        data: { actions: [] },
                        type: "MULTI_ACTION",
                        navigate: true,
                        collectSelect: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    secondary_button_top: {
                      label: {
                        string_id: "mr1-onboarding-sign-in-button-label",
                      },
                      action: {
                        data: {
                          where: "tab",
                          entrypoint: "activity-stream-firstrun",
                        },
                        type: "SHOW_FIREFOX_ACCOUNTS",
                        addFlowParams: true,
                      },
                    },
                    split_narrow_bkg_position: "-60px",
                  },
                  targeting:
                    "os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin && useEmbeddedMigrationWizard",
                },
                {
                  id: "AW_PIN_FIREFOX",
                  content: {
                    logo: {},
                    title: {
                      string_id: "mr2022-onboarding-welcome-pin-header",
                    },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-onboarding-welcome-pin-subtitle",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-pintaskbar.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-pin-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id: "mr2022-onboarding-pin-primary-button-label",
                      },
                      action: {
                        type: "PIN_FIREFOX_TO_TASKBAR",
                        navigate: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    secondary_button_top: {
                      label: {
                        string_id: "mr1-onboarding-sign-in-button-label",
                      },
                      action: {
                        data: {
                          where: "tab",
                          entrypoint: "activity-stream-firstrun",
                        },
                        type: "SHOW_FIREFOX_ACCOUNTS",
                        addFlowParams: true,
                      },
                    },
                    split_narrow_bkg_position: "-155px",
                  },
                  targeting:
                    "!(os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin)",
                },
                {
                  id: "AW_LANGUAGE_MISMATCH",
                  content: {
                    logo: {},
                    title: {
                      string_id: "mr2022-onboarding-live-language-text",
                    },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-language-mismatch-subtitle",
                    },
                    hero_text: {
                      string_id: "mr2022-onboarding-live-language-text",
                      useLangPack: true,
                    },
                    background: "var(--mr-screen-background-color)",
                    progress_bar: true,
                    languageSwitcher: {
                      skip: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      cancel: {
                        string_id:
                          "onboarding-live-language-secondary-cancel-download",
                      },
                      switch: {
                        string_id: "mr2022-onboarding-live-language-switch-to",
                        useLangPack: true,
                      },
                      waiting: {
                        string_id: "onboarding-live-language-waiting-button",
                      },
                      continue: {
                        string_id:
                          "mr2022-onboarding-live-language-continue-in",
                      },
                      downloading: {
                        string_id:
                          "onboarding-live-language-button-label-downloading",
                      },
                    },
                  },
                },
                {
                  id: "AW_SET_DEFAULT",
                  content: {
                    logo: {},
                    title: {
                      string_id: "mr2022-onboarding-set-default-title",
                    },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-onboarding-set-default-subtitle",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-default-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-set-default-primary-button-label",
                      },
                      action: { type: "SET_DEFAULT_BROWSER", navigate: true },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-60px",
                  },
                  targeting:
                    "!(os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin)",
                },
                {
                  id: "AW_IMPORT_SETTINGS",
                  content: {
                    logo: {},
                    title: { string_id: "mr2022-onboarding-import-header" },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-onboarding-import-subtitle",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-import.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-import-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-import-primary-button-label-no-attribution",
                      },
                      action: {
                        data: {},
                        type: "SHOW_MIGRATION_WIZARD",
                        navigate: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-42px",
                  },
                  targeting:
                    "!(os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin) && !useEmbeddedMigrationWizard",
                },
                {
                  id: "AW_IMPORT_SETTINGS_EMBEDDED",
                  content: {
                    tiles: { type: "migration-wizard" },
                    position: "split",
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-import.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    migrate_close: { action: { navigate: true } },
                    migrate_start: { action: {} },
                    image_alt_text: {
                      string_id: "mr2022-onboarding-import-image-alt",
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    hide_secondary_section: "responsive",
                    split_narrow_bkg_position: "-42px",
                  },
                  targeting:
                    '(!(os.windowsBuildNumber >= 15063 && !isDefaultBrowser && !doesAppNeedPin) || ("messaging-system-action.showEmbeddedImport" |preferenceValue == true) && useEmbeddedMigrationWizard',
                },
                {
                  id: "AW_MOBILE_DOWNLOAD",
                  content: {
                    logo: {},
                    title: {
                      raw: "Stay encrypted when you hop between devices",
                    },
                    position: "split",
                    subtitle: {
                      raw: "When you\u2019re synced up, Firefox encrypts your passwords, bookmarks, and more. Plus you can grab tabs from your other devices.",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-mobilecrosspromo.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    hero_image: {
                      url: "chrome://activity-stream/content/data/content/assets/mobile-download-qr-new-user.svg",
                    },
                    progress_bar: true,
                    cta_paragraph: {
                      text: {
                        string_id: "mr2022-onboarding-mobile-download-cta-text",
                        string_name: "download-label",
                      },
                      action: {
                        data: {
                          args: "https://www.mozilla.org/firefox/mobile/get-app/?utm_medium=firefox-desktop&utm_source=onboarding-modal&utm_campaign=mr2022&utm_content=new-global",
                          where: "tab",
                        },
                        type: "OPEN_URL",
                      },
                    },
                    image_alt_text: {
                      string_id: "mr2022-onboarding-mobile-download-image-alt",
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-160px",
                  },
                  targeting: "!isFxASignedIn || sync.mobileDevices == 0",
                },
                {
                  id: "AW_ADDONS_PICKER",
                  content: {
                    logo: {},
                    tiles: {
                      data: [
                        {
                          id: "jid1-MnnxcxisBPnSXQ@jetpack",
                          icon: "https://addons.mozilla.org/user-media/addon_icons/506/506646-64.png?modified=mcrushed",
                          name: "Privacy Badger by EFD Technologists",
                          type: "extension",
                          action: {
                            data: {
                              url: "https://addons.mozilla.org/firefox/downloads/file/4129240/privacy_badger17-2023.6.23.xpi",
                              telemetrySource: "aboutwelcome-addon",
                            },
                            type: "INSTALL_ADDON_FROM_URL",
                          },
                          source_id: "ADD_EXTENSION_BUTTON_PRIVACY_1",
                          description:
                            "Automatically block invisible trackers.",
                          install_label: "Add to Firefox",
                        },
                        {
                          id: "CookieAutoDelete@kennydo.com",
                          icon: "https://addons.mozilla.org/user-media/addon_icons/784/784287-64.png?modified=mcrushed",
                          name: "Cookie Auto-Delete by CAD Team",
                          type: "extension",
                          action: {
                            data: {
                              url: "https://addons.mozilla.org/firefox/downloads/file/4040738/cookie_autodelete-3.8.2.xpi",
                              telemetrySource: "aboutwelcome-addon",
                            },
                            type: "INSTALL_ADDON_FROM_URL",
                          },
                          source_id: "ADD_EXTENSION_BUTTON_PRIVACY_2",
                          description:
                            "Automatically delete unwanted cookies when you close a tab.",
                          install_label: "Add to Firefox",
                        },
                        {
                          id: "@contain-facebook",
                          icon: "https://addons.mozilla.org/user-media/addon_icons/954/954390-64.png?modified=97d4c956",
                          name: "Facebook Container by Mozilla Firefox",
                          type: "extension",
                          action: {
                            data: {
                              url: "https://addons.mozilla.org/firefox/downloads/file/4141092/facebook_container-2.3.11.xpi",
                              telemetrySource: "aboutwelcome-addon",
                            },
                            type: "INSTALL_ADDON_FROM_URL",
                          },
                          source_id: "ADD_EXTENSION_BUTTON_PRIVACY_3",
                          description:
                            "Prevent Facebook from tracking you around the web.",
                          install_label: "Add to Firefox",
                        },
                      ],
                      type: "addons-picker",
                    },
                    title: { raw: "Give your privacy a boost" },
                    position: "center",
                    subtitle: {
                      raw: "Try our recommended extensions to add even more privacy and security to your browsing.",
                    },
                    progress_bar: true,
                    secondary_button: {
                      label: { raw: "Continue" },
                      style: "secondary",
                      action: { navigate: true },
                    },
                    additional_button: {
                      label: { raw: "Explore more extensions" },
                      style: "link",
                      action: {
                        data: {
                          args: "https://addons.mozilla.org",
                          where: "tab",
                        },
                        type: "OPEN_URL",
                      },
                    },
                  },
                },
                {
                  id: "AW_GRATITUDE",
                  content: {
                    logo: {},
                    title: { raw: "Firefox has your back" },
                    position: "split",
                    subtitle: {
                      raw: "Thank you for using Firefox, backed by the Mozilla Foundation. With your support, we're working to make the internet safer and more accessible for everyone.  ",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-gratitude.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-gratitude-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id: "mr2-onboarding-start-browsing-button-label",
                      },
                      action: { navigate: true },
                    },
                    split_narrow_bkg_position: "-228px",
                  },
                },
              ],
              transitions: true,
            },
            enabled: true,
            featureId: "aboutwelcome",
          },
        ],
      },
    ],
    outcomes: [],
    arguments: {},
    isRollout: false,
    probeSets: [],
    startDate: "2023-10-04",
    targeting:
      "(browserSettings.update.channel == \"release\") && ((experiment.slug in activeExperiments) || (((isFirstStartup && !('trailhead.firstrun.didSeeAboutWelcome'|preferenceValue)) && os.windowsBuildNumber >= 18362 && (currentDate|date - profileAgeCreated|date) / 3600000 <= 24 && !isDefaultBrowser && !doesAppNeedPin) && (version|versionCompare('118.!') >= 0) && (locale in ['en-CA', 'en-GB', 'en-US'])))",
    featureIds: ["aboutwelcome"],
    application: "firefox-desktop",
    bucketConfig: {
      count: 10000,
      start: 0,
      total: 10000,
      namespace: "firefox-desktop-aboutwelcome-release-43",
      randomizationUnit: "normandy_id",
    },
    localizations: null,
    schemaVersion: "1.12.0",
    userFacingName: "Addon Recommendations in NUO",
    referenceBranch: "control",
    proposedDuration: 49,
    enrollmentEndDate: "2023-10-25",
    isEnrollmentPaused: true,
    proposedEnrollment: 21,
    userFacingDescription:
      "Add-ons help users customize Firefox to their browser needs and habits, making for a more personalized browsing experience. This experiment adds a screen to onboarding that has a selection of add-ons that can be installed directly from the screen.",
    featureValidationOptOut: false,
    id: "addon-recommendations-in-nuo",
    last_modified: 1698098043464,
  },
};

// https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/nimbus-desktop-experiments/records/new-user-test-copy-about-privacy-speed-security-fx118-rollout
TEST.ROLLOUT = {
  permissions: {},
  data: {
    slug: "new-user-test-copy-about-privacy-speed-security-fx118-rollout",
    appId: "firefox-desktop",
    appName: "firefox_desktop",
    channel: "release",
    endDate: null,
    locales: ["en-GB", "en-CA", "en-US"],
    branches: [
      {
        slug: "control",
        ratio: 1,
        feature: {
          value: {},
          enabled: false,
          featureId: "this-is-included-for-desktop-pre-95-support",
        },
        features: [
          {
            value: {
              id: "new-user-test-copy-about-privacy-speed-security:rollout",
              screens: [
                {
                  id: "AW_WELCOME_BACK",
                  content: {
                    logo: {},
                    title: { string_id: "onboarding-device-migration-title" },
                    position: "split",
                    subtitle: {
                      string_id: "onboarding-device-migration-subtitle2",
                    },
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/device-migration.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "onboarding-device-migration-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "onboarding-device-migration-primary-button-label",
                      },
                      action: {
                        data: {
                          entrypoint: "fx-device-migration-onboarding",
                          extraParams: {
                            utm_medium: "firefox-desktop",
                            utm_source: "fx-new-device-sync",
                            utm_content: "migration-onboarding",
                            utm_campaign: "migration",
                          },
                        },
                        type: "FXA_SIGNIN_FLOW",
                        navigate: "actionResult",
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-100px",
                  },
                  targeting: "isDeviceMigration",
                },
                {
                  id: "AW_EASY_SETUP_EMBEDDED",
                  content: {
                    logo: {},
                    tiles: {
                      data: [
                        {
                          id: "checkbox-1",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-set-default-checkbox-label",
                          },
                          action: { type: "SET_DEFAULT_BROWSER" },
                          defaultValue: true,
                        },
                        {
                          id: "checkbox-2",
                          label: {
                            string_id:
                              "mr2022-onboarding-easy-setup-import-checkbox-label",
                          },
                          defaultValue: true,
                          checkedAction: {
                            data: {
                              actions: [
                                {
                                  data: {
                                    pref: {
                                      name: "showEmbeddedImport",
                                      value: true,
                                    },
                                  },
                                  type: "SET_PREF",
                                },
                              ],
                            },
                            type: "MULTI_ACTION",
                          },
                          uncheckedAction: {
                            data: {
                              actions: [
                                {
                                  data: {
                                    pref: { name: "showEmbeddedImport" },
                                  },
                                  type: "SET_PREF",
                                },
                              ],
                            },
                            type: "MULTI_ACTION",
                          },
                        },
                      ],
                      type: "multiselect",
                    },
                    title: "We love keeping you safe",
                    position: "split",
                    subtitle:
                      "Our non-profit backed browser helps stop companies from secretly following you around the web.",
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-default-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-easy-setup-primary-button-label",
                      },
                      action: {
                        data: { actions: [] },
                        type: "MULTI_ACTION",
                        navigate: true,
                        collectSelect: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    secondary_button_top: {
                      label: {
                        string_id: "mr1-onboarding-sign-in-button-label",
                      },
                      action: {
                        data: {
                          where: "tab",
                          entrypoint: "activity-stream-firstrun",
                        },
                        type: "SHOW_FIREFOX_ACCOUNTS",
                        addFlowParams: true,
                      },
                    },
                    split_narrow_bkg_position: "-60px",
                  },
                },
                {
                  id: "AW_LANGUAGE_MISMATCH",
                  content: {
                    logo: {},
                    title: {
                      string_id: "mr2022-onboarding-live-language-text",
                    },
                    position: "split",
                    subtitle: {
                      string_id: "mr2022-language-mismatch-subtitle",
                    },
                    hero_text: {
                      string_id: "mr2022-onboarding-live-language-text",
                      useLangPack: true,
                    },
                    background: "var(--mr-screen-background-color)",
                    progress_bar: true,
                    languageSwitcher: {
                      skip: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      cancel: {
                        string_id:
                          "onboarding-live-language-secondary-cancel-download",
                      },
                      switch: {
                        string_id: "mr2022-onboarding-live-language-switch-to",
                        useLangPack: true,
                      },
                      waiting: {
                        string_id: "onboarding-live-language-waiting-button",
                      },
                      continue: {
                        string_id:
                          "mr2022-onboarding-live-language-continue-in",
                      },
                      downloading: {
                        string_id:
                          "onboarding-live-language-button-label-downloading",
                      },
                    },
                  },
                },
                {
                  id: "AW_IMPORT_SETTINGS_EMBEDDED",
                  content: {
                    tiles: { type: "migration-wizard" },
                    position: "split",
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-import.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    migrate_close: { action: { navigate: true } },
                    migrate_start: { action: {} },
                    image_alt_text: {
                      string_id: "mr2022-onboarding-import-image-alt",
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-42px",
                  },
                  targeting:
                    '("messaging-system-action.showEmbeddedImport" |preferenceValue == true)',
                },
                {
                  id: "AW_MOBILE_DOWNLOAD",
                  content: {
                    logo: {},
                    title: "Stay encrypted when you hop between devices",
                    position: "split",
                    subtitle:
                      "When you\u2019re synced up, you\u2019re safer. Firefox encrypts your passwords, bookmarks, and more. Plus you can grab tabs from your other devices.",
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-mobilecrosspromo.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    hero_image: {
                      url: "chrome://activity-stream/content/data/content/assets/mobile-download-qr-new-user.svg",
                    },
                    progress_bar: true,
                    cta_paragraph: {
                      text: {
                        string_id: "mr2022-onboarding-mobile-download-cta-text",
                        string_name: "download-label",
                      },
                      action: {
                        data: {
                          args: "https://www.mozilla.org/firefox/mobile/get-app/?utm_medium=firefox-desktop&utm_source=onboarding-modal&utm_campaign=mr2022&utm_content=new-global",
                          where: "tab",
                        },
                        type: "OPEN_URL",
                      },
                    },
                    image_alt_text: {
                      string_id: "mr2022-onboarding-mobile-download-image-alt",
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                      has_arrow_icon: true,
                    },
                    split_narrow_bkg_position: "-160px",
                  },
                  targeting: "!isFxASignedIn || sync.mobileDevices == 0",
                },
                {
                  id: "AW_AMO_INTRODUCE",
                  content: {
                    logo: {},
                    title: "Personalize your Firefox",
                    position: "split",
                    subtitle:
                      "Add-ons are tiny apps that run in Firefox and level up the way you browse \u2014 from ultimate privacy and safety to changing how Firefox looks and behaves.",
                    background:
                      "url('https://firefox-settings-attachments.cdn.mozilla.net/main-workspace/ms-images/74f06853-c80d-4afc-9b2f-644415c35311.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    primary_button: {
                      label: "Explore staff-recommended add-ons",
                      action: {
                        data: {
                          args: "https://addons.mozilla.org/en-US/firefox/collections/4757633/25c2b44583534b3fa8fea977c419cd/?page=1&collection_sort=-added",
                          where: "tabshifted",
                        },
                        type: "OPEN_URL",
                        navigate: true,
                      },
                    },
                    secondary_button: {
                      label: {
                        string_id:
                          "mr2022-onboarding-secondary-skip-button-label",
                      },
                      action: { navigate: true },
                    },
                    split_narrow_bkg_position: "-58px",
                  },
                },
                {
                  id: "AW_GRATITUDE",
                  content: {
                    logo: {},
                    title: "Firefox has your back",
                    position: "split",
                    subtitle:
                      "Thank you for using Firefox, backed by the Mozilla Foundation. With your support, we're working to make the internet safer and more accessible for everyone.",
                    background:
                      "url('chrome://activity-stream/content/data/content/assets/mr-gratitude.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
                    progress_bar: true,
                    image_alt_text: {
                      string_id: "mr2022-onboarding-gratitude-image-alt",
                    },
                    primary_button: {
                      label: {
                        string_id: "mr2-onboarding-start-browsing-button-label",
                      },
                      action: { navigate: true },
                    },
                    split_narrow_bkg_position: "-228px",
                  },
                },
              ],
            },
            enabled: true,
            featureId: "aboutwelcome",
          },
        ],
      },
    ],
    outcomes: [],
    arguments: {},
    isRollout: true,
    probeSets: [],
    startDate: null,
    targeting:
      "(browserSettings.update.channel == \"release\") && (version|versionCompare('119.*') <= 0) && ((experiment.slug in activeRollouts) || (((isFirstStartup && !('trailhead.firstrun.didSeeAboutWelcome'|preferenceValue)) && os.windowsBuildNumber >= 18362 && (currentDate|date - profileAgeCreated|date) / 3600000 <= 24 && !isDefaultBrowser && !doesAppNeedPin) && (version|versionCompare('118.!') >= 0) && (locale in ['en-CA', 'en-GB', 'en-US'])))",
    featureIds: ["aboutwelcome"],
    application: "firefox-desktop",
    bucketConfig: {
      count: 10000,
      start: 0,
      total: 10000,
      namespace:
        "firefox-desktop-aboutwelcome-release-first_run_new_profile_need_default_has_pin-rollout-2",
      randomizationUnit: "normandy_id",
    },
    localizations: null,
    schemaVersion: "1.12.0",
    userFacingName:
      "New User: Test Copy about Privacy, Speed, Security Fx118 - Rollout",
    referenceBranch: "control",
    proposedDuration: 49,
    enrollmentEndDate: null,
    isEnrollmentPaused: false,
    proposedEnrollment: 21,
    userFacingDescription:
      "This rollout introduces copy focused on privacy, speed and security as well as addons picker screens during new user onboarding flow",
    featureValidationOptOut: false,
    id: "new-user-test-copy-about-privacy-speed-security-fx118-rollout",
    last_modified: 1697039457030,
  },
};

// https://searchfox.org/mozilla-central/rev/e94bcd536a2a4caad0597d1b2d624342e6a389c4/browser/components/newtab/aboutwelcome/AboutWelcomeChild.sys.mjs#336
TEST.MESSAGE = {
  id: "FAKESPOT_OPTIN_DEFAULT",
  template: "multistage",
  backdrop: "transparent",
  aria_role: "alert",
  UTMTerm: "opt-in",
  tags: ["shopping"],
  screens: [
    {
      id: "FS_OPT_IN",
      content: {
        position: "split",
        title: { string_id: "shopping-onboarding-headline" },
        subtitle: { string_id: "" },
        above_button_content: [
          {
            type: "text",
            text: {
              string_id: "shopping-onboarding-body",
            },
            link_keys: ["learn_more"],
          },
          {
            type: "image",
            url: "chrome://browser/content/shopping/assets/optInLight.avif",
            darkModeImageURL:
              "chrome://browser/content/shopping/assets/optInDark.avif",
            height: "172px",
            marginInline: "24px",
          },
          {
            type: "text",
            text: {
              string_id:
                "shopping-onboarding-opt-in-privacy-policy-and-terms-of-use2",
            },
            link_keys: ["privacy_policy", "terms_of_use"],
            font_styles: "legal",
          },
        ],
        learn_more: {
          action: {
            type: "OPEN_URL",
            data: {
              args: "https://support.mozilla.org/1/firefox/%VERSION%/%OS%/%LOCALE%/review-checker-review-quality?utm_source=review-checker&utm_campaign=learn-more&utm_medium=in-product",
              where: "tab",
            },
          },
        },
        privacy_policy: {
          action: {
            type: "OPEN_URL",
            data: {
              args: "https://www.fakespot.com/privacy-policy?utm_source=review-checker&utm_campaign=privacy-policy&utm_medium=in-product",
              where: "tab",
            },
          },
        },
        terms_of_use: {
          action: {
            type: "OPEN_URL",
            data: {
              args: "https://www.fakespot.com/terms?utm_source=review-checker&utm_campaign=terms-of-use&utm_medium=in-product",
              where: "tab",
            },
          },
        },
        primary_button: {
          should_focus_button: true,
          label: { string_id: "shopping-onboarding-opt-in-button" },
          action: {
            type: "SET_PREF",
            data: {
              pref: {
                name: "browser.shopping.experience2023.optedIn",
                value: 1,
              },
            },
          },
        },
        additional_button: {
          label: {
            string_id: "shopping-onboarding-not-now-button",
          },
          style: "link",
          flow: "column",
          action: {
            type: "SET_PREF",
            data: {
              pref: {
                name: "browser.shopping.experience2023.active",
                value: false,
              },
            },
          },
        },
      },
    },
  ],
};

// https://searchfox.org/mozilla-central/rev/e94bcd536a2a4caad0597d1b2d624342e6a389c4/browser/components/newtab/aboutwelcome/AboutWelcomeChild.sys.mjs#438
TEST.SURVEY = {
  id: "SHOPPING_MICROSURVEY",
  template: "multistage",
  tags: ["shopping"],
  backdrop: "transparent",
  transitions: true,
  UTMTerm: "survey",
  screens: [
    {
      id: "SHOPPING_MICROSURVEY_SCREEN_1",
      above_button_steps_indicator: true,
      content: {
        position: "split",
        layout: "survey",
        steps_indicator: {
          string_id: "shopping-onboarding-welcome-steps-indicator-label",
        },
        title: {
          string_id: "shopping-survey-headline",
        },
        subtitle: {
          string_id: "shopping-survey-question-one",
        },
        primary_button: {
          label: {
            string_id: "shopping-survey-next-button-label",
            paddingBlock: "5px",
            marginBlock: "0 12px",
          },
          action: {
            type: "MULTI_ACTION",
            collectSelect: true,
            data: {
              actions: [],
            },
            navigate: true,
          },
          disabled: "hasActiveMultiSelect",
        },
        additional_button: {
          label: {
            string_id: "shopping-survey-terms-link",
          },
          style: "link",
          flow: "column",
          action: {
            type: "OPEN_URL",
            data: {
              args: "https://www.mozilla.org/about/legal/terms/mozilla/?utm_source=review-checker&utm_campaign=terms-of-use-screen-1&utm_medium=in-product",
              where: "tab",
            },
          },
        },
        dismiss_button: {
          action: {
            dismiss: true,
          },
          label: {
            string_id: "shopping-onboarding-dialog-close-button",
          },
        },
        tiles: {
          type: "multiselect",
          style: {
            flexDirection: "column",
            alignItems: "flex-start",
          },
          data: [
            {
              id: "radio-1",
              type: "radio",
              group: "radios",
              defaultValue: false,
              label: { string_id: "shopping-survey-q1-radio-1-label" },
            },
            {
              id: "radio-2",
              type: "radio",
              group: "radios",
              defaultValue: false,
              label: { string_id: "shopping-survey-q1-radio-2-label" },
            },
            {
              id: "radio-3",
              type: "radio",
              group: "radios",
              defaultValue: false,
              label: { string_id: "shopping-survey-q1-radio-3-label" },
            },
            {
              id: "radio-4",
              type: "radio",
              group: "radios",
              defaultValue: false,
              label: { string_id: "shopping-survey-q1-radio-4-label" },
            },
            {
              id: "radio-5",
              type: "radio",
              group: "radios",
              defaultValue: false,
              label: { string_id: "shopping-survey-q1-radio-5-label" },
            },
          ],
        },
      },
    },
    {
      id: "SHOPPING_MICROSURVEY_SCREEN_2",
      above_button_steps_indicator: true,
      content: {
        position: "split",
        layout: "survey",
        steps_indicator: {
          string_id: "shopping-onboarding-welcome-steps-indicator-label",
        },
        title: {
          string_id: "shopping-survey-headline",
        },
        subtitle: {
          string_id: "shopping-survey-question-two",
        },
        primary_button: {
          label: {
            string_id: "shopping-survey-submit-button-label",
            paddingBlock: "5px",
            marginBlock: "0 12px",
          },
          action: {
            type: "MULTI_ACTION",
            collectSelect: true,
            data: {
              actions: [],
            },
            navigate: true,
          },
          disabled: "hasActiveMultiSelect",
        },
        additional_button: {
          label: {
            string_id: "shopping-survey-terms-link",
          },
          style: "link",
          flow: "column",
          action: {
            type: "OPEN_URL",
            data: {
              args: "https://www.mozilla.org/about/legal/terms/mozilla/?utm_source=review-checker&utm_campaign=terms-of-use-screen-2&utm_medium=in-product",
              where: "tab",
            },
          },
        },
        dismiss_button: {
          action: {
            dismiss: true,
          },
          label: {
            string_id: "shopping-onboarding-dialog-close-button",
          },
        },
        tiles: {
          type: "multiselect",
          style: {
            flexDirection: "column",
            alignItems: "flex-start",
          },
          data: [
            {
              id: "radio-1",
              type: "radio",
              group: "radios",
              defaultValue: false,
              label: { string_id: "shopping-survey-q2-radio-1-label" },
            },
            {
              id: "radio-2",
              type: "radio",
              group: "radios",
              defaultValue: false,
              label: { string_id: "shopping-survey-q2-radio-2-label" },
            },
            {
              id: "radio-3",
              type: "radio",
              group: "radios",
              defaultValue: false,
              label: { string_id: "shopping-survey-q2-radio-3-label" },
            },
          ],
        },
      },
    },
  ],
};

// import Image from 'next/image'

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
//         <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//           Get started by editing&nbsp;
//           <code className="font-mono font-bold">app/page.tsx</code>
//         </p>
//         <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
//           <a
//             className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
//             href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             By{' '}
//             <Image
//               src="/vercel.svg"
//               alt="Vercel Logo"
//               className="dark:invert"
//               width={100}
//               height={24}
//               priority
//             />
//           </a>
//         </div>
//       </div>

//       <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
//         <Image
//           className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={180}
//           height={37}
//           priority
//         />
//       </div>

//       <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
//         <a
//           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Docs{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Find in-depth information about Next.js features and API.
//           </p>
//         </a>

//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Learn{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Learn about Next.js in an interactive course with&nbsp;quizzes!
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Templates{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Explore starter templates for Next.js.
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Deploy{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Instantly deploy your Next.js site to a shareable URL with Vercel.
//           </p>
//         </a>
//       </div>
//     </main>
//   )
// }
