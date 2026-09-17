const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Pin the absolute app project root: expo/metro-config returns a relative
// projectRoot ("."), which Metro resolves against the CLI process cwd and
// mis-lands on the workspace root. The server root stays workspace-relative
// (Expo's monorepo mode rewrites device bundle requests to
// "apps/native-playground/index"), so only projectRoot is overridden here.
config.projectRoot = __dirname;

// Unistyles v3.3 needs only its babel plugin (see babel.config.js) — no metro
// transformer. Package exports must be honored so the workspace library
// @kala-ui/react-native resolves to its TypeScript source via `exports`.
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
