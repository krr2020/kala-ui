import type { themes } from "@kala-ui/react-native/themes";

// Registers the kala theme names + shapes with unistyles' types (declaration
// merging on the exported UnistylesThemes interface), so `theme.background`
// type-checks inside stylesheets and setTheme accepts the seven kala names.
declare module "react-native-unistyles" {
	export interface UnistylesThemes {
		light: (typeof themes)["light"];
		neutral: (typeof themes)["neutral"];
		accent: (typeof themes)["accent"];
		dark: (typeof themes)["dark"];
		"dark-accent": (typeof themes)["dark-accent"];
		"high-contrast-light": (typeof themes)["high-contrast-light"];
		"high-contrast-dark": (typeof themes)["high-contrast-dark"];
	}
}
