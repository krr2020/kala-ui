import type { KalaTheme } from "./index";

/**
 * Registers the kala theme names + shapes with unistyles' types (declaration
 * merging on the exported UnistylesThemes interface). Living in the library
 * — not each app — means `useUnistyles().theme` is fully typed as KalaTheme
 * inside library components and in every consuming app.
 */
declare module "react-native-unistyles" {
	export interface UnistylesThemes {
		light: KalaTheme;
		dark: KalaTheme;
		"high-contrast-light": KalaTheme;
		"high-contrast-dark": KalaTheme;
	}
}
