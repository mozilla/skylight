import { NimbusRecipeCollection } from '@/lib/nimbusRecipeCollection'
import { ExperimentFakes } from '@/__tests__/ExperimentFakes.mjs'

const fakeFetchData = [ExperimentFakes.recipe()]
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: fakeFetchData }),
  }),
) as jest.Mock;

describe('NimbusRecipeCollection', () => {
  it('creates an empty NimbusRecipeCollection', () => {
    const nimbusRecipeCollection = new NimbusRecipeCollection()

    expect (nimbusRecipeCollection.recipes.length).toEqual(0)
  })
})

// expect(nimbusRecipeCollection.recipes).toEqual(new NimbusRecipe(fakeFetchData// [0]))
