
interface PlatformInfo {
    nimbusAppSlug: string;
    displayName: string;
}

export const platformDictionary: { [key: string]: PlatformInfo } = {
  android: {
    nimbusAppSlug: "fenix",
    displayName: "Android",
  },
  ios: {
    nimbusAppSlug: "ios",
    displayName: "iOS",
  },
  desktop: {
    nimbusAppSlug: "firefox-desktop",
    displayName: "Desktop",
  },
};

