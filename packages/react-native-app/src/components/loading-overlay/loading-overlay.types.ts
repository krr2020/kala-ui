import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { SpinnerProps } from "../spinner";

export interface LoadingOverlayProps {
	/** renders nothing when false */
	visible?: boolean;
	/** stacking order over sibling content */
	zIndex?: number;
	/** announced to screen readers while visible */
	accessibilityLabel?: string;
	/** tunes the default Spinner (label/size/variant); ignored when children replace it */
	loaderProps?: Partial<Pick<SpinnerProps, "label" | "size" | "variant">>;
	/** replaces the default Spinner as the loader node */
	children?: ReactNode;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
