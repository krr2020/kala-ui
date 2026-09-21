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

const bannerClasses = cva(bannerStyles.base, {
	variants: bannerStyles.variants,
	defaultVariants: bannerStyles.defaultVariants,
});

export interface BannerProps
	extends Omit<React.ComponentProps<"div">, "color">,
		VariantProps<typeof bannerClasses> {
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
	cn(bannerClasses({ color, position }), className),
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
