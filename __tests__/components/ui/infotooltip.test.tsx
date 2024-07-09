import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InfoTooltip } from "@/components/ui/infotooltip";

describe("InfoTooltip", () => {
  const iconSize = 16;
  const content = "This is a test string for the tooltip content.";

  it("renders an InfoTooltip button", () => {
    render(<InfoTooltip iconSize={iconSize} content={content} />);
    
    const infoTooltipButton = screen.getByRole("button");
    expect(infoTooltipButton).toBeInTheDocument();
  });

  it("displays tooltip content on focus", async () => {
    const user = userEvent.setup()
    render(<InfoTooltip iconSize={iconSize} content={content} />);
    const infoTooltipButton = screen.getByRole("button");
    
    await user.tab();

    expect(infoTooltipButton).toHaveFocus();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  })
});
