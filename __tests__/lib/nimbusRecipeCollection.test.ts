import { NimbusRecipe } from "@/lib/nimbusRecipe";
import { NimbusRecipeCollection } from "@/lib/nimbusRecipeCollection";
import { ExperimentFakes } from "@/__tests__/ExperimentFakes.mjs";
import { RecipeInfo } from "@/app/columns";
import { Platform } from "@/lib/types";

const platform: Platform = "firefox-desktop";

const fakeFetchData = [ExperimentFakes.recipe()];
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(fakeFetchData),
  }),
) as jest.Mock;

jest.mock("../../lib/sdk");

// eslint-disable-next-line jest/no-mocks-import
import { setMockPlatform, resetMockState } from "@/lib/__mocks__/sdk";

describe("NimbusRecipeCollection", () => {
  // Reset mock state after each test
  afterEach(() => {
    resetMockState();
  });

  it("creates an empty NimbusRecipeCollection", () => {
    // Set platform for this test
    setMockPlatform("firefox-desktop");

    const nimbusRecipeCollection = new NimbusRecipeCollection();

    expect(nimbusRecipeCollection.recipes.length).toEqual(0);
  });

  describe("fetchRecipes", () => {
    it("fetches recipes from the server", async () => {
      setMockPlatform("firefox-desktop");
      const nimbusRecipeCollection = new NimbusRecipeCollection();

      const recipes = await nimbusRecipeCollection.fetchRecipes();

      expect(recipes).toEqual([new NimbusRecipe(fakeFetchData[0])]);
    });

    it("constructs the correct URL for live experiments", async () => {
      setMockPlatform("firefox-desktop");
      const nimbusRecipeCollection = new NimbusRecipeCollection(
        false,
        platform,
      ); //XXX YYY
      await nimbusRecipeCollection.fetchRecipes();

      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.EXPERIMENTER_API_PREFIX}?status=Live&application=${platform}`,
        { credentials: "omit" },
      );
    });

    it("constructs the correct URL for completed experiments", async () => {
      setMockPlatform("firefox-desktop");
      const nimbusRecipeCollection = new NimbusRecipeCollection(true);
      await nimbusRecipeCollection.fetchRecipes();

      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.EXPERIMENTER_API_PREFIX}?status=Complete&application=${platform}`,
        { credentials: "omit" },
      );
    });
  });

  describe("getExperimentAndBranchInfos", () => {
    it("gets all the recipe infos with updated CTR percents", async () => {
      setMockPlatform("firefox-desktop");
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
});
