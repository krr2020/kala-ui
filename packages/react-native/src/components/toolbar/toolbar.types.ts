import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { ButtonColor, ButtonSize, ButtonVariant } from "../button";
import type { ToggleSize, ToggleVariant } from "../toggle/toggle.types";
import type { ToggleGroupType } from "../toggle-group/toggle-group.types";

export interface ToolbarProps {
	children: ReactNode;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface ToolbarButtonProps {
	children: ReactNode;
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ButtonSize;
	disabled?: boolean;
	onPress?: () => void;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface ToolbarSeparatorProps {
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface ToolbarLinkProps {
	children: ReactNode;
	disabled?: boolean;
	onPress?: () => void;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface ToolbarToggleGroupProps {
	children?: ReactNode;
	type?: ToggleGroupType;
	value?: string | string[];
	defaultValue?: string | string[];
	onValueChange?: (value: string | string[]) => void;
	size?: ToggleSize;
	variant?: ToggleVariant;
	disabled?: boolean;
	accessibilityLabel?: string;
	styles?: {
		root?: StyleProp<ViewStyle>;
		item?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

export interface ToolbarToggleItemProps {
	children?: ReactNode;
	value: string;
	size?: ToggleSize;
	variant?: ToggleVariant;
	disabled?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}
