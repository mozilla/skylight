* point of prototype: momentum, questions, feedback
  * keep recent momentum up to maximize chances of lift-off
  * answer key questions
    * implementable as web app? pros & cons?
      * how could we keep per-version ASRouter data up-to-date?
        * hypothesis
          * implement script browser_chrome test framework that exports local stuff
          * runs once/version, results checked into prototype
          * use taskcluster to automate running as needed
      * how could we see real representations of messages?
        * hypothesis: existing messaging-preview infra is reasonable direction
      * how could we pull data from looker (eg click-through rates)
        * hypthesis:
          * pull from existing queries (validate using APIExplorer)
          * look at authorization options (could punt and use OAUTH)
  * validate usefulness/usability to PMs as monitoring tool.
    * collect feedback about:
      * experiments, rollouts, and production representation in dashboard
      * usability / discoverability
    * other learnings
      *

-- required for prototype (DONE)

* prototype ASRouter data extraction
  * write test that dumps to JSON file (DONE)
  * compare JSON file to data in providers (DONE)-ish
  * check to see if it has all platforms & targeting (DONE)-ish
  * [...]

-- required for demo (DONE)

* finish columns.tsx for simple messaging data (DONE)
* finish DataTable prototype using simple messaging data (DONE)
* link single alex dashboard (DONE)
* generalize alex dashboard link (DONE)
* make preview links visible in app (DONE)

-- required for doorknob twisting

* clean up (DONE)
  * title for clarity (DONE)

* deploy
  * Get netlify access (IN PROGRESS)
    * reached out to #sre, filed [SE-3787](https://mozilla-hub.atlassian.net/browse/SE-3787)
  * Push

-- required for something functional & feedback

* land MAKE_LINKABLE in nightly
  * research original MAKE_LINKABLE in nightly landing
  * get re-review & land

* make CTR numbers visible on dashboard

-- next steps for experiments

* add sortability
* style prototype

* implement experiment table
  * implement experiment columns
  * implement experiment layout
  * add sortability
  * style experiment layout

-- later

* figure out if there are cases with inaccuracies because of      message-ids getting reused concurrently in different contexts (eg experiments, in-tree like about:welcome, ...).  Does this everf
* update README.md re font & vercel verbiage
* prototype taskcluster ASRouter extraction
