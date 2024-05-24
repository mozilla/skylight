import { fireEvent, render, screen } from "@testing-library/react";
import { MenuButton } from "@/components/ui/menubutton.tsx";

describe("MenuButton", () => {
  it("renders a MenuButton button", () => {
    render(<MenuButton />);
    
    const menuButton = screen.getByText("Messaging Info");
    
    expect(menuButton).toBeInTheDocument();
  });

  it("displays menu content on focus", () => {
    render(<MenuButton/>);
    const menuButton = screen.getByText("Messaging Info");

    fireEvent.focus(menuButton)

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  })
});
