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
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	testID?: string;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		dismiss?: StyleProp<ViewStyle>;
	};
}

export interface AlertTitleProps {
	/** slotStyles entry for the title text. */
	slotStyles?: { root?: StyleProp<TextStyle> };
	children?: ReactNode;
	/** Root typography; sits below `slotStyles.root`. */
	style?: StyleProp<TextStyle>;
	testID?: string;
}

export interface AlertDescriptionProps {
	/** slotStyles entry for the description text. */
	slotStyles?: { root?: StyleProp<TextStyle> };
	children?: ReactNode;
	/** Root typography; sits below `slotStyles.root`. */
	style?: StyleProp<TextStyle>;
	testID?: string;
}
