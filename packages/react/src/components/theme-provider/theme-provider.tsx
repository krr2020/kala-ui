/**
 * ThemeProvider — class-based theme switching for kala-ui, with runtime
 * theme registration.
 *
 * Applies the active theme to <html> (class or data-theme attribute,
 * `attribute` prop), persists the choice to localStorage, resolves
 * `"system"` through `prefers-color-scheme`, keeps the CSS `color-scheme`
 * property in sync, and applies registered token maps inline. Consumers
 * that server-render can inline `createThemeScript()` before paint to
 * avoid a flash of the wrong theme.
 */

import * as React from "react";
import type {
	CreateThemeScriptOptions,
	ThemeProviderProps,
	ThemeRegistration,
} from "./theme-provider.types";

/**
 * Built-in theme names: light/dark as the standard pair plus the
 * high-contrast pair as an explicit a11y opt-in — the same contract as
 * @kala-ui/react-native. Brand variants (neutral/accent) are not shipped
 * themes; consumers register them via the `themes` prop or override tokens
 * (see the example blocks in globals.css). `light` is the default and
 * applies no class.
 */
export const THEMES = [
	"light",
	"dark",
	"high-contrast-light",
	"high-contrast-dark",
] as const;

type BuiltInTheme = (typeof THEMES)[number];

export type ResolvedTheme = BuiltInTheme | (string & Record<never, never>);

/**
 * User-selectable theme; `"system"` tracks `prefers-color-scheme`. The
 * open string accepts names registered via ThemeProvider's `themes` prop
 * while keeping autocomplete for the built-ins.
 */
export type Theme = BuiltInTheme | "system" | (string & Record<never, never>);

const THEME_CLASSES: Record<BuiltInTheme, string> = {
	light: "",
	dark: "dark",
	"high-contrast-light": "high-contrast-light",
	"high-contrast-dark": "high-contrast-dark",
};

const ALL_THEME_CLASSES = Object.values(THEME_CLASSES).filter(Boolean);

const DARK_THEMES: readonly BuiltInTheme[] = ["dark", "high-contrast-dark"];

export interface ThemeContextValue {
	/** The user-selected theme; `"system"` if tracking the OS preference. */
	theme: Theme;
	/** The theme actually applied (never `"system"`). */
	resolvedTheme: ResolvedTheme;
	/** Select a theme and persist it. Unknown names are ignored. */
	setTheme: (theme: Theme) => void;
	/** Built-in theme names plus registered ones, in registration order. */
	themes: readonly ResolvedTheme[];
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): BuiltInTheme {
	if (
		typeof window !== "undefined" &&
		window.matchMedia?.("(prefers-color-scheme: dark)").matches
	) {
		return "dark";
	}
	return "light";
}

