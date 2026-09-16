/**
 * Non-component wiring for Tag: size-to-font/padding tables and the
 * variant × color token mapping.
 */
import type { KalaTheme, ThemeToken } from "../../types";
import type { TagColor, TagSize, TagVariant } from "./tag.types";

export const FONT: Record<TagSize, number> = { sm: 12, md: 14, lg: 16 };
export const PAD_H: Record<TagSize, number> = { sm: 8, md: 10, lg: 12 };
export const PAD_V: Record<TagSize, number> = { sm: 2, md: 4, lg: 6 };

/** 'muted' has no ramp of its own — same borrow the web config makes. */
export function look(
	variant: TagVariant,
	color: TagColor,
	theme: KalaTheme,
): { bg: string; fg: string; border: string } {
	const hex = (key: ThemeToken) => String(theme[key]);
	const tint = color === "muted" ? hex("mutedForeground") : hex(color);
	if (variant === "outline") {
		return { bg: "transparent", fg: tint, border: tint };
	}
	if (variant === "subtle") {
		if (color === "muted") {
			return { bg: hex("muted"), fg: tint, border: "transparent" };
		}
		return { bg: `${tint}1A`, fg: tint, border: "transparent" };
	}
	// solid: muted borrows the accent pair
	const base = color === "muted" ? "accent" : color;
	return {
		bg: hex(base),
		fg: hex(`${base}Foreground`),
		border: "transparent",
	};
}
