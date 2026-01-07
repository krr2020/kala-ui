import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";
import type { SliderProps } from "./slider.types";

const Slider = React.forwardRef<
	React.ComponentRef<typeof SliderPrimitive.Root>,
	SliderProps
>(({ className, defaultValue, value, isLoading = false, ...props }, ref) => {
	// Show loading skeleton
	if (isLoading) {
		return (
			<div className={cn("relative w-full py-4", className)}>
				<Skeleton className="h-2 w-full rounded-full" />
				<Skeleton className="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
			</div>
		);
	}

	// Determine the number of thumbs based on value or defaultValue
	const values = value || defaultValue || [0];
	const thumbCount = values.length;

	return (
		<SliderPrimitive.Root
			ref={ref}
			className={cn(
				"relative flex w-full touch-none select-none items-center",
				className,
			)}
			{...(defaultValue !== undefined && { defaultValue })}
			{...(value !== undefined && { value })}
			{...props}
		>
			<SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted dark:bg-secondary">
				<SliderPrimitive.Range className="absolute h-full bg-primary" />
			</SliderPrimitive.Track>
			{Array.from({ length: thumbCount }).map((_, i) => (
				<SliderPrimitive.Thumb
					key={`thumb-${i}`}
					className={cn(
						"block h-5 w-5 rounded-full border-2 border-primary bg-background transition-colors disabled:pointer-events-none disabled:opacity-50",
						"focus-ring",
					)}
				/>
			))}
		</SliderPrimitive.Root>
	);
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
