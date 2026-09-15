import type { StyleProp, ViewStyle } from "react-native";

export type RatingSize = "sm" | "md" | "lg";

export interface RatingProps {
	/** Controlled value */
	value?: number;
	/** Default value for uncontrolled usage */
	defaultValue?: number;
	/** Callback when rating changes */
	onValueChange?: (value: number) => void;
	/** Number of stars */
	count?: number;
	/** Allow half-star ratings */
	allowHalf?: boolean;
	/** Read-only display — announced as one summary, stars are decorative */
	readOnly?: boolean;
	/** Disable the input */
	disabled?: boolean;
	/** Size of stars */
	size?: RatingSize;
	/** Accessible label (prefixes the readOnly summary) */
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}
