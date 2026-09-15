import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface StepItem {
	title: string;
	description?: string;
	/** replaces the step number on a pending step (completed steps always show a check) */
	icon?: ReactNode;
}

export type StepsOrientation = "horizontal" | "vertical";

export interface StepsProps {
	/** current step number, 1-based (controlled) */
	value?: number;
	/** initial step number, 1-based (uncontrolled) */
	defaultValue?: number;
	items: StepItem[];
	/** fires with the 1-based step number; presence makes steps pressable */
	onStepChange?: (step: number) => void;
	orientation?: StepsOrientation;
	/** show connecting lines between steps */
	showLine?: boolean;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`; step/indicator apply per step. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		step?: StyleProp<ViewStyle>;
		indicator?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
