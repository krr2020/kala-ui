import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

/** Range selection shape shared by Calendar range mode and DateRangePicker. */
export interface DateRangeValue {
	from: Date;
	to?: Date;
}

export interface CalendarSkeletonConfig {
	/** total day cells to render in the grid; defaults to a full 6x7 month */
	cellCount?: number;
}

export interface CalendarSkeletonProps extends CalendarSkeletonConfig {
	testID?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	children?: ReactNode;
}

export type CalendarMode = "single" | "multiple" | "range";

/** Calendar commit payload — the shape depends on `mode`. */
export type CalendarValue = Date | Date[] | DateRangeValue;

export interface CalendarProps {
	mode?: CalendarMode;
	/** Controlled selection; locks display until the parent re-renders. */
	value?: CalendarValue;
	/** Uncontrolled seed; ignored when `value` is provided. */
	defaultValue?: CalendarValue;
	/** Fires with the new selection; still fires when controlled. */
	onValueChange?: (value: CalendarValue) => void;
	/** Initially visible month; defaults to the selection or today. */
	month?: Date;
	/** Earliest selectable date (inclusive). */
	min?: Date;
	/** Latest selectable date (inclusive). */
	max?: Date;
	/** Extra per-day disable rule, merged with min/max. */
	disabledDates?: (date: Date) => boolean;
	/** Swaps the grid for a skeleton surface keeping the marker. */
	isLoading?: boolean;
	skeletonConfig?: CalendarSkeletonConfig;
	accessibilityLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		day?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
