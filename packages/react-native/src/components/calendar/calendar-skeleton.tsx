import type { ReactElement } from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import type { CalendarSkeletonProps } from "./calendar.types";

/**
 * CalendarSkeleton: month-header bar plus a weekday row and a padded
 * cell grid, mirroring the web CalendarSkeleton surface.
 */
export function CalendarSkeleton({
	cellCount = 42,
	testID = "k-calendar-skeleton",
	style,
	styles,
}: CalendarSkeletonProps): ReactElement {
	return (
		<View
			testID={testID}
			style={[{ gap: 8 }, applySlot(applySlot({}, style), styles?.root)]}
		>
			<Skeleton style={{ height: 20, width: 160, alignSelf: "center" }} />
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				{Array.from({ length: 7 }, (_, i) => (
					<Skeleton key={i} style={{ height: 12, width: 20 }} />
				))}
			</View>
			<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
				{Array.from({ length: cellCount }, (_, i) => (
					<Skeleton
						key={i}
						style={{ height: 36, width: 36, borderRadius: 999 }}
					/>
				))}
			</View>
		</View>
	);
}
