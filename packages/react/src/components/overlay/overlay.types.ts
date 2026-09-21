import type * as React from "react";
import type { BoxProps } from "../box";

export interface OverlayProps extends BoxProps {
	/** Overlay background color, ignored if gradient is set. Default `#000`. */
	color?: string;
	/** Overlay background opacity, ignored if gradient is set. Default `0.6`. */
	backgroundOpacity?: number;
	/** Overlay background blur in px */
	blur?: number;
	/** Overlay background gradient, overrides color and backgroundOpacity */
	gradient?: string;
	/** Overlay z-index */
	zIndex?: number;
	/** Use fixed position instead of absolute, default false */
	fixed?: boolean;
	/** Overlay border radius */
	radius?: number | string;
	/** Content inside overlay */
	children?: React.ReactNode;
}
