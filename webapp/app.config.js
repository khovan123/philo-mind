const app = require("./app.json");

const easProjectId = process.env.EAS_PROJECT_ID;
const easCommand = process.env.EAS_BUILD_PROFILE || process.env.EAS_UPDATE_CHANNEL;

if (easCommand && !easProjectId) {
  throw new Error("EAS_PROJECT_ID is required for EAS Build and EAS Update commands");
}

module.exports = {
  ...app.expo,
  updates: easProjectId
    ? {
        url: `https://u.expo.dev/${easProjectId}`,
      }
    : undefined,
  extra: easProjectId
    ? {
        eas: {
          projectId: easProjectId,
        },
      }
    : undefined,
};
