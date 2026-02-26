import { NimbusRecipe } from "@/lib/nimbusRecipe";
import { NimbusRecipeCollection } from "@/lib/nimbusRecipeCollection";
import { ExperimentFakes } from "@/__tests__/ExperimentFakes.mjs";
import { RecipeInfo } from "@/app/columns";
import { Platform } from "@/lib/types";
import { LOOKER_BATCH_SIZE } from "@/lib/looker";

const platform: Platform = "firefox-desktop";

const fakeFetchData = [ExperimentFakes.recipe()];
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    headers: new Headers({ "content-type": "application/json" }),
    json: () => Promise.resolve(fakeFetchData),
  }),
) as jest.Mock;

jest.mock("../../lib/sdk");
jest.mock("../../lib/looker", () => ({
  ...jest.requireActual("../../lib/looker"),
  LOOKER_BATCH_SIZE: 2,
  getCTRPercentData: jest.fn((...args: any[]) =>
    (jest.requireActual("../../lib/looker") as any).getCTRPercentData(...args),
  ),
}));

// eslint-disable-next-line jest/no-mocks-import
import { setMockPlatform, resetMockState } from "@/lib/__mocks__/sdk";
import { getCTRPercentData } from "@/lib/looker";

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

    it("skips CTR data fetching for blocklisted experiments", async () => {
      setMockPlatform("firefox-desktop");
      const nimbusRecipeCollection = new NimbusRecipeCollection();

      // Create a blocklisted experiment and a normal experiment
      const blocklistedSlug =
        "sidebar-button-feature-callout-vertical-tabs-users-existing-profiles";
      nimbusRecipeCollection.recipes = [
        new NimbusRecipe(ExperimentFakes.recipe(blocklistedSlug)),
        new NimbusRecipe(ExperimentFakes.recipe("normal-experiment")),
      ];

      const recipeInfos =
        (await nimbusRecipeCollection.getExperimentAndBranchInfos()) as RecipeInfo[];

      // Blocklisted experiment should not have CTR data
      expect(recipeInfos[0].branches[0].ctrPercent).toBeUndefined();
      expect(recipeInfos[0].branches[1].ctrPercent).toBeUndefined();

      // Normal experiment should have CTR data
      expect(recipeInfos[1].branches[0].ctrPercent).toBe(12.35);
      expect(recipeInfos[1].branches[1].ctrPercent).toBe(12.35);
    });

    it("respects LOOKER_BATCH_SIZE for Looker API calls", async () => {
      setMockPlatform("firefox-desktop");
      const nimbusRecipeCollection = new NimbusRecipeCollection();

      // Create 4 recipes so we have enough parallel work to detect violations
      nimbusRecipeCollection.recipes = [
        new NimbusRecipe(ExperimentFakes.recipe("recipe-1")),
        new NimbusRecipe(ExperimentFakes.recipe("recipe-2")),
        new NimbusRecipe(ExperimentFakes.recipe("recipe-3")),
        new NimbusRecipe(ExperimentFakes.recipe("recipe-4")),
      ];

      // Track concurrency of getCTRPercentData calls
      let active = 0;
      let maxActive = 0;

      (getCTRPercentData as jest.Mock).mockImplementation(async () => {
        active++;
        maxActive = Math.max(maxActive, active);
        await new Promise((r) => setTimeout(r, 10));
        active--;
        return { ctrPercent: 12.35, impressions: 100 };
      });

      await nimbusRecipeCollection.getExperimentAndBranchInfos();

      // With 4 recipes x 2 branches = 8 getCTRPercentData calls.
      // LOOKER_BATCH_SIZE is mocked to 2, so the outer loop processes
      // 2 recipes at a time, each with an inner loop of 2 branches.
      // Max concurrent should not exceed LOOKER_BATCH_SIZE² = 4.
      expect(maxActive).toBeLessThanOrEqual(
        LOOKER_BATCH_SIZE * LOOKER_BATCH_SIZE,
      );
      expect(maxActive).toBeGreaterThan(0);
      // All 8 calls should have completed despite the concurrency limit
      expect(getCTRPercentData).toHaveBeenCalledTimes(8);
    });
  });
});
