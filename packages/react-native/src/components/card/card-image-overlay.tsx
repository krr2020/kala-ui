import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { OVERLAY, overlayBody, overlayScrim } from "./card.styles";
import type { CardImageOverlayProps } from "./card.types";

export function CardImageOverlay({
	children,
	style,
	slotStyles,
	scrim = true,
	testID = "k-card-overlay",
}: CardImageOverlayProps): ReactElement {
	const { theme } = useUnistyles();
	// defined here, not in card.shared, so shared never imports back
	const wrapBareLight = (node: React.ReactNode) =>
		typeof node === "string" || typeof node === "number" ? (
			<RNText style={overlayBody()}>{node}</RNText>
		) : (
			node
		);
	return (
		<View
			testID={testID}
			style={[OVERLAY, applySlot(applySlot({}, style), slotStyles?.root)]}
		>
			{scrim && <View testID={`${testID}-scrim`} style={overlayScrim(theme)} />}
			{wrapBareLight(children)}
		</View>
	);
}
