import { render, screen } from "@testing-library/react";
import { PrettyDateRange } from "../../app/dates";

describe("PrettyDateRange", () => {
  it("should render a pretty version of the range", () => {
    const startDate = "2024-02-01";
    const endDate = "2024-02-04";

    render(<PrettyDateRange startDate={startDate} endDate={endDate} />);

    const part1 = screen.getByText("2024/2/1 -");
    expect(part1).toBeInTheDocument();
    const part2 = screen.getByText("2024/2/4");
    expect(part2).toBeInTheDocument();
  });

  it("should not convert a null date to Jan 1", () => {
    const startDate = "2024-02-02";
    const endDate: string | null = null;

    render(<PrettyDateRange startDate={startDate} endDate={endDate} />);

    // use queryByText to avoid throwing when it's not there
    const secondDate = screen.queryByText("Jan 1", { exact: false });
    expect(secondDate).not.toBeInTheDocument();
  });
});
