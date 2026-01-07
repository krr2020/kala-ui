import { cva, type VariantProps } from "class-variance-authority";
import { Inbox, type LucideIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import { EmptyStateSkeleton } from "./empty-state-skeleton";
import type { EmptyStateSkeletonConfig } from "../skeleton/skeleton.types";

const emptyStateVariants = cva(
	"flex flex-col items-center justify-center rounded-lg border p-8 text-center animate-in fade-in-50",
	{
		variants: {
			variant: {
				default: "border-dashed bg-muted/20",
				destructive: "border-destructive/20 bg-destructive/10",
			},
			size: {
				default: "min-h-[300px]",
				sm: "min-h-[150px] p-4",
				lg: "min-h-[500px]",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface EmptyStateProps
	extends React.HTMLAttributes<HTMLDivElement>,
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
}

function EmptyState({
	className,
	variant,
	size,
	icon,
	title,
	description,
	action,
	children,
	isLoading = false,
	skeletonConfig,
	skeleton,
	...props
}: EmptyStateProps) {
	if (isLoading) {
		if (skeleton) {
			return (
				<div
					data-comp="empty-state"
					className={cn(emptyStateVariants({ variant, size }), className)}
					{...props}
				>
					{skeleton}
				</div>
			);
		}
		return (
			<EmptyStateSkeleton
				className={cn(emptyStateVariants({ variant, size }), className)}
				{...skeletonConfig}
			/>
		);
	}

	const resolvedIcon = icon ?? Inbox;
	const IconComponent = typeof resolvedIcon === "string" ? null : resolvedIcon;

	return (
		<div
			data-comp="empty-state"
			className={cn(emptyStateVariants({ variant, size }), className)}
			{...props}
		>
			<div
				className="flex h-20 w-20 items-center justify-center rounded-full bg-muted"
				aria-hidden="true"
			>
				{typeof resolvedIcon === "string" ? (
					<span
						className={cn(
							"inline-block h-10 w-10 text-muted-foreground",
							resolvedIcon,
						)}
					/>
				) : IconComponent ? (
					<IconComponent className="h-10 w-10 text-muted-foreground" />
				) : null}
			</div>
			<h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
			{description && (
				<p className="mb-4 mt-2 max-w-sm text-center text-sm text-muted-foreground">
					{description}
				</p>
			)}
			{action && (
				<Button onClick={action.onClick} variant={action.variant || "default"}>
					{action.label}
				</Button>
			)}
			{children}
		</div>
	);
}

export { EmptyState, emptyStateVariants };
