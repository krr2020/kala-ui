/**
 * Non-component wiring for Badge: shape radii and the variant × color
 * token mapping.
 */
import type { KalaTheme, ThemeToken } from "../../types";
import type { BadgeColor, BadgeShape, BadgeVariant } from "./badge.types";

export const RADIUS: Record<BadgeShape, number> = {
	rounded: 4,
	pill: 999,
};

/** 'muted' has no ramp of its own — same borrow the web config makes. */
const baseColor = (
	color: BadgeColor,
):
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info"
	| "muted" => color;

export function look(
	variant: BadgeVariant,
	color: BadgeColor,
	theme: KalaTheme,
): { bg: string; fg: string; border: string } {
	const hex = (key: ThemeToken) => String(theme[key]);
	if (variant === "outline") {
		const tint =
			color === "muted" ? hex("mutedForeground") : hex(baseColor(color));
		return { bg: "transparent", fg: tint, border: tint };
	}
	if (variant === "subtle") {
		if (color === "muted") {
			return {
				bg: hex("muted"),
				fg: hex("mutedForeground"),
				border: "transparent",
			};
		}
		const tint = hex(baseColor(color));
		return { bg: `${tint}1A`, fg: tint, border: "transparent" };
	}
	// solid
	const base = color === "muted" ? "accent" : baseColor(color);
	return {
		bg: hex(base),
		fg: hex(`${base}Foreground`),
		border: "transparent",
	};
}
