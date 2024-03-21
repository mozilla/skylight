## Steps

### BigQuery

* Install google cloud SDK
* `npm install @google-cloud/bigquery`
* Review https://cloud.google.com/docs/authentication/provide-credentials-adc#local-dev
* `gcloud auth application-default login`
* Run test.js

### Looker

* Find data we want
  * Go to Dashboard
  * "Explore from here" in chart
  * "Save as Look" XXX probalby wrong
  * Go into dev mode on looker
  * Use APIExplorer
  * Get Look info, including query id
  * RunQuery(queryId)

* Set up credentials
  * Testing: personal API credentials
  * Production: service account
* Install Looker SDK
  * `npm install @looker/sdk`
  * to learn: use API example links especially, including tests
* See how many calls we need to make
  * get query
  * run query
  * try modifying query
* Draft overview of how this fits into code
  * lib/messageDashboard.ts
  * messageDashboard object
    * constructor/setter/getter
    * getLink
    * runQuery
