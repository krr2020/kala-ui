import type * as React from "react";
import type { IconComponent } from "../icons";
import type { SlotStyles } from "../../lib/slot-styles";

export interface NativeSelectProps
	extends Omit<React.ComponentProps<"select">, "size"> {
	/** Size variant. @default "md" */
	size?: "sm" | "md";
	/** Error state styling */
	hasError?: boolean;
	/** Success state styling */
	hasSuccess?: boolean;
	/** Trigger chevron — any `{className, size}` icon component; defaults to kala's built-in chevron. */
	chevronIcon?: IconComponent;
	/** Per-part overrides: `root` targets the wrapper, `select` the native control, `icon` the chevron holder. */
	slotStyles?: SlotStyles;
}

export interface NativeSelectOptionProps
	extends React.ComponentProps<"option"> {}

export interface NativeSelectOptGroupProps
	extends React.ComponentProps<"optgroup"> {}
