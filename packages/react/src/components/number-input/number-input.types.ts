import type * as React from "react";

export interface NumberInputProps
	extends Omit<
		React.ComponentProps<"input">,
		"onChange" | "size" | "value" | "defaultValue" | "type"
	> {
	/** Controlled value */
	value?: number;
	/** Default value for uncontrolled usage */
	defaultValue?: number;
	/** Called with the new numeric value (undefined when input is cleared) */
	onChange?: (value: number | undefined) => void;
	/** Minimum allowed value */
	min?: number;
	/** Maximum allowed value */
	max?: number;
	/** Amount to increment/decrement per step */
	step?: number;
	/** Size variant */
	size?: "sm" | "default";
	/** Error state styling */
	hasError?: boolean;
	/** Show loading skeleton */
	isLoading?: boolean;
}
