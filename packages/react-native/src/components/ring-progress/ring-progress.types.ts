import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type RingTone =
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info"
	| "muted";

export interface RingProgressSection {
	/** arc size 0-100; segments accumulate clockwise from 12 o'clock */
	value: number;
	color?: RingTone;
}

export interface RingProgressProps {
	/** single-arc value 0-100; ignored when `sections` is given */
	value?: number;
	/** svg square in px */
	size?: number;
	/** arc stroke width in px */
	thickness?: number;
	/** arc tone, resolved through the theme (defaults to primary) */
	color?: RingTone;
	/** track tone behind the arcs (defaults to muted) */
	emptyColor?: RingTone;
	/** content centered inside the ring */
	label?: ReactNode;
	/** round stroke caps (default) vs butt */
	roundCaps?: boolean;
	/** multiple segments; each value is 0-100 and rotations accumulate */
	sections?: RingProgressSection[];
	accessibilityLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		label?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
