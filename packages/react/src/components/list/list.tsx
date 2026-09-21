import * as React from "react";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Badge } from "../badge";
import type {
	ListItemActionProps,
	ListItemAvatarProps,
	ListItemBadgeProps,
	ListItemContentProps,
	ListItemIconProps,
	ListItemProps,
	ListItemTextProps,
	ListItemTitleProps,
	ListProps,
} from "./list.types";
import { ListSkeleton } from "./list-skeleton";

// ===========================
// List Container
// ===========================

function List({
	className,
	style,
	slotStyles,
	divided = true,
	dense = false,
	isLoading = false,
	skeletonConfig,
	skeleton,
	children,
	...props
}: ListProps & { slotStyles?: SlotStyles }) {
	if (isLoading) {
		if (skeleton) {
			const root = applySlot(
				cn(
					"flex flex-col bg-card rounded-lg border overflow-hidden",
					className,
				),
				slotStyles?.root,
			);
			return (
				<ul
					data-kala-component="list"
					className={root.className}
					style={mergeStyle(style, root.style)}
					{...props}
				>
					{skeleton}
				</ul>
			);
		}
		// The skeleton arm renders ListSkeleton's own <ul>, so the slot rides
		// along as className; ListSkeleton takes no style prop.
		const loading = applySlot(className, slotStyles?.root);
		return (
			<ListSkeleton
				data-kala-component="list"
				className={loading.className}
				showDividers={divided}
				dense={dense}
				{...skeletonConfig}
			/>
		);
	}

	const root = applySlot(
		cn(
			"flex flex-col bg-card rounded-lg border overflow-hidden",
			divided && "[&>li:not(:last-child)]:border-b",
			dense ? "gap-0" : "gap-0",
			className,
		),
		slotStyles?.root,
	);
	return (
		<ul
			data-kala-component="list"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			{children}
		</ul>
	);
}

// ===========================
// List Item
// ===========================

function ListItem({
	className,
	style,
	slotStyles,
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
	// The marker <li> is the slot root; interactive rows forward their legacy
	// style to the control filling the row.
	const root = applySlot(undefined, slotStyles?.root);

	if (href) {
		return (
			<li
				data-kala-component="list-item"
				className={root.className}
				style={root.style}
			>
				<a
					href={href}
					style={style}
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
			<li
				data-kala-component="list-item"
				className={root.className}
				style={root.style}
			>
				<button
					type="button"
					style={style}
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
			className={applySlot(rowClassName, slotStyles?.root).className}
			style={mergeStyle(style, root.style)}
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
