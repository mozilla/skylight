import { Platform } from "./types";
interface PlatformInfo {
  displayName: string;
}

export const platformDictionary: Record<Platform, PlatformInfo> = {
  fenix: {
    displayName: "Android",
  },
  ios: {
    displayName: "iOS",
  },
  "firefox-desktop": {
    displayName: "Desktop",
  },
};
