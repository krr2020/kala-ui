import type * as React from "react";

export interface SpoilerProps extends React.ComponentProps<"div"> {
	/** Max height in collapsed state (px) */
	maxHeight: number;
	/** Label for "Show more" button */
	showLabel?: React.ReactNode;
	/** Label for "Show less" button */
	hideLabel?: React.ReactNode;
	/** Initial state */
	initialState?: boolean;
	/** Transition duration in seconds */
	transitionDuration?: number;
}
