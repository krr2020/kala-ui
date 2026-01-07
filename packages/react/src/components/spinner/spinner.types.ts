import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { spinnerVariants } from "./spinner";

export interface SpinnerProps
	extends React.ComponentProps<"svg">,
		VariantProps<typeof spinnerVariants> {
	label?: string;
}
