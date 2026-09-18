import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "@kala-ui/react-native";
import { Spinner } from "@kala-ui/react-native";
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
	loaderProps,
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
			// polite live region: the label is announced when loading starts,
			// and the scrim swallows every touch under it (pointerEvents in
			// scrimStyle) so covered controls can't fire mid-load
			accessibilityLiveRegion="polite"
			style={[
				scrimStyle(theme),
				{ zIndex },
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{children ?? (
				<Spinner size="lg" label={accessibilityLabel} {...loaderProps} />
			)}
		</View>
	);
}
