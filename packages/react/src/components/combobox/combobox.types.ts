import type * as React from "react";

export interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface ComboboxProps {
	/**
	 * Accessible name for the combobox trigger.
	 * @default the placeholder text
	 */
	"aria-label"?: string;
	/** Options to display in the combobox. */
	options: ComboboxOption[];
	/** Selected value (controlled). */
	value?: string;
	/** Initially selected value (uncontrolled). */
	defaultValue?: string;
	/** Called when the user selects an option. The dropdown closes after
	 *  selection. */
	onValueChange?: (value: string) => void;
	/** Placeholder text when no value is selected. @default "Select option..." */
	placeholder?: string;
	/** Placeholder text for the search input. @default "Search..." */
	searchPlaceholder?: string;
	/** Text to show when no results match. @default "No results found." */
	emptyText?: string;
	/** Disabled state for the whole control. */
	disabled?: boolean;
	/** Additional CSS classes for the trigger button. */
	className?: string;
	/** Size variant. @default "md" */
	size?: "sm" | "md";
	/** Match dropdown width to the trigger width. When true, also wraps long
	 *  text inside options. @default true */
	matchTriggerWidth?: boolean;
	/** Show a clear button when a value is selected. @default false */
	clearable?: boolean;
	/** Called on every search input change. When provided, internal client-side
	 *  filtering is disabled (use for server-side / async search). */
	onSearchChange?: (search: string) => void;
	/** Label to show in the trigger for the selected value when it may not be
	 *  present in the current options array (e.g. async search). */
	selectedLabel?: string;
	/** Custom renderer for each option row. Receives the option and a boolean
	 *  indicating whether it is currently selected. */
	renderOption?: (option: ComboboxOption, selected: boolean) => React.ReactNode;
	/** Draw a separator line between each option. @default false */
	separateOptions?: boolean;
}
