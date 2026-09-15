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
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		dismiss?: StyleProp<ViewStyle>;
	};
}

export interface AlertTitleProps {
	/** Slot overrides for the title text. */
	styles?: { root?: StyleProp<TextStyle> };
	children?: ReactNode;
	style?: StyleProp<TextStyle>;
	testID?: string;
}

export interface AlertDescriptionProps {
	/** Slot overrides for the description text. */
	styles?: { root?: StyleProp<TextStyle> };
	children?: ReactNode;
	style?: StyleProp<TextStyle>;
	testID?: string;
}
