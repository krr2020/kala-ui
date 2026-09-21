import type * as React from "react";
import type { Theme } from "./theme-provider";

export interface ThemeProviderProps {
	children: React.ReactNode;
	/**
	 * Theme used when nothing is stored.
	 * @default "system"
	 */
	defaultTheme?: Theme;
	/** localStorage key the choice is persisted under. */
	storageKey?: string;
	/**
	 * Sync the CSS `color-scheme` property on <html> (native controls, scrollbars).
	 * Disable if the host manages it itself.
	 * @default true
	 */
	enableColorScheme?: boolean;
}
