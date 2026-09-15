import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

export type DialogSize = "sm" | "md" | "lg" | "full";

export interface DialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** When true (default), overlay press and hardware back close the dialog. */
	dismissable?: boolean;
	/** When true (default), renders the top-right close affordance. */
	showCloseButton?: boolean;
	size?: DialogSize;
	accessibilityLabel?: string;
	testID?: string;
	children?: ReactNode;
}

export interface DialogPartProps {
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface DialogTextProps {
	children?: ReactNode;
	style?: StyleProp<TextStyle>;
	testID?: string;
}
