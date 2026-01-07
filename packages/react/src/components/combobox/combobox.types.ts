export interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface ComboboxProps {
	/**
	 * Options to display in the combobox
	 */
	options: ComboboxOption[];
	/**
	 * Selected value
	 */
	value?: string;
	/**
	 * Callback when value changes
	 */
	onValueChange?: (value: string) => void;
	/**
	 * Placeholder text when no value is selected
	 * @default "Select option..."
	 */
	placeholder?: string;
	/**
	 * Placeholder text for search input
	 * @default "Search..."
	 */
	searchPlaceholder?: string;
	/**
	 * Text to show when no results found
	 * @default "No results found."
	 */
	emptyText?: string;
	/**
	 * Disabled state
	 */
	disabled?: boolean;
	/**
	 * Additional CSS classes for trigger button
	 */
	className?: string;
	/**
	 * Size variant
	 * @default "default"
	 */
	size?: "sm" | "default";
	/**
	 * Match dropdown width to trigger width. When true, also wraps long text.
	 * @default true
	 */
	matchTriggerWidth?: boolean;
}
