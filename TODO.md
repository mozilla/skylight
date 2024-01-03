-- required for prototype

* prototype ASRouter data extraction
  * write test that dumps to JSON file (DONE)
  * compare JSON file to data in providers (DONE)-ish
  * check to see if it has all platforms & targeting (DONE)-ish
  * [...]

-- required for feedback

* finish columns.tsx for simple messaging data (DONE)
* finish DataTable prototype using simple messaging data (DONE)
* link single alex dashboard (DONE)
* generalize alex dashboard link (DONE)
* make preview links visible in app (DONE)

* add sortability
* implement experiment table
  * implement experiment columns
  * implement experiment layout
  * style experiment layout

* style prototype
* file request for Looker APIExplorer
* file request for Looker API creds

-- next steps for feedback

* deploy to GCP (or vercel or netlify or ...)
  * ask in #frontenders

* add caveats
  * empty dashboards
  * numbers not entirely correct (in-tree can overlap with experiments & rollouts; only sometimes desirable)

* land MAKE_LINKABLE in nightly
  * research original MAKE_LINKABLE in nightly landing
  * get re-review & land

* make CTR trends visible on dashboard

-- next steps for planning

* document point of prototype
* draft basic plans

-- later

* draft details around handle mutally excluding experiments & production, when we want that, so we can remove caveats

* draft strategy for data loading -- just check into tree on each version?
* update README.md re font & vercel verbiage
* prototype taskcluster ASRouter extraction
