import type * as React from "react";
import type { CardSkeletonConfig } from "../skeleton/skeleton.types";

export interface CardProps extends React.ComponentProps<"div"> {
	isLoading?: boolean;
	skeletonConfig?: CardSkeletonConfig;
	skeleton?: React.ReactNode;
}

export interface CardMarkerProps extends React.ComponentProps<"div"> {
	color?: string;
}
