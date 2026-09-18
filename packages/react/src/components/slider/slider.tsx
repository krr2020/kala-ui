import * as SliderPrimitive from "@radix-ui/react-slider";

import {
	applySlot,
	mergeStyle,
	type SlotStyles,
} from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import type { SliderProps } from "./slider.types";

function Slider({
	ref,
	className,
	style,
	slotStyles,
	defaultValue,
	value,
	isLoading = false,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledBy,
	...props
}: SliderProps & { slotStyles?: SlotStyles }) {
	// Show loading skeleton
	if (isLoading) {
		const skel = applySlot(
			cn("relative w-full py-4", className),
			slotStyles?.root,
		);
		return (
			<div
				data-kala-component="slider"
				className={skel.className}
				style={mergeStyle(style, skel.style)}
			>
				<Skeleton className="h-2 w-full rounded-full" />
				<Skeleton className="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
			</div>
		);
	}

	// Determine the number of thumbs based on value or defaultValue
	const values = value || defaultValue || [0];
	const thumbCount = values.length;

	const root = applySlot(
		cn("relative flex w-full touch-none select-none items-center", className),
		slotStyles?.root,
	);
	const track = applySlot(
		"relative h-2 w-full grow overflow-hidden rounded-full bg-muted dark:bg-secondary",
		slotStyles?.track,
	);
	const range = applySlot("absolute h-full bg-primary", slotStyles?.range);
	const thumb = applySlot(
		cn(
			"block h-5 w-5 rounded-full border-2 border-primary bg-background transition-colors disabled:pointer-events-none disabled:opacity-50",
			"kala-focus-ring",
		),
		slotStyles?.thumb,
	);

	return (
		<SliderPrimitive.Root
			data-kala-component="slider"
			ref={ref}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...(defaultValue !== undefined && { defaultValue })}
			{...(value !== undefined && { value })}
			{...props}
		>
			<SliderPrimitive.Track
				className={track.className}
				style={track.style}
			>
				<SliderPrimitive.Range
					className={range.className}
					style={range.style}
				/>
			</SliderPrimitive.Track>
			{Array.from({ length: thumbCount }).map((_, i) => (
				<SliderPrimitive.Thumb
					key={`thumb-${i}`}
					// the thumbs are the actual sliders: they carry the
					// accessible name, not the roleless root wrapper
					aria-label={
						ariaLabel
							? thumbCount > 1
								? `${ariaLabel} (value ${i + 1})`
								: ariaLabel
							: `Slider value ${i + 1}`
					}
					aria-labelledby={ariaLabelledBy}
					className={thumb.className}
					style={thumb.style}
				/>
			))}
		</SliderPrimitive.Root>
	);
}

export { Slider };
