import type { ExpoConfig } from "expo/config";

// All tenant-specific values come from env vars injected by Relay's build worker.
// See README for the full list.

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function opt(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

const APP_NAME = req("RELAY_APP_NAME");
const BUNDLE_ID = req("RELAY_BUNDLE_ID");
const WEB_URL = req("RELAY_WEB_URL");
const SCHEME = req("RELAY_SCHEME").toLowerCase().replace(/[^a-z0-9-]/g, "-");
const EAS_PROJECT_ID = opt("RELAY_EAS_PROJECT_ID");

const config: ExpoConfig = {
  name: APP_NAME,
  slug: SCHEME,
  scheme: SCHEME,
  version: opt("RELAY_APP_VERSION") ?? "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: opt("RELAY_SPLASH_BG") ?? "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: BUNDLE_ID,
    buildNumber: opt("RELAY_IOS_BUILD_NUMBER") ?? "1",
    infoPlist: {
      NSAppTransportSecurity: { NSAllowsArbitraryLoads: false },
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: BUNDLE_ID,
    versionCode: Number(opt("RELAY_ANDROID_VERSION_CODE") ?? "1"),
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: opt("RELAY_SPLASH_BG") ?? "#ffffff",
    },
  },
  extra: {
    relayWebUrl: WEB_URL,
    eas: EAS_PROJECT_ID ? { projectId: EAS_PROJECT_ID } : undefined,
  },
  plugins: ["expo-splash-screen"],
};

export default config;
