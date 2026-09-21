import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type {
	buttonGroupSeparatorVariants,
	buttonGroupVariants,
} from "./button-group";

export interface ButtonGroupProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof buttonGroupVariants> {
	/** Accessible label describing the button group's purpose */
	"aria-label"?: string;
	/** Show separators between buttons */
	separated?: boolean;
	slotStyles?: SlotStyles;
}

export interface ButtonGroupSeparatorProps
	extends React.ComponentProps<"hr">,
		VariantProps<typeof buttonGroupSeparatorVariants> {}

export interface ButtonGroupTextProps
	extends React.HTMLAttributes<HTMLSpanElement> {
	asChild?: boolean;
}
