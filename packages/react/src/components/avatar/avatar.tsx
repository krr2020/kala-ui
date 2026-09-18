"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import {
	avatarFallbackStyles,
	avatarImageStyles,
	avatarStyles,
} from "../../config/avatar";
import { cn } from "../../lib/utils";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { SkeletonCircle } from "../skeleton/skeleton-patterns";

const AvatarContext = React.createContext<{
	shape?: "circle" | "rounded" | "square";
}>({
	shape: "circle",
});

export const avatarVariants = cva(avatarStyles.base, {
	variants: avatarStyles.variants,
	compoundVariants: avatarStyles.compoundVariants as never,
	defaultVariants: avatarStyles.defaultVariants,
});

export const avatarImageVariants = cva(avatarImageStyles.base, {
	variants: avatarImageStyles.variants,
	defaultVariants: avatarImageStyles.defaultVariants,
});

// Skeleton sizing mirrors the size utilities in config/avatar.ts
const AVATAR_SKELETON_SIZES: Record<string, string> = {
	xs: "1.5rem",
	sm: "2rem",
	md: "2.5rem",
	lg: "3rem",
	xl: "4rem",
};

interface AvatarProps
	extends React.ComponentProps<typeof AvatarPrimitive.Root>,
		VariantProps<typeof avatarVariants> {
	/**
	 * Show skeleton loading state
	 */
	isLoading?: boolean;
	slotStyles?: SlotStyles;
}

function Avatar({
	className,
	size,
	shape,
	status,
	isLoading,
	style,
	slotStyles,
	...props
}: AvatarProps) {
	const root = applySlot(cn(avatarVariants({ size, shape, status }), className), slotStyles?.root);
	// Show loading skeleton
	if (isLoading) {
		const skeletonSize =
			AVATAR_SKELETON_SIZES[size ?? "md"] ?? AVATAR_SKELETON_SIZES.md;
		return (
			<SkeletonCircle
				data-kala-component="avatar"
				data-slot="avatar"
				size={skeletonSize}
				className={root.className}
				style={mergeStyle(style, root.style)}
			/>
		);
	}

	return (
		<AvatarContext.Provider value={{ shape: shape || "circle" }}>
			<AvatarPrimitive.Root
				data-kala-component="avatar"
				data-slot="avatar"
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			/>
		</AvatarContext.Provider>
	);
}

export interface AvatarImageProps
	extends Omit<React.ComponentProps<typeof AvatarPrimitive.Image>, "alt">,
		VariantProps<typeof avatarImageVariants> {
	/**
	 * Alternative text describing the avatar (the person's or entity's name).
	 * Required so screen readers never land on an unnamed image.
	 */
	alt: string;
	shape?: "circle" | "rounded" | "square";
}

function AvatarImage({
	className,
	shape: shapeProp,
	...props
}: AvatarImageProps) {
	const { shape: contextShape } = React.useContext(AvatarContext);
	const shape = shapeProp || contextShape || "circle";

	return (
		<AvatarPrimitive.Image
			data-kala-component="avatar-image"
			data-slot="avatar-image"
			className={cn(avatarImageVariants({ shape }), className)}
			{...props}
		/>
	);
}

export const avatarFallbackVariants = cva(avatarFallbackStyles.base, {
	variants: avatarFallbackStyles.variants,
	defaultVariants: avatarFallbackStyles.defaultVariants,
});

export interface AvatarFallbackProps
	extends Omit<React.ComponentProps<typeof AvatarPrimitive.Fallback>, "color">,
		VariantProps<typeof avatarFallbackVariants> {
	slotStyles?: SlotStyles;
}

function AvatarFallback({
	className,
	style,
	slotStyles,
	shape: shapeProp,
	color,
	...props
}: AvatarFallbackProps) {
	const { shape: contextShape } = React.useContext(AvatarContext);
	const shape = shapeProp || contextShape || "circle";
	const root = applySlot(
		cn(avatarFallbackVariants({ shape, color }), className),
		slotStyles?.root,
	);

	return (
		<AvatarPrimitive.Fallback
			data-kala-component="avatar-fallback"
			data-slot="avatar-fallback"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

export { Avatar, AvatarFallback, AvatarImage, type AvatarProps };
