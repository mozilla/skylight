import { NimbusRecipe } from "@/lib/nimbusRecipe";
import { ExperimentFakes } from "@/__tests__/ExperimentFakes.mjs";
import { BranchInfo } from "@/app/columns.jsx";
import { getDashboard, getDashboardIdForTemplate } from "@/lib/messageUtils";
import { getExperimentLookerDashboardDate } from "@/lib/lookerUtils";
import { formatDate } from "@/lib/experimentUtils";

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
  branches: [
    {
      features: [
        {
          enabled: true,
          featureId: "aboutwelcome",
          value: {
            id: "something:control",
          },
        },
      ],
      ratio: 1,
      slug: "control",
      screenshots: [],
      description: "control description",
    },
    {
      features: [
        {
          enabled: true,
          featureId: "aboutwelcome",
          value: {
            backdrop: "test-backdrop",
            id: "feature_value_id:treatment-a",
            screens: [
              {
                id: "TEST_SCREEN_ID_A_0",
              },
            ],
          },
        },
      ],
      ratio: 1,
      slug: "treatment-a",
      screenshots: ["screenshotURI"],
      description: "treatment-a description",
    },
  ],
};

describe("NimbusRecipe", () => {
  it("creates a NimbusRecipe from a raw JS recipe object", () => {
    const rawRecipe = ExperimentFakes.recipe("test-recipe");

    const nimbusRecipe = new NimbusRecipe(rawRecipe);

    expect(nimbusRecipe._rawRecipe).toEqual(rawRecipe);
  });

  describe("getRecipeInfo", () => {
    it("returns a RecipeInfo object", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        userFacingName: "Test Recipe",
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const branches = nimbusRecipe.getBranchInfos();

      const recipeInfo = nimbusRecipe.getRecipeInfo();

      expect(recipeInfo).toEqual({
        startDate: rawRecipe.startDate,
        endDate: rawRecipe.endDate,
        product: "Desktop",
        id: "test-recipe",
        segment: "some segment",
        ctrPercent: 0.5,
        ctrPercentChange: 2,
        metrics: "some metrics",
        experimenterLink: `https://experimenter.services.mozilla.com/nimbus/test-recipe`,
        userFacingName: rawRecipe.userFacingName,
        nimbusExperiment: rawRecipe,
        branches: branches,
        hasMicrosurvey: false,
      });
    });
  });

  describe("getBranchInfo", () => {
    it("returns a BranchInfo object", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      // XXX should add a method to NimbusRecipe and call the getter instead of
      // violating encapsulation like this.  Or, alternately, should retrieve
      // branch info by slug.
      const branch = rawRecipe.branches[1];

      const branchInfo = nimbusRecipe.getBranchInfo(branch);

      expect(branchInfo).toEqual({
        product: "Desktop",
        id: branch.slug,
        isBranch: true,
        nimbusExperiment: rawRecipe,
        slug: branch.slug,
        surface: "testTemplate",
        template: "testTemplate",
        screenshots: ["screenshotURI"],
        description: "test description",
        hasMicrosurvey: false,
      });
    });

    it("returns a specialized BranchInfo object if the recipe is from about:welcome and has screens", () => {
      const nimbusRecipe = new NimbusRecipe(AW_RECIPE);
      const branch = AW_RECIPE.branches[1];

      const branchInfo = nimbusRecipe.getBranchInfo(branch);
      const proposedEndDate = getExperimentLookerDashboardDate(
        branchInfo.nimbusExperiment.startDate,
        branchInfo.nimbusExperiment.proposedDuration,
      );
      const formattedEndDate = formatDate(
        branchInfo.nimbusExperiment.endDate as string,
        1,
      );

      const dashboardLink = getDashboard(
        branchInfo.template as string,
        branchInfo.id,
        undefined,
        branchInfo.nimbusExperiment.slug,
        branch.slug,
        branchInfo.nimbusExperiment.startDate,
        branchInfo.nimbusExperiment.endDate
          ? formattedEndDate
          : proposedEndDate,
        false, // default for isCompleted in constructor
      );

      // XXX getBranchInfo is actually going to return a previewLink, which
      // makes this test kind of brittle. We could refactor this to no longer
      // use deepEqual and check for the existence of object properties instead.
      expect(branchInfo).toEqual({
        product: "Desktop",
        ctrDashboardLink: dashboardLink,
        id: "feature_value_id:treatment-a",
        isBranch: true,
        nimbusExperiment: AW_RECIPE,
        slug: branch.slug,
        surface: "About:Welcome Page (1st screen)",
        template: "aboutwelcome",
        previewLink:
          "about:messagepreview?json=ewAiAGkAZAAiADoAIgBhAGIAbwB1AHQAdwBlAGwAYwBvAG0AZQAtAHQAZQBzAHQALQByAGUAYwBpAHAAZQAiACwAIgB0AGUAbQBwAGwAYQB0AGUAIgA6ACIAcwBwAG8AdABsAGkAZwBoAHQAIgAsACIAdABhAHIAZwBlAHQAaQBuAGcAIgA6AHQAcgB1AGUALAAiAGMAbwBuAHQAZQBuAHQAIgA6AHsAIgBiAGEAYwBrAGQAcgBvAHAAIgA6ACIAdABlAHMAdAAtAGIAYQBjAGsAZAByAG8AcAAiACwAIgBpAGQAIgA6ACIAZgBlAGEAdAB1AHIAZQBfAHYAYQBsAHUAZQBfAGkAZAA6AHQAcgBlAGEAdABtAGUAbgB0AC0AYQAiACwAIgBzAGMAcgBlAGUAbgBzACIAOgBbAHsAIgBpAGQAIgA6ACIAVABFAFMAVABfAFMAQwBSAEUARQBOAF8ASQBEAF8AQQBfADAAIgB9AF0ALAAiAG0AbwBkAGEAbAAiADoAIgB0AGEAYgAiAH0AfQA%3D",
        screenshots: ["screenshotURI"],
        description: "treatment-a description",
        hasMicrosurvey: false,
      });
    });

    it("returns a BranchInfo that uses the message id if no screens exist", () => {
      // https://github.com/jsdom/jsdom/issues/3363 is why we're using
      // a JSON hack rather than structuredClone
      const AW_RECIPE_NO_SCREENS = JSON.parse(JSON.stringify(AW_RECIPE));
      AW_RECIPE_NO_SCREENS.branches[1].features[0].value = {
        id: "feature_value_id:treatment-a",
        backdrop: "XXX-no-msg-test-hack-deleteme-see-getBranchInfo",
      };

      const nimbusRecipe = new NimbusRecipe(AW_RECIPE_NO_SCREENS);
      const branch = AW_RECIPE_NO_SCREENS.branches[1];

      const branchInfo = nimbusRecipe.getBranchInfo(branch);
      const proposedEndDate = getExperimentLookerDashboardDate(
        branchInfo.nimbusExperiment.startDate,
        branchInfo.nimbusExperiment.proposedDuration,
      );
      const formattedEndDate = formatDate(
        branchInfo.nimbusExperiment.endDate as string,
        1,
      );

      const dashboardLink = getDashboard(
        branchInfo.template as string,
        branchInfo.id,
        undefined,
        branchInfo.nimbusExperiment.slug,
        branch.slug,
        branchInfo.nimbusExperiment.startDate,
        branchInfo.nimbusExperiment.endDate
          ? formattedEndDate
          : proposedEndDate,
        false, // default for isCompleted in constructor
      );

      expect(branchInfo).toEqual({
        product: "Desktop",
        ctrDashboardLink: dashboardLink,
        id: "feature_value_id:treatment-a",
        isBranch: true,
        nimbusExperiment: AW_RECIPE_NO_SCREENS,
        slug: branch.slug,
        surface: "About:Welcome Page (1st screen)",
        template: "aboutwelcome",
        screenshots: ["screenshotURI"],
        description: "treatment-a description",
        hasMicrosurvey: false,
      });
    });
  });

  describe("getBranchInfos", () => {
    it("returns an array of BranchInfo objects, one per branch", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);

      const branchInfos: BranchInfo[] = nimbusRecipe.getBranchInfos();

      expect(branchInfos[0]).toEqual({
        product: "Desktop",
        id: "control",
        isBranch: true,
        nimbusExperiment: rawRecipe,
        slug: "control",
        surface: "none",
        template: "none",
        screenshots: [],
        description: "control description",
        hasMicrosurvey: false,
      });

      expect(branchInfos[1]).toEqual({
        product: "Desktop",
        id: "treatment",
        isBranch: true,
        nimbusExperiment: rawRecipe,
        slug: "treatment",
        surface: "testTemplate",
        template: "testTemplate",
        screenshots: ["screenshotURI"],
        description: "test description",
        hasMicrosurvey: false,
      });
    });
  });

  describe("getBranchScreenshotsLink", () => {
    it("returns a link to the branch summary in experimenter", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        slug: "goat shearing`test",
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe);

      // having a weird char in the branch slug helps test that the code
      // is calling encodeURIComponent
      const branchSlug: string = "treatment`a";
      const screenshotsAnchorId = `branch-${encodeURIComponent(branchSlug)}-screenshots`;

      const result = nimbusRecipe.getBranchScreenshotsLink(branchSlug);

      expect(result).toBe(
        `https://experimenter.services.mozilla.com/nimbus/${encodeURIComponent(rawRecipe.slug)}/summary#${screenshotsAnchorId}`,
      );
    });
  });

  describe("usesMessagingFeatures", () => {
    it("returns true if the recipe uses messaging features", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        featureIds: ["fxms-message-1"],
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe);

      const result = nimbusRecipe.usesMessagingFeatures();

      expect(result).toBe(true);
    });

    it("returns false if the recipe does not use messaging features", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        featureIds: ["monkeys-1"],
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe);

      const result = nimbusRecipe.usesMessagingFeatures();

      expect(result).toBe(false);
    });

    it("returns true if featureIds[1] is a messaging feature", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        featureIds: ["monkeys-1", "fxms-message-1"],
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe);

      const result = nimbusRecipe.usesMessagingFeatures();

      expect(result).toBe(true);
    });
  });

  describe("isExpRecipe", () => {
    it("returns true if the recipe is an experiment recipe not in rollout", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);

      const result = nimbusRecipe.isExpRecipe();

      expect(result).toBe(true);
    });

    it("returns false if the recipe is a message rollout", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        isRollout: true,
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe);

      const result = nimbusRecipe.isExpRecipe();

      expect(result).toBe(false);
    });
  });

  describe("getBranchRecipeLink", () => {
    it("returns a link to the branch recipe in experimenter", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        slug: "goat shearing`test",
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe);

      // having a weird char in the branch slug helps test that the code
      // is calling encodeURIComponent
      const branchSlug: string = "treatment`a";

      const result = nimbusRecipe.getBranchRecipeLink(branchSlug);

      expect(result).toBe(
        `https://experimenter.services.mozilla.com/nimbus/${encodeURIComponent(
          rawRecipe.slug,
        )}/summary#${branchSlug}`,
      );
    });
  });

  describe("getExperimentBriefLink", () => {
    it("returns the correct experiment brief link", () => {
      const documentationLinks = [
        {
          title: "DESIGN_DOC",
          link: "https://docs.google.com/document/d/1mKXnU-qbStb1OUNHmDOQY5Awb-Wz5e8wit28jkUKP-4/edit#heading=h.uoblsnu302hk",
        },
        {
          title: "ENG_TICKET",
          link: "https://mozilla-hub.atlassian.net/browse/OMC-811",
        },
        {
          title: "DESIGN_DOC",
          link: "https://www.figma.com/design/V2alIUZh1C4UXoWacJjZCA/Bookmarks-improvements?node-id=2073-16689&node-type=canvas&t=yXRpQavvJl25GGbF-0",
        },
      ];
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);

      const result = nimbusRecipe.getExperimentBriefLink(documentationLinks);

      expect(result).toBe(
        "https://docs.google.com/document/d/1mKXnU-qbStb1OUNHmDOQY5Awb-Wz5e8wit28jkUKP-4/edit#heading=h.uoblsnu302hk",
      );
    });

    it("returns undefined if no experiment brief document exists", () => {
      const documentationLinks = [
        {
          title: "DS_JIRA",
          link: "https://mozilla-hub.atlassian.net/browse/DS-3819",
        },
        {
          title: "ENG_TICKET",
          link: "https://mozilla-hub.atlassian.net/browse/FXE-952",
        },
      ];
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);

      const result = nimbusRecipe.getExperimentBriefLink(documentationLinks);

      expect(result).toBeUndefined();
    });
  });

  it("returns undefined if no documentation link exists", () => {
    const rawRecipe = ExperimentFakes.recipe("test-recipe");
    const nimbusRecipe = new NimbusRecipe(rawRecipe);

    const result = nimbusRecipe.getExperimentBriefLink(undefined);

    expect(result).toBeUndefined();
  });
});
