import type * as React from "react";
import type { Toaster } from "sonner";
import type { SlotStyles } from "../../lib/slot-styles";

export type ToastProps = React.ComponentProps<typeof Toaster> & {
	/** Per-part overrides: `root` targets the toaster wrapper; the remaining
	 * keys flow through sonner's per-toast classNames map. */
	slotStyles?: SlotStyles;
};
