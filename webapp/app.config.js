const app = require("./app.json");

const easProjectId = process.env.EAS_PROJECT_ID ?? app.expo.extra?.eas?.projectId;

if (!easProjectId) {
  throw new Error("EAS_PROJECT_ID is required for EAS Build and EAS Update");
}

module.exports = {
  ...app.expo,
  updates: easProjectId
    ? {
        url: `https://u.expo.dev/${easProjectId}`,
      }
    : undefined,
  extra: {
    ...app.expo.extra,
    eas: {
      projectId: easProjectId,
    },
  },
};
