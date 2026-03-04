import { render } from "@testing-library/react";

jest.mock("next/font/local", () => ({
  __esModule: true,
  default: (config: Record<string, unknown>) => {
    (global as Record<string, unknown>).__localFontArgs = config;
    return {
      className: "mocked-inter",
      variable: "variable",
      style: { fontFamily: "fontFamily" },
    };
  },
}));

import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("loads Inter as a local variable font with swap display", () => {
    expect((global as Record<string, unknown>).__localFontArgs).toEqual({
      src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
      display: "swap",
      weight: "100 900",
    });
  });

  it("applies the font className to <body>", () => {
    const { container } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>,
    );

    const body = container.querySelector("body");
    expect(body).not.toBeNull();
    expect(body?.className).toBe("mocked-inter");
  });
});
