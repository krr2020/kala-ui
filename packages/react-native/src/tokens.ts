import { motion } from './motion';

/**
 * Non-themed shape/density tokens (globals.css `--kala-*`, rem → dp at
 * 16dp per rem). Control height intentionally carries the verbatim web
 * value for parity; the 48dp touch-target floor is a component-layer rule.
 */
export const tokens = {
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
	},
	motion,
} as const;
