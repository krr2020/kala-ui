/** @type {import('react-native-unistyles/plugin').UnistylesPluginOptions} */
const unistylesPluginOptions = {
	// All app components live in src/. Files outside it (the workspace
	// library source) are processed via autoProcessImports.
	root: "src",
	autoProcessImports: ["@kala-ui/react-native"],
};

module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [["react-native-unistyles/plugin", unistylesPluginOptions]],
	};
};
