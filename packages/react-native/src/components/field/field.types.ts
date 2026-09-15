import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface FieldProps {
	/** visible label rendered above the control; merged into the control's accessibilityLabel */
	label?: string;
	/** helper copy below the control, muted tone */
	description?: string;
	/** validation copy below the control, destructive tone; string or list (deduped in first-seen order, comma-joined) */
	error?: string | string[];
	/** destructive asterisk appended to the label */
	required?: boolean;
	/** invalid arm without error copy: no error node is rendered */
	hasError?: boolean;
	/** exactly one control element; its accessibilityLabel is merged unless it provides its own */
	children: ReactNode;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		label?: StyleProp<ViewStyle>;
		control?: StyleProp<ViewStyle>;
		description?: StyleProp<ViewStyle>;
		error?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
