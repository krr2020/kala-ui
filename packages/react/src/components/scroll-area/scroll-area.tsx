"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import type * as React from "react";

import { scrollAreaStyles } from "../../config/scroll-area";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { ScrollAreaProps } from "./scroll-area.types";

function ScrollArea({
	ref,
	className,
	style,
	slotStyles,
	children,
	...props
}: ScrollAreaProps) {
	const root = applySlot(
		cn("relative overflow-hidden", className),
		slotStyles?.root,
	);
	return (
		<ScrollAreaPrimitive.Root
			data-kala-component="scroll-area"
			ref={ref}
			data-slot="scroll-area"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			<ScrollAreaPrimitive.Viewport className="size-full rounded-[inherit]">
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	);
}

interface ScrollBarProps
	extends React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
	slotStyles?: SlotStyles;
}

function ScrollBar({
	ref,
	className,
	style,
	slotStyles,
	orientation = "vertical",
	...props
}: ScrollBarProps) {
	const root = applySlot(
		cn(
			scrollAreaStyles.scrollbar,
			orientation === "vertical" &&
				"h-full w-2.5 border-l border-l-transparent p-px",
			orientation === "horizontal" &&
				"h-2.5 flex-col border-t border-t-transparent p-px",
			className,
		),
		slotStyles?.root,
	);
	const thumb = applySlot(scrollAreaStyles.thumb, slotStyles?.thumb);
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			data-kala-component="scroll-area-scroll-bar"
			ref={ref}
			data-slot="scroll-bar"
			orientation={orientation}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb
				data-slot="scroll-thumb"
				className={thumb.className}
				style={thumb.style}
			/>
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	);
}

export { ScrollArea, ScrollBar };
