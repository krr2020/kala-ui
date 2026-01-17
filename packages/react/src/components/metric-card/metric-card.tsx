import * as React from "react";
import { cn } from "../../lib/utils";
import { Card } from "../card";
import type { MetricCardSkeletonConfig } from "../skeleton/skeleton.types";
import { MetricCardSkeleton } from "./metric-card-skeleton";

export interface MetricCardProps
	extends Omit<React.ComponentProps<"div">, "title"> {
	title: string;
	value: number | string;
	icon?: React.ReactNode;
	change?: number;
	changeLabel?: string;
	subtitle?: string;
	variant?:
		| "primary"
		| "success"
		| "warning"
		| "info"
		| "destructive"
		| "secondary"
		| "default";
	isLoading?: boolean;
	skeletonConfig?: MetricCardSkeletonConfig;
	skeleton?: React.ReactNode;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
	(
		{
			title,
			value,
			icon,
			change,
			changeLabel,
			subtitle,
			className,
			variant = "default",
			isLoading = false,
			skeletonConfig,
			skeleton,
			...props
		},
		ref,
	) => {
		if (isLoading) {
			if (skeleton) {
				return (
					<Card
						ref={ref}
						data-comp="metric-card"
						className={cn(className)}
						{...props}
					>
						{skeleton}
					</Card>
				);
			}
			return <MetricCardSkeleton className={className} {...skeletonConfig} />;
		}

		const getChangeColor = (changeValue: number) => {
			if (changeValue > 0) return "text-success";
			if (changeValue < 0) return "text-destructive";
			return "text-muted-foreground";
		};

		const getChangeIcon = (changeValue: number) => {
			if (changeValue > 0) return "↑";
			if (changeValue < 0) return "↓";
			return "−";
		};

		const getChangeText = (changeValue: number) => {
			const absValue = Math.abs(changeValue);
			const defaultLabel =
				changeValue > 0 || changeValue < 0
					? `${absValue}% than last week`
					: "No change";
			return changeLabel || defaultLabel;
		};

		const getVariantStyles = () => {
			switch (variant) {
				case "primary":
					return "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground";
				case "success":
					return "bg-gradient-to-br from-success to-success/90 text-success-foreground";
				case "warning":
					return "bg-gradient-to-br from-warning to-warning/90 text-warning-foreground";
				case "info":
					return "bg-gradient-to-br from-info to-info/90 text-info-foreground";
				case "destructive":
					return "bg-gradient-to-br from-destructive to-destructive/90 text-destructive-foreground";
				case "secondary":
					return "bg-gradient-to-br from-secondary to-secondary/90 text-secondary-foreground";
				default:
					return "bg-card border text-card-foreground";
			}
		};

		const isColorful = variant !== "default" || className?.includes("bg-");

		return (
			<Card
				ref={ref}
				data-comp="metric-card"
				className={cn(getVariantStyles(), className)}
				{...props}
			>
				<div className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h6
							className={cn(
								"text-xs font-semibold uppercase tracking-wide",
								isColorful ? "opacity-90" : "text-muted-foreground",
							)}
						>
							{title}
						</h6>
						{icon && (
							<div
								className={isColorful ? "opacity-70" : "text-muted-foreground"}
								aria-hidden="true"
							>
								{icon}
							</div>
						)}
					</div>

					<div className="mb-3">
						<div
							className={cn(
								"text-4xl font-bold leading-none",
								isColorful ? "" : "text-card-foreground",
							)}
						>
							<span className="sr-only">
								{title}:{" "}
								{typeof value === "number" ? value.toLocaleString() : value}
							</span>
							{typeof value === "number" ? value.toLocaleString() : value}
						</div>
					</div>

					{(change !== undefined || subtitle) && (
						<div className="text-sm">
							{change !== undefined ? (
								<div
									className={cn(
										"flex items-center gap-1",
										isColorful ? "opacity-90" : getChangeColor(change),
									)}
								>
									<span className="sr-only">
										Change: {getChangeText(change)}
									</span>
									<span className="inline-block" aria-hidden="true">
										{getChangeIcon(change)}
									</span>
									<span>{getChangeText(change)}</span>
								</div>
							) : subtitle ? (
								<div
									className={cn(
										isColorful ? "opacity-80" : "text-muted-foreground",
									)}
								>
									{subtitle}
								</div>
							) : null}
						</div>
					)}
				</div>
			</Card>
		);
	},
);

MetricCard.displayName = "MetricCard";

export { MetricCard };
