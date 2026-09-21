import type * as DialogPrimitive from "@radix-ui/react-dialog";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface DialogContentProps
	extends React.ComponentProps<typeof DialogPrimitive.Content> {
	/** Whether to render the top-right close button (default: true) */
	showCloseButton?: boolean;
	/** Width preset for the dialog surface */
	size?: "sm" | "md" | "lg" | "xl" | "full";
	/** Accessible name for the close button; defaults to "Close". */
	closeLabel?: string;
	/** Per-part overrides: `root` wins over `className`/`style`; `overlay` targets the backdrop, `close` the close button, `closeIcon` its glyph. */
	slotStyles?: SlotStyles;
}
