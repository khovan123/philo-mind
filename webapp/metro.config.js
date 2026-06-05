const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const path = require("path");

// ── Monorepo support ───────────────────────────────────────
const monorepoRoot = path.resolve(__dirname, "..");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Watch the monorepo root for shared packages
config.watchFolders = [monorepoRoot];

// Resolve node_modules from both the app and the monorepo root
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

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
};;

module.exports = withNativewind(config, {
  // inline variables break PlatformColor in CSS variables
  inlineVariables: false,
  // We add className support manually
  globalClassNamePolyfill: false,
});
