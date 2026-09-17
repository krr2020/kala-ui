import type { ReactElement } from "react";
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { subtitle } from "./card.styles";
import type { CardSubtitleProps } from "./card.types";

export function CardSubtitle({
	children,
	style,
	slotStyles,
	testID = "k-card-subtitle",
}: CardSubtitleProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={[
				subtitle(theme),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{children}
		</RNText>
	);
}
