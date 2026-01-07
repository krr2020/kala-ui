import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { buttonVariants } from "./button";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	/** Optional translation key for button text */
	translationKey?: string;
	/** Optional translation key for loading state text */
	loadingTextKey?: string;
	/** Optional translation key for disabled state text */
	disabledTextKey?: string;
	/** Whether button is in loading state */
	isLoading?: boolean;
}
