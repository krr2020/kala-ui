/**
 * DataTableSkeleton: header block plus pulsing rows. Keeps the
 * k-data-table marker so loading swaps are invisible to E2E.
 */

import { Skeleton } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import {
	skeletonHeaderBone,
	skeletonRowBone,
	skeletonSurfaceStyle,
} from "./data-table.styles";
import type { DataTableSkeletonProps } from "./data-table.types";

export function DataTableSkeleton({
	rowCount = 4,
	style,
	styles,
	testID = "k-data-table",
}: DataTableSkeletonProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={[skeletonSurfaceStyle(theme), style, styles?.root]}
		>
			<Skeleton style={skeletonHeaderBone} />
			{Array.from({ length: rowCount }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder rows, never reordered
				<Skeleton key={`row-${i}`} style={skeletonRowBone} />
			))}
		</View>
	);
}
