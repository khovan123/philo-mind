const app = require("./app.json");

const easProjectId = process.env.EAS_PROJECT_ID ?? app.expo.extra?.eas?.projectId;

if (!easProjectId) {
  throw new Error("EAS_PROJECT_ID is required for EAS Build and EAS Update");
}

const plugins = [...(app.expo.plugins ?? []), "expo-font", "expo-web-browser", "expo-asset"];

module.exports = {
  ...app.expo,

  plugins,

  updates: easProjectId
    ? {
        url: `https://u.expo.dev/${easProjectId}`,
      }
    : undefined,
  plugins: [...(app.expo.plugins ?? []), "expo-font", "expo-web-browser", "expo-asset"],
  extra: {
    ...app.expo.extra,
    eas: {
      projectId: easProjectId,
    },
  },
};
