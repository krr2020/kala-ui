/**
 * Chart Skeleton Component
 * Provides a loading placeholder that matches chart components structure
 * including chart area, legend, and optional table below
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../table";

export interface ChartSkeletonProps {
	/**
	 * Height of the chart area (default: 350)
	 */
	height?: number;
	/**
	 * Show legend skeleton (default: true)
	 */
	showLegend?: boolean;
	/**
	 * Number of legend items to show (default: 4)
	 */
	legendCount?: number;
	/**
	 * Show table skeleton below chart
	 */
	showTable?: boolean;
	/**
	 * Number of table rows to show (default: 5)
	 */
	tableRows?: number;
	/**
	 * Number of table columns to show (default: 3)
	 */
	tableColumns?: number;
	/**
	 * Custom CSS class
	 */
	className?: string;
}

export function ChartSkeleton({
	height = 350,
	showLegend = true,
	legendCount = 4,
	showTable = false,
	tableRows = 5,
	tableColumns = 3,
	className,
}: ChartSkeletonProps) {
	return (
		<div className={cn("w-full space-y-4", className)}>
			{/* Chart area skeleton */}
			<div
				className="w-full rounded-lg border bg-card theme-card"
				style={{ height: `${height}px` }}
			>
				<div className="flex items-center justify-center h-full">
					<Skeleton className="h-full w-full" />
				</div>
			</div>

			{/* Legend skeleton */}
			{showLegend && (
				<div className="flex gap-4 justify-center mt-4">
					{Array.from({ length: legendCount }).map((_, i) => (
						<div key={`legend-${i}`} className="flex items-center gap-2">
							<Skeleton className="h-3 w-3 rounded-full" />
							<Skeleton className="h-4 w-16" />
						</div>
					))}
				</div>
			)}

			{/* Optional table below */}
			{showTable && (
				<div className="mt-6">
					<Table>
						<TableHeader>
							<TableRow>
								{Array.from({ length: tableColumns }).map((_, index) => (
									<TableHead key={`header-${index}`}>
										<Skeleton className="h-4 w-24" />
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: tableRows }).map((_, rowIndex) => (
								<TableRow key={`row-${rowIndex}`} className="border-0">
									{Array.from({ length: tableColumns }).map((_, colIndex) => (
										<TableCell key={`cell-${rowIndex}-${colIndex}`}>
											<Skeleton className="h-4 w-20" />
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
