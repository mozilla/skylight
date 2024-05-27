import { NimbusRecipe } from '@/lib/nimbusRecipe'
import { ExperimentFakes } from '@/__tests__/ExperimentFakes.mjs'
import { BranchInfo } from "@/app/columns.jsx"

//XXX We're passing this custom object for about:welcome, since ExperimentFakes
// doesn't quite give us what we want in that case. We probably want to tweak
// the API a little to work better with these deeply nested cases.
const AW_RECIPE = {
  id: "aboutwelcome-test-recipe",
  slug: "aboutwelcome-test-recipe",
  schemaVersion: "1.12.0",
  appId: "firefox-desktop",
  appName: "firefox_desktop",
  application: "firefox-desktop",
  channel: "nightly",
  isEnrollmentPaused: false,
  probeSets: [],
  startDate: null,
  endDate: null,
  proposedEnrollment: 7,
  referenceBranch: "control",
  userFacingName: "AboutWelcome Recipe",
  userFacingDescription: "AboutWelcome test recipe",
  bucketConfig: {
    namespace: "nimbus-test-utils",
    randomizationUnit: "normandy_id",
    start: 0,
    count: 100,
    total: 1000,
  },
  branches: [{
    features: [{
      enabled: true,
      featureId: "aboutwelcome",
      value: {
        id: "something:control",
      }
    }],
    ratio: 1,
    slug: "control",
  },
  {
    features: [{
      enabled: true,
      featureId: "aboutwelcome",
      value: {
        backdrop: "test-backdrop",
        id: "feature_value_id:treatment-a",
        screens: [
          {
            id: "TEST_SCREEN_ID_A_0",
          }
        ],
      },
    }],
    ratio: 1,
    slug: "treatment-a",
  }],
}

