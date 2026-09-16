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
	/** slotStyles: root wins over the library surface. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		overlay?: StyleProp<ViewStyle>;
	};
	testID?: string;
	children?: ReactNode;
}

export interface AlertDialogPartProps {
	children?: ReactNode;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles entry for this part. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface AlertDialogTextProps {
	children?: ReactNode;
	/** Root typography; sits below `slotStyles.root`. */
	style?: StyleProp<TextStyle>;
	/** slotStyles entry for this part. */
	slotStyles?: { root?: StyleProp<TextStyle> };
	testID?: string;
}
