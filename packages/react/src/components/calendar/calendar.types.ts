import type { DayPicker } from "react-day-picker";
import type * as React from "react";
import type { Button } from "../button/button";
import type { CalendarSkeletonConfig } from "../skeleton/skeleton.types";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>["variant"];
	isLoading?: boolean;
	skeletonConfig?: CalendarSkeletonConfig;
	skeleton?: React.ReactNode;
};
