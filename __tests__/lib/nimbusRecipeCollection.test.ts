import { NimbusRecipe } from '@/lib/nimbusRecipe'
import { NimbusRecipeCollection } from '@/lib/nimbusRecipeCollection'
import { ExperimentFakes } from '@/__tests__/ExperimentFakes.mjs'

const fakeFetchData = [ExperimentFakes.recipe()]
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(fakeFetchData),
  }),
) as jest.Mock;

// Required with getExperimentAndBranchInfos being inside NimbusRecipeCollection
jest.mock("../../lib/looker", () => {
  return {
    _esModule: true,
    SDK: "mocked SDK",
    me: "mocked me",
  };
});

describe('NimbusRecipeCollection', () => {
  it('creates an empty NimbusRecipeCollection', () => {
    const nimbusRecipeCollection = new NimbusRecipeCollection()

    expect (nimbusRecipeCollection.recipes.length).toEqual(0)
  })

  describe('fetchRecipes', () => {
    it('fetches recipes from the server', async () => {
      const nimbusRecipeCollection = new NimbusRecipeCollection()

      const recipes = await nimbusRecipeCollection.fetchRecipes()

      expect(recipes).toEqual([new NimbusRecipe(fakeFetchData[0])])
    })
  })
})
