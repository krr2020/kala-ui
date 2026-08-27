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

// ============================================================================
// Pagination Root
// ============================================================================

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
				className={cn(
					"mx-auto flex w-full flex-wrap justify-center",
					className,
				)}
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
	variant = "default",
	spaced = false,
	...props
}: PaginationContentProps) {
	return (
		<PaginationVariantContext.Provider value={variant}>
			<Flex
				as="ul"
				align="center"
				justify="center"
				wrap="wrap"
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

function PaginationLink({
	className,
	isActive,
	size = "md",
	isIconButton = false,
	children,
	page,
	href,
	disabled,
	onClick,
	...props
}: PaginationLinkProps) {
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

	if (href) {
		return (
			<Box
				as="a"
				href={href}
				aria-current={isActive ? "page" : undefined}
				aria-disabled={disabled || undefined}
				className={cn(
					baseClasses,
					variantClasses[parentVariant],
					disabled && "pointer-events-none opacity-50",
					className,
				)}
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
			disabled={disabled}
			aria-current={isActive ? "page" : undefined}
			className={cn(baseClasses, variantClasses[parentVariant], className)}
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
