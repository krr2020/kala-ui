import type * as React from "react";
import type { CardSkeletonConfig } from "../skeleton/skeleton.types";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	isLoading?: boolean;
	skeletonConfig?: CardSkeletonConfig;
	skeleton?: React.ReactNode;
}

export interface CardMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
	color?: string;
}
