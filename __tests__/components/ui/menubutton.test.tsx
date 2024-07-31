import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuButton } from "@/components/ui/menubutton.tsx";

describe("MenuButton", () => {
  it("renders a MenuButton button", () => {
    render(<MenuButton isComplete={false} />);

    const menuButton = screen.getByText("Messaging Info");

    expect(menuButton).toBeInTheDocument();
  });

  it("displays menu content on focus", async () => {
    const user = userEvent.setup();
    render(<MenuButton isComplete={false} />);
    const menuButton = screen.getByText("Messaging Info");

    await act(async () => {
      await user.hover(menuButton);
    });

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("displays link to `/complete` when isComplete is false", async () => {
    render(<MenuButton isComplete={false} />);

    const completeExperimentsButton = screen.getByText(
      "See Completed Experiments",
    );

    expect(completeExperimentsButton).toHaveAttribute("href", "/complete");
  });

  it("displays link to `/` when isComplete is true", async () => {
    render(<MenuButton isComplete={true} />);

    const completeExperimentsButton = screen.getByText("See Live Experiments");

    expect(completeExperimentsButton).toHaveAttribute("href", "/");
  });
});
