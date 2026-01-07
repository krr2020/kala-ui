import type * as LabelPrimitive from "@radix-ui/react-label";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { labelVariants } from "./label";

export interface LabelProps
	extends Omit<React.ComponentProps<typeof LabelPrimitive.Root>, "ref">,
		VariantProps<typeof labelVariants> {
	required?: boolean;
}
