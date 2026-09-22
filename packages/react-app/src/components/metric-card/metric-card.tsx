import { Card } from "@kala-ui/react/card";
import { useSlotStyles } from "@kala-ui/react/kala-provider";
import { applySlot } from "@kala-ui/react/lib/slot-styles";
import { cn } from "@kala-ui/react/lib/utils";
import type { MetricCardSkeletonConfig } from "@kala-ui/react/skeleton";
import type * as React from "react";
import {
	metricCardChangeColors,
	metricCardColorStyles,
	metricCardStyles,
} from "../../config/metric-card";
import type { MetricCardProps } from "./metric-card.types";
import { MetricCardSkeleton } from "./metric-card-skeleton";

function MetricCard({
	ref,
	title,
	value,
	icon,
	change,
	changeLabel,
	subtitle,
	className,
	style,
	slotStyles: slotStylesRaw,
	color = "muted",
	isLoading = false,
	skeletonConfig,
	skeleton,
	...props
}: MetricCardProps) {
	const slotStyles = useSlotStyles("metric-card", slotStylesRaw);

	if (isLoading) {
		if (skeleton) {
			const loadingRoot = applySlot(cn(className), slotStyles?.root);
			return (
				<Card
					data-kala-component="metric-card"
					ref={ref}
					className={loadingRoot.className}
					style={loadingRoot.style}
					{...props}
				>
					{skeleton}
				</Card>
			);
		}
		return (
			<MetricCardSkeleton
				data-kala-component="metric-card"
				className={className}
				{...skeletonConfig}
			/>
		);
	}

	const getChangeColor = (changeValue: number) =>
		changeValue > 0
			? metricCardChangeColors.up
			: changeValue < 0
				? metricCardChangeColors.down
				: metricCardChangeColors.flat;

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

	const isColorful = color !== "muted" || className?.includes("bg-");

	const root = applySlot(
		cn(metricCardColorStyles[color], className),
		slotStyles?.root,
	);
	const body = applySlot(metricCardStyles.body, slotStyles?.body);
	const head = applySlot(metricCardStyles.head, slotStyles?.head);
	const titleLabel = applySlot(metricCardStyles.title, slotStyles?.title);
	const iconSlot = applySlot(metricCardStyles.icon, slotStyles?.icon);
	const valueSlot = applySlot(metricCardStyles.value, slotStyles?.value);
	const meta = applySlot(metricCardStyles.meta, slotStyles?.meta);
	const changeSlot = applySlot(metricCardStyles.change, slotStyles?.change);
	const subtitleSlot = applySlot(
		metricCardStyles.subtitle,
		slotStyles?.subtitle,
	);

	return (
		<Card
			data-kala-component="metric-card"
			ref={ref}
			className={root.className}
			style={root.style}
			{...props}
		>
			<div className={body.className}>
				<div className={head.className}>
					<h6
						className={cn(
							titleLabel.className,
							isColorful ? "opacity-90" : "text-muted-foreground",
						)}
					>
						{title}
					</h6>
					{icon && (
						<div
							className={cn(
								iconSlot.className,
								isColorful ? "opacity-70" : "text-muted-foreground",
							)}
							aria-hidden="true"
						>
							{icon}
						</div>
					)}
				</div>

				<div className="mb-3">
					<div
						className={cn(
							valueSlot.className,
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
					<div className={meta.className}>
						{change !== undefined ? (
							<div
								className={cn(
									changeSlot.className,
									isColorful ? "opacity-90" : getChangeColor(change),
								)}
							>
								<span className="sr-only">Change: {getChangeText(change)}</span>
								<span className="inline-block" aria-hidden="true">
									{getChangeIcon(change)}
								</span>
								<span>{getChangeText(change)}</span>
							</div>
						) : subtitle ? (
							<div
								className={cn(
									subtitleSlot.className,
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
}

export { MetricCard };
