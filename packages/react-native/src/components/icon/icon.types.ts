import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import type { KalaTheme } from "../../types";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface IconProps {
	/** lucide icon component, e.g. `Sun` from lucide-react-native */
	icon: LucideIcon;
	size?: IconSize;
	/** theme token key (`'primary'`) or any raw color string */
	color?: keyof KalaTheme | (string & {});
	/** when set, the icon joins the accessibility tree as an image */
	label?: string;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
