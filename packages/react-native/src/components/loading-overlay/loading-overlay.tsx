import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { Spinner } from "../spinner";
import { scrimStyle } from "./loading-overlay.styles";
import type { LoadingOverlayProps } from "./loading-overlay.types";

/**
 * LoadingOverlay: absolute-fill scrim + centered loader over sibling
 * content. Web composes Box+Overlay; those primitives are deliberate
 * non-ports, so this is one surface — `children` replaces the default
 * Spinner like web's loaderProps.children.
 */
export function LoadingOverlay({
	visible = false,
	zIndex = 400,
	accessibilityLabel = "Loading",
	children,
	style,
	slotStyles,
	testID = "k-loading-overlay",
}: LoadingOverlayProps): ReactElement | null {
	const { theme } = useUnistyles();
	if (!visible) return null;

	return (
		<View
			testID={testID}
			accessibilityLabel={accessibilityLabel}
			style={[
				scrimStyle(theme),
				{ zIndex },
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{children ?? <Spinner size="lg" />}
		</View>
	);
}
