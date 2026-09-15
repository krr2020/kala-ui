import type { StyleProp, ViewStyle } from "react-native";

/**
 * Radix value vocabulary transcribed natively: `value`/`defaultValue` are
 * number arrays (one entry per thumb) and `onValueChange` receives the full
 * array on every change — no native-only naming divergence.
 */
export interface SliderProps {
	/** Controlled value, one entry per thumb */
	value?: number[];
	/** Default (uncontrolled) values, one entry per thumb */
	defaultValue?: number[];
	/** Fires on every drag/tap/a11y change with the full value array */
	onValueChange?: (value: number[]) => void;
	/** Minimum slider value (default 0) */
	min?: number;
	/** Maximum slider value (default 100) */
	max?: number;
	/** Increment granularity (default 1) */
	step?: number;
	/** Disable interaction */
	disabled?: boolean;
	/** Show the loading skeleton instead of the interactive slider */
	isLoading?: boolean;
	/** Accessible label carried by each adjustable thumb */
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		track?: StyleProp<ViewStyle>;
		range?: StyleProp<ViewStyle>;
		thumb?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
