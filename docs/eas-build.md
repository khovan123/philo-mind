# EAS Build and OTA Updates

The Expo app lives in `webapp/`. EAS Build produces signed iOS and Android
binaries for the `preview` and `production` profiles.

## Prerequisites

- Install EAS CLI: `npm install --global eas-cli`.
- Log in: `eas login`.
- Run all EAS commands from `webapp/`.
- Use an Apple Developer account for signed iOS builds.
- Use a Google Play Console account for Android store submission.

## Link the Expo Project

Create or link the Expo project once:

```bash
cd webapp
eas init
```

Copy the resulting Expo project UUID into the `EAS_PROJECT_ID` variable in the
EAS `preview` and `production` environments. Also add it to an ignored
`webapp/.env.local` file for local EAS Update commands. This value is required
by `app.config.js`; EAS Build commands fail fast when it is missing.

Set the public API URL in both EAS environments:

```text
EXPO_PUBLIC_API_URL=https://philo-mind-api.fly.dev/api/v1
```

Do not commit Expo access tokens, Apple credentials, provisioning profiles,
keystores, or Google service-account keys.

## Signing

Both build profiles use EAS-managed remote credentials:

```bash
eas credentials --platform ios
eas credentials --platform android
```

The first iOS preview build uses internal ad hoc distribution. Register test
devices before building:

```bash
eas device:create
```

Production iOS builds target App Store Connect. Production Android builds
produce an Android App Bundle for Google Play.

## Builds

Create internal preview builds:

```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

Create store builds:

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

## OTA Updates

The app uses `expo-updates`, the `appVersion` runtime policy, and separate
channels for preview and production:

```bash
EAS_PROJECT_ID="<expo-project-uuid>" \
  eas update --channel preview --environment preview --message "Preview update"

EAS_PROJECT_ID="<expo-project-uuid>" \
  eas update --channel production --environment production --message "Production update"
```

Publish to `preview` first and verify the installed preview binary before
publishing the same compatible JavaScript update to `production`. Increment the
app version and create a new native build whenever native dependencies or
native configuration change.

## Validation

Run local config validation without real credentials:

```bash
npm run eas:validate --workspace=webapp
```
