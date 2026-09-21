/**
 * Base Chart Component
 * React component for ApexCharts with built-in loading and empty states
 */

import { useSlotStyles } from "@kala-ui/react/kala-provider";
import { applySlot } from "@kala-ui/react/lib/slot-styles";
import { cn } from "@kala-ui/react/lib/utils";
import { chartStyles } from "../../config/charts";
import { lazy, Suspense } from "react";
import type { Props } from "react-apexcharts";
import type { ChartSkeletonConfig } from "./chart.types";
import { ChartSkeleton } from "./chart-skeleton";

// apexcharts touches `window` at module scope, so importing it statically
// crashes any SSR framework on the first render — and the root barrel
// transitively imports every chart. Loaded lazily instead: the module only
// evaluates in the browser, and the tree stays SSR-safe.
const ReactApexChart = lazy(() => import("react-apexcharts"));

export interface ChartProps extends Props {
	className?: string;
	isLoading?: boolean;
	isEmpty?: boolean;
	emptyMessage?: string;
	skeletonConfig?: ChartSkeletonConfig;
	skeleton?: React.ReactNode;
	/** Per-part overrides: root, empty, emptyIcon, emptyText. */
	slotStyles?: import("@kala-ui/react/lib/slot-styles").SlotStyles;
}

/**
 * Get tooltip theme from DOM safely (SSR-compatible)
 */
function getTooltipTheme(): "dark" | "light" {
	if (typeof document === "undefined") return "light";
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Base Chart Component - use this as the foundation for all charts
 * Provides consistent styling, loading skeleton, and empty state
 */
export function Chart({
	className,
	isLoading,
	isEmpty,
	emptyMessage = "No data available",
	skeletonConfig,
	skeleton,
	slotStyles: slotStylesRaw,
	...props
}: ChartProps) {
	const slotStyles = useSlotStyles("charts", slotStylesRaw);
	const { "data-kala-component": _marker, ...chartProps } = props as {
		"data-kala-component"?: string;
		[key: string]: unknown;
	};
	const markerProps = { "data-kala-component": _marker };

	// Render skeleton if loading
	if (isLoading) {
		if (skeleton) {
			return <>{skeleton}</>;
		}
		return (
			<ChartSkeleton
				data-kala-component="charts-chart"
				{...(skeletonConfig || {})}
				className={className}
			/>
		);
	}

	const emptyPart = applySlot(chartStyles.empty, slotStyles?.empty);
	const emptyIcon = applySlot(chartStyles.emptyIcon, slotStyles?.emptyIcon);
	const emptyText = applySlot(chartStyles.emptyText, slotStyles?.emptyText);

	// Render empty state when no data
	if (isEmpty) {
		// Height may arrive as a number (px) or a CSS length string ("20rem",
		// "50%") — appending px to a string double-unitizes it.
		const configuredHeight = skeletonConfig?.height ?? props.height ?? 350;
		const height =
			typeof configuredHeight === "number"
				? `${configuredHeight}px`
				: configuredHeight;
		return (
			<div
				data-kala-component="charts-chart"
				className={cn(emptyPart.className, className)}
				style={{ height, ...emptyPart.style }}
			>
				<svg
					className={emptyIcon.className}
					fill="none"
					role="img"
					aria-label="Chart empty state"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>No chart data</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M3 13h2v8H3zM9 9h2v12H9zM15 5h2v16h-2zM21 1h2v20h-2z"
					/>
				</svg>
				<p className={emptyText.className}>{emptyMessage}</p>
			</div>
		);
	}

	const root = applySlot(cn(chartStyles.root, className), slotStyles?.root);

return (
	<div
		data-kala-component={_marker ?? "charts-chart"}
		className={root.className}
		style={root.style}
	>
		<Suspense
			fallback={
				skeleton ?? (
					<ChartSkeleton {...(skeletonConfig || {})} className={className} />
				)
			}
		>
			<ReactApexChart {...chartProps} />
		</Suspense>
	</div>
);
}

export { ChartSkeleton } from "./chart-skeleton";
export { getTooltipTheme };
