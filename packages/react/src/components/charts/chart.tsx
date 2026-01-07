/**
 * Base Chart Component
 * React component for ApexCharts
 */

import type { Props } from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import { cn } from "../../lib/utils";
import { ChartSkeleton } from "./chart-skeleton";
import type { ChartSkeletonConfig } from "./chart.types";

export interface ChartProps extends Props {
	className?: string;
	isLoading?: boolean;
	skeletonConfig?: ChartSkeletonConfig;
	skeleton?: React.ReactNode;
}

/**
 * Base Chart Component - use this as the foundation for all charts
 * Provides consistent styling
 */
export function Chart({
	className,
	isLoading,
	skeletonConfig,
	skeleton,
	...props
}: ChartProps) {
	// Render skeleton if loading
	if (isLoading) {
		if (skeleton) {
			return <>{skeleton}</>;
		}
		return <ChartSkeleton {...(skeletonConfig || {})} className={className} />;
	}

	return (
		<div className={cn("w-full", className)}>
			<ReactApexChart {...props} />
		</div>
	);
}

// Re-export ChartSkeleton for direct use
export { ChartSkeleton } from "./chart-skeleton";
