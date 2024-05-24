## Friday, May 24th, 2024

### Added

* Added a Messaging Info navigation menu to include links to key messaging resources

## Tuesday, May 21st, 2024

### Changed

* Updated experiment names and branch descriptions to hyperlink to their recipe on Experimenter
* Removed Experimenter link from the right-most column

## Friday, May 17th, 2024

### Added

* Experiment rows now have toggle buttons that will expand/collapse all its branches
* The experiments table header now has a toggle button that will expand/collapse all of the experiments at once

### Internal

* SSO integration using the nextjs-auth0 package
* Middleware that conditionally loads the Auth0 wrapper based on an
  environment variable (true for prod environment and false for dev && preview)

## Thursday, May 16th, 2024

### Added

* Added Rollout messages and displayed them inside a new table
* Adding an Info icon tooltip with context to Released table

### Changed

* Update branch names to be human-readable
* Make table titles clearer
* Change "Screen 0" to "1st screen" for readability
* Removed currently information-free Topic column from Released table.

### Fixed

* Only link to branch screenshots that actually exist

### Internal

* Started pulling data from Experimenter instead of Remote Settings to
  get access to more data for the UI.
* Support for getting configurables from the environment in preparation for
  Auth0 and Looker integration.

## Wednesday, April 24th, 2024

### Added

* Support for getting configurables from the environment
* Added a sample .env file which can be copied for local development

## Monday, April 8th, 2024

### Added

* about:welcome dashboards turned on for experiments

### Fixed

* Fixed all about:welcome-based surface experiment dashboards
  incorrectly showing data for everything with the given message id
  instead of just the correct branch & experiment.

## Monday, April 1st, 2024

### Added

* Display about:welcome experiments (we now show all messaging experiments!)
* Add Previews for about:welcome experiments.
* Show total number of Live Messaging Experiments
* Show multi-feature messaging experiments

### Fixed

* Improve clarity of Production dashboard with wordsmithing and making the Looker dashboards only show release channel telemetry.

## Wednesday, March 13th, 2024

### Added

* Show Previews for infobar experiments
* Link to screenshots for messages without previews

### Changed

* Clarify visual hierarchy by indenting experiment branches

### Fixed

* Replace broken infobar dashboards with new ones that work
* Fix localized preview experiments

### Below the Fold

* Refactored much experimentation code into NimbusRecipe class

## Tuesday, February 20th, 2024

### Added

* Display basic experiments table

### Changed

* Make dashboard more skimmable
* Make experiment dates human-readable
* Show proposed experiment durations if there's no end date

### Fixed

* Stop linking to dashboards for unsupported surfaces
* Give buttons an active state for usability

## Tuesday, Jan 9th, 2024

### Added

* Stand up Production messages table
* Deploy on Netlify so others can use it
* Import Production messages from Firefox 123

## December, 2023

### Added

* Stand up Next.JS-based dashboard from imported hackathon code!

## November, 2023

### Added

* Prototyped a basic dashboard with engineers, product, & design during a one-day hackathon, orchestrated by Ed Lee (thanks Ed!)
