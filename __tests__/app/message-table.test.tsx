import { act, fireEvent, render, screen } from "@testing-library/react";
import { MessageTable } from "@/app/message-table";
import {
  completedExperimentColumns,
  experimentColumns,
  fxmsMessageColumns,
  FxMSMessageInfo,
  RecipeInfo,
  RecipeOrBranchInfo,
} from "@/app/columns";
import { ExperimentFakes } from "@/__tests__/ExperimentFakes.mjs";
import { NimbusRecipeCollection } from "@/lib/nimbusRecipeCollection";
import { NimbusRecipe } from "@/lib/nimbusRecipe";
import { compareSurfacesFn } from "@/lib/messageUtils";
import userEvent from "@testing-library/user-event";

// These are part of the mock control API
// eslint-disable-next-line jest/no-mocks-import
import { resetMockState, setMockPlatform } from "@/lib/__mocks__/sdk";

jest.mock("../../lib/sdk");

afterEach(() => {
  resetMockState();
});

describe("MessageTable", () => {
  describe("ExperimentColumns", () => {
    it("renders the branch description and slug on expanded branch rows", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeOrBranchInfo[] = [
        nimbusRecipe.getRecipeInfo(),
      ];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );

      const toggleButton = screen.getByTestId("toggleBranchRowsButton");
      fireEvent.click(toggleButton);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("test description")).toBeInTheDocument();
      expect(screen.getByText("treatment")).toBeInTheDocument();
    });

    it("expands all experiment rows when clicking the header toggle button", () => {
      const rawRecipe1 = ExperimentFakes.recipe("test-recipe-1");
      const rawRecipe2 = ExperimentFakes.recipe("test-recipe-2");
      const nimbusRecipe1 = new NimbusRecipe(rawRecipe1);
      const nimbusRecipe2 = new NimbusRecipe(rawRecipe2);
      const messageTableData: RecipeOrBranchInfo[] = [
        nimbusRecipe1.getRecipeInfo(),
        nimbusRecipe2.getRecipeInfo(),
      ];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );

      const toggleButton = screen.getByTestId("toggleAllRowsButton");
      fireEvent.click(toggleButton);

      expect(screen.getAllByText("control description").length).toBe(2);
      expect(screen.getAllByText("control").length).toBe(2);
      expect(screen.getAllByText("test description").length).toBe(2);
      expect(screen.getAllByText("treatment").length).toBe(2);
    });

    it("renders collapsed branch rows at start up", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeOrBranchInfo[] = [
        nimbusRecipe.getRecipeInfo(),
      ];

      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );

      const controlBranchDescription = screen.queryByText(
        "control description",
      );
      expect(controlBranchDescription).not.toBeInTheDocument();
      const treatmentBranchDescription = screen.queryByText("test description");
      expect(treatmentBranchDescription).not.toBeInTheDocument();
    });

    it("collapses branch rows when clicking the experiment toggle button again after expanding the rows", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeOrBranchInfo[] = [
        nimbusRecipe.getRecipeInfo(),
      ];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );

      const toggleButton = screen.getByTestId("toggleBranchRowsButton");
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);

      const controlBranchDescription = screen.queryByText(
        "control description",
      );
      expect(controlBranchDescription).not.toBeInTheDocument();
      const treatmentBranchDescription = screen.queryByText("test description");
      expect(treatmentBranchDescription).not.toBeInTheDocument();
    });

    it("renders preview buttons for infobars", () => {
      const infobarRecipe = ExperimentFakes.recipe("test-recipe");
      // infobar needs a content object to generate a previewLink
      infobarRecipe.branches[1].features[0].value.template = "infobar";
      infobarRecipe.branches[1].features[0].value.content = { string: "test" };
      const nimbusRecipe = new NimbusRecipe(infobarRecipe);
      const messageTableData: RecipeOrBranchInfo[] = [
        nimbusRecipe.getRecipeInfo(),
      ];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );
      const toggleButton = screen.getByTestId("toggleAllRowsButton");

      fireEvent.click(toggleButton);

      expect(screen.getAllByText("Copy Preview URL").length).toBe(1);
    });

    it("renders preview buttons for spotlights", () => {
      const spotlightRecipe = ExperimentFakes.recipe("test-recipe");
      spotlightRecipe.branches[1].features[0].value.template = "spotlight";
      const nimbusRecipe = new NimbusRecipe(spotlightRecipe);
      const messageTableData: RecipeOrBranchInfo[] = [
        nimbusRecipe.getRecipeInfo(),
      ];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );
      const toggleButton = screen.getByTestId("toggleAllRowsButton");

      fireEvent.click(toggleButton);

      expect(screen.getAllByText("Copy Preview URL").length).toBe(1);
    });

    it("renders preview buttons for feature callouts", () => {
      const featureCalloutRecipe = ExperimentFakes.recipe("test-recipe");
      // feature callout needs screens to generate a previewLink
      featureCalloutRecipe.branches[1].features[0].value.template =
        "feature_callout";
      featureCalloutRecipe.branches[1].features[0].value.content = {
        screens: [{ id: "testID" }],
      };
      const nimbusRecipe = new NimbusRecipe(featureCalloutRecipe);
      const messageTableData: RecipeOrBranchInfo[] = [
        nimbusRecipe.getRecipeInfo(),
      ];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );
      const toggleButton = screen.getByTestId("toggleAllRowsButton");

      fireEvent.click(toggleButton);

      expect(screen.getAllByText("Copy Preview URL").length).toBe(1);
    });

    it("does not render a preview button for toasts", () => {
      const toastRecipe = ExperimentFakes.recipe("test-recipe");
      // we don't generate a previewLink for toasts
      toastRecipe.branches[1].features[0].value.template = "toast_notification";
      toastRecipe.branches[1].features[0].value.content = { tag: "test tag" };
      const nimbusRecipe = new NimbusRecipe(toastRecipe);
      const messageTableData: RecipeOrBranchInfo[] = [
        nimbusRecipe.getRecipeInfo(),
      ];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );
      const toggleButton = screen.getByTestId("toggleAllRowsButton");

      fireEvent.click(toggleButton);

      const previewButton = screen.queryByText("Copy Preview URL");
      expect(previewButton).not.toBeInTheDocument();
    });

    it("displays UCTR percentages when Looker dashboard exists and UCTR is defined", async () => {
      setMockPlatform("firefox-desktop");
      const nimbusRecipeCollection = new NimbusRecipeCollection();
      nimbusRecipeCollection.recipes = [
        new NimbusRecipe(ExperimentFakes.recipe()),
      ];
      const recipeInfos =
        (await nimbusRecipeCollection.getExperimentAndBranchInfos()) as RecipeInfo[];
      // Setting fake dashboard link in order to render in MessageTable
      recipeInfos[0].branches[0].uctrDashboardLink = "test link";

      render(<MessageTable columns={experimentColumns} data={recipeInfos} />);

      const toggleButton = screen.getByTestId("toggleAllRowsButton");
      fireEvent.click(toggleButton);
      const uctrMetrics = screen.getByText("12.35% UCTR", {
        exact: false,
      });

      expect(recipeInfos[0].branches[0].uctrPercent).toBe(12.35);
      expect(recipeInfos[0].branches[0].uctrDashboardLink).toBeDefined();
      expect(uctrMetrics).toBeInTheDocument();
    });

    it("displays 'Dashboard' when Looker dashboard exists but UCTR is undefined", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      let recipeInfo = nimbusRecipe.getRecipeInfo();
      // Setting fake dashboard link in order to render in MessageTable
      recipeInfo.branches[0].uctrDashboardLink = "test link";
      render(<MessageTable columns={experimentColumns} data={[recipeInfo]} />);

      const toggleButton = screen.getByTestId("toggleAllRowsButton");
      fireEvent.click(toggleButton);
      const dashboardLink = screen.getByText("Dashboard");
      const uctrMetrics = screen.queryByText("UCTR");

      expect(recipeInfo.branches[0].uctrPercent).not.toBeDefined();
      expect(recipeInfo.branches[0].uctrDashboardLink).toBeDefined();
      expect(dashboardLink).toBeInTheDocument();
      expect(uctrMetrics).not.toBeInTheDocument();
    });

    it("doesn't display any metric when Looker dashboard doesn't exist", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeInfo[] = [nimbusRecipe.getRecipeInfo()];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );

      const toggleButton = screen.getByTestId("toggleAllRowsButton");
      fireEvent.click(toggleButton);
      const uctrMetrics = screen.queryByText("UCTR");
      const dashboardLink = screen.queryByText("Dashboard");

      expect(messageTableData[0].branches[0].uctrPercent).not.toBeDefined();
      expect(
        messageTableData[0].branches[0].uctrDashboardLink,
      ).not.toBeDefined();
      expect(uctrMetrics).not.toBeInTheDocument();
      expect(dashboardLink).not.toBeInTheDocument();
    });

    it("displays a 'Microsurvey' badge if the experiment recipe id contains a 'survey' substring", () => {
      const rawRecipe = ExperimentFakes.recipe("microsurvey-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeInfo[] = [nimbusRecipe.getRecipeInfo()];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );

      const microsurveyBadge = screen.getByText("Microsurvey");

      expect(microsurveyBadge).toBeInTheDocument();
    });

    it("displays a 'Microsurvey' badge if the experiment branch slug contains a 'survey' substring", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        branches: [
          {
            slug: "Test-Micro-Survey",
            description: "test description",
            ratio: 1,
            features: [
              {
                featureId: "testFeature",
                value: { testInt: 123, enabled: true },
              },
            ],
            screenshots: [],
          },
        ],
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeInfo[] = [nimbusRecipe.getRecipeInfo()];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );

      const microsurveyBadge = screen.getByText("Microsurvey");

      expect(microsurveyBadge).toBeInTheDocument();
    });

    it("displays a 'Microsurvey' badge if the experiment branch description contains a 'survey' substring", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        branches: [
          {
            slug: "test-slug",
            description: "this is a description for a MICROSURVEY",
            ratio: 1,
            features: [
              {
                featureId: "testFeature",
                value: { testInt: 123, enabled: true },
              },
            ],
            screenshots: [],
          },
        ],
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeInfo[] = [nimbusRecipe.getRecipeInfo()];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );

      const microsurveyBadge = screen.getByText("Microsurvey");

      expect(microsurveyBadge).toBeInTheDocument();
    });

    it("displays a tooltip when hovering on an experiment name", async () => {
      const user = userEvent.setup();
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        userFacingName: "Test Experiment Name",
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeInfo[] = [nimbusRecipe.getRecipeInfo()];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />,
      );

      await act(async () => {
        await user.hover(screen.getByText("Test Experiment Name"));
      });
      const tooltip = await screen.findByRole("tooltip");

      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent("Go to Experimenter page");
    });
  });

  describe("MessageColumns", () => {
    it("displays UCTR percentages when Looker dashboard exists and UCTR is defined", async () => {
      const fakeMsgInfo: FxMSMessageInfo = {
        product: "Desktop",
        id: "test id",
        template: "test template",
        surface: "test surface",
        segment: "test segment",
        metrics: "test metrics",
        uctrPercent: 12.35,
        uctrPercentChange: 2,
        uctrDashboardLink: "test link",
        impressions: 12899,
      };
      render(
        <MessageTable columns={fxmsMessageColumns} data={[fakeMsgInfo]} />,
      );

      const uctrMetrics = screen.getByText("12.35% UCTR", {
        exact: false,
      });

      expect(uctrMetrics).toBeInTheDocument();
    });

    it("displays 'Dashboard' when Looker dashboard exists but UCTR is undefined", () => {
      const fakeMsgInfo: FxMSMessageInfo = {
        product: "Desktop",
        id: "test id",
        template: "test template",
        surface: "test surface",
        segment: "test segment",
        metrics: "test metrics",
        uctrDashboardLink: "test link",
      };
      render(
        <MessageTable columns={fxmsMessageColumns} data={[fakeMsgInfo]} />,
      );

      const uctrMetrics = screen.queryByText("UCTR");
      const dashboardLink = screen.getByText("Dashboard");

      expect(uctrMetrics).not.toBeInTheDocument();
      expect(dashboardLink).toBeInTheDocument();
    });

    it("doesn't display any metrics when Looker dashboard doesn't exist", () => {
      const fxmsMsgInfo: FxMSMessageInfo = {
        product: "Desktop",
        id: "test id",
        template: "test template",
        surface: "test surface",
        segment: "test segment",
        metrics: "test metrics",
      };
      render(
        <MessageTable columns={fxmsMessageColumns} data={[fxmsMsgInfo]} />,
      );

      const uctrMetrics = screen.queryByText("UCTR");
      const dashboardLink = screen.queryByText("Dashboard");

      expect(uctrMetrics).not.toBeInTheDocument();
      expect(dashboardLink).not.toBeInTheDocument();
    });

    it("displays a 'Microsurvey' badge when the message id is a microsurvey", () => {
      const fxmsMsgInfo: FxMSMessageInfo = {
        product: "Desktop",
        id: "test micro survey id",
        template: "test template",
        surface: "test surface",
        segment: "test segment",
        metrics: "test metrics",
        hasMicrosurvey: true,
      };
      render(
        <MessageTable columns={fxmsMessageColumns} data={[fxmsMsgInfo]} />,
      );

      const microsurveyBadge = screen.getByText("Microsurvey");

      expect(microsurveyBadge).toBeInTheDocument();
    });

    it("filters message with less than HIDDEN_MESSAGE_IMPRESSION_THRESHOLD impressions when canHideMessages is true", () => {
      const impressions = process.env.HIDDEN_MESSAGE_IMPRESSION_THRESHOLD;

      const fxmsMsgInfo1: FxMSMessageInfo = {
        product: "Desktop",
        id: "MESSAGE_1",
        template: "test template",
        surface: "test surface",
        segment: "test segment",
        metrics: "test metrics",
        uctrPercent: 24.3,
        impressions: parseInt(impressions!) + 100,
      };
      const fxmsMsgInfo2: FxMSMessageInfo = {
        product: "Desktop",
        id: "MESSAGE_2",
        template: "test template",
        surface: "test surface",
        segment: "test segment",
        metrics: "test metrics",
        uctrPercent: 24.3,
        impressions: parseInt(impressions!) - 100,
      };
      const fxmsMsgInfo3: FxMSMessageInfo = {
        product: "Desktop",
        id: "MESSAGE_3",
        template: "test template",
        surface: "test surface",
        segment: "test segment",
        metrics: "test metrics",
        uctrPercent: 24.3,
        impressions: parseInt(impressions!),
      };
      render(
        <MessageTable
          columns={fxmsMessageColumns}
          data={[fxmsMsgInfo1, fxmsMsgInfo2, fxmsMsgInfo3]}
          canHideMessages={true}
          impressionsThreshold={impressions}
        />,
      );

      const hideMessageButton = screen.getByRole("checkbox");
      fireEvent.click(hideMessageButton);
      const hiddenMessage = screen.queryByText("MESSAGE_2");
      const message1 = screen.getByText("MESSAGE_1");
      const message3 = screen.getByText("MESSAGE_3");

      expect(hiddenMessage).not.toBeInTheDocument();
      expect(message1).toBeInTheDocument();
      expect(message3).toBeInTheDocument();
    });

    it("compareSurfacesFn sorts the messages by surface types in MessageTable", () => {
      const fxmsMsgInfo1: FxMSMessageInfo = {
        product: "Desktop",
        id: "MESSAGE_1",
        template: "feature_callout",
        surface: "Feature Callout (1st screen)",
        segment: "test segment",
        metrics: "test metrics",
        uctrPercent: 24.3,
        impressions: 1000,
      };
      const fxmsMsgInfo2: FxMSMessageInfo = {
        product: "Desktop",
        id: "MESSAGE_2",
        template: "defaultaboutwelcome",
        surface: "Default About:Welcome Message (1st screen)",
        segment: "test segment",
        metrics: "test metrics",
        uctrPercent: 24.3,
        impressions: 1000,
      };
      const fxmsMsgInfo3: FxMSMessageInfo = {
        product: "Desktop",
        id: "MESSAGE_3",
        template: "pb_newtab",
        surface: "Private Browsing New Tab",
        segment: "test segment",
        metrics: "test metrics",
        uctrPercent: 24.3,
        impressions: 1000,
      };

      render(
        <MessageTable
          columns={fxmsMessageColumns}
          data={[fxmsMsgInfo1, fxmsMsgInfo2, fxmsMsgInfo3].sort(
            compareSurfacesFn,
          )}
        />,
      );

      const featureCalloutMsg = screen.getByText("MESSAGE_1");
      const defaultAboutWelcomeMsg = screen.getByText("MESSAGE_2");
      const privateBrowsingMsg = screen.getByText("MESSAGE_3");

      // See https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition for more details
      expect(
        defaultAboutWelcomeMsg.compareDocumentPosition(featureCalloutMsg),
      ).toBe(4);
      expect(
        featureCalloutMsg.compareDocumentPosition(privateBrowsingMsg),
      ).toBe(4);
    });

    describe("filtering messages by surface", () => {
      let messages: FxMSMessageInfo[];

      beforeEach(() => {
        const fxmsMsgInfo1: FxMSMessageInfo = {
          product: "Desktop",
          id: "MESSAGE_1",
          template: "feature_callout",
          surface: "Feature Callout (1st screen)",
          segment: "test segment",
          metrics: "test metrics",
          uctrPercent: 24.3,
          impressions: 1000,
        };
        const fxmsMsgInfo2: FxMSMessageInfo = {
          product: "Desktop",
          id: "MESSAGE_2",
          template: "infobar",
          surface: "InfoBar",
          segment: "test segment",
          metrics: "test metrics",
          uctrPercent: 24.3,
          impressions: 1000,
        };
        const fxmsMsgInfo3: FxMSMessageInfo = {
          product: "Desktop",
          id: "MESSAGE_3",
          template: "defaultaboutwelcome",
          surface: "Default About:Welcome Message (1st screen)",
          segment: "test segment",
          metrics: "test metrics",
          uctrPercent: 24.3,
          impressions: 1000,
        };

        messages = [fxmsMsgInfo1, fxmsMsgInfo2, fxmsMsgInfo3];
      });

      it("filters messages by surface without any case sensitivity", async () => {
        const user = userEvent.setup();

        render(<MessageTable columns={fxmsMessageColumns} data={messages} />);
        const surfaceFilterTextBox = await screen.findByRole("textbox");
        await user.type(surfaceFilterTextBox, "feature");

        const featureCalloutMsg = await screen.findByText("MESSAGE_1");
        const infoBarMsg = screen.queryByText("MESSAGE_2");
        const defaultAboutWelcomeMsg = screen.queryByText("MESSAGE_3");

        expect(featureCalloutMsg).toBeInTheDocument();
        expect(infoBarMsg).not.toBeInTheDocument();
        expect(defaultAboutWelcomeMsg).not.toBeInTheDocument();
      });

      it("filters messages by surface for any substring", async () => {
        const user = userEvent.setup();

        render(<MessageTable columns={fxmsMessageColumns} data={messages} />);
        const surfaceFilterTextBox = await screen.findByRole("textbox");
        await user.type(surfaceFilterTextBox, "1st");

        const featureCalloutMsg = await screen.findByText("MESSAGE_1");
        const infoBarMsg = screen.queryByText("MESSAGE_2");
        const defaultAboutWelcomeMsg = await screen.findByText("MESSAGE_3");

        expect(featureCalloutMsg).toBeInTheDocument();
        expect(infoBarMsg).not.toBeInTheDocument();
        expect(defaultAboutWelcomeMsg).toBeInTheDocument();
      });
    });

    it("truncates message ID if it's over 50 characters long", () => {
      const messageId =
        "12345678901234567890123456789012345678901234567890 is 50 characters long";
      const fakeMsgInfo: FxMSMessageInfo = {
        product: "Desktop",
        id: messageId,
        template: "test template",
        surface: "test surface",
        segment: "test segment",
        metrics: "test metrics",
        uctrDashboardLink: "test link",
      };
      render(
        <MessageTable columns={fxmsMessageColumns} data={[fakeMsgInfo]} />,
      );

      const message = screen.queryByText(messageId);
      const truncatedMessage = screen.queryByText(
        "12345678901234567890123456789012345678901234567890…",
      );

      expect(message).not.toBeInTheDocument();
      expect(truncatedMessage).toBeInTheDocument();
    });
  });

  describe("CompletedExperimentColumns", () => {
    it("displays a 'Microsurvey' badge if the completed experiment recipe id contains a 'survey' substring", () => {
      const rawRecipe = ExperimentFakes.recipe("microsurvey-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeInfo[] = [nimbusRecipe.getRecipeInfo()];
      render(
        <MessageTable
          columns={completedExperimentColumns}
          data={messageTableData}
        />,
      );

      const microsurveyBadge = screen.getByText("Microsurvey");

      expect(microsurveyBadge).toBeInTheDocument();
    });

    it("displays a 'Microsurvey' badge if the completed experiment branch slug contains a 'survey' substring", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        branches: [
          {
            slug: "Test-Micro-Survey",
            description: "test description",
            ratio: 1,
            features: [
              {
                featureId: "testFeature",
                value: { testInt: 123, enabled: true },
              },
            ],
            screenshots: [],
          },
        ],
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeInfo[] = [nimbusRecipe.getRecipeInfo()];
      render(
        <MessageTable
          columns={completedExperimentColumns}
          data={messageTableData}
        />,
      );

      const microsurveyBadge = screen.getByText("Microsurvey");

      expect(microsurveyBadge).toBeInTheDocument();
    });

    it("displays a 'Microsurvey' badge if the completed experiment branch description contains a 'survey' substring", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe", {
        branches: [
          {
            slug: "test-slug",
            description: "this is a description for a MICROSURVEY",
            ratio: 1,
            features: [
              {
                featureId: "testFeature",
                value: { testInt: 123, enabled: true },
              },
            ],
            screenshots: [],
          },
        ],
      });
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeInfo[] = [nimbusRecipe.getRecipeInfo()];
      render(
        <MessageTable
          columns={completedExperimentColumns}
          data={messageTableData}
        />,
      );

      const microsurveyBadge = screen.getByText("Microsurvey");

      expect(microsurveyBadge).toBeInTheDocument();
    });
  });
});
