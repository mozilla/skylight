# Contributing to Skylight Messaging System Interface

This documention is a work-in-progress that we'll be filling in as our best
practices solidify.

## Setting local environment variables

1. Copy the sample env file

   `cp .env.sample .env.local`

1. Modify variables in .env.local, e.g. uncommenting the `EXPERIMENTER_API_CALL`
   line will switch from the default of live experiments to preview experiments

## Running the development server

```bash
npm run dev
```

## Enabling Auth0 locally

Local development currently has Auth0 turned off, via the `IS_AUTH_ENABLED` env var.
It’s possible to enable Auth0 locally (if desired) for testing, by setting `IS_AUTH_ENABLED` to true &&
setting the correct Auth0 values in `.env.local`.

To test Auth0 locally, start with these steps:

1. Create an account at https://auth0.com/ by clicking the "Login" button and following the prompts
2. Open the Applications section in the sidebar
3. Create a new app and add the correct properties to `.env.local`:

### Auth0 properties

#### A long, secret value used to encrypt the session cookie (use `openssl rand -hex 32` to generate a 32 byte value)

```
AUTH0_SECRET='LONG_RANDOM_VALUE'
```

#### The base url of the application

```
AUTH0_BASE_URL='http://localhost:3000'
```

#### The url of the Auth0 tenant domain

```
AUTH0_ISSUER_BASE_URL='AUTH0_TENANT_URL'
```

#### The application's Client ID

```
AUTH0_CLIENT_ID='YOUR_AUTH0_CLIENT_ID'
```

#### The application's Client Secret

```
AUTH0_CLIENT_SECRET='YOUR_AUTH0_CLIENT_SECRET'
```

Within the Application URIs section of the Auth0 application Settings pane, set the following properties:

```
Application Login URI: https://fxms-skylight.netlify.app/api/auth/login

Allowed Callback URLs: http://localhost:3000/api/auth/callback

Allowed Logout URLs: http://localhost:3000
```

URLs need to be exact or Auth0 will throw errors, including the `http` protocol. If something isn't working, check for typos!
The Login URI must point at `https://fxms-skylight.netlify.app/api/auth/login`, Auth0 will not accept `http://` or `localhost` there.

4. Finally, create a test user in the Auth0 UI, (User Management > Users > Create User) and log in using the credentials you've created.

Documentation for Auth0 quickstart can be found at https://auth0.com/docs/quickstart/webapp/nextjs

## Enabling Looker locally

Local development by default has Looker disabled, via the `IS_LOOKER_ENABLED` env var. It’s possible to enable it locally for testing, by setting `IS_LOOKER_ENABLED` to true && setting the correct Looker SDK credentials in `.env.local` (see `.env.sample` for the variables).

Ask in #data-help on Slack to get Looker API credentials for your own Looker account to use in development.

## Using browser tests to pull live message data into Skylight

Skylight gets their live message data from asrouter in mozilla-central. For every new version in Release, we must be able to pull the live message data and commit it into Skylight by following these steps:

1. Ensure that you have Firefox built by following the steps [here for macOS](https://firefox-source-docs.mozilla.org/setup/macos_build.html) or [here for Windows](https://firefox-source-docs.mozilla.org/setup/windows_build.html).
2. In `mozilla-unified`, checkout to the release tag you want to pull data from.

   To fetch all the tags, run:

   ```
   git cinnabar fetch --tags
   ```

   To see what specific tags exist, you can use regex and run a command similar to:

   ```
   git tag -l | grep 'FIREFOX_12[0-9]_0_RELEASE' | less
   ```

   Here is an example to checkout to a specific release:

   ```
   git checkout FIREFOX_129_0_RELEASE
   ```

3. [This patch](https://phabricator.services.mozilla.com/D201646) contains a browser test that will pull the JSON data for live messages from asrouter. Apply the patch to the release.

   ```
   moz-phab patch --apply-to here D201646
   ```

   Run `git log` to verify that the HEAD is pointing to the patch that's been applied.

4. Clobber, build, and run the browser test using the following commands:

   ```
   ./mach clobber
   ./mach build
   ./mach test --headless browser/components/newtab/test/browser/browser_dump-provider-state.js
   ```

5. Assuming the test runs successfully, you will find the JSON output in `/tmp/file.json`. Commit the file into Skylight by moving the file to the appropriate location and renaming it in the format `{VERSION_NUM}-release.json`.

   ```bash
   # In Skylight
   cd lib/asrouter-local-prod-messages/
   mv /tmp/file.json ./{VERSION_NUM}-release.json
   ```

6. Run [`lib/mergeASRouterData.js`](/lib/mergeASRouterData.js) using node to merge all the release data into one file. Make sure you include the latest version number you've just collected data from into the `availableReleases` array inside the script.

## Pull Requests

Before submitting a pull request for review, please do at least these things:

- Update the [CHANGELOG.md](/CHANGELOG.md) file with a human-readable description of the change
  - Write primarily for an audience of the users of Skylight

## Code of Conduct

Please note that we have a [Code of Conduct](https://www.mozilla.org/en-US/about/governance/policies/participation/),
please follow it in all your interactions with the project.
