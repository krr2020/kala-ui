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
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		viewport?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

export interface ToastTitleProps {
	children?: ReactNode;
	/** Root typography; sits below `slotStyles.root`. */
	style?: StyleProp<TextStyle>;
	/** slotStyles entry for the title text. */
	slotStyles?: { root?: StyleProp<TextStyle> };
	testID?: string;
}

export interface ToastDescriptionProps {
	children?: ReactNode;
	/** Root typography; sits below `slotStyles.root`. */
	style?: StyleProp<TextStyle>;
	/** slotStyles entry for the description text. */
	slotStyles?: { root?: StyleProp<TextStyle> };
	testID?: string;
}
