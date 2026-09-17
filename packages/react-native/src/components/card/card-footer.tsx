import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { footer } from "./card.styles";
import type { CardFooterProps } from "./card.types";
import { wrapBare } from "./card.shared";

export function CardFooter({
	children,
	style,
	slotStyles,
	testID = "k-card-footer",
}: CardFooterProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={[
				footer(theme),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{wrapBare(children, theme)}
		</View>
	);
}
