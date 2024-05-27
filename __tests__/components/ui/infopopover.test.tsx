import { fireEvent, render, screen } from "@testing-library/react";
import { InfoPopover } from "@/components/ui/infopopover";

describe("InfoPopover", () => {
  const iconSize = 16;
  const content = "This is a test string for the info popover content.";

  it("renders an InfoPopover button", () => {
    render(<InfoPopover iconSize={iconSize} content={content} />);

    const infoPopoverButton = screen.getByRole("info");
    
    expect(infoPopoverButton).toBeInTheDocument();
  });

  it("displays menu on click", () => {
    render(<InfoPopover iconSize={iconSize} content={content} />);
    const infoPopoverButton = screen.getByRole("info");

    fireEvent.click(infoPopoverButton);

    expect(screen.getByText(content)).toBeInTheDocument();
  });
});
