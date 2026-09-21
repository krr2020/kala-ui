import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { flexVariants } from "./flex";

export type FlexProps<T extends React.ElementType = "div"> = Omit<
	React.ComponentProps<T>,
	"as" | "asChild"
> &
	VariantProps<typeof flexVariants> & {
		as?: T;
		asChild?: boolean;
		slotStyles?: SlotStyles;
	};
