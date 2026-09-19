import { usePagination } from "@kala-ui/react-hooks";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Box } from "../box";
import { Flex } from "../flex";
import { Text } from "../text";
import type {
	PaginationContentProps,
	PaginationLinkProps,
	PaginationNextProps,
	PaginationPreviousProps,
	PaginationProps,
} from "./pagination.types";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";

// ============================================================================
// Pagination Root
// ============================================================================

function Pagination({
	className,
	style,
	slotStyles,
	"aria-label": ariaLabel = "Pagination",
	total,
	page,
	defaultPage,
	siblings,
	boundaries,
	onPageChange,
	children,
	...props
}: PaginationProps & { slotStyles?: SlotStyles }) {
	const pagination = usePagination({
		total: total || 0,
		page,
		defaultPage,
		siblings,
		boundaries,
		onPageChange,
	});

	return (
		<PaginationContext.Provider value={pagination}>
			<Box
				as="nav"
				data-kala-component="pagination"
				aria-label={ariaLabel}
				slotStyles={slotStyles}
				className={cn("mx-auto flex w-full flex-wrap justify-center", className)}
				style={style}
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

function PaginationContent({
	className,
	style,
	slotStyles,
	variant = "default",
	spaced = false,
	...props
}: PaginationContentProps & { slotStyles?: SlotStyles }) {
	return (
		<PaginationVariantContext.Provider value={variant}>
			<Flex
				as="ul"
				data-kala-component="pagination-content"
				align="center"
				justify="center"
				wrap="wrap"
				gap={spaced ? 2 : 1}
				className={className}
				style={style}
				slotStyles={slotStyles}
				data-variant={variant}
				{...props}
			/>
		</PaginationVariantContext.Provider>
	);
}

// ============================================================================
// Pagination Item (List Item Container)
// ============================================================================

function PaginationItem({
	className,
	style,
	slotStyles,
	...props
}: React.ComponentProps<"li"> & { slotStyles?: SlotStyles }) {
	return (
		<Box
				data-kala-component="pagination-item"
				as="li"
				slotStyles={slotStyles}
				className={className}
				style={style}
				{...props}
			/>
	);
}

// ============================================================================
// Pagination Link (Button or Anchor)
// ============================================================================

function PaginationLink({
	className,
	style,
	slotStyles,
	isActive,
	size = "md",
	isIconButton = false,
	children,
	page,
	href,
	disabled,
	onClick,
	...props
}: PaginationLinkProps & { slotStyles?: SlotStyles }) {
	const parentVariant = React.useContext(PaginationVariantContext) || "default";
	const pagination = usePaginationContext();

	const sizeClasses = {
		sm: "h-8 min-w-8 text-xs",
		md: "h-9 min-w-9 text-sm",
		lg: "h-10 min-w-10 text-base",
	};

	const baseClasses = cn(
		"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors cursor-pointer",
		"kala-focus-ring",
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

	const root = applySlot(
		cn(
			baseClasses,
			variantClasses[parentVariant],
			disabled && "pointer-events-none opacity-50",
			className,
		),
		slotStyles?.root,
	);

	if (href) {
		return (
			<Box
				data-kala-component="pagination-link"
				as="a"
				href={href}
				aria-current={isActive ? "page" : undefined}
				aria-disabled={disabled || undefined}
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			>
				{children}
			</Box>
		);
	}

	return (
		<Box
			data-kala-component="pagination-link"
			as="button"
			type="button"
			disabled={disabled}
			aria-current={isActive ? "page" : undefined}
			className={root.className}
			style={mergeStyle(style, root.style)}
			onClick={handleClick}
			// anchor-typed rest props are a superset of what a button renders
			{...(props as unknown as React.ComponentProps<"button">)}
		>
			{children}
		</Box>
	);
}

// ============================================================================
// Pagination Previous
// ============================================================================

function PaginationPrevious({
	className,
	slotStyles,
	showLabel = true,
	children,
	onClick,
	...props
}: PaginationPreviousProps & { slotStyles?: SlotStyles }) {
	const pagination = usePaginationContext();

	const handleClick = (e: React.MouseEvent) => {
		pagination?.previous();
		onClick?.(e);
	};

	return (
		<PaginationLink
			data-kala-component="pagination-previous"
			aria-label="Go to previous page"
			isIconButton={!showLabel}
			className={cn("gap-1", className)}
			slotStyles={slotStyles}
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

function PaginationNext({
	className,
	slotStyles,
	showLabel = true,
	children,
	onClick,
	...props
}: PaginationNextProps & { slotStyles?: SlotStyles }) {
	const pagination = usePaginationContext();

	const handleClick = (e: React.MouseEvent) => {
		pagination?.next();
		onClick?.(e);
	};

	return (
		<PaginationLink
			data-kala-component="pagination-next"
			aria-label="Go to next page"
			isIconButton={!showLabel}
			className={cn("gap-1", className)}
			slotStyles={slotStyles}
			onClick={handleClick}
			disabled={pagination ? pagination.active >= pagination.total : undefined}
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
			data-kala-component="pagination-ellipsis"
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
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
};
