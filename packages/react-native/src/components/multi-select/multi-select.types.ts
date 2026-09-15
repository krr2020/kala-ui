import type { StyleProp, ViewStyle } from "react-native";

export interface MultiSelectOption {
	value: string;
	label: string;
	disabled?: boolean;
	/** flat grouping key; options sharing one render under a header row */
	group?: string;
}

export interface MultiSelectProps {
	options: MultiSelectOption[];
	/** controlled selection set; locks display until the parent re-renders */
	value?: string[];
	/** uncontrolled seed; ignored when `value` is provided */
	defaultValue?: string[];
	/** fires with the full array on every add/remove/clear */
	onValueChange?: (value: string[]) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyText?: string;
	/** cap on selections; additions gate at the cap, removals stay free */
	maxSelected?: number;
	/** chips shown in the trigger before the +N badge; default 3 */
	maxVisibleSelections?: number;
	disabled?: boolean;
	size?: "sm" | "md";
	/** render group header rows for options carrying a group */
	grouped?: boolean;
	/** select-all / clear-all affordances; default true */
	showActions?: boolean;
	isLoading?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		chip?: StyleProp<ViewStyle>;
		option?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
