"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { SeparatorProps } from "./separator.types";

function Separator({
	className,
	style,
	slotStyles,
	orientation = "horizontal",
	decorative = true,
	...props
}: SeparatorProps) {
	const root = applySlot(
		cn(
			"bg-separator shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
			className,
		),
		slotStyles?.root,
	);
	return (
		<SeparatorPrimitive.Root
			data-kala-component="separator"
			data-slot="separator"
			decorative={decorative}
			orientation={orientation}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

export { Separator };
