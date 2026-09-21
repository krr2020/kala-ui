import type * as React from "react";
import type { ResolvedTheme, Theme } from "./theme-provider";

/** Runtime theme registration: name → class and/or inline token map;
 * re-using a built-in name overrides that built-in. */
export interface ThemeRegistration {
	name: string;
	className?: string;
	/** CSS custom properties set inline on <html> while the theme is active. */
	tokens?: Record<string, string>;
	colorScheme?: "light" | "dark";
	/** <html> data-theme value (attribute="data-theme" only); defaults to `name`. */
	value?: string;
}

export interface ThemeProviderProps {
	children: React.ReactNode;
	/** Theme used when nothing is stored; defaults to "system". */
	defaultTheme?: Theme;
	/** localStorage key the choice is persisted under. */
	storageKey?: string;
	/** Sync the CSS `color-scheme` property on <html>; defaults to true. */
	enableColorScheme?: boolean;
	/** Runtime-registered themes in addition to (or overriding) the built-ins. */
	themes?: ThemeRegistration[];
	/** How the resolved theme is written to <html>; defaults to "class". */
	attribute?: "class" | "data-theme";
}

export interface CreateThemeScriptOptions {
	/** Each option must match the corresponding ThemeProvider prop. */
	storageKey?: string;
	defaultTheme?: Theme | ResolvedTheme;
	attribute?: "class" | "data-theme";
}
