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
			backgroundColor: {
				DEFAULT: "hsl(var(--background) / var(--background-alpha, 1))",
			},
			borderColor: {
				DEFAULT: "hsl(var(--border) / var(--border-alpha, 1))",
			},
			ringColor: {
				DEFAULT: "hsl(var(--ring))",
			},
			ringOffsetColor: {
				DEFAULT: "hsl(var(--background))",
			},
			colors: {
				primary: {
					...colors.primary,
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				neutral: colors.neutral,
				success: {
					...colors.success,
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))",
				},
				error: {
					...colors.error,
					DEFAULT: "hsl(var(--error))",
					foreground: "hsl(var(--error-foreground))",
				},
				warning: {
					...colors.warning,
					DEFAULT: "hsl(var(--warning))",
					foreground: "hsl(var(--warning-foreground))",
				},
				info: {
					...colors.info,
					DEFAULT: "hsl(var(--info))",
					foreground: "hsl(var(--info-foreground))",
				},
				border: "hsl(var(--border) / var(--border-alpha, 1))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				separator:
					"hsl(var(--separator, var(--border)) / var(--border-alpha, 1))",
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
					"0 0 var(--shadow-spread) hsl(var(--shadow-color) / var(--shadow-alpha))",
				DEFAULT:
					"0 0 var(--shadow-spread) hsl(var(--shadow-color) / var(--shadow-alpha))",
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
