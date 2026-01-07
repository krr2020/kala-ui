import type * as SliderPrimitive from "@radix-ui/react-slider";
import type * as React from "react";

export interface SliderProps
	extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
	/** Show loading skeleton */
	isLoading?: boolean;
}
