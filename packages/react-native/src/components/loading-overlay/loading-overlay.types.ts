import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface LoadingOverlayProps {
	/** renders nothing when false */
	visible?: boolean;
	/** stacking order over sibling content */
	zIndex?: number;
	/** announced to screen readers while visible */
	accessibilityLabel?: string;
	/** replaces the default Spinner as the loader node */
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
