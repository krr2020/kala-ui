import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type IndicatorColor =
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info";

/** Which corner of the decorated target the badge anchors to (MUI model). */
export interface IndicatorAnchorOrigin {
	vertical: "top" | "bottom";
	horizontal: "left" | "right";
}

/**
 * rectangular centers the badge on the corner (web default);
 * circular insets it fully inside the corner so it reads against a
 * circular target like an avatar (Avatar status-dot convention).
 */
export type IndicatorOverlap = "circular" | "rectangular";

export interface IndicatorProps {
	/** Content the badge decorates */
	children?: ReactNode;
	/**
	 * Count or short text. Numbers above `max` render as `${max}+`;
	 * zero hides the badge unless `showZero`; undefined renders no badge
	 * (unless `dot`).
	 */
	badgeContent?: string | number;
	/** Count cap before the badge renders `${max}+`. */
	max?: number;
	/** Render zero counts (default hides them, Ant model). */
	showZero?: boolean;
	/** Contentless status dot. */
	dot?: boolean;
	anchorOrigin?: IndicatorAnchorOrigin;
	overlap?: IndicatorOverlap;
	/**
	 * Fine-tune on top of the overlap-derived anchor: [x, y] with
	 * positive x moving right and positive y moving down (Ant model).
	 */
	offset?: [number, number];
	color?: IndicatorColor;
	/** Badge height (and dot diameter), in px. Defaults: dot 10, badge 16. */
	size?: number;
	withBorder?: boolean;
	/** Hide the badge; the wrapper and target keep their layout. */
	invisible?: boolean;
	/** Core-Animated opacity pulse (web's animate-pulse). */
	processing?: boolean;
	/** Shrink the wrapper to its content instead of stretching. */
	inline?: boolean;
	/** Badge styling (web parity: user style spreads onto the badge);
	 * sits below `slotStyles.badge`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		badge?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
