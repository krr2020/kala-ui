import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface TagInputProps
	extends Omit<React.ComponentProps<"input">, "value" | "defaultValue"> {
	/**
	 * Array of tag values (controlled)
	 */
	value?: string[];
	/**
	 * Initial tags (uncontrolled)
	 */
	defaultValue?: string[];
	/**
	 * Callback when tags change
	 */
	onValueChange?: (tags: string[]) => void;
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
	/**
	 * Show success state
	 */
	hasSuccess?: boolean;
	/**
	 * Per-part overrides: `root` wins over `className` on the chip container,
	 * `tag` targets each chip, `remove` a chip's X button, `clear` the
	 * clear-all button.
	 */
	slotStyles?: SlotStyles;
}
