* point of prototype: momentum, answer questions, get user feedback
  * keep recent momentum up to maximize chances of lift-off
  * Answer key questions
    * Implementable as web app? pros & cons?
      * How could we keep per-version ASRouter data up-to-date?
        * hypothesis: implement script browser_chrome test framework that exports local stuff
          * run once/version, results checked (VALIDATED)
      * how could we see real previews of messages?
        * hypothesis: existing messaging-preview infra is reasonable direction
          * To validate: get feedback from Velocity PMs
      * what's a low-effort and secure way to get click-through rate data?
        * hypothesis:
          * pull from existing Looker query (validate using APIExplorer)
          * look at authorization options (could punt and use OAUTH)
        * alternatives:
          * use SQL directly on BigQuery tables in app
          * use SQL in redash (has been done before, unsure of details)
        * next step:
          * collaborate with SRE to learn how tightly/easily we can limit service account access to Looker, BigQuery, and Redash (this only needs a small amount of data)

  * validate usefulness/usability to PMs as monitoring tool.
    * collect feedback & learnings about:
      * looking at live messages from asrouter/experiments in this form?
      * experiments, rollouts, and production representation in dashboard
      * usability / discoverability
      * how do we handle messages in production across multiple versions?
      * how useful is the monitoring feature? what is missing?
      * how often would/do you use this?
    * other learnings
      * experiences with the (fairly standard) tech stack used in prototype?

-- required for prototype: displays some data (DONE)

* prototype ASRouter data extraction
  * write test that dumps data from mozilla-central to JSON file (DONE)
  * compare JSON file to data in providers (DONE)-ish
  * check to see if it has all platforms & targeting (DONE)-ish
  * (MOSTLY VALIDATED)

-- required for demo: links to dashboards (DONE)

* finish columns.tsx for simple messaging data (DONE)
* finish DataTable prototype using simple messaging data (DONE)
* link single alex dashboard (DONE)
* generalize alex dashboard link (DONE)
* make preview links visible in app (DONE)

-- required for doorknob twisting: first cut explorable (but not necessarily useful) for PMs and UX

* Make preview affordance usable (one or both of):
  * switch preview button to copy-paste button (DONE)

* clean up (DONE)
  * title for clarity (DONE)

* deploy
  * Get netlify access (IN PROGRESS)
    * reached out to #sre, filed [SE-3787](https://mozilla-hub.atlassian.net/browse/SE-3787) (DONE)
  * Configure & Push (DONE)
  * Replace with site-maintenance page until after RSA (DONE)
  * File Rapid Security Assessment bugzilla ticket
  * Remove site-maintenance page.

-- milestone: test messaging experiment data access & UX

* see if desired experimenter data is public (check Hackathon prototype)
  * if not, research minimum amount of access we need & easiest way to get it
* implement experiment columns
* implement experiment layout
* add sortability
* style experiment layout

-- milestone: test mocked UI features

* make CTR numbers visible on dashboard (IN PROGRESS)
  * get client API key and Looker APIExplorer installed (DONE)
  * find right query call using explorer
  * fetch query results server-side (only)
  * render into table
  * use secrets manager to handle key (before landing)

* add sortability
* style prototype

-- open questions for the future

* Are there cases of message-ids getting reused concurrently in different contexts that would need to be handled to get the numbers right?
  * eg experiment branches, rollouts, in-tree -- such as for onboarding messages
* How do we handle previews across different Firefox versions, given
  surface evolution?
  * This issue would be equally relevant whether tool is implemented as web app or in Firefox
  * Proposal: declare out of scope for MVP
    * Existence proof: experimenter still doesn't handle different Firefox version schemas
    * Users expected to user current versions of Firefox
    * See how often this problem crops up in reality
* How do we handle mobile messages?
* When is it worth making a case for making about:messagepreview linkable
  in some circumstances?
    * propose mitigations/limitations for good security

-- later

* update README.md re font & vercel verbiage
* prototype taskcluster ASRouter extraction

