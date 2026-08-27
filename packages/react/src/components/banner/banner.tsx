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
}

export function Banner({
	className,
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
	if (isLoading) {
		if (skeleton) {
			return (
				<div
					className={cn(bannerVariants({ color, position }), className)}
					role={role}
					{...props}
				>
					{skeleton}
				</div>
			);
		}
		return (
			<BannerSkeleton
				className={cn(bannerVariants({ color, position }), className)}
				{...skeletonConfig}
			/>
		);
	}

	return (
		<div
			className={cn(bannerVariants({ color, position }), className)}
			role={role}
			{...props}
		>
			<div className="flex-1 flex items-center gap-3">{children}</div>
			{onClose && (
				<button
					type="button"
					onClick={onClose}
					className="kala-touch cursor-pointer shrink-0 p-1 rounded hover:bg-overlay/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-label="Close banner"
				>
					<X className="w-4 h-4" aria-hidden="true" />
				</button>
			)}
		</div>
	);
}
