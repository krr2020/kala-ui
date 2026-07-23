/**
 * Theme Design Tokens
 *
 * Centralized theme definitions for the design system.
 * All themes defined here serve as single source of truth for styling.
 * Color values are WHOLE CSS colors (hsl/oklch/hex), not raw HSL channels;
 * components consume them via `var(--x)`.
 */

export interface Theme {
	name: string;
	className: string;
	colorScheme: "light" | "dark";
	colors: {
		background: string; // whole CSS color
		foreground: string;
		card: string;
		border: string; // whole CSS color
	};
	shadow?: {
		color: string; // whole CSS color
		alpha: number; // Transparency value (0-1)
		spread: string; // Spread radius
	};
}

export const themes: Record<string, Theme> = {
	light: {
		name: "Light",
		className: "",
		colorScheme: "light",
		colors: {
			background: "hsl(0 0% 100%)",
			foreground: "hsl(220 100% 11%)",
			card: "hsl(0 0% 100%)",
			border: "hsl(211 27% 81%)",
		},
		shadow: {
			color: "hsl(0 0% 0%)",
			alpha: 0,
			spread: "0px",
		},
	},

	neutral: {
		name: "Neutral",
		className: "neutral",
		colorScheme: "light",
		colors: {
			background: "hsl(228 25% 97%)",
			foreground: "hsl(220 100% 11%)",
			card: "hsl(0 0% 100%)",
			border: "hsl(221 32% 43%)",
		},
		shadow: {
			color: "hsl(221 38% 15%)",
			alpha: 0.05,
			spread: "10px",
		},
	},

	accent: {
		name: "Accent",
		className: "accent",
		colorScheme: "light",
		colors: {
			background: "hsl(219 81% 49%)",
			foreground: "hsl(220 100% 11%)",
			card: "hsl(0 0% 100%)",
			border: "hsl(219 81% 49%)",
		},
		shadow: {
			color: "hsl(219 81% 49%)",
			alpha: 0.1,
			spread: "25px",
		},
	},

	dark: {
		name: "Dark",
		className: "dark",
		colorScheme: "dark",
		colors: {
			background: "hsl(219 33% 12%)",
			foreground: "hsl(215 18% 66%)",
			card: "hsl(219 31% 17%)",
			border: "hsl(221 32% 43%)",
		},
		shadow: {
			color: "hsl(221 38% 15%)",
			alpha: 0.05,
			spread: "10px",
		},
	},

	"high-contrast-light": {
		name: "High Contrast Light",
		className: "high-contrast-light",
		colorScheme: "light",
		colors: {
			background: "hsl(0 0% 100%)",
			foreground: "hsl(222.2 84% 4.9%)",
			card: "hsl(0 0% 100%)",
			border: "hsl(214.3 31.8% 91.4%)",
		},
		shadow: {
			color: "hsl(0 0% 0%)",
			alpha: 0,
			spread: "0px",
		},
	},

	"high-contrast-dark": {
		name: "High Contrast Dark",
		className: "high-contrast-dark",
		colorScheme: "dark",
		colors: {
			background: "hsl(222.2 84% 4.9%)",
			foreground: "hsl(210 40% 98%)",
			card: "hsl(222.2 84% 4.9%)",
			border: "hsl(217.2 32.6% 17.5%)",
		},
		shadow: {
			color: "hsl(224.3 76.3% 48%)",
			alpha: 0,
			spread: "0px",
		},
	},
} as const;

export type ThemeKey = keyof typeof themes;
