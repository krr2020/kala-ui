import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { Button } from "../button";
import type { EmptyStateSkeletonConfig } from "../skeleton/skeleton.types";
import type { emptyStateVariants } from "./empty-state";

export interface EmptyStateProps
	extends Omit<React.ComponentProps<"div">, "color">,
		VariantProps<typeof emptyStateVariants> {
	/** Icon component or emoji/text glyph shown in the badge */
	icon?: LucideIcon | string;
	/** Primary heading */
	title: string;
	/** Supporting copy under the title */
	description?: string;
	/** Optional call-to-action rendered under the description */
	action?: {
		label: string;
		onClick: () => void;
		variant?: React.ComponentProps<typeof Button>["variant"];
	};
	/** Renders the skeleton arm instead of content */
	isLoading?: boolean;
	/** Config for the built-in skeleton (ignored when `skeleton` is set) */
	skeletonConfig?: EmptyStateSkeletonConfig;
	/** Custom loading node */
	skeleton?: React.ReactNode;
	/** Per-part overrides: `root` wins over `className`/`style` in every arm; `icon`/`title`/`description`/`action` target the inner nodes. */
	slotStyles?: SlotStyles;
}
