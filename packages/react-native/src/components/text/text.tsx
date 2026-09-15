/**
 * Text: token-driven typography with the web Text vocabulary (size ×
 * weight × align × themed color). Color accepts the web color names —
 * `secondary`/`muted` resolve to the *Foreground tokens, mirroring the
 * web `text-secondary-foreground` / `text-muted-foreground` mappings —
 * or any raw color string.
 */
import type { ReactElement } from "react";
import type { TextStyle } from "react-native";
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { TextAlign, TextProps, TextSize, TextWeight } from "./text.types";

const FONT_SIZE: Record<TextSize, number> = {
	xs: 12,
	sm: 14,
	md: 16,
	lg: 18,
	xl: 20,
	"2xl": 24,
	"3xl": 30,
};

const FONT_WEIGHT: Record<TextWeight, TextStyle["fontWeight"]> = {
	thin: 100,
	extralight: 200,
	light: 300,
	normal: 400,
	medium: 500,
	semibold: 600,
	bold: 700,
	extrabold: 800,
	black: 900,
};

const ALIGN: Record<TextAlign, "left" | "center" | "right"> = {
	left: "left",
	center: "center",
	right: "right",
};

/** Web color name → theme token key (foreground suffix where the web does). */
const COLOR_KEY: Record<string, string> = {
	primary: "primary",
	secondary: "secondaryForeground",
	destructive: "destructive",
	success: "success",
	warning: "warning",
	info: "info",
	muted: "mutedForeground",
	foreground: "foreground",
};

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
	const themeMap = theme as unknown as Record<string, string | number>;
	const key = COLOR_KEY[color as string];
	const resolved = (key ? themeMap[key] : undefined) ?? color;

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
					color: String(resolved),
				},
				applySlot(applySlot({}, style), styles?.root),
			]}
		>
			{children}
		</RNText>
	);
}
