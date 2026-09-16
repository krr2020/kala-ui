import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface CollapsibleProps {
	children?: ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	accessibilityLabel?: string;
	/** slotStyles: trigger/content flow to their parts. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		trigger?: StyleProp<ViewStyle>;
		content?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

export interface CollapsibleTriggerProps {
	children?: ReactNode;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface CollapsibleContentProps {
	children?: ReactNode;
	/** slotStyles: root wins over the group-flowed content slot. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
