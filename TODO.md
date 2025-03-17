Goal: stand up mobile version of experiments/rollouts

User Story: As a mobile PM, I should be able to understand what things are in experiments and
 rollouts for messaging & onboarding & what the clickthrough rates look like


* research
    * [surfaces & guidelines](https://mozilla-hub.atlassian.net/wiki/spaces/FIREFOX/pages/210206760/Mobile+Message+Surface+Guidelines)
    * [mobile telemetry docs](https://experimenter.info/messaging/mobile-messaging/#events-emitted)
    * [desktop explore](https://mozilla.cloud.looker.com/explore/user_journey/event_counts)

    1. look at iOS telemetry & explores
        * [iOS message probes](https://dictionary.telemetry.mozilla.org/apps/firefox_ios?page=1&search=messag)
        * Note no experiments probes like Android has
        * [iOS event count explore](https://mozilla.cloud.looker.com/explore/firefox_ios/event_counts?qid=OZqOXzZqTujARgvCK12NJ4)
        * [recent iOS clicked events](https://mozilla.cloud.looker.com/explore/firefox_ios/event_counts?qid=jQpgYwZpBZEhW73B1dcyzu&toggle=fil,vis)
        * XXX look at onboarding also

    2. look at Android telemetry & explores
        *  [Android message probes - Glean dictionary](https://dictionary.telemetry.mozilla.org/apps/fenix?page=1&search=messaging)
        * [android explore](https://mozilla.cloud.looker.com/explore/fenix/event_counts)$$
        * [recent android messaing click events with most extra keys and experiments](https://mozilla.cloud.looker.com/explore/fenix/event_counts?qid=u0OKWHjWgTcstNgbzvyyBc&toggle=fil)
        * [recent android onboarding events](https://mozilla.cloud.looker.com/explore/fenix/event_counts?qid=n71HDr0LIxuNS3vGX9essN&toggle=fil)
          * Need to understand this telemetry compared to JSON
 *
* open questions
    * what does telemetry look like for onboarding?  other surfaces?  similar to messaging?
    * Does Click telemetry on both iOS and Android alwyas mean CTA?  Or something else?
    * What is action_uuid extra key (see docs)?
    * XXX Do non-experimental message send pings on iOS?  on Android?
      *


1. Draft plan for Android page
   1. ?File ticket
   2. Build chart for Android messaging (DONE)
   3. Build 2nd chart (LATER)
   4. Build dashboard (DONE - id = 2191)
   5. Move to shared folder (LATER)

    XXX FINISH BUILDING todo list; XXX plan team work; XXX map to calendar

   1. Build Android page
      1. Review existing clone for "completed" (DONE)
      2. ?Consider options for cloning, since we'll want Android completed page too, and iOS pages (DONE)

      3. Create new dir with new page.tsx (MUST)

      4. TDD Factor out dashboard (STARTED)
      5. Factor "application=" out of env (MUST)
      6. Add cases / refactor messageUtils.getDashboard (MUST)
      7. Add cases / refactor experimentUtils.ts (MUST)
      8. Update / move messageUtils.getDashboardIdForTemplate (MUST)
      9.  Add cases / refactor nimbusRecipe.ts:getBranchInfo (MUST)
      10. Add cases / refactor templates & getSurfaceDataForTemplate (MUST)
      11. Add cases / refactor looker.ts:getCTRPercentData (LATER)
      12. Update columns.tsx:filterBySurface (LATER)
      13. TDD Factor Out NimbusMessageTable (NICE)
      14. TDD Factor out high-level data fetching (NICE)

      15. Pull in Android experiments using that URL
      16. Build dashboard link
         1. How to handle multi types
      17. Build CTR
         1. How to handle multi types


2. standup 2nd page

    * TDD? clone for mobile

3. standup 2nd dashboard

    * review mobile telemetry using glean dict
    * look at explores available for those tables
    *  TDD? subclass recipes (desktop & mobile)

   1. Separate dashboards per surface: onboarding, (messaging genrally - may need to split into message_surface dashboard)
   2.
2.What about QA?


Later:
* clean up text on messaging graph
*