import type { ComponentType } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Any icon-library component taking `size` (px) and `color` — lucide
 * (the demos' choice) satisfies this structurally, as do expo/vector-icons,
 * phosphor, tabler, etc. kala's own default glyphs stay lucide.
 */
export type IconComponent = ComponentType<{
	size?: number;
	color?: string;
}>;

export interface IconProps {
	/** icon-library component, e.g. `Sun` from lucide-react-native */
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
