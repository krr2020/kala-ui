import * as React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../badge";
import type { ListSkeletonConfig } from "../skeleton/skeleton.types";
import { ListSkeleton } from "./list-skeleton";

// ===========================
// List Container
// ===========================

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

function List({
	className,
	divided = true,
	dense = false,
	isLoading = false,
	skeletonConfig,
	skeleton,
	children,
	...props
}: ListProps) {
	if (isLoading) {
		if (skeleton) {
			return (
				<ul
					data-kala-component="list"
					className={cn(
						"flex flex-col bg-card rounded-lg border overflow-hidden",
						className,
					)}
					{...props}
				>
					{skeleton}
				</ul>
			);
		}
		return (
			<ListSkeleton
				data-kala-component="list"
				className={className}
				showDividers={divided}
				dense={dense}
				{...skeletonConfig}
			/>
		);
	}

	return (
		<ul
			data-kala-component="list"
			className={cn(
				"flex flex-col bg-card rounded-lg border overflow-hidden",
				divided && "[&>li:not(:last-child)]:border-b",
				dense ? "gap-0" : "gap-0",
				className,
			)}
			{...props}
		>
			{children}
		</ul>
	);
}

// ===========================
// List Item
// ===========================

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
	/**
	 * Make the item interactive (clickable)
	 * @default false
	 */
	interactive?: boolean;
	/**
	 * Render the row as a link
	 */
	href?: string;
	/**
	 * Active/selected state
	 * @default false
	 */
	active?: boolean;
	/**
	 * Disabled state
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Dense spacing
	 * @default false
	 */
	dense?: boolean;
}

function ListItem({
	className,
	interactive = false,
	href,
	active = false,
	disabled = false,
	dense = false,
	children,
	onClick,
	...props
}: ListItemProps) {
	// The <li> wrapper is unconditional so interactive rows keep valid
	// ul > li structure; the control itself (a/button) fills the row.
	const rowClassName = cn(
		"flex items-center gap-3 w-full text-left",
		dense ? "px-3 py-2" : "px-4 py-3",
		interactive && "transition-colors cursor-pointer",
		interactive && !disabled && "hover:bg-muted",
		active && "bg-primary/10",
		disabled && "opacity-50 cursor-not-allowed",
		className,
	);
	const stateProps = {
		"aria-current": active ? ("page" as const) : undefined,
	};

	if (href) {
		return (
			<li data-kala-component="list-item">
				<a
					href={href}
					aria-disabled={disabled || undefined}
					onClick={
						onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined
					}
					className={cn(
						rowClassName,
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
					)}
					{...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
				>
					{children}
				</a>
			</li>
		);
	}

	if (interactive) {
		return (
			<li data-kala-component="list-item">
				<button
					type="button"
					disabled={disabled}
					onClick={
						onClick as React.MouseEventHandler<HTMLButtonElement> | undefined
					}
					className={cn(
						rowClassName,
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
					)}
					{...stateProps}
					{...(props as React.ComponentProps<"button">)}
				>
					{children}
				</button>
			</li>
		);
	}

	// Static rows render no handler: a clickable row must opt in via
	// `interactive` (real button, keyboard accessible) or `href` (real link).
	return (
		<li
			data-kala-component="list-item"
			className={rowClassName}
			aria-disabled={disabled || undefined}
			{...stateProps}
			{...props}
		>
			{children}
		</li>
	);
}

// ===========================
// List Item Icon
// ===========================

export interface ListItemIconProps extends React.ComponentProps<"div"> {
	/**
	 * Icon size variant
	 * @default 'default'
	 */
	size?: "sm" | "md" | "lg";
}

function ListItemIcon({
	className,
	size = "md",
	children,
	...props
}: ListItemIconProps) {
	return (
		<div
			data-kala-component="list-item-icon"
			className={cn(
				"shrink-0 flex items-center justify-center text-muted-foreground",
				size === "sm" && "w-4 h-4 text-sm",
				size === "md" && "w-5 h-5 text-base",
				size === "lg" && "w-6 h-6 text-lg",
				className,
			)}
			aria-hidden="true"
			{...props}
		>
			{children}
		</div>
	);
}

// ===========================
// List Item Avatar
// ===========================

export interface ListItemAvatarProps extends React.ComponentProps<"div"> {
	/**
	 * Avatar image source
	 */
	src?: string;
	/**
	 * Alt text for the avatar
	 */
	alt?: string;
	/**
	 * Fallback content (initials, icon, etc.)
	 */
	fallback?: React.ReactNode;
	/**
	 * Avatar size
	 * @default 'default'
	 */
	size?: "sm" | "md" | "lg";
}

function ListItemAvatar({
	className,
	src,
	alt = "",
	fallback,
	size = "md",
	...props
}: ListItemAvatarProps) {
	const [imgError, setImgError] = React.useState(false);

	return (
		<div
			data-kala-component="list-item-avatar"
			className={cn(
				"shrink-0 rounded-full overflow-hidden bg-muted flex items-center justify-center",
				size === "sm" && "w-8 h-8 text-xs",
				size === "md" && "w-10 h-10 text-sm",
				size === "lg" && "w-12 h-12 text-base",
				className,
			)}
			{...props}
		>
			{src && !imgError ? (
				<img
					src={src}
					alt={alt}
					className="w-full h-full object-cover"
					onError={() => setImgError(true)}
				/>
			) : (
				<span className="font-medium text-muted-foreground">{fallback}</span>
			)}
		</div>
	);
}

// ===========================
// List Item Content
// ===========================

export interface ListItemContentProps extends React.ComponentProps<"div"> {
	/**
	 * Truncate text with ellipsis
	 * @default false
	 */
	truncate?: boolean;
}

function ListItemContent({
	className,
	truncate = false,
	...props
}: ListItemContentProps) {
	return (
		<div
			data-kala-component="list-item-content"
			className={cn("flex-1 min-w-0", truncate && "overflow-hidden", className)}
			{...props}
		/>
	);
}

// ===========================
// List Item Title
// ===========================

export interface ListItemTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement> {
	/**
	 * Truncate text with ellipsis
	 * @default false
	 */
	truncate?: boolean;
	/**
	 * Heading level for semantic HTML
	 * @default 'div'
	 */
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";
}

function ListItemTitle({
	className,
	truncate = false,
	as: Component = "div",
	...props
}: ListItemTitleProps) {
	return (
		<Component
			data-kala-component="list-item-title"
			className={cn(
				"text-sm font-medium text-foreground",
				truncate && "truncate",
				className,
			)}
			{...props}
		/>
	);
}

// ===========================
// List Item Text
// ===========================

export interface ListItemTextProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	/**
	 * Truncate text with ellipsis
	 * @default false
	 */
	truncate?: boolean;
	/**
	 * Number of lines to show before truncating
	 */
	lines?: number;
}

