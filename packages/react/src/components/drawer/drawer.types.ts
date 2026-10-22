import type * as React from "react";
import type { Drawer as DrawerPrimitive } from "vaul";
import type { SlotStyles } from "../../lib/slot-styles";

export type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";
export type DrawerHeaderAlign = "left" | "center" | "right";

export interface DrawerContentProps
	extends React.ComponentProps<typeof DrawerPrimitive.Content> {
	/**
	 * Width (left/right) or height (top/bottom) preset
	 * @default "md"
	 */
	size?: DrawerSize;
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}

export interface DrawerHeaderProps
	extends Omit<React.ComponentProps<"div">, "align"> {
	/** Text alignment for the title and description. Defaults to left with a close button, otherwise center. */
	align?: DrawerHeaderAlign;
	/** Render an accessible close icon button. Defaults to true. */
	showCloseButton?: boolean;
	/** Accessible name for the close icon button. */
	closeLabel?: string;
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}

export interface DrawerFooterProps extends React.ComponentProps<"div"> {
	/** Keep the footer pinned to the bottom edge while drawer content scrolls. Defaults to true. */
	sticky?: boolean;
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}
