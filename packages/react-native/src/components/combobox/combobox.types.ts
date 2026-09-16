import type { StyleProp, ViewStyle } from "react-native";

export interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface ComboboxProps {
	options: ComboboxOption[];
	/** controlled value; locks the displayed label until the parent re-renders */
	value?: string;
	/** uncontrolled seed; ignored when `value` is provided */
	defaultValue?: string;
	/** fires with the option value on commit, then the sheet closes */
	onValueChange?: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyText?: string;
	disabled?: boolean;
	size?: "sm" | "md";
	/** shows a clear affordance once a value exists; commits '' */
	clearable?: boolean;
	/** switches to async mode: no client filtering, queries reported here */
	onSearchChange?: (search: string) => void;
	/** label for a controlled value not present in options (async search) */
	selectedLabel?: string;
	isLoading?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		option?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
