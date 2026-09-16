import type { StyleProp, ViewStyle } from "react-native";

export interface TimeValue {
	hours: number;
	minutes: number;
	seconds?: number;
}

export interface TimePickerProps {
	/** Controlled time value (24h); locks display until the parent re-renders. */
	value?: TimeValue;
	/** Uncontrolled seed; ignored when `value` is provided. */
	defaultValue?: TimeValue;
	/** Fires on commit; still fires when controlled. */
	onValueChange?: (value: TimeValue) => void;
	/** 12 renders an AM/PM toggle; 24 (default) does not. */
	hourCycle?: 12 | 24;
	/** Adds a seconds wheel. */
	showSeconds?: boolean;
	disabled?: boolean;
	hasError?: boolean;
	/** Swaps the wheels for a skeleton surface keeping the marker. */
	isLoading?: boolean;
	accessibilityLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
