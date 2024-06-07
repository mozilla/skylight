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
3. create a new app and add the correct properties to `.env.local`:
  
Auth0 properties
# A long, secret value used to encrypt the session cookie 
# (use `openssl rand -hex 32` to generate a 32 byte value)
AUTH0_SECRET='LONG_RANDOM_VALUE'

# The base url of the application
AUTH0_BASE_URL='http://localhost:3000'

# The url of the Auth0 tenant domain
AUTH0_ISSUER_BASE_URL='AUTH0_TENANT_URL'

# The application's Client ID
AUTH0_CLIENT_ID='YOUR_AUTH0_CLIENT_ID'

# The application's Client Secret
AUTH0_CLIENT_SECRET='YOUR_AUTH0_CLIENT_SECRET'

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

## Enabling Looker Locally

Local development by default has Looker disabled, via the `IS_LOOKER_ENABLED` env var. It’s possible to enable Looker locally (if desired) for testing, by setting `IS_LOOKER_ENABLED` to true && setting the correct Looker SDK credentials in `.env.local`.

<!-- XXX link correct resource for devs to reach out to -->
Please reach out to Data Engineering to retrieve Looker SDK credentials if needed. 

## Pull Requests

Before submitting a pull request for review, please do at least these things:

* Update the [CHANGELOG.md](/CHANGELOG.md) file with a human-readable description of the change
  * Write primarily for an audience of the users of Skylight

## Code of Conduct

Please note that we have a [Code of Conduct](https://www.mozilla.org/en-US/about/governance/policies/participation/),
please follow it in all your interactions with the project.
