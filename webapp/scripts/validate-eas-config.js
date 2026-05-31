const eas = require("../eas.json");

const projectId = "0d037822-45e4-4e74-9101-13e054e72dc2";

const config = require("../app.config.js");

const expected = {
  name: "PhiloMind",
  slug: "philo-mind",
  owner: "minhpnq1807",
  bundleIdentifier: "com.khovan123.philomind",
  package: "com.khovan123.philomind",
  projectId,
  updatesUrl: `https://u.expo.dev/${projectId}`,
  runtimeVersionPolicy: "appVersion",
};

const actual = {
  name: config.name,
  slug: config.slug,
  owner: config.owner,
  bundleIdentifier: config.ios?.bundleIdentifier,
  package: config.android?.package,
  projectId: config.extra?.eas?.projectId,
  updatesUrl: config.updates?.url,
  runtimeVersionPolicy: config.runtimeVersion?.policy,
};

for (const [key, value] of Object.entries(expected)) {
  if (actual[key] !== value) {
    throw new Error(`Invalid EAS config: expected ${key}=${value}, received ${actual[key]}`);
  }
}

const expectedProfiles = {
  preview: {
    channel: "preview",
    distribution: "internal",
    environment: "preview",
    credentialsSource: "remote",
    androidBuildType: "apk",
  },
  production: {
    channel: "production",
    distribution: "store",
    environment: "production",
    credentialsSource: "remote",
    autoIncrement: true,
    androidBuildType: "app-bundle",
  },
};

for (const [profileName, expectedProfile] of Object.entries(expectedProfiles)) {
  const profile = eas.build?.[profileName];
  const actualProfile = {
    channel: profile?.channel,
    distribution: profile?.distribution,
    environment: profile?.environment,
    credentialsSource: profile?.credentialsSource,
    autoIncrement: profile?.autoIncrement,
    androidBuildType: profile?.android?.buildType,
  };

  for (const [key, value] of Object.entries(expectedProfile)) {
    if (actualProfile[key] !== value) {
      throw new Error(
        `Invalid ${profileName} EAS profile: expected ${key}=${value}, received ${actualProfile[key]}`,
      );
    }
  }
}

console.log("EAS app config validation passed");
