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
	/** Optional translation key for button text */
	translationKey?: string;
	/** Optional translation key for loading state text */
	loadingTextKey?: string;
	/** Optional translation key for disabled state text */
	disabledTextKey?: string;
	/** Whether button is in loading state */
	isLoading?: boolean;
}
