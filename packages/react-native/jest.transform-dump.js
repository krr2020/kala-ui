/**
 * Transform wrapper referenced by jest.config.js. Rebuilds jest-expo's own
 * transformer (babel-jest + the preset's resolved babel options) so the
 * pipeline is identical to the preset's inline entry, and optionally
 * dumps transformed output for modules matching
 * KALA_DUMP_TRANSFORM=<substring> when debugging transform issues.
 */
const path = require('path');

// jest-expo resolves babel-jest from its own dependency graph; resolving
// from the preset's context keeps the version pinned to what the preset
// was built against (pnpm layout makes root-level resolution unreliable).
const expoDir = path.dirname(require.resolve('jest-expo/package.json'));
const { resolveBabelOptions } = require(
	path.join(expoDir, 'src/resolveBabelOptions.js'),
);
const rnPresetDir = path.dirname(
	require.resolve('@react-native/jest-preset/package.json'),
);
const babelJest = require(
	require.resolve('babel-jest', { paths: [rnPresetDir] }),
);

const delegate = babelJest.createTransformer(resolveBabelOptions(process.cwd()));

const needle = process.env.KALA_DUMP_TRANSFORM;

module.exports = {
	process(sourceText, sourcePath, options) {
		const result = delegate.process(sourceText, sourcePath, options);
		if (needle && sourcePath.includes(needle)) {
			console.log(`\n[transform-dump] ${sourcePath}\n${result.code}\n`);
		}
		return result;
	},
	getCacheKey: delegate.getCacheKey,
};
