import { cva } from "class-variance-authority";
import { Inbox, type IconComponent } from "../icons";
import type * as React from "react";
import { isValidElement } from "react";
import { emptyStateStyles } from "../../config/empty-state";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import { useSlotStyles } from "../kala-provider";
import type { EmptyStateProps } from "./empty-state.types";
import { EmptyStateSkeleton } from "./empty-state-skeleton";

const emptyStateVariants = cva(
	"flex flex-col items-center justify-center rounded-lg border p-8 text-center animate-in fade-in-50",
	{
		variants: {
			color: {
				default: "border-dashed bg-muted/20",
				destructive: "border-destructive/20 bg-destructive/10",
			},
			size: {
				md: "min-h-[300px]",
				sm: "min-h-[150px] p-4",
				lg: "min-h-[500px]",
			},
		},
		defaultVariants: {
			color: "default",
			size: "md",
		},
	},
);

type ButtonActionProps = {
	label: string;
	onClick: () => void;
	variant?: React.ComponentProps<typeof Button>["variant"];
};

function isButtonAction(
	action: EmptyStateProps["action"],
): action is ButtonActionProps {
	return (
		typeof action === "object" &&
		action !== null &&
		!isValidElement(action) &&
		"label" in action
	);
}

function EmptyState({
	className,
	style,
	slotStyles: slotStylesRaw,
	color,
	size,
	icon,
	iconVariant = "tile",
	title,
	description,
	action,
	children,
	isLoading = false,
	skeletonConfig,
	skeleton,
	ref,
	...props
}: EmptyStateProps) {
	const slotStyles = useSlotStyles("empty-state", slotStylesRaw);
	const root = applySlot(
		cn(emptyStateVariants({ color, size }), className),
		slotStyles?.root,
	);
	const rootStyle = mergeStyle(style, root.style);
	if (isLoading) {
		if (skeleton) {
			return (
				<div
					data-kala-component="empty-state"
					ref={ref}
					className={root.className}
					style={rootStyle}
					{...props}
				>
					{skeleton}
				</div>
			);
		}
		return (
			<EmptyStateSkeleton
				data-kala-component="empty-state"
				className={root.className}
				style={rootStyle}
				{...skeletonConfig}
			/>
		);
	}

	const resolvedIcon = icon ?? Inbox;
	const iconNode =
		typeof resolvedIcon !== "string" && isValidElement(resolvedIcon)
			? resolvedIcon
			: null;
	const IconComponent =
		iconNode || typeof resolvedIcon === "string"
			? null
			: (resolvedIcon as IconComponent);
	const actionNode = isValidElement(action) ? action : null;
	const buttonAction = isButtonAction(action) ? action : null;
	const iconBase =
		iconVariant === "plain"
			? emptyStateStyles.iconPlain
			: emptyStateStyles.icon;
	const iconCircle = applySlot(iconBase, slotStyles?.icon);
	const titleSlot = applySlot(emptyStateStyles.title, slotStyles?.title);
	const descriptionSlot = applySlot(
		emptyStateStyles.description,
		slotStyles?.description,
	);
	const actionSlot = applySlot(null, slotStyles?.action ?? null);

	return (
		<div
			data-kala-component="empty-state"
			ref={ref}
			className={root.className}
			style={rootStyle}
			{...props}
		>
			<div
				className={iconCircle.className}
				style={iconCircle.style}
				aria-hidden="true"
			>
				{typeof resolvedIcon === "string" ? (
					<span
						className={cn(
							"inline-block h-10 w-10 text-muted-foreground",
							resolvedIcon,
						)}
					/>
				) : iconNode ? (
					iconNode
				) : IconComponent ? (
					<IconComponent className="h-10 w-10 text-muted-foreground" />
				) : null}
			</div>
			<h3 className={titleSlot.className} style={titleSlot.style}>
				{title}
			</h3>
			{description && (
				<p className={descriptionSlot.className} style={descriptionSlot.style}>
					{description}
				</p>
			)}
			{actionNode ? (
				actionNode
			) : buttonAction ? (
				<Button
					onClick={buttonAction.onClick}
					variant={buttonAction.variant}
					className={actionSlot.className}
					style={actionSlot.style}
				>
					{buttonAction.label}
				</Button>
			) : null}
			{children}
		</div>
	);
}

export { EmptyState, emptyStateVariants };
