/**
 * ThemeProvider — class-based theme switching for kala-ui.
 *
 * Applies the active theme as a class on <html> (the same mechanism the
 * stylesheets and charts already observe), persists the choice to
 * localStorage, resolves `"system"` through `prefers-color-scheme`, and
 * keeps the CSS `color-scheme` property in sync so form controls and
 * scrollbars follow the theme.
 */

import * as React from "react";

/**
 * Built-in theme names: light/dark as the standard pair plus the
 * high-contrast pair as an explicit a11y opt-in — the same contract as
 * @kala-ui/react-native. Brand variants (neutral/accent) are not shipped
 * themes; consumers express them by overriding tokens (see the example
 * blocks in globals.css). `light` is the default and applies no class.
 */
export const THEMES = [
	"light",
	"dark",
	"high-contrast-light",
	"high-contrast-dark",
] as const;

export type ResolvedTheme = (typeof THEMES)[number];

/** User-selectable theme; `"system"` tracks `prefers-color-scheme`. */
export type Theme = ResolvedTheme | "system";

const THEME_CLASSES: Record<ResolvedTheme, string> = {
	light: "",
	dark: "dark",
	"high-contrast-light": "high-contrast-light",
	"high-contrast-dark": "high-contrast-dark",
};

const ALL_THEME_CLASSES = Object.values(THEME_CLASSES).filter(Boolean);

const DARK_THEMES: readonly ResolvedTheme[] = ["dark", "high-contrast-dark"];

function isTheme(value: unknown): value is Theme {
	return (
		value === "system" ||
		(typeof value === "string" && (THEMES as readonly string[]).includes(value))
	);
}

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
	 * Sync the CSS `color-scheme` property on <html> (native controls,
	 * scrollbars). Disable if the host manages it itself.
	 * @default true
	 */
	enableColorScheme?: boolean;
}

export interface ThemeContextValue {
	/** The user-selected theme; `"system"` if tracking the OS preference. */
	theme: Theme;
	/** The theme actually applied (never `"system"`). */
	resolvedTheme: ResolvedTheme;
	/** Select a theme and persist it. */
	setTheme: (theme: Theme) => void;
	/** Available built-in theme names. */
	themes: readonly ResolvedTheme[];
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
	if (
		typeof window !== "undefined" &&
		window.matchMedia?.("(prefers-color-scheme: dark)").matches
	) {
		return "dark";
	}
	return "light";
}

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "kala-ui-theme",
	enableColorScheme = true,
}: ThemeProviderProps) {
	const [theme, setThemeState] = React.useState<Theme>(() => {
		if (typeof window === "undefined") return defaultTheme;
		try {
			const stored = window.localStorage.getItem(storageKey);
			if (isTheme(stored)) return stored;
		} catch {
			// localStorage can be unavailable (private mode, sandboxed iframes)
		}
		return defaultTheme;
	});

	const [systemTheme, setSystemTheme] =
		React.useState<ResolvedTheme>(getSystemTheme);

	// Track the OS preference for "system" mode.
	React.useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;
		const query = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = (event: MediaQueryListEvent) => {
			setSystemTheme(event.matches ? "dark" : "light");
		};
		query.addEventListener("change", onChange);
		return () => query.removeEventListener("change", onChange);
	}, []);

	const resolvedTheme = theme === "system" ? systemTheme : theme;

	// Apply the theme class + color-scheme on <html>.
	React.useEffect(() => {
		if (typeof document === "undefined") return;
		const root = document.documentElement;
		root.classList.remove(...ALL_THEME_CLASSES);
		const themeClass = THEME_CLASSES[resolvedTheme];
		if (themeClass) root.classList.add(themeClass);
		if (enableColorScheme) {
			root.style.colorScheme = DARK_THEMES.includes(resolvedTheme)
				? "dark"
				: "light";
		}
	}, [resolvedTheme, enableColorScheme]);

	const setTheme = React.useCallback(
		(next: Theme) => {
			setThemeState(next);
			try {
				window.localStorage.setItem(storageKey, next);
			} catch {
				// Persistence is best-effort
			}
		},
		[storageKey],
	);

	const value = React.useMemo(
		() => ({ theme, resolvedTheme, setTheme, themes: THEMES }),
		[theme, resolvedTheme, setTheme],
	);

	return (
		<ThemeContext.Provider data-kala-component="theme-provider" value={value}>
			{children}
		</ThemeContext.Provider>
	);
}

/**
 * Access the active ThemeProvider state. Must be used inside a
 * `<ThemeProvider>`; charts and stylesheets observe theme changes on their
 * own, so only apps that render theme controls need this.
 */
export function useTheme(): ThemeContextValue {
	const context = React.useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a <ThemeProvider>");
	}
	return context;
}

/**
 * Optional counterpart to useTheme: returns null outside a `<ThemeProvider>`
 * instead of throwing. For components that must render even provider-less
 * (e.g. the Toaster in apps that toggle theme classes by hand).
 */
export function useOptionalTheme(): ThemeContextValue | null {
	return React.useContext(ThemeContext);
}
