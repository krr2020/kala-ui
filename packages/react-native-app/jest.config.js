/**
 * Jest harness for the app-composites layer: jest-expo preset
 * (react-native mocks), TLB v14 renderer. Mirrors
 * packages/react-native/jest.config.js — data tests (*.test.ts) stay on
 * vitest (see vitest.config.ts), component tests (*.test.tsx) run here.
 */
module.exports = {
	transform: { "^.+\\.[jt]sx?$": "./jest.transform-dump.js" },
	preset: "jest-expo",
	rootDir: ".",
	setupFiles: ["./jest.setup.ts"],
	testMatch: ["<rootDir>/src/**/*.test.tsx"],
	moduleNameMapper: {
		"^lucide-react-native$":
			"<rootDir>/../react-native/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js",
		"^react-native-unistyles$": require.resolve("react-native-unistyles"),
		// core-source imports ("@kala-ui/react-native" maps into
		// ../react-native/src) must resolve reanimated to the same copy this
		// package's jest.setup mocks, or sheet.styles' Easing import loads the
		// real native build under jest and crashes at module scope.
		"^react-native-reanimated$": require.resolve("react-native-reanimated"),
		"^react-native-unistyles/mocks$": require("node:path").join(
			require("node:path").dirname(require.resolve("react-native-unistyles")),
			"mocks.js",
		),
		"^@kala-ui/react-native$": "<rootDir>/../react-native/src/index.ts",
		"^@kala-ui/react-native/themes$":
			"<rootDir>/../react-native/src/themes/index.ts",
		"^@kala-ui/react-native/types$":
			"<rootDir>/../react-native/src/types/index.ts",
	},
	transformIgnorePatterns: [
		"/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|react-native-svg|react-native-unistyles|react-native-gesture-handler|react-native-reanimated|lucide-react-native))",
		"/node_modules/react-native-reanimated/plugin/",
		"/node_modules/@react-native/babel-preset/",
	],
};
