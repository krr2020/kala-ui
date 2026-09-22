/**
 * Jest harness for the component layer: jest-expo preset (react-native
 * mocks), TLB v14 renderer. Data tests (tokens/parity) stay on vitest —
 * see vitest.config.ts, which matches only *.test.ts data files.
 */
module.exports = {
  transform: { '^.+\\.[jt]sx?$': './jest.transform-dump.js' },
  preset: 'jest-expo',
  rootDir: '.',
  setupFiles: ['./jest.setup.ts'],
  testMatch: ['<rootDir>/src/**/*.test.tsx'],
  // jest-expo's customExportConditions resolve lucide to its ESM .mjs build,
  // which jest's CJS runtime cannot load — pin the require/CJS build instead.
  moduleNameMapper: {
    // Workspace react-hooks dist is resolved through its own node_modules,
    // which lands on the root react@19.3.0 — a second React instance breaks
    // hook dispatch inside jest. Pin react to THIS package's 19.2.3 copy.
    '^react$': require.resolve('react'),
    '^lucide-react-native$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
    // pnpm-hoisted unistyles resolves fine from the old component dirs but
    // the resolver intermittently misses it for newly created ones — pin the
    // CJS entries so resolution never depends on the haste cache state.
    '^react-native-unistyles$': require.resolve('react-native-unistyles'),
    // The /mocks subpath is gated by the package exports map for plain
    // require.resolve, so it is derived from the resolved main entry.
    '^react-native-unistyles/mocks$': require('path').join(
      require('path').dirname(require.resolve('react-native-unistyles')),
      'mocks.js'
    ),
  },
  // Based on jest-expo's own defaults (incl. the .pnpm escape and the
  // reentrant-plugin exclusions) plus the kala native deps.
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|react-native-svg|react-native-unistyles|react-native-gesture-handler|react-native-reanimated|lucide-react-native))',
    '/node_modules/react-native-reanimated/plugin/',
    '/node_modules/@react-native/babel-preset/',
  ],
};
