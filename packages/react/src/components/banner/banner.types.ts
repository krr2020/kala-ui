import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { BannerSkeletonConfig } from "../skeleton/skeleton.types";
import type { bannerVariants } from "./banner";

export interface BannerProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof bannerVariants> {
	onClose?: () => void;
	/**
	 * ARIA role for the banner
	 * @default 'banner' - use 'alert' for important/urgent messages
	 */
	role?: "banner" | "alert" | "status";
	/**
	 * ARIA live region for dynamic announcements
	 * @default undefined - use 'polite' or 'assertive' for dynamic banners
	 */
	"aria-live"?: "polite" | "assertive";
	isLoading?: boolean;
	skeletonConfig?: BannerSkeletonConfig;
	skeleton?: React.ReactNode;
}
