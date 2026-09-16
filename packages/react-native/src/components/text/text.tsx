/**
 * Text: token-driven typography — size × weight × align × themed color,
 * with optional single-line truncate.
 */
import type { ReactElement } from "react";
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { ALIGN, FONT_SIZE, FONT_WEIGHT, textColor } from "./text.styles";
import type { TextProps } from "./text.types";

export function Text({
	children,
	size = "md",
	weight = "normal",
	align = "left",
	color = "foreground",
	truncate = false,
	style,
	styles,
	testID = "k-text",
}: TextProps): ReactElement {
	const { theme } = useUnistyles();

	return (
		<RNText
			testID={testID}
			numberOfLines={truncate ? 1 : undefined}
			ellipsizeMode={truncate ? "tail" : undefined}
			style={[
				{
					fontSize: FONT_SIZE[size],
					fontWeight: FONT_WEIGHT[weight],
					textAlign: ALIGN[align],
					color: textColor(theme, color),
				},
				applySlot(applySlot({}, style), styles?.root),
			]}
		>
			{children}
		</RNText>
	);
}
