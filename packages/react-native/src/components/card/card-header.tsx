import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { wrapBare } from "./card.shared";
import { HEADER } from "./card.styles";
import type { CardHeaderProps } from "./card.types";

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
