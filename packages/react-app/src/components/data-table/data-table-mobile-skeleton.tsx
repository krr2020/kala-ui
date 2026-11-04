/**
 * DataTableMobileSkeleton — card-shaped loading rows matching DataTableMobileList.
 */

import { Box } from "@kala-ui/react/box";
import { Skeleton } from "@kala-ui/react/skeleton";
import { Stack } from "@kala-ui/react/stack";

export interface DataTableMobileSkeletonProps {
	rows?: number;
	showSelection?: boolean;
}

export function DataTableMobileSkeleton({
	rows = 5,
	showSelection = false,
}: DataTableMobileSkeletonProps) {
	return (
		<Stack
			data-kala-component="data-table-mobile-skeleton"
			gap={0}
			className="w-full"
		>
			{Array.from({ length: rows }).map((_, index) => (
				<Box
					key={index}
					className="min-h-11 px-4 py-3 border-b last:border-b-0 flex items-start gap-3"
				>
					{showSelection ? <Skeleton className="mt-0.5 h-4 w-4" /> : null}
					<Stack gap={2} className="flex-1">
						<Skeleton className="h-4 w-2/3" />
						<Skeleton className="h-3 w-1/3" />
					</Stack>
				</Box>
			))}
		</Stack>
	);
}
