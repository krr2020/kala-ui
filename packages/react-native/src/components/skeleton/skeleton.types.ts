import type { StyleProp, ViewStyle } from "react-native";

export type SkeletonVariant = "rect" | "circle";

export interface SkeletonProps {
	variant?: SkeletonVariant;
	/** Pulse the opacity loop; false renders a static block. */
	animated?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}
