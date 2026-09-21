import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { gridItemVariants, gridVariants } from "./grid";

export interface GridProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof gridVariants> {
	asChild?: boolean;
	slotStyles?: SlotStyles;
}

export interface GridItemProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof gridItemVariants> {
	asChild?: boolean;
	slotStyles?: SlotStyles;
}
