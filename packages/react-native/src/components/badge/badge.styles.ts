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

export interface BadgeLook {
	/** surface fill; "transparent" for outline */
	bg: string;
	/** text hue for string/number children */
	fg: string;
	/** border hue; "transparent" when the variant draws no border */
	border: string;
	/** border width — outline is the only variant that draws one */
	borderWidth: number;
}

/** 'muted' has no ramp of its own — each variant borrows, same as the web config. */
export function look(
	variant: BadgeVariant,
	color: BadgeColor,
	theme: KalaTheme,
): BadgeLook {
	const hex = (key: ThemeToken) => String(theme[key]);

	if (variant === "outline") {
		const tint = color === "muted" ? "mutedForeground" : color;
		return {
			bg: "transparent",
			fg: hex(tint),
			border: hex(tint),
			borderWidth: 1,
		};
	}
	if (variant === "subtle") {
		if (color === "muted") {
			return {
				bg: hex("muted"),
				fg: hex("mutedForeground"),
				border: "transparent",
				borderWidth: 0,
			};
		}
		const tint = hex(color);
		return {
			bg: `${tint}1A`,
			fg: tint,
			border: "transparent",
			borderWidth: 0,
		};
	}
	// solid — muted borrows the accent surface pair
	const base = color === "muted" ? "accent" : color;
	return {
		bg: hex(base),
		fg: hex(`${base}Foreground`),
		border: "transparent",
		borderWidth: 0,
	};
}
