/**
 * DataTableSkeleton: header block plus pulsing rows. Keeps the
 * k-data-table marker so loading swaps are invisible to E2E.
 */

import { Skeleton } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { DataTableSkeletonProps } from "./data-table.types";

interface ThemeShape {
	border: string;
}

export function DataTableSkeleton({
	rowCount = 4,
	style,
	styles,
	testID = "k-data-table",
}: DataTableSkeletonProps): ReactElement {
	const { theme } = useUnistyles() as unknown as { theme: ThemeShape };
	return (
		<View
			testID={testID}
			style={[
				{ borderWidth: 1, borderColor: theme.border, padding: 12, gap: 10 },
				style,
				styles?.root,
			]}
		>
			<Skeleton style={{ height: 14, width: "60%" }} />
			{Array.from({ length: rowCount }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder rows, never reordered
				<Skeleton key={`row-${i}`} style={{ height: 12, width: "100%" }} />
			))}
		</View>
	);
}
