import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { wrapBare } from "./card.shared";
import { CONTENT } from "./card.styles";
import type { CardContentProps } from "./card.types";

export function CardContent({
	children,
	style,
	slotStyles,
	testID = "k-card-content",
}: CardContentProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={[CONTENT, applySlot(applySlot({}, style), slotStyles?.root)]}
		>
			{wrapBare(children, theme)}
		</View>
	);
}
