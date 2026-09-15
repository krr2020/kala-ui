import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface CollapsibleProps {
	children?: ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	accessibilityLabel?: string;
	/** Slot overrides: trigger/content flow to their parts. */
	styles?: {
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
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface CollapsibleContentProps {
	children?: ReactNode;
	/** Slot overrides: root wins over the group-flowed content slot. */
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
