import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Badge, type badgeVariants } from "../badge";
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
				className={className}
				showDividers={divided}
				dense={dense}
				{...skeletonConfig}
			/>
		);
	}

	return (
		<ul
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
			<li>
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
			<li>
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
					{...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
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

export interface ListItemIconProps
	extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Icon size variant
	 * @default 'default'
	 */
	size?: "sm" | "default" | "lg";
}

function ListItemIcon({
	className,
	size = "default",
	children,
	...props
}: ListItemIconProps) {
	return (
		<div
			className={cn(
				"shrink-0 flex items-center justify-center text-muted-foreground",
				size === "sm" && "w-4 h-4 text-sm",
				size === "default" && "w-5 h-5 text-base",
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

export interface ListItemAvatarProps
	extends React.HTMLAttributes<HTMLDivElement> {
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
	size?: "sm" | "default" | "lg";
}

function ListItemAvatar({
	className,
	src,
	alt = "",
	fallback,
	size = "default",
	...props
}: ListItemAvatarProps) {
	const [imgError, setImgError] = React.useState(false);

	return (
		<div
			className={cn(
				"shrink-0 rounded-full overflow-hidden bg-muted flex items-center justify-center",
				size === "sm" && "w-8 h-8 text-xs",
				size === "default" && "w-10 h-10 text-sm",
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

export interface ListItemContentProps
	extends React.HTMLAttributes<HTMLDivElement> {
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

function ListItemText({
	className,
	truncate = false,
	lines,
	...props
}: ListItemTextProps) {
	return (
		<p
			className={cn(
				"text-sm text-muted-foreground",
				truncate && !lines && "truncate",
				lines && `line-clamp-${lines}`,
				className,
			)}
			{...props}
		/>
	);
}

// ===========================
// List Item Action
// ===========================

export interface ListItemActionProps
	extends React.HTMLAttributes<HTMLDivElement> {}

function ListItemAction({ className, ...props }: ListItemActionProps) {
	return (
		<div
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
	 * Badge variant
	 * @default 'default'
	 */
	variant?: "default" | "primary" | "success" | "warning" | "danger";
}

function ListItemBadge({
	className,
	variant = "default",
	...props
}: ListItemBadgeProps) {
	const variantMap: Record<
		string,
		VariantProps<typeof badgeVariants>["variant"]
	> = {
		default: "secondary",
		primary: "primary",
		success: "success",
		warning: "warning",
		danger: "danger",
	};

	return (
		<Badge
			variant={variantMap[variant] || "secondary"}
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
