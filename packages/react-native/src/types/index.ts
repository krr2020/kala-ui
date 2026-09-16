/**
 * The theme names shipped on mobile: light/dark as the standard pair plus
 * the high-contrast pair as an explicit a11y opt-in. The web-only brand
 * variants (neutral/accent/dark-accent) stay in globals.css, not here.
 */
export type ThemeName =
	| "light"
	| "dark"
	| "high-contrast-light"
	| "high-contrast-dark";

/**
 * A Unistyles theme: flat token map in camelCase (`primaryForeground`),
 * colors as hex strings, alphas/spreads as numbers. Token parity with the
 * web `--token` names is enforced by the parity test. Every key is typed
 * so `satisfies KalaTheme` in the theme definitions catches a missing,
 * extra, or mis-typed token at compile time.
 */
export interface KalaTheme {
	background: string;
	foreground: string;
	card: string;
	cardForeground: string;
	popover: string;
	popoverForeground: string;
	primary: string;
	primaryForeground: string;
	secondary: string;
	secondaryForeground: string;
	muted: string;
	mutedForeground: string;
	accent: string;
	accentForeground: string;
	destructive: string;
	destructiveForeground: string;
	border: string;
	borderStrong: string;
	borderAlpha: number;
	cardBorderAlpha: number;
	input: string;
	ring: string;
	ringOffsetColor: string;
	overlay: string;
	overlayAlpha: number;
	shadowColor: string;
	shadowAlpha: number;
	shadowSpread: number;
	separator: string;
	success: string;
	successForeground: string;
	warning: string;
	warningForeground: string;
	error: string;
	errorForeground: string;
	info: string;
	infoForeground: string;
}

/** Any theme token key. */
export type ThemeToken = keyof KalaTheme;

/**
 * Ramp bases: colors that have a paired `*Foreground` token. Components
 * that tint by a color prop index the theme with `` `${RampBase}Foreground` ``.
 */
export type RampBase =
	| "primary"
	| "secondary"
	| "accent"
	| "destructive"
	| "success"
	| "warning"
	| "error"
	| "info";
