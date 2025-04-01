Goal: stand up mobile version of experiments/rollouts

Epics:

- BIG UNKNOWN: figure out outside-of-nimbus plan
- stand up android
  - messaging surface
  - onboarding surface
  - UNKNOWN: enumerate other surfaces
- stand up iOS
  - UNKNOWN: sort out surfaces
  - redo android steps, but without all the refactoring

User Stories. As an Android PM, I should

- have an easy view of rollouts/branches on the messaging surface

  - so I can see a bunch of what Android users see (on the message surface)
    - 1-10

- research

  - [surfaces & guidelines](https://mozilla-hub.atlassian.net/wiki/spaces/FIREFOX/pages/210206760/Mobile+Message+Surface+Guidelines)
  - [mobile telemetry docs](https://experimenter.info/messaging/mobile-messaging/#events-emitted)
  - [desktop explore](https://mozilla.cloud.looker.com/explore/user_journey/event_counts)

  1. look at iOS telemetry & explores

     - [iOS message probes](https://dictionary.telemetry.mozilla.org/apps/firefox_ios?page=1&search=messag)
     - Note no experiments probes like Android has
     - [iOS event count explore](https://mozilla.cloud.looker.com/explore/firefox_ios/event_counts?qid=OZqOXzZqTujARgvCK12NJ4)
     - [recent iOS clicked events](https://mozilla.cloud.looker.com/explore/firefox_ios/event_counts?qid=jQpgYwZpBZEhW73B1dcyzu&toggle=fil,vis)
     - XXX look at onboarding also

  2. look at Android telemetry & explores
     - [Android message probes - Glean dictionary](https://dictionary.telemetry.mozilla.org/apps/fenix?page=1&search=messaging)
     - [android explore](https://mozilla.cloud.looker.com/explore/fenix/event_counts)$$
     - [recent android messaing click events with most extra keys and experiments](https://mozilla.cloud.looker.com/explore/fenix/event_counts?qid=u0OKWHjWgTcstNgbzvyyBc&toggle=fil)
     - [recent android onboarding events](https://mozilla.cloud.looker.com/explore/fenix/event_counts?qid=n71HDr0LIxuNS3vGX9essN&toggle=fil)
       - Need to understand this telemetry compared to JSON

-
- open questions
  - what does telemetry look like for onboarding? other surfaces? similar to messaging?
  - Does Click telemetry on both iOS and Android alwyas mean CTA? Or something else?
  - What is action_uuid extra key (see docs)?
  - **Do non-experimental message send pings on iOS or Android?**

1.  Draft plan for Android page

        1. ?File ticket
        2. Build chart for Android messaging (DONE)
        3. Build 2nd chart (LATER)
        4. Build dashboard (DONE: id = 2191)
        5. Move to shared folder (LATER)

        XXX FINISH BUILDING todo list; XXX plan team work; XXX map to calendar

        6. Build Android page

           1. ~~Review existing clone for "completed" (DONE)~~
           2. ~~?Consider options for cloning, since we'll want Android completed page too, and iOS pages (DONE)~~
           3. ~~Create new dir with new page.tsx (MUST)~~
           4. ~~TDD Factor out dashboard (DONE)~~
              1. Use platform search param (TRIED; TOO FIDDLY, MAYBE LATER)
              2. ~~Put in separate android/ route (DONE)~~
           5. ~~Refactor to not display local table on Android (DONE)~~
           6. Factor "application=" out of env (DONE)
              1.  ~~Create PlatformInfo interface~~
                 1. ~~application name~~
              2. ~~Create PlatformInfoDict containing (android, desktop)~~
              3. ~~pull experiments path component into EXPERIMENTER_API_PREFIX~~
              4. ~~Figure out how to resolve NimbusAppSlug and Platform param stuff~~
              5. ~~Get application param from PlatformInfoDict; remove from env~~
              6. ~~Get status param from appropriate files; remove from env~~
           7. Pull platform-specific-feature-list from experimentUtils into
            PlatformInfo (LATER)
           8. Move nimbusRecipe.ts:getBranchInfo into own file included into PlatformInfo? (fallback: add messaging cases for now; move to PlatformInfo later - XXX DONE)
              1. Detect by surface
              2. Call into GetAndroidBranchInfo
                 1. Move existing code
                 2. Copy-paste proposedEndDate
                 3. ...
           9. Fix exeriments (DONE -- for messaging & juno-onboarding)

           10. Deploy to web (ALREADY WORKING)
           11. Add getAndroidDashboard
           12. Add getAndroidDashboardIdForTemplate
           13. --
           14. Build onBoarding dashboard in Amplitude
           15. Link in

           16. Add cases / refactor messageUtils.getDashboard (IMPT)
           17. Update / move messageUtils.getDashboardIdForTemplate (IMPT)

           18. Visual polish on surfaces?
           19. Make pills exclude local if not on desktop (NICE)

    . 2. Add cases / refactor looker.ts:getCTRPercentData (NICE)

           20. Add cases / refactor templates & getSurfaceDataForTemplate (LATER)
           21. Support microsurveys badge, if sensible on mobile (LATER)
           22. Update columns.tsx:filterBySurface (LATER)
           23. Add l10n (LATER)

           24. Factor Out NimbusMessageTable (EVEN LATER)
           25. Factor out high-level data fetching (EVEN LATER)

           26. Pull in Android experiments using that URL
           27. Build dashboard link
           28. How to handle multi types
           29. Build CTR
           30. How to handle multi types

2.  standup 2nd page

    - TDD? clone for mobile

3.  standup 2nd dashboard

        * review mobile telemetry using glean dict
        * look at explores available for those tables
        *  TDD? subclass recipes (desktop & mobile)

    1. Separate dashboards per surface: onboarding, (messaging genrally - may need to split into message_surface dashboard)
    2. 2.What about QA?

Later:

- clean up text on messaging graph
-
