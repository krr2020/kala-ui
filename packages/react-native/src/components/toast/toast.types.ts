import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

export type ToastPosition = "top" | "bottom";

export interface ToastProps {
	open: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Auto-dismiss delay in ms; undefined disables the timer. */
	duration?: number;
	position?: ToastPosition;
	children?: ReactNode;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface ToastTitleProps {
	children?: ReactNode;
	style?: StyleProp<TextStyle>;
	testID?: string;
}

export interface ToastDescriptionProps {
	children?: ReactNode;
	style?: StyleProp<TextStyle>;
	testID?: string;
}
