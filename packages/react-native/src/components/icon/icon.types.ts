import type { ComponentType } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

/** Theme token key (`'primary'`) or any raw color string. */
export type IconColor = keyof KalaTheme | (string & {});

/** Any icon-library component taking `size` (px) and `color` — lucide, expo/vector-icons, phosphor, tabler all satisfy this; kala's built-in glyphs (`./glyphs`) are the components' defaults. */
export type IconComponent = ComponentType<{
	size?: number;
	color?: string;
	testID?: string;
}>;

export interface IconProps {
	/** icon-library component — kala glyph or any library's component */
	icon: IconComponent;
	size?: IconSize;
	/** theme token key (`'primary'`) or any raw color string */
	color?: keyof KalaTheme | (string & {});
	/** when set, the icon joins the accessibility tree as an image */
	label?: string;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
