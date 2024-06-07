import { fireEvent, render, screen } from "@testing-library/react";
import { MessageTable } from "@/app/message-table";
import { experimentColumns, fxmsMessageColumns, FxMSMessageInfo, RecipeInfo, RecipeOrBranchInfo } from "@/app/columns";
import { ExperimentFakes } from "@/__tests__/ExperimentFakes.mjs";
import { NimbusRecipeCollection } from "@/lib/nimbusRecipeCollection";
import { NimbusRecipe } from "@/lib/nimbusRecipe";

const fakeQueryResult = {
  "event_counts.submission_timestamp_date": "2024-06-04",
  primary_rate: 0.123456789,
  other_rate: 0.987654321,
  "event_counts.user_count": {},
};
jest.mock("../../lib/looker", () => {
  return {
    _esModule: true,
    getAWDashboardElement0: jest.fn(() => "mocked dashboard element"),
    runEventCountQuery: jest.fn(() => fakeQueryResult),
    getCTRPercent: jest.fn(() =>
      Number(Number(fakeQueryResult.primary_rate * 100).toFixed(1))
    ),
  };
});

describe("MessageTable", () => {
  describe("ExperimentColumns", () => {
    it("renders the branch description and slug on expanded branch rows", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeOrBranchInfo[] =
        [nimbusRecipe.getRecipeInfo()];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />
      );

      const toggleButton = screen.getByTestId("toggleBranchRowsButton")
      fireEvent.click(toggleButton)

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
        <MessageTable columns={experimentColumns} data={messageTableData} />
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
        <MessageTable columns={experimentColumns} data={messageTableData} />
      );

      const controlBranchDescription = screen.queryByText(
        "control description"
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
        <MessageTable columns={experimentColumns} data={messageTableData} />
      );

      const toggleButton = screen.getByTestId("toggleBranchRowsButton");
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);

      const controlBranchDescription = screen.queryByText(
        "control description"
      );
      expect(controlBranchDescription).not.toBeInTheDocument();
      const treatmentBranchDescription = screen.queryByText("test description");
      expect(treatmentBranchDescription).not.toBeInTheDocument();
    });

    it("displays CTR percentages when Looker dashboard exists and CTR is defined", async () => {
      const nimbusRecipeCollection = new NimbusRecipeCollection();
      nimbusRecipeCollection.recipes = [
        new NimbusRecipe(ExperimentFakes.recipe()),
      ];
      const recipeInfos =
        (await nimbusRecipeCollection.getExperimentAndBranchInfos()) as RecipeInfo[];
      // Setting fake dashboard link in order to render in MessageTable
      recipeInfos[0].branches[0].ctrDashboardLink = "test link";
      render(<MessageTable columns={experimentColumns} data={recipeInfos} />);

      const toggleButton = screen.getByTestId("toggleAllRowsButton");
      fireEvent.click(toggleButton);
      const ctrMetrics = screen.getByText("12.3% CTR");

      expect(recipeInfos[0].branches[0].ctrPercent).toBe(12.3);
      expect(recipeInfos[0].branches[0].ctrDashboardLink).toBeDefined();
      expect(ctrMetrics).toBeInTheDocument();
    });

    it("displays 'Dashboard' when Looker dashboard exists but CTR is undefined", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      let recipeInfo = nimbusRecipe.getRecipeInfo();
      // Setting fake dashboard link in order to render in MessageTable
      recipeInfo.branches[0].ctrDashboardLink = "test link";
      render(<MessageTable columns={experimentColumns} data={[recipeInfo]} />);

      const toggleButton = screen.getByTestId("toggleAllRowsButton");
      fireEvent.click(toggleButton);
      const dashboardLink = screen.getByText("Dashboard");
      const ctrMetrics = screen.queryByText("CTR");

      expect(recipeInfo.branches[0].ctrPercent).not.toBeDefined()
      expect(recipeInfo.branches[0].ctrDashboardLink).toBeDefined();
      expect(dashboardLink).toBeInTheDocument();
      expect(ctrMetrics).not.toBeInTheDocument();
    });

    it("doesn't display any metric when Looker dashboard doesn't exist", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeOrBranchInfo[] = [
        nimbusRecipe.getRecipeInfo(),
      ];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />
      );

      const toggleButton = screen.getByTestId("toggleAllRowsButton");
      fireEvent.click(toggleButton);
      const ctrMetrics = screen.queryByText("CTR");
      const dashboardLink = screen.queryByText("Dashboard");

      expect(ctrMetrics).not.toBeInTheDocument();
      expect(dashboardLink).not.toBeInTheDocument();
    });
  });

  describe("MessageColumns", () => {
    it("displays CTR percentages when Looker dashboard exists and CTR is defined", async () => {
      const fakeMsgInfo: FxMSMessageInfo = {
        product: "Desktop",
        id: "test id",
        template: "test template",
        surface: "test surface",
        segment: "test segment",
        metrics: "test metrics",
        ctrPercent: 12.3,
        ctrPercentChange: 2,
        ctrDashboardLink: "test link"
      };
      render(<MessageTable columns={fxmsMessageColumns} data={[fakeMsgInfo]} />);

      const ctrMetrics = screen.getByText("12.3% CTR");

      expect(ctrMetrics).toBeInTheDocument();
    });

    it("displays 'Dashboard' when Looker dashboard exists but CTR is undefined", () => {
      const fakeMsgInfo: FxMSMessageInfo = {
        product: "Desktop",
        id: "test id",
        template: "test template",
        surface: "test surface",
        segment: "test segment",
        metrics: "test metrics",
        ctrDashboardLink: "test link"
      };
      render(<MessageTable columns={fxmsMessageColumns} data={[fakeMsgInfo]} />);

      const ctrMetrics = screen.queryByText("CTR");
      const dashboardLink = screen.getByText("Dashboard");

      expect(ctrMetrics).not.toBeInTheDocument();
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
        <MessageTable columns={fxmsMessageColumns} data={[fxmsMsgInfo]} />
      );

      const ctrMetrics = screen.queryByText("CTR");
      const dashboardLink = screen.queryByText("Dashboard");

      expect(ctrMetrics).not.toBeInTheDocument();
      expect(dashboardLink).not.toBeInTheDocument();
    });
  });
});
