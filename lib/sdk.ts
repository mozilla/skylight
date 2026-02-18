import { LookerNodeSDK } from "@looker/sdk-node";
import { Looker40SDK } from "@looker/sdk";

const LOOKER_CACHE_REVALIDATE_DEFAULT = 86400;

/**
 * Parse the `LOOKER_CACHE_REVALIDATE` env var into a positive integer
 * (seconds), falling back to {@link LOOKER_CACHE_REVALIDATE_DEFAULT} for
 * missing, empty, non-numeric, zero, or negative values.
 */
export function parseLookerCacheRevalidate(raw: string | undefined): number {
  if (raw === undefined || raw === "") {
    return LOOKER_CACHE_REVALIDATE_DEFAULT;
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) {
    return LOOKER_CACHE_REVALIDATE_DEFAULT;
  }
  return Math.floor(n);
}

/**
 * Returns `true` when the URL's hostname is exactly `looker.com` or ends
 * with `.looker.com` — i.e. a genuine Looker-owned domain. This rejects
 * look-alikes such as `evil-looker.com` or `looker.com.evil.com`.
 */
export function isLookerApiUrl(urlString: string): boolean {
  try {
    const { hostname } = new URL(urlString);
    return hostname === "looker.com" || hostname.endsWith(".looker.com");
  } catch {
    return false;
  }
}

const LOOKER_CACHE_REVALIDATE = parseLookerCacheRevalidate(
  process.env.LOOKER_CACHE_REVALIDATE,
);

let _fetchPatched = false;
/**
 * Patches globalThis.fetch to set caching behavior for Looker API requests.
 * Login/logout endpoints are never cached, while all other Looker requests
 * are cached for {@link LOOKER_CACHE_REVALIDATE} seconds to reduce redundant
 * API calls. Non-Looker requests are passed through unmodified. Only patches
 * fetch once, subsequent calls are no-ops.
 */
function setLookerFetchCacheConfig() {
  if (_fetchPatched) {
    return;
  }
  _fetchPatched = true;
  const originalFetch = globalThis.fetch;
  function getUrlAsString(input: RequestInfo | URL): string {
    if (typeof input === "string") {
      return input;
    }
    if (input instanceof URL) {
      return input.toString();
    }
    return input.url;
  }

  globalThis.fetch = (input, init) => {
    const url = getUrlAsString(input);
    if (isLookerApiUrl(url)) {
      if (url.endsWith("/login") || url.endsWith("/logout")) {
        init = { ...init, cache: "no-store" };
      } else {
        init = { ...init, next: { revalidate: LOOKER_CACHE_REVALIDATE } };
      }
    }
    return originalFetch(input, init);
  };
}

export let SDK: Looker40SDK;

export function getLookerSDK(): Looker40SDK {
  setLookerFetchCacheConfig();
  if (!SDK) {
    SDK = LookerNodeSDK.init40();
  }
  return SDK;
}

SDK = getLookerSDK();

console.log("LOOKER ENABLED: ", process.env.IS_LOOKER_ENABLED);
