import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { IconComponent } from "../icons";
import type { AlertSkeletonConfig } from "../skeleton/skeleton.types";
import type { alertVariants } from "./alert";

export interface AlertProps
	extends Omit<React.ComponentProps<"div">, "color">,
		VariantProps<typeof alertVariants> {
	dismissible?: boolean;
	onDismiss?: () => void;
	/** Accessible name for the dismiss button; defaults to "Dismiss alert". */
	dismissLabel?: string;
	/** Status glyph — any `{className, size}` icon component; defaults by `color` (info/warning/success). */
	icon?: IconComponent;
	/** Dismiss-button glyph — any `{className, size}` icon component; defaults to kala's built-in ✕. */
	closeIcon?: IconComponent;
	showIcon?: boolean;
	isLoading?: boolean;
	/** Render the consumer's element instead of the default div */
	asChild?: boolean;
	skeletonConfig?: AlertSkeletonConfig;
	skeleton?: React.ReactNode;
	/** Per-part overrides: `root` wins over `className`/`style`, `icon` targets the status icon, `dismiss` the close button. */
	slotStyles?: SlotStyles;
}
