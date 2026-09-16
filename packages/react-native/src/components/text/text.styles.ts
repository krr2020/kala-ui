/**
 * Non-component wiring for Text: the token-backed font ramp, weight and
 * align maps, the web color-name → theme token mapping, and color
 * resolution.
 */
import type { TextStyle } from "react-native";
import { tokens } from "../../tokens";
import type { KalaTheme } from "../../types";
import type { TextAlign, TextSize, TextWeight } from "./text.types";

export const FONT_SIZE: Record<TextSize, number> = {
	xs: tokens.size.font.xs,
	sm: tokens.size.font.sm,
	md: tokens.size.font.md,
	lg: tokens.size.font.lg,
	xl: tokens.size.font.xl,
	"2xl": tokens.size.font["2xl"],
	"3xl": tokens.size.font["3xl"],
};

export const FONT_WEIGHT: Record<TextWeight, TextStyle["fontWeight"]> = {
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

export const ALIGN: Record<TextAlign, "left" | "center" | "right"> = {
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

/** Named color resolves to its token; raw strings pass through. */
export function textColor(
	theme: KalaTheme,
	color: string,
): string {
	const key = COLOR_KEY[color] as keyof KalaTheme | undefined;
	const resolved = (key ? theme[key] : undefined) ?? color;
	return String(resolved);
}
