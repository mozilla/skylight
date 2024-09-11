const fs = require("fs");

// NOTE: Add release versions here for all the JSON data
// that is available in `asrouter-local-prod-messages`
let availableReleases = [130, 129, 128, 127, 126, 125, 124, 123];

// Sort availableReleases in descending order
// XXX This will need to be revisited if/once we add dot-versions
availableReleases.sort(function (a, b) {
  return b - a;
});
console.log(availableReleases);

const manualMessages = [
  {
    id: "MR_WELCOME_DEFAULT",
    template: "defaultaboutwelcome",
    transitions: true,
    backdrop:
      "var(--mr-welcome-background-color) var(--mr-welcome-background-gradient)",
    screens: [
      {
        id: "AW_WELCOME_BACK",
        targeting: "isDeviceMigration",
        content: {
          position: "split",
          split_narrow_bkg_position: "-100px",
          image_alt_text: {
            string_id: "onboarding-device-migration-image-alt",
          },
          background:
            "url('chrome://activity-stream/content/data/content/assets/device-migration.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
          progress_bar: true,
          logo: {},
          title: { string_id: "onboarding-device-migration-title" },
          subtitle: { string_id: "onboarding-device-migration-subtitle2" },
          primary_button: {
            label: {
              string_id: "onboarding-device-migration-primary-button-label",
            },
            action: {
              type: "FXA_SIGNIN_FLOW",
              navigate: "actionResult",
              data: {
                entrypoint: "fx-device-migration-onboarding",
                extraParams: {
                  utm_content: "migration-onboarding",
                  utm_source: "fx-new-device-sync",
                  utm_medium: "firefox-desktop",
                  utm_campaign: "migration",
                },
              },
            },
          },
          secondary_button: {
            label: {
              string_id: "mr2022-onboarding-secondary-skip-button-label",
            },
            action: { navigate: true },
            has_arrow_icon: true,
          },
        },
      },
      {
        id: "AW_EASY_SETUP_NEEDS_DEFAULT_AND_PIN",
        targeting:
          "doesAppNeedPin && 'browser.shell.checkDefaultBrowser'|preferenceValue && !isDefaultBrowser",
        content: {
          position: "split",
          split_narrow_bkg_position: "-60px",
          image_alt_text: {
            string_id: "mr2022-onboarding-default-image-alt",
          },
          background:
            "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
          progress_bar: true,
          hide_secondary_section: "responsive",
          logo: {},
          title: {
            string_id: "onboarding-easy-setup-security-and-privacy-title",
          },
          subtitle: {
            string_id: "onboarding-easy-setup-security-and-privacy-subtitle",
          },
          tiles: {
            type: "multiselect",
            data: [
              {
                id: "checkbox-1",
                defaultValue: true,
                label: {
                  string_id: "mr2022-onboarding-pin-primary-button-label",
                },
                action: { type: "PIN_FIREFOX_TO_TASKBAR" },
              },
              {
                id: "checkbox-2",
                defaultValue: true,
                label: {
                  string_id:
                    "mr2022-onboarding-easy-setup-set-default-checkbox-label",
                },
                action: { type: "SET_DEFAULT_BROWSER" },
              },
              {
                id: "checkbox-3",
                defaultValue: true,
                label: {
                  string_id:
                    "mr2022-onboarding-easy-setup-import-checkbox-label",
                },
                uncheckedAction: {
                  type: "MULTI_ACTION",
                  data: {
                    actions: [
                      {
                        type: "SET_PREF",
                        data: { pref: { name: "showEmbeddedImport" } },
                      },
                    ],
                  },
                },
                checkedAction: {
                  type: "MULTI_ACTION",
                  data: {
                    actions: [
                      {
                        type: "SET_PREF",
                        data: {
                          pref: {
                            name: "showEmbeddedImport",
                            value: true,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
          primary_button: {
            label: {
              string_id: "mr2022-onboarding-easy-setup-primary-button-label",
            },
            action: {
              type: "MULTI_ACTION",
              collectSelect: true,
              navigate: true,
              data: { actions: [] },
            },
          },
          secondary_button: {
            label: {
              string_id: "mr2022-onboarding-secondary-skip-button-label",
            },
            action: { navigate: true },
            has_arrow_icon: true,
          },
          secondary_button_top: {
            label: { string_id: "mr1-onboarding-sign-in-button-label" },
            action: {
              data: {
                entrypoint: "activity-stream-firstrun",
                where: "tab",
              },
              type: "SHOW_FIREFOX_ACCOUNTS",
              addFlowParams: true,
            },
          },
        },
      },
      {
        id: "AW_EASY_SETUP_NEEDS_DEFAULT",
        targeting:
          "!doesAppNeedPin && 'browser.shell.checkDefaultBrowser'|preferenceValue && !isDefaultBrowser",
        content: {
          position: "split",
          split_narrow_bkg_position: "-60px",
          image_alt_text: {
            string_id: "mr2022-onboarding-default-image-alt",
          },
          background:
            "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
          progress_bar: true,
          logo: {},
          title: {
            string_id: "onboarding-easy-setup-security-and-privacy-title",
          },
          subtitle: {
            string_id: "onboarding-easy-setup-security-and-privacy-subtitle",
          },
          tiles: {
            type: "multiselect",
            data: [
              {
                id: "checkbox-1",
                defaultValue: true,
                label: {
                  string_id:
                    "mr2022-onboarding-easy-setup-set-default-checkbox-label",
                },
                action: { type: "SET_DEFAULT_BROWSER" },
              },
              {
                id: "checkbox-2",
                defaultValue: true,
                label: {
                  string_id:
                    "mr2022-onboarding-easy-setup-import-checkbox-label",
                },
                uncheckedAction: {
                  type: "MULTI_ACTION",
                  data: {
                    actions: [
                      {
                        type: "SET_PREF",
                        data: { pref: { name: "showEmbeddedImport" } },
                      },
                    ],
                  },
                },
                checkedAction: {
                  type: "MULTI_ACTION",
                  data: {
                    actions: [
                      {
                        type: "SET_PREF",
                        data: {
                          pref: {
                            name: "showEmbeddedImport",
                            value: true,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
          primary_button: {
            label: {
              string_id: "mr2022-onboarding-easy-setup-primary-button-label",
            },
            action: {
              type: "MULTI_ACTION",
              collectSelect: true,
              navigate: true,
              data: { actions: [] },
            },
          },
          secondary_button: {
            label: {
              string_id: "mr2022-onboarding-secondary-skip-button-label",
            },
            action: { navigate: true },
            has_arrow_icon: true,
          },
          secondary_button_top: {
            label: { string_id: "mr1-onboarding-sign-in-button-label" },
            action: {
              data: {
                entrypoint: "activity-stream-firstrun",
                where: "tab",
              },
              type: "SHOW_FIREFOX_ACCOUNTS",
              addFlowParams: true,
            },
          },
        },
      },
      {
        id: "AW_EASY_SETUP_NEEDS_PIN",
        targeting:
          "doesAppNeedPin && (!'browser.shell.checkDefaultBrowser'|preferenceValue || isDefaultBrowser)",
        content: {
          position: "split",
          split_narrow_bkg_position: "-60px",
          image_alt_text: {
            string_id: "mr2022-onboarding-default-image-alt",
          },
          background:
            "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
          progress_bar: true,
          logo: {},
          title: {
            string_id: "onboarding-easy-setup-security-and-privacy-title",
          },
          subtitle: {
            string_id: "onboarding-easy-setup-security-and-privacy-subtitle",
          },
          tiles: {
            type: "multiselect",
            data: [
              {
                id: "checkbox-1",
                defaultValue: true,
                label: {
                  string_id: "mr2022-onboarding-pin-primary-button-label",
                },
                action: { type: "PIN_FIREFOX_TO_TASKBAR" },
              },
              {
                id: "checkbox-2",
                defaultValue: true,
                label: {
                  string_id:
                    "mr2022-onboarding-easy-setup-import-checkbox-label",
                },
                uncheckedAction: {
                  type: "MULTI_ACTION",
                  data: {
                    actions: [
                      {
                        type: "SET_PREF",
                        data: { pref: { name: "showEmbeddedImport" } },
                      },
                    ],
                  },
                },
                checkedAction: {
                  type: "MULTI_ACTION",
                  data: {
                    actions: [
                      {
                        type: "SET_PREF",
                        data: {
                          pref: {
                            name: "showEmbeddedImport",
                            value: true,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
          primary_button: {
            label: {
              string_id: "mr2022-onboarding-easy-setup-primary-button-label",
            },
            action: {
              type: "MULTI_ACTION",
              collectSelect: true,
              navigate: true,
              data: { actions: [] },
            },
          },
          secondary_button: {
            label: {
              string_id: "mr2022-onboarding-secondary-skip-button-label",
            },
            action: { navigate: true },
            has_arrow_icon: true,
          },
          secondary_button_top: {
            label: { string_id: "mr1-onboarding-sign-in-button-label" },
            action: {
              data: {
                entrypoint: "activity-stream-firstrun",
                where: "tab",
              },
              type: "SHOW_FIREFOX_ACCOUNTS",
              addFlowParams: true,
            },
          },
        },
      },
      {
        id: "AW_EASY_SETUP_ONLY_IMPORT",
        targeting:
          "!doesAppNeedPin && (!'browser.shell.checkDefaultBrowser'|preferenceValue || isDefaultBrowser)",
        content: {
          position: "split",
          split_narrow_bkg_position: "-60px",
          image_alt_text: {
            string_id: "mr2022-onboarding-default-image-alt",
          },
          background:
            "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
          progress_bar: true,
          logo: {},
          title: {
            string_id: "onboarding-easy-setup-security-and-privacy-title",
          },
          subtitle: {
            string_id: "onboarding-easy-setup-security-and-privacy-subtitle",
          },
          tiles: {
            type: "multiselect",
            data: [
              {
                id: "checkbox-1",
                defaultValue: true,
                label: {
                  string_id:
                    "mr2022-onboarding-easy-setup-import-checkbox-label",
                },
                uncheckedAction: {
                  type: "MULTI_ACTION",
                  data: {
                    actions: [
                      {
                        type: "SET_PREF",
                        data: { pref: { name: "showEmbeddedImport" } },
                      },
                    ],
                  },
                },
                checkedAction: {
                  type: "MULTI_ACTION",
                  data: {
                    actions: [
                      {
                        type: "SET_PREF",
                        data: {
                          pref: {
                            name: "showEmbeddedImport",
                            value: true,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
          primary_button: {
            label: {
              string_id: "mr2022-onboarding-easy-setup-primary-button-label",
            },
            action: {
              type: "MULTI_ACTION",
              collectSelect: true,
              navigate: true,
              data: { actions: [] },
            },
          },
          secondary_button: {
            label: {
              string_id: "mr2022-onboarding-secondary-skip-button-label",
            },
            action: { navigate: true },
            has_arrow_icon: true,
          },
          secondary_button_top: {
            label: { string_id: "mr1-onboarding-sign-in-button-label" },
            action: {
              data: {
                entrypoint: "activity-stream-firstrun",
                where: "tab",
              },
              type: "SHOW_FIREFOX_ACCOUNTS",
              addFlowParams: true,
            },
          },
        },
      },
      {
        id: "AW_LANGUAGE_MISMATCH",
        content: {
          position: "split",
          background: "var(--mr-screen-background-color)",
          progress_bar: true,
          logo: {},
          title: { string_id: "mr2022-onboarding-live-language-text" },
          subtitle: { string_id: "mr2022-language-mismatch-subtitle" },
          hero_text: {
            string_id: "mr2022-onboarding-live-language-text",
            useLangPack: true,
          },
          languageSwitcher: {
            downloading: {
              string_id: "onboarding-live-language-button-label-downloading",
            },
            cancel: {
              string_id: "onboarding-live-language-secondary-cancel-download",
            },
            waiting: {
              string_id: "onboarding-live-language-waiting-button",
            },
            skip: {
              string_id: "mr2022-onboarding-secondary-skip-button-label",
            },
            action: { navigate: true },
            switch: {
              string_id: "mr2022-onboarding-live-language-switch-to",
              useLangPack: true,
            },
            continue: {
              string_id: "mr2022-onboarding-live-language-continue-in",
            },
          },
        },
      },
      {
        id: "AW_IMPORT_SETTINGS_EMBEDDED",
        targeting:
          '("messaging-system-action.showEmbeddedImport" |preferenceValue == true) && useEmbeddedMigrationWizard',
        content: {
          tiles: { type: "migration-wizard" },
          position: "split",
          split_narrow_bkg_position: "-42px",
          image_alt_text: {
            string_id: "mr2022-onboarding-import-image-alt",
          },
          background:
            "url('chrome://activity-stream/content/data/content/assets/mr-import.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
          progress_bar: true,
          hide_secondary_section: "responsive",
          migrate_start: { action: {} },
          migrate_close: { action: { navigate: true } },
          secondary_button: {
            label: {
              string_id: "mr2022-onboarding-secondary-skip-button-label",
            },
            action: { navigate: true },
            has_arrow_icon: true,
          },
        },
      },
      {
        id: "AW_MOBILE_DOWNLOAD",
        targeting: "!isFxASignedIn || sync.mobileDevices == 0",
        content: {
          position: "split",
          split_narrow_bkg_position: "-160px",
          image_alt_text: {
            string_id: "mr2022-onboarding-mobile-download-image-alt",
          },
          background:
            "url('chrome://activity-stream/content/data/content/assets/mr-mobilecrosspromo.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
          progress_bar: true,
          logo: {},
          title: {
            string_id: "onboarding-mobile-download-security-and-privacy-title",
          },
          subtitle: {
            string_id:
              "onboarding-mobile-download-security-and-privacy-subtitle",
          },
          hero_image: {
            url: "chrome://activity-stream/content/data/content/assets/mobile-download-qr-new-user.svg",
          },
          cta_paragraph: {
            text: {
              string_id: "mr2022-onboarding-mobile-download-cta-text",
              string_name: "download-label",
            },
            action: {
              type: "OPEN_URL",
              data: {
                args: "https://www.mozilla.org/firefox/mobile/get-app/?utm_medium=firefox-desktop&utm_source=onboarding-modal&utm_campaign=mr2022&utm_content=new-global",
                where: "tab",
              },
            },
          },
          secondary_button: {
            label: {
              string_id: "mr2022-onboarding-secondary-skip-button-label",
            },
            action: { navigate: true },
            has_arrow_icon: true,
          },
        },
      },
      {
        id: "AW_AMO_INTRODUCE",
        targeting: "localeLanguageCode == 'en'",
        content: {
          position: "split",
          split_narrow_bkg_position: "-58px",
          background:
            "url('chrome://activity-stream/content/data/content/assets/mr-amo-collection.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
          progress_bar: true,
          logo: {},
          title: { string_id: "amo-screen-title" },
          subtitle: { string_id: "amo-screen-subtitle" },
          primary_button: {
            label: { string_id: "amo-screen-primary-cta" },
            action: {
              type: "OPEN_URL",
              data: {
                args: "https://addons.mozilla.org/en-US/firefox/collections/4757633/25c2b44583534b3fa8fea977c419cd/?page=1&collection_sort=-added",
                where: "tabshifted",
              },
              navigate: true,
            },
          },
          secondary_button: {
            label: {
              string_id: "mr2022-onboarding-secondary-skip-button-label",
            },
            action: { navigate: true },
          },
        },
      },
      {
        id: "AW_GRATITUDE",
        content: {
          position: "split",
          split_narrow_bkg_position: "-228px",
          image_alt_text: {
            string_id: "mr2022-onboarding-gratitude-image-alt",
          },
          background:
            "url('chrome://activity-stream/content/data/content/assets/mr-gratitude.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
          progress_bar: true,
          logo: {},
          title: {
            string_id: "onboarding-gratitude-security-and-privacy-title",
          },
          subtitle: {
            string_id: "onboarding-gratitude-security-and-privacy-subtitle",
          },
          primary_button: {
            label: {
              string_id: "mr2-onboarding-start-browsing-button-label",
            },
            action: { navigate: true },
          },
        },
      },
    ],
  },
];

// Overwriting data.json with manual messages we need to add
// to ensure we get the latest released version data first
fs.writeFileSync(
  "lib/asrouter-local-prod-messages/data.json",
  JSON.stringify(manualMessages),
);

availableReleases.map((release) => {
  // Existing message data
  let result = fs.readFileSync(
    "lib/asrouter-local-prod-messages/data.json",
    "utf8",
  );
  let json_result = JSON.parse(result);

  // Release message data
  let data = fs.readFileSync(
    `lib/asrouter-local-prod-messages/${release.toString()}-release.json`,
    "utf8",
  );
  let json_data = JSON.parse(data);

  // Add any message data with an id that does not already exist in data.json
  for (let i = 0; i < json_data.length; i++) {
    if (!json_result.find((x) => x.id === json_data[i].id)) {
      json_result.push(json_data[i]);
    }
  }

  fs.writeFileSync(
    "lib/asrouter-local-prod-messages/data.json",
    JSON.stringify(json_result),
  );
});