// Tailwind only compiles classes it can see in source — a composed
// `line-clamp-${lines}` would silently no-op. Static map keeps every
// value in source while clamping arbitrary values.
const LINE_CLAMP_CLASSES: Record<number, string> = {
	1: "line-clamp-1",
	2: "line-clamp-2",
	3: "line-clamp-3",
	4: "line-clamp-4",
	5: "line-clamp-5",
	6: "line-clamp-6",
};

function ListItemText({
	className,
	truncate = false,
	lines,
	style,
	...props
}: ListItemTextProps) {
	const clampClass =
		lines !== undefined ? LINE_CLAMP_CLASSES[lines] : undefined;
	return (
		<p
			data-kala-component="list-item-text"
			className={cn(
				"text-sm text-muted-foreground",
				truncate && !lines && "truncate",
				clampClass,
				className,
			)}
			style={
				lines !== undefined && !clampClass
					? { lineClamp: lines, ...style }
					: style
			}
			{...props}
		/>
	);
}

// ===========================
// List Item Action
// ===========================

export interface ListItemActionProps extends React.ComponentProps<"div"> {}

function ListItemAction({ className, ...props }: ListItemActionProps) {
	return (
		<div
			data-kala-component="list-item-action"
			className={cn("shrink-0 flex items-center gap-2", className)}
			{...props}
		/>
	);
}

// ===========================
// List Item Badge
// ===========================

export interface ListItemBadgeProps
	extends React.HTMLAttributes<HTMLSpanElement> {
	/**
	 * Badge semantic color
	 * @default 'muted'
	 */
	color?:
		| "primary"
		| "secondary"
		| "destructive"
		| "success"
		| "warning"
		| "info"
		| "muted";
}

function ListItemBadge({
	className,
	color = "muted",
	...props
}: ListItemBadgeProps) {
	return (
		<Badge
			data-kala-component="list-item-badge"
			variant="subtle"
			color={color}
			shape="pill"
			className={cn("px-2 py-0.5", className)}
			{...props}
		/>
	);
}

export {
	List,
	ListItem,
	ListItemAction,
	ListItemAvatar,
	ListItemBadge,
	ListItemContent,
	ListItemIcon,
	ListItemText,
	ListItemTitle,
};
