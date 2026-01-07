import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

// ============================================================================
// Pagination Root
// ============================================================================

export interface PaginationProps extends React.ComponentProps<"nav"> {
	/**
	 * ARIA label for the navigation
	 * @default "Pagination"
	 */
	"aria-label"?: string;
}

function Pagination({
	className,
	"aria-label": ariaLabel = "Pagination",
	...props
}: PaginationProps) {
	return (
		<nav
			aria-label={ariaLabel}
			className={cn("mx-auto flex w-full justify-center", className)}
			{...props}
		/>
	);
}

// ============================================================================
// Pagination Content (List Container)
// ============================================================================

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

function PaginationContent({
	className,
	variant = "default",
	spaced = false,
	...props
}: PaginationContentProps) {
	return (
		<ul
			className={cn(
				"flex flex-row items-center",
				spaced ? "gap-2" : "gap-1",
				className,
			)}
			data-variant={variant}
			{...props}
		/>
	);
}

// ============================================================================
// Pagination Item (List Item Container)
// ============================================================================

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
	return <li className={cn("", className)} {...props} />;
}

// ============================================================================
// Pagination Link (Button or Anchor)
// ============================================================================

export interface PaginationLinkProps extends React.ComponentProps<"a"> {
	/**
	 * Whether this page is currently active
	 * @default false
	 */
	isActive?: boolean;
	/**
	 * Size variant
	 * @default "default"
	 */
	size?: "default" | "sm" | "lg";
	/**
	 * Whether this is an icon-only button (prev/next)
	 * @default false
	 */
	isIconButton?: boolean;
}

function PaginationLink({
	className,
	isActive,
	size = "default",
	isIconButton = false,
	children,
	...props
}: PaginationLinkProps) {
	const parentVariant = React.useContext(PaginationVariantContext) || "default";

	const sizeClasses = {
		sm: "h-8 min-w-8 text-xs",
		default: "h-9 min-w-9 text-sm",
		lg: "h-10 min-w-10 text-base",
	};

	const baseClasses = cn(
		"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors",
		"focus-ring",
		"disabled:pointer-events-none disabled:opacity-50",
		"text-foreground",
		sizeClasses[size],
		isIconButton ? "px-2" : "px-3",
	);

	// Variant-specific styles
	const variantClasses = {
		default: cn(
			"hover:bg-accent hover:text-accent-foreground",
			isActive &&
				"bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
		),
		outline: cn(
			"border border-input",
			"hover:bg-accent hover:text-accent-foreground",
			isActive &&
				"border-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
		),
		filled: cn(
			"bg-muted hover:bg-accent hover:text-accent-foreground",
			isActive &&
				"bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
		),
		circle: cn(
			"rounded-full",
			"bg-muted hover:bg-accent hover:text-accent-foreground",
			isActive &&
				"bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
		),
	};

	return (
		<a
			aria-current={isActive ? "page" : undefined}
			className={cn(baseClasses, variantClasses[parentVariant], className)}
			{...props}
		>
			{children}
		</a>
	);
}

// ============================================================================
// Pagination Previous
// ============================================================================

export interface PaginationPreviousProps
	extends Omit<PaginationLinkProps, "isIconButton"> {
	/**
	 * Show label text alongside icon
	 * @default true
	 */
	showLabel?: boolean;
}

function PaginationPrevious({
	className,
	showLabel = true,
	children,
	...props
}: PaginationPreviousProps) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			isIconButton={!showLabel}
			className={cn("gap-1", className)}
			{...props}
		>
			<ChevronLeft className="h-4 w-4" />
			{showLabel && <span>{children || "Previous"}</span>}
		</PaginationLink>
	);
}

// ============================================================================
// Pagination Next
// ============================================================================

export interface PaginationNextProps
	extends Omit<PaginationLinkProps, "isIconButton"> {
	/**
	 * Show label text alongside icon
	 * @default true
	 */
	showLabel?: boolean;
}

function PaginationNext({
	className,
	showLabel = true,
	children,
	...props
}: PaginationNextProps) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			isIconButton={!showLabel}
			className={cn("gap-1", className)}
			{...props}
		>
			{showLabel && <span>{children || "Next"}</span>}
			<ChevronRight className="h-4 w-4" />
		</PaginationLink>
	);
}

// ============================================================================
// Pagination Ellipsis
// ============================================================================

function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			aria-hidden
			className={cn("flex h-9 w-9 items-center justify-center", className)}
			{...props}
		>
			<MoreHorizontal className="h-4 w-4" />
			<span className="sr-only">More pages</span>
		</span>
	);
}

// ============================================================================
// Context for variant propagation
// ============================================================================

const PaginationVariantContext =
	React.createContext<PaginationContentProps["variant"]>("default");

function PaginationContentWithContext({
	variant = "default",
	...props
}: PaginationContentProps) {
	return (
		<PaginationVariantContext.Provider value={variant}>
			<PaginationContent variant={variant} {...props} />
		</PaginationVariantContext.Provider>
	);
}

// ============================================================================
// Helper: Generate page numbers with ellipsis
// ============================================================================

export interface PageItem {
	type: "page" | "ellipsis";
	page?: number;
	key: string;
}

/**
 * Generate page items with ellipsis for large page ranges
 *
 * @param currentPage - Current active page (1-indexed)
 * @param totalPages - Total number of pages
 * @param siblingCount - Number of siblings to show on each side of current page
 * @returns Array of page items to render
 *
 * @example
 * ```tsx
 * const items = generatePagination(5, 10, 1);
 * // Returns: [1, ellipsis, 4, 5, 6, ellipsis, 10]
 * ```
 */
export function generatePagination(
	currentPage: number,
	totalPages: number,
	siblingCount: number = 1,
): PageItem[] {
	// Always show first page, last page, current page, and siblings
	const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
	const totalBlocks = totalNumbers + 2; // + 2 ellipsis

	if (totalPages <= totalBlocks) {
		// Show all pages if total is small
		return Array.from({ length: totalPages }, (_, i) => ({
			type: "page" as const,
			page: i + 1,
			key: `page-${i + 1}`,
		}));
	}

	const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
	const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

	const shouldShowLeftEllipsis = leftSiblingIndex > 2;
	const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

	const items: PageItem[] = [];

	// First page
	items.push({ type: "page", page: 1, key: "page-1" });

	// Left ellipsis
	if (shouldShowLeftEllipsis) {
		items.push({ type: "ellipsis", key: "ellipsis-left" });
	} else if (leftSiblingIndex === 2) {
		items.push({ type: "page", page: 2, key: "page-2" });
	}

	// Middle pages (siblings + current)
	for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
		if (i !== 1 && i !== totalPages) {
			items.push({ type: "page", page: i, key: `page-${i}` });
		}
	}

	// Right ellipsis
	if (shouldShowRightEllipsis) {
		items.push({ type: "ellipsis", key: "ellipsis-right" });
	} else if (rightSiblingIndex === totalPages - 1) {
		items.push({
			type: "page",
			page: totalPages - 1,
			key: `page-${totalPages - 1}`,
		});
	}

	// Last page
	if (totalPages > 1) {
		items.push({ type: "page", page: totalPages, key: `page-${totalPages}` });
	}

	return items;
}

export {
	Pagination,
	PaginationContentWithContext as PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
};
