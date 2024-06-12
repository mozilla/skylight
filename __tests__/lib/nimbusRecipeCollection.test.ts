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

// Mock SDK
const fakeDashboardElements = [
  {
      query: {
          id: "test_query_0",
          model: "test model",
          view: "test view",
          client_id: "test_client_id_0"
      },
  },
  {
      query: {
          id: "test_query_1",
          model: "test model",
          view: "test view",
          client_id: "test_client_id_1"
      },
  }
]
const fakeFilters = { 'event_counts.message_id':  '%test_query_0%' }
const fakeQuery = {
  id: "test_query"
}
const fakeQueryResult = [{
  "event_counts.submission_timestamp_date": "2024-06-04",
  primary_rate: 0.123456789,
  other_rate: 0.987654321,
  "event_counts.user_count": {},
}];

// Mocking structuredClone
global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val))
})

// Mocking all SDK methods
jest.mock("../../lib/sdk", () => {
  return {
      __esModule: true,
      SDK: {
          ok: jest.fn((apiMethod) => {
              if (apiMethod === "dashboard_dashboard_elements") {
                  return fakeDashboardElements
              } else if (apiMethod === "create_query") {
                  return fakeQuery
              } else if (apiMethod === "run_query") {
                  return fakeQueryResult
              }
          }),
          dashboard_dashboard_elements: jest.fn(() => "dashboard_dashboard_elements"),
          create_query: jest.fn(() => "create_query"),
          run_query: jest.fn(() => "run_query")
      }
      
  }
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

  describe('getExperimentAndBranchInfos', () => {
    it('gets all the recipe infos with updated CTR percents', async () => {
      const nimbusRecipeCollection = new NimbusRecipeCollection();
      nimbusRecipeCollection.recipes = [
        new NimbusRecipe(ExperimentFakes.recipe("test recipe")),
      ];
      
      const recipeInfos =
        (await nimbusRecipeCollection.getExperimentAndBranchInfos()) as RecipeInfo[];

      expect(recipeInfos[0].branches[0].ctrPercent).toBe(12.3)
      expect(recipeInfos[0].branches[1].ctrPercent).toBe(12.3)
    })
  })
})
