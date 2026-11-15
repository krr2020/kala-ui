import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { Button } from "../button";
import type { EmptyStateSkeletonConfig } from "../skeleton/skeleton.types";
import type { emptyStateVariants } from "./empty-state";

export interface EmptyStateProps
	extends Omit<React.ComponentProps<"div">, "color" | "title">,
		VariantProps<typeof emptyStateVariants> {
	/** Icon component, ReactNode, or emoji/text glyph shown in the badge */
	icon?: LucideIcon | string | React.ReactNode;
	/** "tile" (default) frames the icon in the muted circle; "plain" renders it bare — no size box, no background */
	iconVariant?: "tile" | "plain";
	/** Primary heading */
	title: React.ReactNode;
	/** Supporting copy under the title */
	description?: React.ReactNode;
	/** Optional call-to-action rendered under the description — a node (rendered as-is) or the library Button props */
	action?: React.ReactNode | {
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
