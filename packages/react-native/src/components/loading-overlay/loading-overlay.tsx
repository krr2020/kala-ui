import type { ReactElement, ReactNode } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { Spinner } from "../spinner";
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
	useUnistyles();
	if (!visible) return null;

	return (
		<View
			testID={testID}
			accessibilityLabel={accessibilityLabel}
			style={[
				{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex,
					backgroundColor: "rgba(0,0,0,0.5)",
					alignItems: "center",
					justifyContent: "center",
				},
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{children ?? <Spinner size="lg" />}
		</View>
	);
}

export type { ReactNode as LoadingOverlayChildren };
