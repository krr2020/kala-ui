import type * as React from "react";

export interface MultiSelectOption {
	value: string;
	label: string;
	disabled?: boolean;
	icon?: React.ReactNode;
	group?: string;
}

export interface MultiSelectProps {
	/**
	 * Options to display
	 */
	options: MultiSelectOption[];
	/**
	 * Selected values (array)
	 */
	value?: string[];
	/**
	 * Callback when values change
	 */
	onValueChange?: (value: string[]) => void;
	/**
	 * Placeholder text when no values selected
	 * @default "Select options..."
	 */
	placeholder?: string;
	/**
	 * Placeholder for search input
	 * @default "Search..."
	 */
	searchPlaceholder?: string;
	/**
	 * Text when no results found
	 * @default "No results found."
	 */
	emptyText?: string;
	/**
	 * Maximum number of selections allowed
	 */
	maxSelections?: number;
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
	 * Match dropdown width to trigger width
	 * @default true
	 */
	matchTriggerWidth?: boolean;
	/**
	 * Show clear button when selections exist
	 * @default true
	 */
	showClearButton?: boolean;
	/**
	 * Show counter badge with selection count
	 * @default false
	 */
	showCounter?: boolean;
	/**
	 * Group options by group property
	 * @default false
	 */
	grouped?: boolean;
}
