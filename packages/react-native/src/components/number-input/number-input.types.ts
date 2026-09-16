import type { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface NumberInputProps {
	/** controlled numeric value; null = empty field. Rendered verbatim, even outside [min, max] — the parent owns clamping for its own state. */
	value?: number | null;
	/** uncontrolled initial value */
	defaultValue?: number | null;
	/** fires on stepper press, text change, and blur commit; null when the field is empty */
	onValueChange?: (value: number | null) => void;
	/** inclusive lower bound; undefined = unclamped below */
	min?: number;
	/** inclusive upper bound; undefined = unclamped above */
	max?: number;
	/** stepper delta, default 1 */
	step?: number;
	/** parity with TextInput's disabled: blocks editing and steppers */
	disabled?: boolean;
	/** destructive border on the field */
	hasError?: boolean;
	placeholder?: string;
	/** label merged onto the inner field */
	accessibilityLabel?: string;
	/** stepper labels, default "Increase" / "Decrease" */
	incrementLabel?: string;
	decrementLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library row and `style`; input/stepper reach the field and the pressable steppers. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		input?: StyleProp<TextStyle>;
		stepper?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
