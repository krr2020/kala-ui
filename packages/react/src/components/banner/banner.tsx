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

import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { bannerStyles } from "../../config/banner";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { BannerSkeleton } from "./banner-skeleton";
import type { BannerProps } from "./banner.types";

export const bannerClasses = cva(bannerStyles.base, {
	variants: bannerStyles.variants,
	compoundVariants: bannerStyles.compoundVariants as never,
	defaultVariants: bannerStyles.defaultVariants,
});

export function Banner({
	className,
	style,
	slotStyles,
	variant,
	color,
	position,
	onClose,
	dismissLabel = "Close banner",
	children,
	role = "status",
	isLoading = false,
	skeletonConfig,
	skeleton,
	asChild = false,
	...props
}: BannerProps) {
	const root = applySlot(
		cn(bannerClasses({ variant, color, position }), className),
		slotStyles?.root,
	);
	const Comp = asChild ? Slot : "div";
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
		<Comp
			data-kala-component="banner"
			className={root.className}
			style={rootStyle}
			role={role}
			{...props}
		>
			{asChild ? (
				<Slottable>{children}</Slottable>
			) : (
				<div className={actions.className} style={actions.style}>
					{children}
				</div>
			)}
			{onClose && (
				<button
					type="button"
					onClick={onClose}
					className={close.className}
					style={close.style}
					aria-label={dismissLabel}
				>
					<X className={icon.className} style={icon.style} aria-hidden="true" />
				</button>
			)}
		</Comp>
	);
}
