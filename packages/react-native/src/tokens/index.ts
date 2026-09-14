/**
 * Public token surface: shape/density tokens composed with the motion
 * tokens under one `tokens` object (the pre-restructure shape, pinned by
 * the tokens deep-equal assertion in src/__tests__/tokens-parity.test.ts).
 */
import { motion } from "./motion";
import { shape } from "./shape";

export const tokens = {
	...shape,
	motion,
} as const;

export { motion, shape };
