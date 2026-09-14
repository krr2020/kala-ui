/**
 * Jest harness for the component layer: jest-expo preset (react-native
 * mocks), TLB v14 renderer. Data tests (tokens/parity) stay on vitest —
 * see vitest.config.ts, which matches only *.test.ts data files.
 */
module.exports = {
  preset: 'jest-expo',
  rootDir: '.',
  setupFiles: ['./jest.setup.ts'],
  testMatch: ['<rootDir>/src/**/*.test.tsx'],
  // jest-expo's customExportConditions resolve lucide to its ESM .mjs build,
  // which jest's CJS runtime cannot load — pin the require/CJS build instead.
  moduleNameMapper: {
    '^lucide-react-native$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
  // Based on jest-expo's own defaults (incl. the .pnpm escape and the
  // reentrant-plugin exclusions) plus the kala native deps.
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|react-native-svg|react-native-unistyles|react-native-gesture-handler|react-native-reanimated|lucide-react-native))',
    '/node_modules/react-native-reanimated/plugin/',
    '/node_modules/@react-native/babel-preset/',
  ],
};
