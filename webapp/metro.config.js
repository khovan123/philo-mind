const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const path = require("path");

// ── Monorepo support ───────────────────────────────────────
const monorepoRoot = path.resolve(__dirname, "..");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const appNodeModules = path.resolve(__dirname, "node_modules");

// Watch the monorepo root for shared packages
config.watchFolders = [monorepoRoot];

// Resolve node_modules from both the app and the monorepo root
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [appNodeModules, path.resolve(monorepoRoot, "node_modules")];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  react: path.join(appNodeModules, "react"),
  "react-dom": path.join(appNodeModules, "react-dom"),
  "react-native": path.join(appNodeModules, "react-native"),
  "react-native-gesture-handler": path.join(appNodeModules, "react-native-gesture-handler"),
  "react-native-reanimated": path.join(appNodeModules, "react-native-reanimated"),
  "react-native-safe-area-context": path.join(appNodeModules, "react-native-safe-area-context"),
  "react-native-screens": path.join(appNodeModules, "react-native-screens"),
  "react-native-svg": path.join(appNodeModules, "react-native-svg"),
  "react-native-worklets": path.join(appNodeModules, "react-native-worklets"),
  "expo-modules-core": path.join(monorepoRoot, "node_modules", "expo-modules-core"),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-i18next") {
    return context.resolveRequest(context, "react-i18next/dist/commonjs/index.js", platform);
  }

  // Metro doesn't map relative imports ending in '.js' back to '.ts'/'.tsx' source files on disk.
  // We strip the '.js' extension to let Metro resolve it via its standard fallback extensions.
  if ((moduleName.startsWith("./") || moduleName.startsWith("../")) && moduleName.endsWith(".js")) {
    const withoutJsExtension = moduleName.slice(0, -3);
    try {
      return context.resolveRequest(context, withoutJsExtension, platform);
    } catch (err) {
      // Fall back to original name if stripping the extension fails
    }
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativewind(config, {
  // inline variables break PlatformColor in CSS variables
  inlineVariables: false,
  // We add className support manually
  globalClassNamePolyfill: false,
});
