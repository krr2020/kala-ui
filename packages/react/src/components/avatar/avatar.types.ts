import type * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type {
	avatarFallbackVariants,
	avatarImageVariants,
	avatarVariants,
} from "./avatar";

export interface AvatarProps
	extends React.ComponentProps<typeof AvatarPrimitive.Root>,
		VariantProps<typeof avatarVariants> {
	isLoading?: boolean;
	slotStyles?: SlotStyles;
}

export interface AvatarImageProps
	extends Omit<React.ComponentProps<typeof AvatarPrimitive.Image>, "alt">,
		VariantProps<typeof avatarImageVariants> {
	/** Alternative text describing the avatar; required so screen readers never land on an unnamed image. */
	alt: string;
	shape?: "circle" | "rounded" | "square";
}

export interface AvatarFallbackProps
	extends Omit<React.ComponentProps<typeof AvatarPrimitive.Fallback>, "color">,
		VariantProps<typeof avatarFallbackVariants> {
	slotStyles?: SlotStyles;
}
