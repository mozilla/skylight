import { fireEvent, render, screen } from "@testing-library/react";
import { InfoIcon } from "@/components/ui/infoicon.tsx";

describe("InfoIcon", () => {
  const iconSize = 16;
  const content = "This is a test string for the tooltip content.";

  it("renders an InfoIcon button", () => {
    render(<InfoIcon iconSize={iconSize} content={content} />);
    const infoIconButton = screen.getByRole("button");
    expect(infoIconButton).toBeInTheDocument();
  });

  it("displays tooltip content on focus", () => {
    render(<InfoIcon iconSize={iconSize} content={content} />);
    const infoIconButton = screen.getByRole("button");
    fireEvent.focus(infoIconButton)
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  })
});