function colorSchemeFor(name: string, registration?: ThemeRegistration) {
	if (registration?.colorScheme) return registration.colorScheme;
	return DARK_THEMES.includes(name as BuiltInTheme) || name.includes("dark")
		? "dark"
		: "light";
}

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "kala-ui-theme",
	enableColorScheme = true,
	themes,
	attribute = "class",
}: ThemeProviderProps) {
	const [theme, setThemeState] = React.useState<Theme>(() => {
		if (typeof window === "undefined") return defaultTheme;
		try {
			const stored = window.localStorage.getItem(storageKey);
			if (stored && isKnownTheme(stored, themes)) return stored;
		} catch {
			// localStorage can be unavailable (private mode, sandboxed iframes)
		}
		return defaultTheme;
	});

	const [systemTheme, setSystemTheme] =
		React.useState<BuiltInTheme>(getSystemTheme);

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

	const registrations = React.useMemo(() => {
		const map = new Map<string, ThemeRegistration>();
		for (const registration of themes ?? []) {
			map.set(registration.name, registration);
		}
		return map;
	}, [themes]);

	const resolvedTheme = theme === "system" ? systemTheme : theme;

	// Token keys applied by the previous effect run — cleared before the
	// next theme's tokens land so themes never bleed into each other.
	const appliedTokenKeys = React.useRef<string[]>([]);

	// Apply the theme to <html>: class or data-theme, tokens, color-scheme.
	React.useEffect(() => {
		if (typeof document === "undefined") return;
		const root = document.documentElement;
		const registration = registrations.get(resolvedTheme);
		const isBuiltIn = (THEMES as readonly string[]).includes(
			resolvedTheme as string,
		);

		for (const key of appliedTokenKeys.current) {
			root.style.removeProperty(key);
		}
		appliedTokenKeys.current = [];
		if (registration?.tokens) {
			for (const [key, value] of Object.entries(registration.tokens)) {
				root.style.setProperty(key, value);
				appliedTokenKeys.current.push(key);
			}
		}

		const themeClass = registration
			? (registration.className ?? "")
			: isBuiltIn
				? THEME_CLASSES[resolvedTheme as BuiltInTheme]
				: "";
		const registeredClasses = [...registrations.values()]
			.map((reg) => reg.className)
			.filter((cls): cls is string => Boolean(cls));
		root.classList.remove(...ALL_THEME_CLASSES, ...registeredClasses);
		root.removeAttribute("data-theme");
		if (attribute === "data-theme") {
			root.setAttribute(
				"data-theme",
				registration?.value ?? (resolvedTheme as string),
			);
		} else if (themeClass) {
			root.classList.add(themeClass);
		}

		if (enableColorScheme) {
			root.style.colorScheme = colorSchemeFor(
				resolvedTheme as string,
				registration,
			);
		}
	}, [resolvedTheme, enableColorScheme, attribute, registrations]);

	const setTheme = React.useCallback(
		(next: Theme) => {
			// Unknown names reset to defaultTheme rather than activating garbage.
			const accepted = isKnownTheme(next, themes) ? next : defaultTheme;
			setThemeState(accepted);
			try {
				window.localStorage.setItem(storageKey, accepted);
			} catch {
				// Persistence is best-effort
			}
		},
		[storageKey, themes, defaultTheme],
	);

	const themesList = React.useMemo(
		() => [
			...THEMES,
			...(themes ?? [])
				.map((registration) => registration.name)
				.filter((name) => !(THEMES as readonly string[]).includes(name)),
		],
		[themes],
	);

	const value = React.useMemo(
		() => ({ theme, resolvedTheme, setTheme, themes: themesList }),
		[theme, resolvedTheme, setTheme, themesList],
	);

	return (
		<ThemeContext.Provider data-kala-component="theme-provider" value={value}>
			{children}
		</ThemeContext.Provider>
	);
}

function isKnownTheme(
	value: string,
	registrations: ThemeRegistration[] | undefined,
): boolean {
	if (value === "system") return true;
	if ((THEMES as readonly string[]).includes(value)) return true;
	return Boolean(registrations?.some((reg) => reg.name === value));
}

/**
 * Inline <script> string for SSR apps: drop it into <head> (before paint)
 * so the stored/system theme is applied pre-hydration and the first paint
 * never flashes the wrong theme. Options must mirror the ThemeProvider's
 * storageKey/defaultTheme/attribute. Only built-ins and "system" are
 * resolved here — registered themes are known to React only.
 */
export function createThemeScript(options: CreateThemeScriptOptions = {}) {
	const { storageKey = "kala-ui-theme", defaultTheme = "system" } = options;
	const attribute = options.attribute ?? "class";
	const classMode = attribute !== "data-theme";
	const builtIns = [...THEMES, "system"];
	return `(function(){try{var d=document.documentElement;var t=null;try{t=localStorage.getItem(${JSON.stringify(storageKey)})}catch(e){}if(${JSON.stringify(builtIns)}.indexOf(t)<0)t=${JSON.stringify(defaultTheme)};if(t==="system"){t=(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light"}${
		classMode
			? 'var c={"dark":"dark","high-contrast-light":"high-contrast-light","high-contrast-dark":"high-contrast-dark"}[t]||"";if(c)d.classList.add(c);'
			: 'd.setAttribute("data-theme",t);'
	}d.style.colorScheme=(t==="dark"||t==="high-contrast-dark"||String(t).indexOf("dark")>-1)?"dark":"light"}catch(e){}})();`;
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
