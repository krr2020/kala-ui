import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { containerVariants } from "./container";

export interface ContainerProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof containerVariants> {
	/** Render the consumer's element instead of the default div */
	asChild?: boolean;
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}
