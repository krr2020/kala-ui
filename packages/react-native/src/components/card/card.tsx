/**
 * Card: themed surface container (card background, radius, padding,
 * hairline border). Raw string children are wrapped in themed body text —
 * same convenience as Sheet.Body; pass elements for anything richer.
 * Web Card's loading/skeleton arm is deferred until a native skeleton
 * primitive exists.
 */
import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { tokens } from "../../tokens";
import type { CardProps } from "./card.types";

export function Card({
	children,
	style,
	testID = "k-card",
}: CardProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={[
				{
					backgroundColor: theme.card,
					borderRadius: tokens.radius.card,
					borderWidth: 1,
					borderColor: theme.border,
					padding: tokens.space.cardPad,
					gap: 8,
				},
				style,
			]}
		>
			{typeof children === "string" || typeof children === "number" ? (
				<RNText style={{ color: theme.cardForeground, fontSize: 14 }}>
					{children}
				</RNText>
			) : (
				children
			)}
		</View>
	);
}
