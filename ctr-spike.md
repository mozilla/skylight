## Summary

Spiked with both BigQuery and Looker.  Ultimately, I went with Looker because it appeared more straightforward, and Looker is what we're linking to for more sophisicated dashboards and it appeared (initially) as though it would be easier to implement. 

Ultimately, I suspect it's six of one/half dozen of the other, and we may end up switching to BigQuery at some point, but for now we've got something that basically works.

### Looker

* Set up credentials
  * Testing/Development: use developer API credentials (may need to talk to AScholz to get those creds, and definitely will need to do do so to get Looker-side dev privs)
  * Production: service account

* Looker SDK
  * Learning how to use it:
    * The docs contained in the [API Explorer](https://cloud.google.com/looker/docs/api-explorer) Looker app for the REST API itself are decent, as is the built in query-runnner. Looker developer privs are required.

    * The [TypeScript SDK docs](https://developers.looker.com/api/getting-started?language=typescript) are pretty minimal. I mostly depended on [the examples](https://github.com/looker-open-source/sdk-codegen/tree/main/examples) pages linked from the API Explorer app including unit tests. We've now got some example code in this branch too, of course.

    * https://cloud.google.com/looker/docs/reference/looker-api/latest looks interesting as well

  * The strategy here is to
    * get the dashboard for the surface we want (eg using the API Explorer)
    * In the code (`looker.ts`)
      * get the dashboard element 0 for the dashboard
      * clone the .query property
      * override the filters with the ones we want for the specific line in our dashboard
      * execute that and `await` the results
      * compute the CTR percentage from the expected properties in the results

* How do we really want this to fit into the code?
  * Maybe just moving looker.ts to lib/lookerUtils.ts for now and objectify
    * later once our usage patterns become clearer.
  * Maybe create a lib/messageDashboiard.ts
    * messageDashboard object: have a single messageDashboard
      * object which both constructs Links (as we currently do in `messageUtils.getDashboard`) and runs queries against specific dashboards
      * constructor/setter/getter
      * getLink
      * runQuery
  * figure out how to execute and await queries in parallel using `thenables` and `Promise.all` or `Promise.allSettled` or something similar
  *

* Risks
  * speed
    * optimize/structure https://www.googlecloudcommunity.com/gc/Technical-Tips-Tricks/Looker-API-Performance-Best-Practices/ta-p/591327
    * figure out how to make Looker SDK use NextJS fetch cache?

  * running the queries in parallel might have complexity issues (doesn't seem super high risk).
  * Dependency: Finish sorting out how to [get a limit privs service account](https://cloud.google.com/looker/docs/api-auth#authentication_with_an_sdk) for the web app to use the Looker API on our instance. I don't yet understand the model for constraining the privs for that account.
    * [DSRE-1583](https://mozilla-hub.atlassian.net/browse/DSRE-1583) (**DONE**)
  * Dependency: add getting secrets from environment vars
    * [Bug 1888930](https://bugzilla.mozilla.org/show_bug.cgi?id=1888930) (**DONE**)
  * Performance issues
    * do stuff in parallel as described above
