import { NimbusRecipe } from '@/lib/nimbusRecipe'
import { ExperimentFakes } from '@/__tests__/ExperimentFakes.mjs'
import { BranchInfo } from "@/app/columns.jsx"

//XXX We're passing this custom object for about:welcome, since ExperimentFakes
// doesn't quite give us what we want in that case. We probably want to tweak
// the API a little to work better with these deeply nested cases.
const AW_RECIPE = {
  id: "aboutwelcome-test-recipe",
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
        id: "control",
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
        id: "treatment-a",
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
        release: 'Fx Something',
        id: "test-recipe",
        topic: 'some topic',
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

    it('returns a specialized BranchInfo object if the recipe is from about:welcome', () => {
      const nimbusRecipe = new NimbusRecipe(AW_RECIPE)

      const branch = AW_RECIPE.branches[1]

      const branchInfo = nimbusRecipe.getBranchInfo(branch)

      // XXX getBranchInfo is actually going to return a previewLink, which
      // makes this test kind of brittle. We could refactor this to no longer 
      // use deepEqual and check for the existence of object properties instead.
      expect(branchInfo).toEqual({
        product: 'Desktop',
        id: branch.slug,
        isBranch: true,
        nimbusExperiment: AW_RECIPE,
        slug: branch.slug,
        surface: "About:Welcome Page",
        template: "aboutwelcome",
        ctrDashboardLink:
          "https://mozilla.cloud.looker.com/dashboards/1471?Message+ID=%25TREATMENT-A%25",
        previewLink: "about:messagepreview?json=ewAiAGkAZAAiADoAIgBhAGIAbwB1AHQAdwBlAGwAYwBvAG0AZQAtAHQAZQBzAHQALQByAGUAYwBpAHAAZQAiACwAIgB0AGUAbQBwAGwAYQB0AGUAIgA6ACIAcwBwAG8AdABsAGkAZwBoAHQAIgAsACIAdABhAHIAZwBlAHQAaQBuAGcAIgA6AHQAcgB1AGUALAAiAGMAbwBuAHQAZQBuAHQAIgA6AHsAIgBiAGEAYwBrAGQAcgBvAHAAIgA6ACIAdgBhAHIAKAAtAC0AbQByAC0AdwBlAGwAYwBvAG0AZQAtAGIAYQBjAGsAZwByAG8AdQBuAGQALQBjAG8AbABvAHIAKQAgAHYAYQByACgALQAtAG0AcgAtAHcAZQBsAGMAbwBtAGUALQBiAGEAYwBrAGcAcgBvAHUAbgBkAC0AZwByAGEAZABpAGUAbgB0ACkAIgAsACIAaQBkACIAOgAiAHQAcgBlAGEAdABtAGUAbgB0AC0AYQAiACwAIgBtAG8AZABhAGwAIgA6ACIAdABhAGIAIgB9AH0A",
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

})
