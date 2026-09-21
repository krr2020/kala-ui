import type * as TogglePrimitive from "@radix-ui/react-toggle";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { toggleVariants } from "./toggle";

export interface ToggleProps
	extends React.ComponentProps<typeof TogglePrimitive.Root>,
		VariantProps<typeof toggleVariants> {
	slotStyles?: SlotStyles;
}
