import type { StyleProp, ViewStyle } from "react-native";

export type SkeletonVariant = "rect" | "circle";

export interface SkeletonProps {
	variant?: SkeletonVariant;
	/** Pulse the opacity loop; false renders a static block. */
	animated?: boolean;
	/** Announce this loading state to screen readers. Without a label the
	 * block stays decorative and hidden from the a11y tree. */
	accessibilityLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
