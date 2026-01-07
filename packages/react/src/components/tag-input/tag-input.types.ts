import type * as React from "react";

export interface TagInputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"value" | "onChange"
	> {
	/**
	 * Array of tag values
	 */
	value?: string[];
	/**
	 * Callback when tags change
	 */
	onChange?: (tags: string[]) => void;
	/**
	 * Character(s) that trigger tag creation
	 * @default [',']
	 */
	separators?: string[];
	/**
	 * Allow duplicate tags
	 * @default false
	 */
	allowDuplicates?: boolean;
	/**
	 * Maximum number of tags allowed
	 */
	maxTags?: number;
	/**
	 * Validate tag before adding
	 */
	validateTag?: (tag: string) => boolean;
	/**
	 * Transform tag before adding (e.g., lowercase, trim)
	 */
	transformTag?: (tag: string) => string;
	/**
	 * Additional CSS classes for the container
	 */
	className?: string;
	/**
	 * Show error state
	 */
	hasError?: boolean;
}
