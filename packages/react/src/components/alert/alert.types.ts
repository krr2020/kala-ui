import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { AlertSkeletonConfig } from "../skeleton/skeleton.types";
import type { alertVariants } from "./alert";

export interface AlertProps
	extends Omit<React.ComponentProps<"div">, "style">,
		VariantProps<typeof alertVariants> {
	dismissable?: boolean;
	onDismiss?: () => void;
	showIcon?: boolean;
	isLoading?: boolean;
	skeletonConfig?: AlertSkeletonConfig;
	skeleton?: React.ReactNode;
}
