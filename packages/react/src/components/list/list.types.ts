import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { ListSkeletonConfig } from "../skeleton/skeleton.types";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
	/** Show dividers between list items @default true */
	divided?: boolean;
	/** Reduce spacing between items @default false */
	dense?: boolean;
	isLoading?: boolean;
	skeletonConfig?: ListSkeletonConfig;
	skeleton?: React.ReactNode;
}

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
	slotStyles?: SlotStyles;
	/** Make the item interactive (clickable) @default false */
	interactive?: boolean;
	/** Render the row as a link */
	href?: string;
	/** Active/selected state @default false */
	active?: boolean;
	/** Disabled state @default false */
	disabled?: boolean;
	/** Dense spacing @default false */
	dense?: boolean;
}

export interface ListItemIconProps extends React.ComponentProps<"div"> {
	/** Icon size variant @default 'md' */
	size?: "sm" | "md" | "lg";
}

export interface ListItemAvatarProps extends React.ComponentProps<"div"> {
	/** Avatar image source */
	src?: string;
	/** Alt text for the avatar */
	alt?: string;
	/** Fallback content (initials, icon, etc.) */
	fallback?: React.ReactNode;
	/** Avatar size @default 'md' */
	size?: "sm" | "md" | "lg";
}

export interface ListItemContentProps extends React.ComponentProps<"div"> {
	/** Truncate text with ellipsis @default false */
	truncate?: boolean;
}

export interface ListItemTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement> {
	/** Truncate text with ellipsis @default false */
	truncate?: boolean;
	/** Heading level for semantic HTML @default 'div' */
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";
}

export interface ListItemTextProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	/** Truncate text with ellipsis @default false */
	truncate?: boolean;
	/** Number of lines to show before truncating */
	lines?: number;
}

export interface ListItemActionProps extends React.ComponentProps<"div"> {}

export interface ListItemBadgeProps
	extends React.HTMLAttributes<HTMLSpanElement> {
	/** Badge semantic color @default 'muted' */
	color?:
		| "primary"
		| "secondary"
		| "destructive"
		| "success"
		| "warning"
		| "info"
		| "muted";
}
