import type * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type * as React from "react";
import type { IconComponent } from "../icons";

export interface CheckboxProps
	extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
	/** Show loading skeleton */
	isLoading?: boolean;
	/** Checked-state glyph — any `{className, size}` icon component; defaults to kala's built-in check. */
	checkIcon?: IconComponent;
	/** Indeterminate-state glyph — any `{className, size}` icon component; defaults to kala's built-in minus. */
	minusIcon?: IconComponent;
}
