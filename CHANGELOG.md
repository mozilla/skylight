## Monday, October 28th, 2024

### Added

- Added a `postMessageToLimelight` function which uses the `window.postMessage` utility to open Limelight and send message JSON for editing
- Added a link to edit messages to Spotlights and Infobars in the production table
- Added a "Create a New Message" link to the navigation header, which links to the New Message page in Limelight

### Fixed

- Fixed a missing message ID in the local JSON, and added a function to safeguard similar errors

## Wednesday, October 23rd, 2024

### Added

- Added FxMS telemetry data from Looker (query can be found [here](https://mozilla.cloud.looker.com/looks/2162)) to the live message table

## Tuesday, October 15th, 2024

### Updated

- Updated the timeline component so that the pills link to appropriate tables

## Friday, September 27th, 2024

### Added

- Added a search bar in the Surface column to allow filtering by surfaces

## Thursday, September 26th, 2024

### Added

- Added default sorting by surface tags for the live message table
- Exposed dashboard links to completed rollouts and experiments

## Monday, September 16th, 2024

### Added

- Added a toggle option in the Metrics column to hide live messages with low impressions (ie. messages with less than 1000 impressions)
- Added a script to pull live message data from Firefox versions after 123 and to update the production table with those new messages

## Thursday, September 5th, 2024

### Fixed

- Updated the URL in the "Search Briefs" button to start a search in Google Drive for experiment briefs

## Friday, August 30th, 2024

### Added

- Added Microsurvey badges next to messages or experiments that have microsurveys

## Friday, August 16th, 2024

### Changed

- Updated the preview button tooltips to be more comprehensive

## Tuesday, August 6th, 2024

### Added

- Added a "Search Briefs" button in the header which links to a Google Drive with all past experiment/rollout briefs

### Changed

- Table headers and section timeline components are sticky

## Wednesday, July 24th, 2024

### Added

- A new route `/complete` is created to show all completed experiments and rollouts on a separate page. This new page can be accessed by the "See Completed Experiments" button in the header which changes to "See Live Experiments" on the `/complete` page.
- Impression data is displayed in the Metrics column when Looker is configured
- Surfaces are displayed in the Surface column using coloured tags for more readability
- Surface tags link to Experimenter docs with screenshots if available
- Timeline components are displayed below each table title section to clarify relationships between tables
- Enabled `whatsNewPage` features

### Changed

- CTR metrics are shown for the entire duration of experiments/rollout lengths
- Improved visibility for info and expand/collapse buttons by adding background colours
- Moved the "Help/Feedback" link to the Skylight slack channel outside of the Messaging Info menu for more visibility

### Internal

- Enabled Prettier for VSCode users and added a Prettier check in the CI
- Increased the static page generation timeout value

## Wednesday, July 10th, 2024

### Added

- Added info popover buttons to the Metrics column headers to give more context about the CTR values

## Tuesday, June 18th, 2024

### Added

- Display CTR percentages in the table when Looker is configured

## Thursday, June 13th, 2024

### Added

- Added an option to make experiment tables default to being fully expanded or collapsed

## Wednesday, June 12, 2024

### Added

- Enabled the preview button for Feature Callouts

### Fixed

- Fixed a bug where about:welcome previews were being generated for empty messages (those without a `screens` property)

## Friday, May 31st, 2024

### Added

- Added the AboutWelcomeDefaults message to the release table

## Monday, May 27th, 2024

### Added

- Added a label to the last column in the message and experiment tables with a info popover button that displays preview URL context when clicked

## Friday, May 24th, 2024

### Added

- Added a Messaging Info navigation menu to include links to key messaging resources
- Added a Help/Feedback button linking to the #skylight-messaging-system slack channel

## Tuesday, May 21st, 2024

### Changed

- Updated experiment names and branch descriptions to hyperlink to their recipe on Experimenter
- Removed Experimenter link from the right-most column

## Friday, May 17th, 2024

### Added

- Experiment rows now have toggle buttons that will expand/collapse all its branches
- The experiments table header now has a toggle button that will expand/collapse all of the experiments at once

### Internal

- SSO integration using the nextjs-auth0 package
- Middleware that conditionally loads the Auth0 wrapper based on an
  environment variable (true for prod environment and false for dev && preview)

## Thursday, May 16th, 2024

### Added

- Added Rollout messages and displayed them inside a new table
- Adding an Info icon tooltip with context to Released table

### Changed

- Update branch names to be human-readable
- Make table titles clearer
- Change "Screen 0" to "1st screen" for readability
- Removed currently information-free Topic column from Released table.

### Fixed

- Only link to branch screenshots that actually exist

### Internal

- Started pulling data from Experimenter instead of Remote Settings to
  get access to more data for the UI.
- Support for getting configurables from the environment in preparation for
  Auth0 and Looker integration.

## Wednesday, April 24th, 2024

### Added

- Support for getting configurables from the environment
- Added a sample .env file which can be copied for local development

## Monday, April 8th, 2024

### Added

- about:welcome dashboards turned on for experiments

### Fixed

- Fixed all about:welcome-based surface experiment dashboards
  incorrectly showing data for everything with the given message id
  instead of just the correct branch & experiment.

## Monday, April 1st, 2024

### Added

- Display about:welcome experiments (we now show all messaging experiments!)
- Add Previews for about:welcome experiments.
- Show total number of Live Messaging Experiments
- Show multi-feature messaging experiments

### Fixed

- Improve clarity of Production dashboard with wordsmithing and making the Looker dashboards only show release channel telemetry.

## Wednesday, March 13th, 2024

### Added

- Show Previews for infobar experiments
- Link to screenshots for messages without previews

### Changed

- Clarify visual hierarchy by indenting experiment branches

### Fixed

- Replace broken infobar dashboards with new ones that work
- Fix localized preview experiments

### Below the Fold

- Refactored much experimentation code into NimbusRecipe class

## Tuesday, February 20th, 2024

### Added

- Display basic experiments table

### Changed

- Make dashboard more skimmable
- Make experiment dates human-readable
- Show proposed experiment durations if there's no end date

### Fixed

- Stop linking to dashboards for unsupported surfaces
- Give buttons an active state for usability

## Tuesday, Jan 9th, 2024

### Added

- Stand up Production messages table
- Deploy on Netlify so others can use it
- Import Production messages from Firefox 123

## December, 2023

### Added

- Stand up Next.JS-based dashboard from imported hackathon code!

## November, 2023

### Added

- Prototyped a basic dashboard with engineers, product, & design during a one-day hackathon, orchestrated by Ed Lee (thanks Ed!)
