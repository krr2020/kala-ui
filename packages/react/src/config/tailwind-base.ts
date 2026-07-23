import {
	breakpoints,
	colors,
	shadows,
	spacing,
	transitions,
	typography,
} from "@kala-ui/design-tokens";
import animate from "tailwindcss-animate";

export const baseConfig = {
	darkMode: "class",
	safelist: [
		"neutral",
		"accent",
		"dark",
		"high-contrast-light",
		"high-contrast-dark",
	],
	theme: {
		container: {
			center: true,
			padding: "1rem",
			screens: breakpoints.screens,
		},
		extend: {
			// Tokens are whole values (hsl/oklch/hex) on :root; alpha via color-mix,
			// so Tailwind's `/90` modifier still works.
			backgroundColor: {
				DEFAULT:
					"color-mix(in oklab, var(--background), transparent calc((1 - var(--background-alpha, 1)) * 100%))",
			},
			borderColor: {
				DEFAULT:
					"color-mix(in oklab, var(--border), transparent calc((1 - var(--border-alpha, 1)) * 100%))",
			},
			ringColor: {
				DEFAULT: "var(--ring)",
			},
			ringOffsetColor: {
				DEFAULT: "var(--background)",
			},
			colors: {
				primary: {
					...colors.primary,
					DEFAULT: "var(--primary)",
					foreground: "var(--primary-foreground)",
				},
				secondary: {
					DEFAULT: "var(--secondary)",
					foreground: "var(--secondary-foreground)",
				},
				neutral: colors.neutral,
				success: {
					...colors.success,
					DEFAULT: "var(--success)",
					foreground: "var(--success-foreground)",
				},
				error: {
					...colors.error,
					DEFAULT: "var(--error)",
					foreground: "var(--error-foreground)",
				},
				warning: {
					...colors.warning,
					DEFAULT: "var(--warning)",
					foreground: "var(--warning-foreground)",
				},
				info: {
					...colors.info,
					DEFAULT: "var(--info)",
					foreground: "var(--info-foreground)",
				},
				border:
					"color-mix(in oklab, var(--border), transparent calc((1 - var(--border-alpha, 1)) * 100%))",
				input: "var(--input)",
				ring: "var(--ring)",
				background: "var(--background)",
				foreground: "var(--foreground)",
				card: {
					DEFAULT: "var(--card)",
					foreground: "var(--card-foreground)",
				},
				popover: {
					DEFAULT: "var(--popover)",
					foreground: "var(--popover-foreground)",
				},
				muted: {
					DEFAULT: "var(--muted)",
					foreground: "var(--muted-foreground)",
				},
				accent: {
					DEFAULT: "var(--accent)",
					foreground: "var(--accent-foreground)",
				},
				destructive: {
					DEFAULT: "var(--destructive)",
					foreground: "var(--destructive-foreground)",
				},
				brand: colors.brand,
				separator:
					"color-mix(in oklab, var(--separator, var(--border)), transparent calc((1 - var(--border-alpha, 1)) * 100%))",
			},
			spacing: spacing,
			fontFamily: typography.fontFamily,
			fontSize: typography.fontSize,
			fontWeight: typography.fontWeight,
			lineHeight: typography.lineHeight,
			letterSpacing: typography.letterSpacing,
			boxShadow: {
				...shadows.boxShadow,
				themed:
					"0 0 var(--shadow-spread) color-mix(in oklab, var(--shadow-color), transparent calc((1 - var(--shadow-alpha, 0)) * 100%))",
				DEFAULT:
					"0 0 var(--shadow-spread) color-mix(in oklab, var(--shadow-color), transparent calc((1 - var(--shadow-alpha, 0)) * 100%))",
			},
			dropShadow: shadows.dropShadow,
			screens: breakpoints.screens,
			transitionDuration: transitions.duration,
			transitionTimingFunction: transitions.timingFunction,
			transitionDelay: transitions.delay,
			keyframes: {
				...transitions.keyframes,
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"progress-stripes": {
					"0%": { backgroundPosition: "1rem 0" },
					"100%": { backgroundPosition: "0 0" },
				},
			},
			animation: {
				spin: "spin 1s linear infinite",
				pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				bounce: "bounce 1s infinite",
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"progress-stripes": "progress-stripes 1s linear infinite",
			},
		},
	},
	plugins: [animate],
};
