import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { buttonVariants } from "./button";

export interface ButtonProps
	extends Omit<React.ComponentProps<"button">, "color">,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	/** Per-part style overrides: `root` wins over the legacy `className`/`style`; `spinner` targets the loading icon. */
	slotStyles?: SlotStyles;
	/** Whether button is in loading state */
	isLoading?: boolean;
}
