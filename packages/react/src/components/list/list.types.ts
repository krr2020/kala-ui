import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { badgeVariants } from "../badge";
import type { ListSkeletonConfig } from "../skeleton/skeleton.types";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
	/**
	 * Show dividers between list items
	 * @default true
	 */
	divided?: boolean;
	/**
	 * Reduce spacing between items
	 * @default false
	 */
	dense?: boolean;
	isLoading?: boolean;
	skeletonConfig?: ListSkeletonConfig;
	skeleton?: React.ReactNode;
}

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
	/**
	 * Highlight the list item
	 * @default false
	 */
	highlighted?: boolean;
	/**
	 * Make the list item clickable (adds hover state)
	 * @default false
	 */
	interactive?: boolean;
	/**
	 * Show the list item as selected
	 * @default false
	 */
	selected?: boolean;
	/**
	 * Disable the list item
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Reduce padding
	 * @default false
	 */
	dense?: boolean;
	/**
	 * Align content to the top instead of center
	 * @default false
	 */
	alignTop?: boolean;
}

export interface ListItemIconProps
	extends React.HTMLAttributes<HTMLSpanElement> {
	/**
	 * Reduce size and spacing
	 * @default false
	 */
	dense?: boolean;
}

export interface ListItemAvatarProps
	extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Reduce size and spacing
	 * @default false
	 */
	dense?: boolean;
}

export interface ListItemContentProps
	extends React.HTMLAttributes<HTMLDivElement> {}

export interface ListItemTitleProps
	extends React.HTMLAttributes<HTMLDivElement> {}

export interface ListItemTextProps
	extends React.HTMLAttributes<HTMLDivElement> {}

export interface ListItemActionProps
	extends React.HTMLAttributes<HTMLDivElement> {}

export interface ListItemBadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {}
