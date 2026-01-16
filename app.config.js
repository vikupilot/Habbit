/**
 * Expo App Configuration
 * This file allows using environment variables in app configuration
 * 
 * To use: Rename app.json to app.json.backup and use this file instead
 * Or keep both - Expo will prefer app.config.js if it exists
 */

export default {
  expo: {
    name: "Habbit",
    slug: "Habbit",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    scheme: "habbit",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.habbit.app"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff"
      },
      package: "com.habbit.app",
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "habbit"
            }
          ],
          category: [
            "BROWSABLE",
            "DEFAULT"
          ]
        }
      ]
    },
    plugins: [
      "expo-router",
      "expo-font"
    ],
    extra: { 
      eas: {
        "projectId": "5e7c5c43-00bc-42af-a4ce-4ab20404af73"
      },
      googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "462216399110-vea4psjh612ras8dfrkr61c66n5vafkq.apps.googleusercontent.com"
    }
  }
};

