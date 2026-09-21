import type * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { buttonVariants } from "../button";

export interface AlertDialogProps
	extends React.ComponentProps<typeof AlertDialogPrimitive.Root> {}

export interface AlertDialogContentProps
	extends React.ComponentProps<typeof AlertDialogPrimitive.Content> {
	slotStyles?: SlotStyles;
}

/** Intersection, not extends: buttonVariants narrow the native color/size keys. */
export type AlertDialogActionProps = React.ComponentProps<
	typeof AlertDialogPrimitive.Action
> &
	VariantProps<typeof buttonVariants>;
