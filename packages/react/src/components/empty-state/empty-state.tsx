import { cva, type VariantProps } from "class-variance-authority";
import { Inbox, type LucideIcon } from "lucide-react";
import type * as React from "react";
import { emptyStateStyles } from "../../config/empty-state";
import { cn } from "../../lib/utils";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { Button } from "../button";
import type { EmptyStateSkeletonConfig } from "../skeleton/skeleton.types";
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

export interface EmptyStateProps
	extends Omit<React.ComponentProps<"div">, "color">,
		VariantProps<typeof emptyStateVariants> {
	icon?: LucideIcon | string;
	title: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
		variant?: React.ComponentProps<typeof Button>["variant"];
	};
	isLoading?: boolean;
	skeletonConfig?: EmptyStateSkeletonConfig;
	skeleton?: React.ReactNode;
	/** Per-part overrides: `root` wins over `className`/`style` in every arm; `icon`/`title`/`description`/`action` target the inner nodes. */
	slotStyles?: SlotStyles;
}

function EmptyState({
	className,
	style,
	slotStyles,
	color,
	size,
	icon,
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
	const IconComponent = typeof resolvedIcon === "string" ? null : resolvedIcon;
	const iconCircle = applySlot(emptyStateStyles.icon, slotStyles?.icon);
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
						className={cn("inline-block h-10 w-10 text-muted-foreground", resolvedIcon)}
					/>
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
			{action && (
				<Button
				onClick={action.onClick}
				variant={action.variant}
				className={actionSlot.className}
				style={actionSlot.style}
			>
					{action.label}
				</Button>
			)}
			{children}
		</div>
	);
}

export { EmptyState, emptyStateVariants };
