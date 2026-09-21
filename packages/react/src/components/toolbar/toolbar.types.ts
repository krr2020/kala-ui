import type * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { toggleVariants } from "../toggle/toggle";

export interface ToolbarProps
	extends React.ComponentProps<typeof ToolbarPrimitive.Root> {
	slotStyles?: SlotStyles;
}

export interface ToolbarButtonProps
	extends React.ComponentProps<typeof ToolbarPrimitive.Button>,
		VariantProps<typeof toggleVariants> {}

/** Intersection, not extends: the Radix ToggleGroup props are a single|multiple union. */
export type ToolbarToggleGroupProps = React.ComponentProps<
	typeof ToolbarPrimitive.ToggleGroup
>;

export interface ToolbarToggleItemProps
	extends React.ComponentProps<typeof ToolbarPrimitive.ToggleItem>,
		VariantProps<typeof toggleVariants> {}

export interface ToolbarSeparatorProps
	extends React.ComponentProps<typeof ToolbarPrimitive.Separator> {}

export interface ToolbarLinkProps
	extends React.ComponentProps<typeof ToolbarPrimitive.Link> {}
