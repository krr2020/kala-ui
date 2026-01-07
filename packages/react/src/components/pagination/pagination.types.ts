import type * as React from "react";

export interface PaginationProps extends React.ComponentProps<"nav"> {
	/**
	 * ARIA label for the navigation
	 * @default "Pagination"
	 */
	"aria-label"?: string;
}

export interface PaginationContentProps extends React.ComponentProps<"ul"> {
	/**
	 * Visual variant
	 * @default "default"
	 */
	variant?: "default" | "outline" | "filled" | "circle";
	/**
	 * Add spacing between items
	 * @default false
	 */
	spaced?: boolean;
}

export interface PaginationLinkProps extends React.ComponentProps<"a"> {
	/**
	 * Active state for current page
	 * @default false
	 */
	isActive?: boolean;
	/**
	 * Size variant
	 * @default "default"
	 */
	size?: "default" | "sm" | "lg" | "icon";
	/**
	 * Visual variant
	 * Inherits from parent PaginationContent unless overridden
	 */
	variant?: "default" | "outline" | "filled" | "circle";
}

export interface PaginationPreviousProps
	extends Omit<PaginationLinkProps, "children"> {
	/**
	 * Custom label for the previous button
	 * @default "Previous"
	 */
	label?: string;
}

export interface PaginationNextProps
	extends Omit<PaginationLinkProps, "children"> {
	/**
	 * Custom label for the next button
	 * @default "Next"
	 */
	label?: string;
}

export interface PageItem {
	type: "page" | "ellipsis";
	page?: number;
	label: string;
	isActive?: boolean;
}
