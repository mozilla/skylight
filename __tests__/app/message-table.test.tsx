import { render, screen } from "@testing-library/react";
import { MessageTable } from "@/app/message-table";
import { experimentColumns, RecipeOrBranchInfo } from "@/app/columns";
import { ExperimentFakes } from "@/__tests__/ExperimentFakes.mjs";
import { NimbusRecipe } from "@/lib/nimbusRecipe";

describe("MessageTable", () => {
  describe("ExperimentColumns", () => {
    it("renders the branch description and slug", () => {
      const rawRecipe = ExperimentFakes.recipe("test-recipe");
      const nimbusRecipe = new NimbusRecipe(rawRecipe);
      const messageTableData: RecipeOrBranchInfo[] = nimbusRecipe
        .getRecipeOrBranchInfos()
        .flat(1);

      render(
        <MessageTable columns={experimentColumns} data={messageTableData} />
      );

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("test description")).toBeInTheDocument();
      expect(screen.getByText("treatment")).toBeInTheDocument();
    });
  });
});
