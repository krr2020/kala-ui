import type * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { toggleVariants } from "../toggle/toggle";

/** Intersection, not extends: the Radix Root props are a single|multiple union. */
export type ToggleGroupProps = React.ComponentProps<
	typeof ToggleGroupPrimitive.Root
> &
	VariantProps<typeof toggleVariants> & {
		slotStyles?: SlotStyles;
	};
