## Summary

Spiked with both BigQuery and Looker.  Ultimately, I went with Looker because it appeared more straightforward, and Looker is what we're linking to for more sophisicated dashboards and it appeared (initially) as though it would be easier to implement.

Ultimately, I suspect it's six of one/half dozen of the other, and we may end up switching to BigQuery at some point, but for now we've got something that basically works.

### Looker

* Set up credentials
  * Testing/Development: use developer API credentials
  * Production: service account

* Looker SDK
  * `npm install @looker/sdk`
  * Learning how to use it:
    * The docs contained in the [API Explorer](https://cloud.google.com/looker/docs/api-explorer) Looker app for the REST API itself are decent, as is the built in query-runnner. Looker developer privs are required.

    * The [TypeScript SDK docs](https://developers.looker.com/api/getting-started?language=typescript) are pretty minimal. I mostly depended on [the examples](https://github.com/looker-open-source/sdk-codegen/tree/main/examples) linked from the API Explorer app including unit tests. We've now got some example code in this branch too, of course.

  * The strategy here is to
    * get the dashboard for the surface we want (eg using the API Explorer)
    * In the code (`looker.ts`)
      * get the dashboard element 0 for the dashboard
      * clone the .query property
      * override the filters with the ones we want for the specific line in our dashboard
      * execute that and `await` the results
      * compute the CTR percentage from the expected properties in the results

* How do we really want this to fit into the code?  Not looker.ts, but...
  * lib/messageDashboard.ts
  * messageDashboard object: theory, we can have a single messageDashboard
    * object which both constructs Links (as we currently do in `messageUtils.getDashboard`) and runs queries against specific dashboards.  Likely simplest to use switch statements for the dashboard types at first; perhaps eventually one object per surface.
      * constructor/setter/getter
      * getLink
      * runQuery
  * execute and await queries in parallel using `thenables` and `Promise.all` or `Promise.allSettled` or something similar

* Risks
  * running the queries in parallel might have complexity issues (doesn't seem super high risk).
  * Dependency: Finish sorting out how to [get a limit privs service account](https://cloud.google.com/looker/docs/api-auth#authentication_with_an_sdk) for the web app to use the Looker API on our instance. I don't yet understand the model for constraining the privs for that account.
  * Dependency: add getting secrets from environment vars

### BigQuery

Played around with getting things set up, and then wrote a `test.js` script to make sure I could access the tables I needed.  Ultimately, if we were to move forward with this, we'd want a service account with access to just the columns of just the tables we need.

* Install google cloud SDK
* `npm install @google-cloud/bigquery`
* Review https://cloud.google.com/docs/authentication/provide-credentials-adc#local-dev
* `gcloud auth application-default login`
* Run test.js
