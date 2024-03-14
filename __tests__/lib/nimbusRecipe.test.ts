import { NimbusRecipe } from '@/lib/nimbusRecipe'
import { ExperimentFakes } from '@/__tests__/ExperimentFakes.mjs'
import { BranchInfo } from "@/app/columns.jsx"

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
