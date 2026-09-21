import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { textVariants } from "./text";

export interface TextProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
		VariantProps<typeof textVariants>,
		React.RefAttributes<HTMLElement> {
	asChild?: boolean;
	as?: React.ElementType;
	slotStyles?: SlotStyles;
}
