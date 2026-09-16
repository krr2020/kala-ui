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
 * web `--token` names is enforced by the parity test.
 */
export type KalaTheme = Record<string, string | number>;
