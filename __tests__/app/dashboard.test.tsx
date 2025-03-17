import { Dashboard } from "@/app/dashboard";
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

describe("Dashboard", () => {
  it("all timeline pill ids exist in the Dashboard component in /", async () => {
    const dashboard = render(await Dashboard({platform: "desktop"}));

    const firefox = dashboard.getByTestId("firefox");
    const experiments = dashboard.getByTestId("live_experiments");
    const rollouts = dashboard.getByTestId("live_rollouts");

    expect(firefox).toBeInTheDocument();
    expect(experiments).toBeInTheDocument();
    expect(rollouts).toBeInTheDocument();
  });

  it("all timeline pill ids exist in the Dashboard component in /complete", async () => {
    const dashboard = render(await CompleteExperimentsDashboard());

    const experiments = dashboard.getByTestId("complete_experiments");
    const rollouts = dashboard.getByTestId("complete_rollouts");

    expect(experiments).toBeInTheDocument();
    expect(rollouts).toBeInTheDocument();
  });
});
