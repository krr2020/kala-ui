/**
 * Chart Skeleton Component
 * Provides a loading placeholder that matches chart components structure
 * including chart area, legend, and optional table below
 */

import { cn } from "@kala-ui/react/lib/utils";
import { Skeleton } from "@kala-ui/react/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@kala-ui/react/table";
import { chartSkeletonStyles } from "../../config/charts";

export interface ChartSkeletonProps {
	height?: number;
	showLegend?: boolean;
	legendCount?: number;
	showTable?: boolean;
	tableRows?: number;
	tableColumns?: number;
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
		<div
			data-kala-component="charts-chart-skeleton"
			className={cn(chartSkeletonStyles.root, className)}
		>
			{/* Chart area skeleton */}
			<div
				className={chartSkeletonStyles.frame}
				style={{ height: `${height}px` }}
			>
				<div className={chartSkeletonStyles.frameInner}>
					<Skeleton className={chartSkeletonStyles.frameFill} />
				</div>
			</div>

			{/* Legend skeleton */}
			{showLegend && (
				<div className={chartSkeletonStyles.legendRow}>
					{Array.from({ length: legendCount }).map((_, i) => (
						<div key={`legend-${i}`} className={chartSkeletonStyles.legendItem}>
							<Skeleton className={chartSkeletonStyles.legendDot} />
							<Skeleton className={chartSkeletonStyles.legendLabel} />
						</div>
					))}
				</div>
			)}

			{/* Optional table below */}
			{showTable && (
				<div className={chartSkeletonStyles.tableWrap}>
					<Table>
						<TableHeader>
							<TableRow>
								{Array.from({ length: tableColumns }).map((_, index) => (
									<TableHead key={`header-${index}`}>
										<Skeleton className={chartSkeletonStyles.tableHead} />
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: tableRows }).map((_, rowIndex) => (
								<TableRow
									key={`row-${rowIndex}`}
									className={chartSkeletonStyles.tableRow}
								>
									{Array.from({ length: tableColumns }).map((_, colIndex) => (
										<TableCell key={`cell-${rowIndex}-${colIndex}`}>
											<Skeleton className={chartSkeletonStyles.tableCell} />
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
