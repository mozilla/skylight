import { isLookerApiUrl, parseLookerCacheRevalidate } from "@/lib/sdk";

// Used only by the dynamic imports in the setLookerFetchCacheConfig tests.
type SdkModule = typeof import("@/lib/sdk");

describe("isLookerApiUrl", () => {
  it("matches a standard Looker API URL", () => {
    expect(
      isLookerApiUrl("https://mozilla.cloud.looker.com/api/4.0/dashboards"),
    ).toBe(true);
  });

  it("matches a bare looker.com URL", () => {
    expect(isLookerApiUrl("https://looker.com/something")).toBe(true);
  });

  it("rejects a URL whose hostname contains looker.com as a substring", () => {
    expect(isLookerApiUrl("https://evil-looker.com/api")).toBe(false);
  });

  it("rejects a URL that embeds looker.com in a subdomain of another host", () => {
    expect(isLookerApiUrl("https://looker.com.evil.com/api")).toBe(false);
  });

  it("rejects a non-Looker URL", () => {
    expect(isLookerApiUrl("https://example.com/api")).toBe(false);
  });

  it("handles URLs with port numbers", () => {
    expect(isLookerApiUrl("https://mozilla.cloud.looker.com:443/api")).toBe(
      true,
    );
  });

  it("rejects a URL with looker.com in the path but not in the hostname", () => {
    expect(isLookerApiUrl("https://example.com/looker.com/api")).toBe(false);
  });
});

describe("parseLookerCacheRevalidate", () => {
  it("returns 86400 when env var is undefined", () => {
    expect(parseLookerCacheRevalidate(undefined)).toBe(86400);
  });

  it("returns 86400 when env var is empty string", () => {
    expect(parseLookerCacheRevalidate("")).toBe(86400);
  });

  it("returns 86400 when env var is non-numeric", () => {
    expect(parseLookerCacheRevalidate("abc")).toBe(86400);
  });

  it("returns 86400 when env var is zero", () => {
    expect(parseLookerCacheRevalidate("0")).toBe(86400);
  });

  it("returns 86400 when env var is negative", () => {
    expect(parseLookerCacheRevalidate("-100")).toBe(86400);
  });

  it("parses a valid positive integer", () => {
    expect(parseLookerCacheRevalidate("3600")).toBe(3600);
  });

  it("floors a decimal value", () => {
    expect(parseLookerCacheRevalidate("7200.5")).toBe(7200);
  });
});

describe("setLookerFetchCacheConfig", () => {
  let savedFetch: typeof globalThis.fetch;

  beforeEach(() => {
    jest.resetModules();
    savedFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = savedFetch;
  });

  async function importFreshSdk(): Promise<SdkModule> {
    return (await import("@/lib/sdk")) as SdkModule;
  }

  it("sets cache: 'no-store' for /login endpoints", async () => {
    const mockFetch = jest.fn();
    globalThis.fetch = mockFetch;

    await importFreshSdk();

    globalThis.fetch("https://mozilla.cloud.looker.com/api/4.0/login");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://mozilla.cloud.looker.com/api/4.0/login",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("sets cache: 'no-store' for /logout endpoints", async () => {
    const mockFetch = jest.fn();
    globalThis.fetch = mockFetch;

    await importFreshSdk();

    globalThis.fetch("https://mozilla.cloud.looker.com/api/4.0/logout");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://mozilla.cloud.looker.com/api/4.0/logout",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("sets next.revalidate for other Looker API URLs", async () => {
    const mockFetch = jest.fn();
    globalThis.fetch = mockFetch;

    await importFreshSdk();

    globalThis.fetch("https://mozilla.cloud.looker.com/api/4.0/dashboards");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://mozilla.cloud.looker.com/api/4.0/dashboards",
      expect.objectContaining({ next: { revalidate: 86400 } }),
    );
  });

  it("passes non-Looker URLs through unmodified", async () => {
    const mockFetch = jest.fn();
    globalThis.fetch = mockFetch;

    await importFreshSdk();

    const init = { method: "GET" as RequestInit["method"] };
    globalThis.fetch("https://example.com/api", init);

    expect(mockFetch).toHaveBeenCalledWith("https://example.com/api", init);
  });

  it("only patches fetch once (subsequent calls are no-ops)", async () => {
    const mockFetch = jest.fn();
    globalThis.fetch = mockFetch;

    const sdk = await importFreshSdk();
    const patchedFetch = globalThis.fetch;

    // Call getLookerSDK() again — should not re-wrap fetch
    sdk.getLookerSDK();

    expect(globalThis.fetch).toBe(patchedFetch);
  });

  it("handles undefined init parameter", async () => {
    const mockFetch = jest.fn();
    globalThis.fetch = mockFetch;

    await importFreshSdk();

    // Call without an init argument
    globalThis.fetch("https://mozilla.cloud.looker.com/api/4.0/looks");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://mozilla.cloud.looker.com/api/4.0/looks",
      { next: { revalidate: 86400 } },
    );
  });
});