describe('NimbusRecipe', () => {

  it('creates a NimbusRecipe from a raw JS recipe object', () => {
    const rawRecipe = ExperimentFakes.recipe("test-recipe");

    const nimbusRecipe = new NimbusRecipe(rawRecipe)

    expect(nimbusRecipe._rawRecipe).toEqual(rawRecipe)
  })

  describe('getRecipeInfo', () => {
    it('returns a RecipeInfo object', () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        userFacingName: "Test Recipe",
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe)

      const recipeInfo = nimbusRecipe.getRecipeInfo()

      expect(recipeInfo).toEqual({
        startDate: rawRecipe.startDate,
        endDate:
          rawRecipe.endDate,
        product: 'Desktop',
        id: "test-recipe",
        segment: 'some segment',
        ctrPercent: .5,
        ctrPercentChange: 2,
        metrics: 'some metrics',
        experimenterLink: `https://experimenter.services.mozilla.com/nimbus/test-recipe`,
        userFacingName: rawRecipe.userFacingName,
        nimbusExperiment: rawRecipe
      });
    })
  })

  describe('getBranchInfo', () => {
    it('returns a BranchInfo object', () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe)
      // XXX should add a method to NimbusRecipe and call the getter instead of
      // violating encapsulation like this.  Or, alternately, should retrieve
      // branch info by slug.
      const branch = rawRecipe.branches[1]

      const branchInfo = nimbusRecipe.getBranchInfo(branch)

      expect(branchInfo).toEqual({
        product: 'Desktop',
        id: branch.slug,
        isBranch: true,
        nimbusExperiment: rawRecipe,
        slug: branch.slug,
        surface: "testTemplate",
        template: "testTemplate"
      })
    })

    it('returns a specialized BranchInfo object if the recipe is from about:welcome and has screens', () => {
      const nimbusRecipe = new NimbusRecipe(AW_RECIPE)
      const branch = AW_RECIPE.branches[1]

      const branchInfo = nimbusRecipe.getBranchInfo(branch)

      // XXX getBranchInfo is actually going to return a previewLink, which
      // makes this test kind of brittle. We could refactor this to no longer
      // use deepEqual and check for the existence of object properties instead.
      expect(branchInfo).toEqual({
        product: 'Desktop',
        ctrDashboardLink: `https://mozilla.cloud.looker.com/dashboards/1677?Message+ID=%25${"feature_value_id%3Atreatment-a".toUpperCase()}%25&Normalized+Channel=&Experiment=aboutwelcome-test-recipe&Branch=treatment-a`,
        id: "feature_value_id:treatment-a",
        isBranch: true,
        nimbusExperiment: AW_RECIPE,
        slug: branch.slug,
        surface: "About:Welcome Page (1st screen)",
        template: "aboutwelcome",
        previewLink: "about:messagepreview?json=ewAiAGkAZAAiADoAIgBhAGIAbwB1AHQAdwBlAGwAYwBvAG0AZQAtAHQAZQBzAHQALQByAGUAYwBpAHAAZQAiACwAIgB0AGUAbQBwAGwAYQB0AGUAIgA6ACIAcwBwAG8AdABsAGkAZwBoAHQAIgAsACIAdABhAHIAZwBlAHQAaQBuAGcAIgA6AHQAcgB1AGUALAAiAGMAbwBuAHQAZQBuAHQAIgA6AHsAIgBiAGEAYwBrAGQAcgBvAHAAIgA6ACIAdABlAHMAdAAtAGIAYQBjAGsAZAByAG8AcAAiACwAIgBpAGQAIgA6ACIAZgBlAGEAdAB1AHIAZQBfAHYAYQBsAHUAZQBfAGkAZAA6AHQAcgBlAGEAdABtAGUAbgB0AC0AYQAiACwAIgBzAGMAcgBlAGUAbgBzACIAOgBbAHsAIgBpAGQAIgA6ACIAVABFAFMAVABfAFMAQwBSAEUARQBOAF8ASQBEAF8AQQBfADAAIgB9AF0ALAAiAG0AbwBkAGEAbAAiADoAIgB0AGEAYgAiAH0AfQA%3D"
      })
    })

    it("returns a BranchInfo that uses the message id if no screens exist", () => {
      // https://github.com/jsdom/jsdom/issues/3363 is why we're using
      // a JSON hack rather than structuredClone
      const AW_RECIPE_NO_SCREENS = JSON.parse(JSON.stringify(AW_RECIPE))
      AW_RECIPE_NO_SCREENS.branches[1].features[0].value =
        { id: "feature_value_id:treatment-a", }

      const nimbusRecipe = new NimbusRecipe(AW_RECIPE_NO_SCREENS)
      const branch = AW_RECIPE_NO_SCREENS.branches[1]

      const branchInfo = nimbusRecipe.getBranchInfo(branch)
      
      expect(branchInfo).toEqual({
        product: 'Desktop',
        ctrDashboardLink: "https://mozilla.cloud.looker.com/dashboards/1677?Message+ID=%25FEATURE_VALUE_ID%3ATREATMENT-A%25&Normalized+Channel=&Experiment=aboutwelcome-test-recipe&Branch=treatment-a",
        id: "feature_value_id:treatment-a",
        isBranch: true,
        nimbusExperiment: AW_RECIPE_NO_SCREENS,
        slug: branch.slug,
        surface: "About:Welcome Page (1st screen)",
        template: "aboutwelcome"
      })
    })
  })

  describe('getBranchInfos', () => {
    it('returns an array of BranchInfo objects, one per branch', () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe)

      const branchInfos: BranchInfo[] = nimbusRecipe.getBranchInfos()

      expect(branchInfos[0]).toEqual({
        product: 'Desktop',
        id: 'control',
        isBranch: true,
        nimbusExperiment: rawRecipe,
        slug: 'control',
        surface: "none",
        template: "none"
      })

      expect(branchInfos[1]).toEqual({
        product: 'Desktop',
        id: 'treatment',
        isBranch: true,
        nimbusExperiment: rawRecipe,
        slug: 'treatment',
        surface: "testTemplate",
        template: "testTemplate"
      })
    })
  })

  describe('getBranchScreenshotsLink', () => {
    it('returns a link to the branch summary in experimenter', () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        slug: "goat shearing`test"
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe)

      // having a weird char in the branch slug helps test that the code
      // is calling encodeURIComponent
      const branchSlug : string = "treatment`a"
      const screenshotsAnchorId =
        `branch-${encodeURIComponent(branchSlug)}-screenshots`

      const result = nimbusRecipe.getBranchScreenshotsLink(branchSlug)

      expect(result).toBe(`https://experimenter.services.mozilla.com/nimbus/${encodeURIComponent(rawRecipe.slug)}/summary#${screenshotsAnchorId}`)
    })
  })

  describe('usesMessagingFeatures', () => {
    it('returns true if the recipe uses messaging features', () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        featureIds: ["fxms-message-1"]
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe)

      const result = nimbusRecipe.usesMessagingFeatures()

      expect(result).toBe(true)
    })

    it('returns false if the recipe does not use messaging features', () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        featureIds: ["monkeys-1"]
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe)

      const result = nimbusRecipe.usesMessagingFeatures()

      expect(result).toBe(false)
    })

    it('returns true if featureIds[1] is a messaging feature', () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        featureIds: ["monkeys-1", "fxms-message-1"]
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe)

      const result = nimbusRecipe.usesMessagingFeatures()

      expect(result).toBe(true)

    })
  })
})
