const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Unistyles v3.3 needs only its babel plugin (see babel.config.js) — no metro
// transformer. Package exports must be honored so the workspace library
// @kala-ui/react-native resolves to its TypeScript source via `exports`.
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
