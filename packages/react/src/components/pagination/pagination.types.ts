import type * as React from "react";

export interface PaginationProps
	extends Omit<React.ComponentProps<"nav">, "onChange"> {
	/**
	 * Total amount of pages
	 */
	total?: number;
	/**
	 * Active page
	 */
	page?: number;
	/**
	 * Initial active page
	 */
	initialPage?: number;
	/**
	 * Siblings amount on left/right side of selected page
	 */
	siblings?: number;
	/**
	 * Amount of elements visible on left/right edges
	 */
	boundaries?: number;
	/**
	 * Callback fired after change of each page
	 */
	onChange?: (page: number) => void;
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

export interface PaginationLinkProps
	extends Omit<React.ComponentProps<"a">, "onClick"> {
	/**
	 * Active state for current page
	 * @default false
	 */
	isActive?: boolean;
	/**
	 * Size variant
	 * @default "md"
	 */
	size?: "sm" | "md" | "lg";
	/**
	 * Whether this is an icon-only control (prev/next)
	 * @default false
	 */
	isIconButton?: boolean;
	/**
	 * Page number to navigate to (button form)
	 */
	page?: number;
	/**
	 * Link href (anchor form)
	 */
	href?: string;
	/**
	 * Disable the control (applies to the button form; links get
	 * aria-disabled)
	 */
	disabled?: boolean;
	/**
	 * On click handler
	 */
	onClick?: (e: React.MouseEvent) => void;
}

export interface PaginationPreviousProps
	extends Omit<PaginationLinkProps, "isIconButton"> {
	/**
	 * Show label text alongside icon
	 * @default true
	 */
	showLabel?: boolean;
}

export interface PaginationNextProps
	extends Omit<PaginationLinkProps, "isIconButton"> {
	/**
	 * Show label text alongside icon
	 * @default true
	 */
	showLabel?: boolean;
}

export interface PageItem {
	type: "page" | "ellipsis";
	page?: number;
	label: string;
	isActive?: boolean;
}
