import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { badgeVariants } from "./badge";

/** Intersection, not extends: the cva `color` variant narrows the native span `color`. */
export type BadgeProps = React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & {
		asChild?: boolean;
		isLoading?: boolean;
		/** `root` wins over the legacy `className`/`style` props. */
		slotStyles?: SlotStyles;
	};
