import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import type { SlotStyles } from "../../lib/slot-styles";
import type { aspectRatioVariants } from "./aspect-ratio";

export interface AspectRatioProps
	extends React.ComponentProps<typeof AspectRatioPrimitive.Root>,
		VariantProps<typeof aspectRatioVariants> {
	rounded?: VariantProps<typeof aspectRatioVariants>["rounded"];
	bordered?: VariantProps<typeof aspectRatioVariants>["bordered"];
	slotStyles?: SlotStyles;
}
