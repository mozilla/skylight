import { fireEvent, render, screen } from "@testing-library/react";
import { InfoTooltip } from "@/components/ui/infotooltip";

describe("InfoTooltip", () => {
  const iconSize = 16;
  const content = "This is a test string for the tooltip content.";

  it("renders an InfoTooltip button", () => {
    render(<InfoTooltip iconSize={iconSize} content={content} />);
    
    const infoTooltipButton = screen.getByRole("button");
    expect(infoTooltipButton).toBeInTheDocument();
  });

  it("displays tooltip content on focus", () => {
    render(<InfoTooltip iconSize={iconSize} content={content} />);
    const infoTooltipButton = screen.getByRole("button");

    fireEvent.focus(infoTooltipButton)

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  })
});
