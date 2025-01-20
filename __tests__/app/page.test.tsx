import Dashboard from "@/app/page";
import CompleteExperimentsDashboard from "@/app/complete/page";
import { render } from "@testing-library/react";
import { ExperimentFakes } from "../ExperimentFakes.mjs";
import { BranchInfo } from "@/app/columns";

const fakeFetchData: BranchInfo[] = [ExperimentFakes.recipe()];
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(fakeFetchData),
  }),
) as jest.Mock;

describe("Page", () => {
  it("all timeline pill ids exist in the Dashboard component in /", async () => {
    const dashboard = render(await Dashboard());

    const firefox = dashboard.getByTestId("firefox");
    const experiments = dashboard.getByTestId("live_experiments");
    const rollouts = dashboard.getByTestId("live_rollouts");

    expect(firefox).toBeDefined();
    expect(experiments).toBeDefined();
    expect(rollouts).toBeDefined();
  });

  it("all timeline pill ids exist in the Dashboard component in /complete", async () => {
    const dashboard = render(await CompleteExperimentsDashboard());

    const experiments = dashboard.getByTestId("complete_experiments");
    const rollouts = dashboard.getByTestId("complete_rollouts");

    expect(experiments).toBeDefined();
    expect(rollouts).toBeDefined();
  });
});
