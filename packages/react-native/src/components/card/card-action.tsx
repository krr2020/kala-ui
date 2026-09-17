import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { action } from "./card.styles";
import type { CardActionProps } from "./card.types";
import { wrapBare } from "./card.shared";

export function CardAction({
	children,
	style,
	slotStyles,
	testID = "k-card-action",
}: CardActionProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={[action(), applySlot(applySlot({}, style), slotStyles?.root)]}
		>
			{wrapBare(children, theme)}
		</View>
	);
}
