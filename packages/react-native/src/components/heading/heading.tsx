/**
 * Heading: semantic header typography (announces accessibilityRole
 * "header"). Sizes mirror the web h1–h6 scale; themes carry no font
 * families, so the web `font-heading` pairing is approximated with the
 * bold default weight and tight tracking.
 */
import type { ReactElement } from "react";
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import {
	ALIGN,
	FONT_SIZE,
	FONT_WEIGHT,
	TRACKING_TIGHT,
} from "./heading.styles";
import type { HeadingProps } from "./heading.types";

export function Heading({
	children,
	size = "h2",
	weight = "default",
	align = "left",
	style,
	slotStyles,
	testID = "k-heading",
}: HeadingProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			accessibilityRole="header"
			style={[
				{
					fontSize: FONT_SIZE[size],
					fontWeight: FONT_WEIGHT[weight],
					textAlign: ALIGN[align],
					color: theme.foreground,
					letterSpacing: TRACKING_TIGHT,
				},
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{children}
		</RNText>
	);
}
