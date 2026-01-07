import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import type { Button } from "../button";
import type { EmptyStateSkeletonConfig } from "../skeleton/skeleton.types";
import type { emptyStateVariants } from "./empty-state";

export interface EmptyStateProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof emptyStateVariants> {
	icon?: LucideIcon | string;
	title: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
		variant?: React.ComponentProps<typeof Button>["variant"];
	};
	isLoading?: boolean;
	skeletonConfig?: EmptyStateSkeletonConfig;
	skeleton?: React.ReactNode;
}
