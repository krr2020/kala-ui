import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { ToggleSize, ToggleVariant } from "../toggle/toggle.types";

export type ToggleGroupType = "single" | "multiple";

export interface ToggleGroupProps {
	children?: ReactNode;
	/** single = deselectable radio set ('' when empty); multiple = array */
	type?: ToggleGroupType;
	/** Controlled value: string for single, string[] for multiple */
	value?: string | string[];
	defaultValue?: string | string[];
	onValueChange?: (value: string | string[]) => void;
	size?: ToggleSize;
	variant?: ToggleVariant;
	disabled?: boolean;
	accessibilityLabel?: string;
	/** Slot overrides: root wins over the library surface; item flows to items. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		item?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

export interface ToggleGroupItemProps {
	children?: ReactNode;
	value: string;
	size?: ToggleSize;
	variant?: ToggleVariant;
	disabled?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
