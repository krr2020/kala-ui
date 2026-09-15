import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type AccordionType = "single" | "multiple";
export type AccordionVariant = "default" | "bordered" | "filled";

interface AccordionShared {
	children?: ReactNode;
	variant?: AccordionVariant;
	disabled?: boolean;
	accessibilityLabel?: string;
	/** Slot overrides flow group→part; per-part styles win over these. */
	styles?: {
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
	/** Slot overrides: root wins over the group-flowed item slot. */
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface AccordionTriggerProps {
	children?: ReactNode;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface AccordionContentProps {
	children?: ReactNode;
	/** Slot overrides: root wins over the group-flowed content slot. */
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
