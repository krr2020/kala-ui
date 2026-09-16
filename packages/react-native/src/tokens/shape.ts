import type { motion } from "./motion";

export type Motion = typeof motion;

/**
 * Non-themed shape/density tokens (globals.css `--kala-*`, rem → dp at
 * 16dp per rem). Control height intentionally carries the verbatim web
 * value for parity; the 48dp touch-target floor is a component-layer rule.
 * Composed with the motion tokens in `../tokens/index.ts`.
 */
export const shape = {
	radius: {
		control: 6,
		card: 8,
		input: 6,
	},
	space: {
		controlPx: 16,
		cardPad: 24,
		gutter: 16,
	},
	size: {
		controlH: 40,
		// icon glyph ramp — the Icon size tiers resolve here, never raw px
		icon: {
			xs: 14,
			sm: 16,
			md: 20,
			lg: 24,
			xl: 32,
		},
	},
} as const;
