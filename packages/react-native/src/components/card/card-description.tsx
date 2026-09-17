import type { ReactElement } from "react";
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { description } from "./card.styles";
import type { CardDescriptionProps } from "./card.types";

export function CardDescription({
	children,
	style,
	slotStyles,
	testID = "k-card-description",
}: CardDescriptionProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={[
				description(theme),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{children}
		</RNText>
	);
}
