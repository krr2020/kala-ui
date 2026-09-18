import { Easing } from "react-native-reanimated";
import { motion } from "@kala-ui/react-native/tokens";

/** Screen transitions ride the web `--kala-ease` standard curve. */
export const STACK_EASE = Easing.bezier(...motion.ease.standard);

export const ENTER_CONFIG = {
	duration: motion.duration.slow,
	easing: STACK_EASE,
} as const;

export const EXIT_CONFIG = {
	duration: motion.duration.slow,
	easing: STACK_EASE,
} as const;

/** Dialog-style center entry starts nearly full-size (spec §6). */
export const CENTER_SCALE_START = 0.97;

/** Scrim ink from the theme's overlay tokens (same recipe as Sheet). */
export function scrimColor(theme: {
	overlay: string;
	overlayAlpha: number;
}): string {
	const hex = theme.overlay.replace("#", "");
	const n = Number.parseInt(hex, 16);
	const r = (n >> 16) & 0xff;
	const g = (n >> 8) & 0xff;
	const b = n & 0xff;
	const alpha = Math.min(Math.max(theme.overlayAlpha, 0), 1);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
