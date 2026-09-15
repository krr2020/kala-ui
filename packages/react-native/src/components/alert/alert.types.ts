import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

export type AlertVariant = "solid" | "outline" | "subtle";
export type AlertColor =
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info"
	| "muted";

export interface AlertProps {
	children?: ReactNode;
	variant?: AlertVariant;
	color?: AlertColor;
	/** Show the per-color status icon (default true). */
	showIcon?: boolean;
	dismissable?: boolean;
	onDismiss?: () => void;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface AlertTitleProps {
	children?: ReactNode;
	style?: StyleProp<TextStyle>;
	testID?: string;
}

export interface AlertDescriptionProps {
	children?: ReactNode;
	style?: StyleProp<TextStyle>;
	testID?: string;
}
