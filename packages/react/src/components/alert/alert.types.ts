import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { AlertSkeletonConfig } from "../skeleton/skeleton.types";
import type { alertVariants } from "./alert";

export interface AlertProps
	extends Omit<React.ComponentProps<"div">, "color">,
		VariantProps<typeof alertVariants> {
	dismissable?: boolean;
	onDismiss?: () => void;
	showIcon?: boolean;
	isLoading?: boolean;
	skeletonConfig?: AlertSkeletonConfig;
	skeleton?: React.ReactNode;
	/** Per-part overrides: `root` wins over `className`/`style`, `icon` targets the status icon, `dismiss` the close button. */
	slotStyles?: SlotStyles;
}
