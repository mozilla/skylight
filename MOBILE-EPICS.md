Top-level bullets are user story epics, 2nd-level bullet are regular user stories

# Android

1. Looker Dashboard
   1. Make messaging feature Looker dashboard (3: DONE)
   2. Shared folder, permissions & docs) (LATER)
2. Stand up viewable (though incorrect) Skylight dashboard route (3: DONE)
3. Make things work for Android & Desktop enough to see Android msg rollouts:

   1. Page route/dashboard component (5: DONE)
   2. Data fetching: (5: DONE)

4. Diagnose Viewpoint Dashboard link 0/0 CTR (DONE)

5. Start landing pieces of android branch incrementally:

   1. Experimenter API client work (DONE) - landed on main
   2. Publish to web so they can test (DONE)

   3. Env var changes - landed on branch
      1. Draft plan; ask Emily to review
      2. Create PR for main for this one change
      3. Netlify deploy should be failing
      4. Add new env variable to Netlify
      5. Netlify deploy should start succeeding
      6. Update docs (README and .env\* and CONTRIBUTING?)
      7. Merge branch change
   4. Feature ID list (DONE on branch)
      1. CLEAN UP slightly: Update comments in file & land eg "Cross-platform list of Nimbus feature IDs"
   5. Fix existing dashboard tests on branch
   6. Nimbus.GetBranchInfo (5: DONE) - Write tests & review
   7. Show experiments & rollouts for a few key surfaces (DONE on branch) - Tests?
   8. Get simple dashboard links for messaging surface (DONE on branch) - Tests?

6. Onboarding dashboard - desktop-equivalent (WIP on branch)
7. Add monthly Impressions/CTR chart to Looker `messaging` dashboard (2)
   1. Correctly label these "users impressed",
8. Add Inline Impressions/CTR to Skylight `messaging` (8 - needs breakdown or SPIKE)
   \*\* TODO (Dan): draft checklist & plan for this

9. Clean up dashboards with separate stats: users impressed & clicks / User Impression Rate & CTR
10. Separate chart?

---

1.  Fix $pivot by index numbers stuff in Looker dashboard
2.  Make pills exclude "Firefox" on Android page, since we don't yet have production section (3?)
3.  Onboarding funnel (XXXdmose add notes)
4.  Fully useful surface columns
5.  Completed page

6.  Key Unknowns to research
7.  Enumerate Nimbus telemetry feature ids to show
    1. Enumerate production teletry that can be shown for each surface
8.  Make a list of all-subsurfaces (of messaging) with links to telemetry
9.  Which other feature ids (eg onboarding) are desired? How much work will they be?
10. Handle production telemetry (waiting on research; chat with Vasant)

11. Maybe immediate; maybe iOS first
    1.  Add other feature IDs? Prob at least onboarding
    2.  Microsurveys badge?
    3.  Surface-based filtering?

# iOS

1. Looker Dashboard
2. Stand up viewable Skylight dashboard route (3)
