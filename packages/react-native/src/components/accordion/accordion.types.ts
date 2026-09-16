import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type AccordionType = "single" | "multiple";
export type AccordionVariant = "default" | "bordered" | "filled";

interface AccordionShared {
	children?: ReactNode;
	variant?: AccordionVariant;
	disabled?: boolean;
	accessibilityLabel?: string;
	/** slotStyles flow group→part; per-part entries win over these. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		item?: StyleProp<ViewStyle>;
		trigger?: StyleProp<ViewStyle>;
		content?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

/** `type` discriminates the callback payload: single emits a string. */
export interface AccordionSingleProps extends AccordionShared {
	type?: "single";
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
}

/** multiple emits the full open-value array each toggle. */
export interface AccordionMultipleProps extends AccordionShared {
	type: "multiple";
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (value: string[]) => void;
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export interface AccordionItemProps {
	children?: ReactNode;
	value: string;
	disabled?: boolean;
	/** slotStyles: root wins over the group-flowed item slot. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface AccordionTriggerProps {
	children?: ReactNode;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface AccordionContentProps {
	children?: ReactNode;
	/** slotStyles: root wins over the group-flowed content slot. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
