import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { headingVariants } from "./heading";

export interface HeadingProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement>,
		VariantProps<typeof headingVariants> {
	asChild?: boolean;
	as?: React.ElementType;
	slotStyles?: SlotStyles;
	// biome-ignore lint/suspicious/noExplicitAny: Support polymorphic props
	[key: string]: any;
}
