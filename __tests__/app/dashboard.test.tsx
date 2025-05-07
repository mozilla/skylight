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

const mockFetchData = {
  localData: [],
  experimentAndBranchInfo: [],
  totalExperiments: 0,
  msgRolloutInfo: [],
  totalRolloutExperiments: 0,
};

// XXX these issues seem to be in part related to asynchrony and
// have so far turned out be difficult to resolve. Let's see if upgrading to
// React 19 makes this easier to untangle so we can re-enabled. It's
// conceivable that there are bugs in the framework software or bundler that
// are in play.
describe.skip("Dashboard", () => {
  it("all timeline pill ids exist in the Dashboard component in /", async () => {
    const dashboard = await render(await (<Dashboard {...mockFetchData} />));

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
