import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { IconComponent } from "../icons";
import type { SlotStyles } from "../../lib/slot-styles";
import type { tagClasses } from "./tag";

export interface TagProps
	extends Omit<React.ComponentProps<"span">, "color">,
		VariantProps<typeof tagClasses> {
	/** Show remove button */
	onRemove?: () => void;
	/** Accessible name for the remove button; defaults to "Remove". */
	dismissLabel?: string;
	/** Remove-button glyph — any `{className, size}` icon component; defaults to kala's built-in ✕. */
	removeIcon?: IconComponent;
	/** Icon to show before label */
	icon?: React.ReactNode;
	/** Render the consumer's element instead of the default span */
	asChild?: boolean;
	/** Per-part overrides: `root` wins over `className`/`style`, `icon` targets the icon wrapper, `remove` the remove button. */
	slotStyles?: SlotStyles;
}
