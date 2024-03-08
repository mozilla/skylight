import { NimbusRecipe } from '@/lib/nimbusRecipe'
import { ExperimentFakes } from '@/__tests__/ExperimentFakes.mjs'
import { RecipeInfo } from "@/app/columns.jsx"

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
        recipe: rawRecipe
      });
    })
  })
})
