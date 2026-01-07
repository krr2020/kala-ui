import type * as React from "react";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
	/** Show loading skeleton */
	isLoading?: boolean;
}
