import { Timeline } from "@/components/ui/timeline";
import { render, screen } from "@testing-library/react";

describe("Timeline", () => {
  it("displays the Experiment TimelineStep as blue when active is 'experiment'", () => {
    render(<Timeline active="experiment" />);

    const experimentStep = screen.getByText("Experiment");
    const rolloutStep = screen.getByText("Rollout");
    const firefoxStep = screen.getByText("Firefox");

    // Active steps
    expect(experimentStep).toHaveClass("text-blue-500");
    expect(experimentStep).toHaveClass("border-blue-300");
    // Non active steps
    expect(rolloutStep).not.toHaveClass("text-blue-500");
    expect(rolloutStep).not.toHaveClass("border-blue-300");
    expect(firefoxStep).not.toHaveClass("text-blue-500");
    expect(firefoxStep).not.toHaveClass("border-blue-300");
  });

  it("displays the Rollout TimelineStep as blue when active is 'rollout'", () => {
    render(<Timeline active="rollout" />);

    const experimentStep = screen.getByText("Experiment");
    const rolloutStep = screen.getByText("Rollout");
    const firefoxStep = screen.getByText("Firefox");

    // Active step
    expect(rolloutStep).toHaveClass("text-blue-500");
    expect(rolloutStep).toHaveClass("border-blue-300");
    // Non active steps
    expect(experimentStep).not.toHaveClass("text-blue-500");
    expect(experimentStep).not.toHaveClass("border-blue-300");
    expect(firefoxStep).not.toHaveClass("text-blue-500");
    expect(firefoxStep).not.toHaveClass("border-blue-300");
  });

  it("displays the Firefox TimelineStep as blue when active is 'firefox'", () => {
    render(<Timeline active="firefox" />);

    const experimentStep = screen.getByText("Experiment");
    const rolloutStep = screen.getByText("Rollout");
    const firefoxStep = screen.getByText("Firefox");

    // Active step
    expect(firefoxStep).toHaveClass("text-blue-500");
    expect(firefoxStep).toHaveClass("border-blue-300");
    // Non active steps
    expect(experimentStep).not.toHaveClass("text-blue-500");
    expect(experimentStep).not.toHaveClass("border-blue-300");
    expect(rolloutStep).not.toHaveClass("text-blue-500");
    expect(rolloutStep).not.toHaveClass("border-blue-300");
  });
});
