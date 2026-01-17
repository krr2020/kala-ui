import type * as React from "react";
import type { DayPicker } from "react-day-picker";
import type { Button } from "../button";
import type { CalendarSkeletonConfig } from "./calendar-skeleton";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>["variant"];
	isLoading?: boolean;
	skeletonConfig?: CalendarSkeletonConfig;
	skeleton?: React.ReactNode;
};
