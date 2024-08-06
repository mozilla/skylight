import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InfoPopover } from "@/components/ui/infopopover";

describe("InfoPopover", () => {
  const content = "This is a test string for the info popover content.";

  it("renders an InfoPopover button", () => {
    render(<InfoPopover content={content} />);

    const infoPopoverButton = screen.getByRole("img", { name: "Info" });

    expect(infoPopoverButton).toBeInTheDocument();
  });

  it("displays menu on click", async () => {
    const user = userEvent.setup();
    render(<InfoPopover content={content} />);
    const infoPopoverButton = screen.getByRole("img", { name: "Info" });

    await act(async () => {
      await user.click(infoPopoverButton);
    });

    expect(screen.getByText(content)).toBeInTheDocument();
  });
});
