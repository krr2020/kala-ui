import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { paperVariants } from "./paper";

export interface PaperProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof paperVariants> {
	asChild?: boolean;
	slotStyles?: SlotStyles;
}
