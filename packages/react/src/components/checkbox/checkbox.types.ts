import type * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type * as React from "react";

export interface CheckboxProps
	extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
	/** Show loading skeleton */
	isLoading?: boolean;
}
