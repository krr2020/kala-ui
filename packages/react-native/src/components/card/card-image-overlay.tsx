import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { OVERLAY } from "./card.styles";
import type { CardImageOverlayProps } from "./card.types";
import { wrapBare } from "./card.shared";

export function CardImageOverlay({
	children,
	style,
	slotStyles,
	testID = "k-card-overlay",
}: CardImageOverlayProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={[OVERLAY, applySlot(applySlot({}, style), slotStyles?.root)]}
		>
			{wrapBare(children, theme)}
		</View>
	);
}
