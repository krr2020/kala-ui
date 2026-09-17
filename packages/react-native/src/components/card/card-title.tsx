import type { ReactElement } from "react";
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { title } from "./card.styles";
import type { CardTitleProps } from "./card.types";

export function CardTitle({
	children,
	style,
	slotStyles,
	testID = "k-card-title",
}: CardTitleProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={[title(theme), applySlot(applySlot({}, style), slotStyles?.root)]}
		>
			{children}
		</RNText>
	);
}
