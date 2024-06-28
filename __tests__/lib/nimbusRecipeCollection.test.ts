import { NimbusRecipe } from '@/lib/nimbusRecipe'
import { NimbusRecipeCollection } from '@/lib/nimbusRecipeCollection'
import { ExperimentFakes } from '@/__tests__/ExperimentFakes.mjs'
import { RecipeInfo } from '@/app/columns';

const fakeFetchData = [ExperimentFakes.recipe()]
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(fakeFetchData),
  }),
) as jest.Mock;

jest.mock("../../lib/sdk")

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

  describe("getExperimentAndBranchInfos", () => {
    it("gets all the recipe infos with updated CTR percents", async () => {
      const nimbusRecipeCollection = new NimbusRecipeCollection();
      nimbusRecipeCollection.recipes = [
        new NimbusRecipe(ExperimentFakes.recipe("test recipe")),
      ];

      const recipeInfos =
        (await nimbusRecipeCollection.getExperimentAndBranchInfos()) as RecipeInfo[];

      expect(recipeInfos[0].branches[0].ctrPercent).toBe(12.35);
      expect(recipeInfos[0].branches[1].ctrPercent).toBe(12.35);
    });
  });
})
