const app = require("./app.json");

const easProjectId = process.env.EAS_PROJECT_ID ?? app.expo.extra?.eas?.projectId;

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
