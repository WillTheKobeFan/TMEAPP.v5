export default {
  expo: {
    name: "TMEAPP",
    slug: "TMEAPP",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/TME.logo.png",
    assetBundlePatterns: ["**/*"],
    scheme: "tmeappv5",
    userInterfaceStyle: "automatic",

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.TMEAPP"
    },

    android: {
      package: "com.anonymous.tmeapp",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE"
      },
      predictiveBackGestureEnabled: false
    },

    web: {
      output: "static"
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/splash.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ],
      "expo-web-browser",
      "expo-font"
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },

    extra: {
      eas: {
        projectId: "1f59c016-6ef4-4c33-856e-a3c52f84f267"
      }
    }
  }
};