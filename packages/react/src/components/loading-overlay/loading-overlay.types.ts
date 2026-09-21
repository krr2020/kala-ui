import type * as React from "react";
import type { OverlayProps } from "../overlay";
import type { Spinner } from "../spinner";

export interface LoadingOverlayProps extends React.ComponentProps<"div"> {
	/** If set, the loading overlay will be visible */
	visible?: boolean;
	/** Overlay z-index */
	zIndex?: number;
	/** Props passed to the Overlay component */
	overlayProps?: OverlayProps;
	/** Props passed to the Loader component */
	loaderProps?: React.ComponentProps<typeof Spinner> & {
		children?: React.ReactNode;
	};
	/** Transition duration in ms */
	transitionDuration?: number;
}
