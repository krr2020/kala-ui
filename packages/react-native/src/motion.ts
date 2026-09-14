/**
 * Motion tokens (design-specs §7.1/§8). Durations and the easing carry the
 * web `--kala-duration-*` / `--kala-ease` values; springs are the native-only
 * Reanimated configs. `ease` values are cubic-bezier segments.
 */
export const motion = {
	duration: {
		fast: 120,
		base: 150,
		slow: 200,
	},
	ease: {
		standard: [0.4, 0, 0.2, 1],
	},
	spring: {
		gentle: { damping: 18, stiffness: 120 },
		snappy: { damping: 14, stiffness: 220 },
		bouncy: { damping: 10, stiffness: 180 },
	},
} as const;
