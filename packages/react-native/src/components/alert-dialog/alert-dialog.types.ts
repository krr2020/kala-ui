import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface AlertDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/**
	 * Defaults to false — a destructive confirmation must not be
	 * dismissable by stray taps or hardware back (the web dialog's
	 * radix alert semantics).
	 */
	dismissable?: boolean;
	accessibilityLabel?: string;
	/** Slot overrides: root wins over the library surface. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		overlay?: StyleProp<ViewStyle>;
	};
	testID?: string;
	children?: ReactNode;
}

export interface AlertDialogPartProps {
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides for this part. */
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface AlertDialogTextProps {
	children?: ReactNode;
	style?: StyleProp<TextStyle>;
	/** Slot overrides for this text part. */
	styles?: { root?: StyleProp<TextStyle> };
	testID?: string;
}
