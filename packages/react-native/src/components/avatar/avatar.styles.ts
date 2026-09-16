/**
 * Non-component wiring for Avatar: size-to-geometry tables, shape radii,
 * status-dot ring weights, and the initials fallback helper.
 */
import type { AvatarShape, AvatarSize } from "./avatar.types";

export const BOX: Record<AvatarSize, number> = {
	xs: 24,
	sm: 32,
	md: 40,
	lg: 48,
	xl: 64,
};

export const DOT: Record<AvatarSize, number> = {
	xs: 6,
	sm: 8,
	md: 10,
	lg: 12,
	xl: 16,
};

/** Hairline dot ring at the two smallest sizes, 2px from md up. */
export const RING: Record<AvatarSize, number> = {
	xs: 1,
	sm: 1,
	md: 2,
	lg: 2,
	xl: 2,
};

export const FALLBACK_FONT: Record<AvatarSize, number> = {
	xs: 12,
	sm: 14,
	md: 14,
	lg: 16,
	xl: 20,
};

export const RADIUS: Record<AvatarShape, number> = {
	circle: 999,
	rounded: 8,
	square: 0,
};

/** First letters of the first two words, uppercase; en-dash when unnamed. */
export function initialsFor(name?: string): string {
	const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return "–";
	return words
		.slice(0, 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase();
}
