import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface NativeSelectProps
	extends Omit<React.ComponentProps<"select">, "size"> {
	/** Size variant. @default "md" */
	size?: "sm" | "md";
	/** Error state styling */
	hasError?: boolean;
	/** Success state styling */
	hasSuccess?: boolean;
	/** Per-part overrides: `root` targets the wrapper, `select` the native control, `icon` the chevron holder. */
	slotStyles?: SlotStyles;
}

export interface NativeSelectOptionProps
	extends React.ComponentProps<"option"> {}

export interface NativeSelectOptGroupProps
	extends React.ComponentProps<"optgroup"> {}
