import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import {
	MARKER_POSITION,
	markerColors,
	markerShape,
	markerText,
} from "./card.styles";
import type { CardMarkerProps } from "./card.types";

export function CardMarker({
	children,
	position = "top-left",
	variant = "default",
	color = "muted",
	style,
	slotStyles,
	testID = "k-card-marker",
}: CardMarkerProps): ReactElement {
	const { theme } = useUnistyles();
	const pair = markerColors(theme, color);
	const textChild =
		typeof children === "string" || typeof children === "number" ? (
			<RNText style={markerText(pair.foreground)}>{children}</RNText>
		) : (
			children
		);
	return (
		<View
			testID={testID}
			style={[
				MARKER_POSITION[position],
				markerShape(variant),
				{ backgroundColor: pair.background },
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{textChild}
		</View>
	);
}
