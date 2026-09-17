import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { HEADER } from "./card.styles";
import type { CardHeaderProps } from "./card.types";
import { wrapBare } from "./card.shared";

export function CardHeader({
	children,
	style,
	slotStyles,
	testID = "k-card-header",
}: CardHeaderProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={[HEADER, applySlot(applySlot({}, style), slotStyles?.root)]}
		>
			{wrapBare(children, theme)}
		</View>
	);
}
