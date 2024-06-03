import { fireEvent, render, screen } from "@testing-library/react";
import { MessageTable } from "@/app/message-table";
import { experimentColumns, RecipeOrBranchInfo } from "@/app/columns";
import { ExperimentFakes } from "@/__tests__/ExperimentFakes.mjs";
import { NimbusRecipe } from "@/lib/nimbusRecipe";

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

    it("displays CTR percentages if Looker dashboard exists", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const branchInfos = nimbusRecipe.getBranchInfos()
      branchInfos[0].ctrDashboardLink = "https://mozilla.cloud.looker.com/dashboards/1677?Message+ID=%25FEATURE_VALUE_ID%3ATREATMENT-A%25&Normalized+Channel=&Experiment=aboutwelcome-test-recipe&Branch=treatment-a"
      branchInfos[0].ctrPercent = 23.2
      let updatedRecipe = nimbusRecipe.getRecipeInfo()
      updatedRecipe.branches = branchInfos
      const messageTableData: RecipeOrBranchInfo[] =
        [updatedRecipe];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />
      );

      const toggleButton = screen.getByTestId("toggleBranchRowsButton");
      fireEvent.click(toggleButton);
      const ctrMetric = screen.getByText("23.2% CTR")

      expect(ctrMetric).toBeInTheDocument();
    });

    it("doesn't display any CTR percentages if Looker dashboard doesn't exist", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeOrBranchInfo[] =
        [nimbusRecipe.getRecipeInfo()];
      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />
      );

      const ctrMetrics = screen.queryByText("CTR");

      expect(ctrMetrics).not.toBeInTheDocument();
    });
  });
});
