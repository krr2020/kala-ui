/**
 * Heading: semantic header typography (announces accessibilityRole
 * "header"). Sizes mirror the web h1–h6 scale; themes carry no font
 * families, so the web `font-heading` pairing is approximated with the
 * bold default weight and tight tracking.
 */
import type { ReactElement } from "react";
import type { TextStyle } from "react-native";
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type {
	HeadingAlign,
	HeadingProps,
	HeadingSize,
	HeadingWeight,
} from "./heading.types";

const FONT_SIZE: Record<HeadingSize, number> = {
	h1: 36,
	h2: 30,
	h3: 24,
	h4: 20,
	h5: 18,
	h6: 16,
};

const FONT_WEIGHT: Record<HeadingWeight, TextStyle["fontWeight"]> = {
	default: 700,
	medium: 500,
	semibold: 600,
	extrabold: 800,
};

const ALIGN: Record<HeadingAlign, "left" | "center" | "right"> = {
	left: "left",
	center: "center",
	right: "right",
};

export function Heading({
	children,
	size = "h2",
	weight = "default",
	align = "left",
	style,
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
					// tracking-tight, in dp
					letterSpacing: -0.5,
				},
				style,
			]}
		>
			{children}
		</RNText>
	);
}
