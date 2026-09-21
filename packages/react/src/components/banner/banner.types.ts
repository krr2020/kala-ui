import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { BannerSkeletonConfig } from "../skeleton/skeleton.types";
import type { bannerClasses } from "./banner";

export interface BannerProps
	extends Omit<React.ComponentProps<"div">, "color">,
		VariantProps<typeof bannerClasses> {
	onClose?: () => void;
	/** Accessible name for the close button; defaults to "Close banner". */
	dismissLabel?: string;
	/** `status` announces politely; use `alert` for urgent messages. */
	role?: "status" | "alert";
	"aria-live"?: "polite" | "assertive";
	isLoading?: boolean;
	skeletonConfig?: BannerSkeletonConfig;
	skeleton?: React.ReactNode;
	/** Render the consumer's element instead of the default div */
	asChild?: boolean;
	/** `root` wins over `className`/`style`, `actions` targets the content row, `icon`/`close` the close glyph/button. */
	slotStyles?: SlotStyles;
}
