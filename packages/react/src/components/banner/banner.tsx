/**
 * Banner Component - Reusable notification banner
 *
 * Full-width banner for important notifications and alerts.
 *
 * Purpose: Used for system-wide or top-level messages that apply to the entire page
 * or application context. Unlike the Alert component, Banners are typically fixed
 * at the top of the viewport or container and demand immediate attention without
 * being tied to a specific form or content area.
 */

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type * as React from "react";
import { bannerStyles } from "../../config/banner";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { BannerSkeletonConfig } from "../skeleton/skeleton.types";
import { BannerSkeleton } from "./banner-skeleton";

export const bannerVariants = cva(
	"w-full z-50 px-4 py-3 text-sm font-medium flex items-center justify-between gap-4",
	{
		variants: {
			color: {
				info: "bg-info text-info-foreground",
				warning: "bg-warning text-warning-foreground",
				destructive: "bg-destructive text-destructive-foreground",
				success: "bg-success text-success-foreground",
			},
			position: {
				fixed: "fixed top-0 left-0 right-0 shadow-md",
				static: "relative",
			},
		},
		defaultVariants: {
			color: "info",
			position: "fixed",
		},
	},
);

export interface BannerProps
	extends Omit<React.ComponentProps<"div">, "color">,
		VariantProps<typeof bannerVariants> {
	onClose?: () => void;
	/**
	 * ARIA role for the banner
	 * @default 'status' - announces politely; use 'alert' for urgent messages
	 */
	role?: "status" | "alert";
	/**
	 * ARIA live region for dynamic announcements
	 * @default undefined - role status/alert already imply live regions
	 */
	"aria-live"?: "polite" | "assertive";
	isLoading?: boolean;
	skeletonConfig?: BannerSkeletonConfig;
	skeleton?: React.ReactNode;
	/** Per-part overrides: `root` wins over `className`/`style`, `actions` targets the content row, `icon`/`close` the close glyph/button. */
	slotStyles?: SlotStyles;
}

export function Banner({
className,
style,
slotStyles,
color,
position,
onClose,
children,
role = "status",
isLoading = false,
skeletonConfig,
skeleton,
...props
}: BannerProps) {
const root = applySlot(
	cn(bannerVariants({ color, position }), className),
	slotStyles?.root,
);
const rootStyle = mergeStyle(style, root.style);
if (isLoading) {
	if (skeleton) {
		return (
			<div
				data-kala-component="banner"
				className={root.className}
				style={rootStyle}
				role={role}
				{...props}
			>
				{skeleton}
			</div>
		);
	}
	return (
		<BannerSkeleton
			data-kala-component="banner"
			className={root.className}
			style={rootStyle}
			{...skeletonConfig}
		/>
	);
}

const actions = applySlot(bannerStyles.actions, slotStyles?.actions);
const close = applySlot(bannerStyles.close, slotStyles?.close);
const icon = applySlot(bannerStyles.icon, slotStyles?.icon);

return (
	<div
		data-kala-component="banner"
		className={root.className}
		style={rootStyle}
		role={role}
		{...props}
	>
		<div className={actions.className} style={actions.style}>
			{children}
		</div>
		{onClose && (
			<button
				type="button"
				onClick={onClose}
				className={close.className}
				style={close.style}
				aria-label="Close banner"
			>
				<X className={icon.className} style={icon.style} aria-hidden="true" />
			</button>
		)}
	</div>
);
}
