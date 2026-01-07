import type * as SwitchPrimitive from "@radix-ui/react-switch";
import type * as React from "react";

export interface SwitchProps
	extends React.ComponentProps<typeof SwitchPrimitive.Root> {
	/** Show loading skeleton */
	isLoading?: boolean;
}
