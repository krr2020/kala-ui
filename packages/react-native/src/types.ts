/** The seven theme names, mirroring the CSS theme classes in globals.css. */
export type ThemeName =
	| 'light'
	| 'neutral'
	| 'accent'
	| 'dark'
	| 'dark-accent'
	| 'high-contrast-light'
	| 'high-contrast-dark';

/**
 * A Unistyles theme: flat token map in camelCase (`primaryForeground`),
 * colors as hex strings, alphas/spreads as numbers. Token parity with the
 * web `--token` names is enforced by the parity test.
 */
export type KalaTheme = Record<string, string | number>;
