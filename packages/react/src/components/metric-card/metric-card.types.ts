import type * as React from "react";
import type { MetricCardSkeletonConfig } from "../skeleton/skeleton.types";

export interface MetricCardProps
	extends Omit<React.ComponentProps<"div">, "title"> {
	title: string;
	value: number | string;
	icon?: React.ReactNode;
	change?: number;
	changeLabel?: string;
	subtitle?: string;
	color?:
		| "primary"
		| "secondary"
		| "destructive"
		| "success"
		| "warning"
		| "info"
		| "muted";
	isLoading?: boolean;
	skeletonConfig?: MetricCardSkeletonConfig;
	skeleton?: React.ReactNode;
}
