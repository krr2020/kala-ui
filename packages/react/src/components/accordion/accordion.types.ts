import type * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { accordionVariants } from "./accordion";

/** Intersection, not extends: the Radix Root props are a single|multiple union. */
export type AccordionProps = React.ComponentProps<
	typeof AccordionPrimitive.Root
> &
	VariantProps<typeof accordionVariants>;

export interface AccordionTriggerProps
	extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {
	/** `root` targets the header wrapper, `chevron` the indicator glyph. */
	slotStyles?: SlotStyles;
}
