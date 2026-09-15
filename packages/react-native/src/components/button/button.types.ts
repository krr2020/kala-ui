import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type ButtonVariant = "solid" | "outline" | "ghost" | "subtle" | "link";
export type ButtonColor = "primary" | "secondary" | "destructive" | "muted";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

export interface ButtonProps {
	children: ReactNode;
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ButtonSize;
	fullWidth?: boolean;
	rounded?: boolean;
	isLoading?: boolean;
	disabled?: boolean;
	onPress?: () => void;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
