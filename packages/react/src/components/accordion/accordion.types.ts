import type * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { IconComponent } from "../icons";
import type { SlotStyles } from "../../lib/slot-styles";
import type { accordionVariants } from "./accordion";

/** Intersection, not extends: the Radix Root props are a single|multiple union. */
export type AccordionProps = React.ComponentProps<
	typeof AccordionPrimitive.Root
> &
	VariantProps<typeof accordionVariants>;

export interface AccordionTriggerProps
	extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {
	/** Indicator glyph — any `{className, size}` icon component; defaults to kala's built-in chevron. */
	chevronIcon?: IconComponent;
	/** `root` targets the header wrapper, `chevron` the indicator glyph. */
	slotStyles?: SlotStyles;
}
