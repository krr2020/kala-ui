import type { ReactElement } from "react";
import { View } from "react-native";
import { applySlot } from "../slot-styles";
import { wrapBareLight } from "./card.shared";
import { OVERLAY, OVERLAY_SCRIM } from "./card.styles";
import type { CardImageOverlayProps } from "./card.types";

export function CardImageOverlay({
	children,
	style,
	slotStyles,
	scrim = true,
	testID = "k-card-overlay",
}: CardImageOverlayProps): ReactElement {
	return (
		<View
			testID={testID}
			style={[OVERLAY, applySlot(applySlot({}, style), slotStyles?.root)]}
		>
			{scrim && <View testID={`${testID}-scrim`} style={OVERLAY_SCRIM} />}
			{wrapBareLight(children)}
		</View>
	);
}
