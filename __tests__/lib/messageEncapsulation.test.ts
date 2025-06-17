import { encapsulateMessageForBranchInfo } from "../../lib/messageEncapsulation";

describe("encapsulateMessageForBranchInfo", () => {
  const rawRecipe = {
    id: "recipe-id",
    localizations: { en: {} },
  };
  const branch = { slug: "treatment" };

  it("handles aboutwelcome", () => {
    const message = { id: "aw-id", screens: [{}], template: "aboutwelcome" };
    const result = encapsulateMessageForBranchInfo({
      message,
      rawRecipe,
      branch,
    });
    expect(result.template).toBe("aboutwelcome");
    expect(result.id).toBe("aw-id");
    expect(result.previewLink).toBeDefined();
  });

  it("handles feature_callout", () => {
    const message = {
      content: { screens: [{ id: "fc-id:extra" }] },
      template: "feature_callout",
    };
    const result = encapsulateMessageForBranchInfo({
      message,
      rawRecipe,
      branch,
    });
    expect(result.template).toBe("feature_callout");
    expect(result.id).toBe("fc-id");
    expect(result.previewLink).toBeDefined();
  });

  it("handles infobar", () => {
    const message = { id: "info-id", content: {}, template: "infobar" };
    const result = encapsulateMessageForBranchInfo({
      message,
      rawRecipe,
      branch,
    });
    expect(result.template).toBe("infobar");
    expect(result.id).toBe("info-id");
    expect(result.previewLink).toBeDefined();
  });

  it("handles multi (recursively)", () => {
    const message = {
      messages: [
        {
          content: { screens: [{ id: "fc-id:extra" }] },
          template: "feature_callout",
        },
      ],
      template: "multi",
    };
    const result = encapsulateMessageForBranchInfo({
      message,
      rawRecipe,
      branch,
    });
    expect(result.id).toBe("fc-id");
  });

  it("handles multi with infobar as first message", () => {
    const message = {
      messages: [
        { id: "info-id", content: {}, template: "infobar" },
        { id: "other-id", content: {}, template: "feature_callout" },
      ],
      template: "multi",
    };
    const result = encapsulateMessageForBranchInfo({
      message,
      rawRecipe,
      branch,
    });
    expect(result.template).toBe("multi");
    expect(result.id).toBe("info-id");
    expect(result.previewLink).toBeDefined();
  });

  it("handles multi with first message having content.screens[0].id and previewLink", () => {
    const message = {
      messages: [
        {
          content: { screens: [{ id: "screen-id-123" }] },
          template: "feature_callout",
        },
      ],
      template: "multi",
    };
    const result = encapsulateMessageForBranchInfo({
      message,
      rawRecipe,
      branch,
    });
    expect(result.template).toBe("multi");
    expect(result.id).toBe("screen-id-123");
    expect(result.previewLink).toBeDefined();
  });

  it("handles unknown/default", () => {
    const message = { messages: [{ id: "default-id" }] };
    const result = encapsulateMessageForBranchInfo({
      message,
      rawRecipe,
      branch,
    });
    expect(result.id).toBe("default-id");
  });

  it("throws if encapsulateMessageForBranchInfo returns no id for multi", () => {
    const message = {
      messages: [
        { content: { screens: [] }, template: "feature_callout" }, // no id
      ],
      template: "multi",
    };
    // Simulate usage in NimbusRecipe.getDesktopBranchInfo
    expect(() => {
      const encapsulated =
        require("../../lib/messageEncapsulation").encapsulateMessageForBranchInfo(
          {
            message,
            rawRecipe,
            branch,
          },
        );
      if (!encapsulated.id) {
        throw new Error(
          "encapsulateMessageForBranchInfo did not return an id for a multi message",
        );
      }
    }).toThrow(
      "encapsulateMessageForBranchInfo did not return an id for a multi message",
    );
  });
});
