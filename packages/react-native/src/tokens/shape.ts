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
		// Text/Icon size tiers resolve here, never raw px
		font: {
			xs: 12,
			sm: 14,
			md: 16,
			lg: 18,
			xl: 20,
			"2xl": 24,
			"3xl": 30,
		},
		icon: {
			xs: 14,
			sm: 16,
			md: 20,
			lg: 24,
			xl: 32,
		},
	},
} as const;
