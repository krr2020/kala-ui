import type { ReactElement } from "react";
import { View } from "react-native";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import type { CalendarSkeletonProps } from "./calendar.types";

// Slot identities for the placeholder grid: the skeleton is static, so
// stable per-slot ids (not array indices) key the placeholder cells.
const WEEKDAY_SLOTS = [
	"sun",
	"mon",
	"tue",
	"wed",
	"thu",
	"fri",
	"sat",
] as const;

function cellSlots(count: number): string[] {
	return Array.from({ length: count }, (_, i) => `cell-${i + 1}`);
}

/**
 * CalendarSkeleton: month-header bar plus a weekday row and a padded
 * cell grid, mirroring the web CalendarSkeleton surface.
 */
export function CalendarSkeleton({
	cellCount = 42,
	testID = "k-calendar-skeleton",
	style,
	slotStyles,
}: CalendarSkeletonProps): ReactElement {
	return (
		<View
			testID={testID}
			style={[{ gap: 8 }, applySlot(applySlot({}, style), slotStyles?.root)]}
		>
			<Skeleton style={{ height: 20, width: 160, alignSelf: "center" }} />
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				{WEEKDAY_SLOTS.map((slot) => (
					<Skeleton key={slot} style={{ height: 12, width: 20 }} />
				))}
			</View>
			<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
				{cellSlots(cellCount).map((slot) => (
					<Skeleton
						key={slot}
						style={{ height: 36, width: 36, borderRadius: 999 }}
					/>
				))}
			</View>
		</View>
	);
}
