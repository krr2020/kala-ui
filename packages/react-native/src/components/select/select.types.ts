import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface SelectOption {
	/** identity of the option — what onValueChange reports and lookups key on */
	value: string;
	/** visible copy inside the trigger and the option row */
	label: string;
	disabled?: boolean;
}

export interface SelectProps {
	options: SelectOption[];
	/** controlled value; locks display until the parent re-renders */
	value?: string;
	/** uncontrolled seed; ignored when `value` is provided */
	defaultValue?: string;
	/** fires with the option value on commit; still fires when controlled */
	onValueChange?: (value: string) => void;
	/** trigger copy when nothing is selected; also the fallback for a value not present in options */
	placeholder?: string;
	/** takes precedence over placeholder/selected for the trigger's accessibilityLabel */
	label?: string;
	size?: "sm" | "md";
	disabled?: boolean;
	hasError?: boolean;
	/** tints the trigger border with the success token */
	hasSuccess?: boolean;
	/** swaps the trigger for a skeleton surface while keeping the k-select marker */
	isLoading?: boolean;
	accessibilityLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		value?: StyleProp<ViewStyle>;
		chevron?: StyleProp<ViewStyle>;
		option?: StyleProp<ViewStyle>;
	};
	testID?: string;
	/** reserved for future sheet composition; ignored today */
	children?: ReactNode;
}
