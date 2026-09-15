import type { StyleProp, ViewStyle } from "react-native";

export type SkeletonVariant = "rect" | "circle";

export interface SkeletonProps {
	variant?: SkeletonVariant;
	/** Pulse the opacity loop; false renders a static block. */
	animated?: boolean;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
