import { usePagination } from "@kala-ui/react-hooks";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Box } from "../box";
import { Flex } from "../flex";
import { Text } from "../text";

// ============================================================================
// Pagination Root
// ============================================================================

export interface PaginationProps extends Omit<React.ComponentProps<"nav">, "onChange"> {
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

function Pagination({
	className,
	"aria-label": ariaLabel = "Pagination",
	total,
	page,
	initialPage,
	siblings,
	boundaries,
	onChange,
	children,
	...props
}: PaginationProps) {
	const pagination = usePagination({
		total: total || 0,
		page,
		initialPage,
		siblings,
		boundaries,
		onChange,
	});

	return (
		<PaginationContext.Provider value={pagination}>
			<Box
				as="nav"
				aria-label={ariaLabel}
				className={cn("mx-auto flex w-full justify-center", className)}
				{...props}
			>
				{children}
			</Box>
		</PaginationContext.Provider>
	);
}

// ============================================================================
// Pagination Context
// ============================================================================

type PaginationContextType = ReturnType<typeof usePagination>;

const PaginationContext = React.createContext<PaginationContextType | null>(
	null,
);

function usePaginationContext() {
	const context = React.useContext(PaginationContext);
	return context;
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
		<PaginationVariantContext.Provider value={variant}>
			<Flex
				as="ul"
				align="center"
				gap={spaced ? 2 : 1}
				className={className}
				data-variant={variant}
				{...props}
			/>
		</PaginationVariantContext.Provider>
	);
}

// ============================================================================
// Pagination Item (List Item Container)
// ============================================================================

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
	return <Box as="li" className={cn("", className)} {...props} />;
}

// ============================================================================
// Pagination Link (Button or Anchor)
// ============================================================================

export interface PaginationLinkProps
	extends Omit<React.ComponentProps<"button">, "onClick"> {
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
	/**
	 * Page number to navigate to (if using as button)
	 */
	page?: number;
	/**
	 * Link href (if using as anchor)
	 */
	href?: string;
	/**
	 * On click handler
	 */
	onClick?: (e: React.MouseEvent) => void;
}

function PaginationLink({
	className,
	isActive,
	size = "default",
	isIconButton = false,
	children,
	page,
	href,
	onClick,
	...props
}: PaginationLinkProps) {
	const parentVariant = React.useContext(PaginationVariantContext) || "default";
	const pagination = usePaginationContext();

	const sizeClasses = {
		sm: "h-8 min-w-8 text-xs",
		default: "h-9 min-w-9 text-sm",
		lg: "h-10 min-w-10 text-base",
	};

	const baseClasses = cn(
		"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors cursor-pointer",
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

	const handleClick = (e: React.MouseEvent) => {
		if (page !== undefined && pagination) {
			pagination.setPage(page);
		}
		onClick?.(e);
	};

	if (href) {
		return (
			<Box
				as="a"
				href={href}
				aria-current={isActive ? "page" : undefined}
				className={cn(baseClasses, variantClasses[parentVariant], className)}
				{...props}
			>
				{children}
			</Box>
		);
	}

	return (
		<Box
			as="button"
			type="button"
			aria-current={isActive ? "page" : undefined}
			className={cn(baseClasses, variantClasses[parentVariant], className)}
			onClick={handleClick}
			{...props}
		>
			{children}
		</Box>
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
	onClick,
	...props
}: PaginationPreviousProps) {
	const pagination = usePaginationContext();

	const handleClick = (e: React.MouseEvent) => {
		pagination?.previous();
		onClick?.(e);
	};

	return (
		<PaginationLink
			aria-label="Go to previous page"
			isIconButton={!showLabel}
			className={cn("gap-1", className)}
			onClick={handleClick}
			disabled={pagination?.active === 1}
			{...props}
		>
			<ChevronLeft className="h-4 w-4" />
			{showLabel && <Text as="span">{children || "Previous"}</Text>}
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
	onClick,
	...props
}: PaginationNextProps) {
	const pagination = usePaginationContext();

	const handleClick = (e: React.MouseEvent) => {
		pagination?.next();
		onClick?.(e);
	};

	return (
		<PaginationLink
			aria-label="Go to next page"
			isIconButton={!showLabel}
			className={cn("gap-1", className)}
			onClick={handleClick}
			disabled={
				pagination ? pagination.active >= pagination.total : undefined
			}
			{...props}
		>
			{showLabel && <Text as="span">{children || "Next"}</Text>}
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
		<Flex
			as="span"
			align="center"
			justify="center"
			aria-hidden
			className={cn("h-9 w-9", className)}
			{...props}
		>
			<MoreHorizontal className="size-4" />
			<Text className="sr-only">More pages</Text>
		</Flex>
	);
}

// ============================================================================
// Context for variant propagation
// ============================================================================

const PaginationVariantContext =
	React.createContext<PaginationContentProps["variant"]>("default");

// ============================================================================
// Export components
// ============================================================================

export {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
};
