import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ThemeRegistration } from "./index";
import { createThemeScript } from "./index";
import { THEMES, ThemeProvider, useTheme } from "./theme-provider";

const ALL_THEME_CLASSES = [
	"dark",
	"neutral",
	"accent",
	"high-contrast-light",
	"high-contrast-dark",
];

/**
 * jsdom ships no (or a non-firing) matchMedia; stub it with a controllable
 * implementation so "system" mode can be driven from tests.
 */
function stubMatchMedia(matches: boolean) {
	const listeners = new Set<(event: MediaQueryListEvent) => void>();
	const mediaQuery = {
		matches,
		addEventListener: (_: string, cb: (event: MediaQueryListEvent) => void) => {
			listeners.add(cb);
		},
		removeEventListener: (
			_: string,
			cb: (event: MediaQueryListEvent) => void,
		) => {
			listeners.delete(cb);
		},
	};
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockImplementation(() => mediaQuery),
	);
	return {
		emit(nextMatches: boolean) {
			for (const listener of listeners) {
				listener({ matches: nextMatches } as MediaQueryListEvent);
			}
		},
	};
}

function Probe() {
	const { theme, resolvedTheme } = useTheme();
	return (
		<div>
			<span data-testid="theme">{theme}</span>
			<span data-testid="resolved">{resolvedTheme}</span>
		</div>
	);
}

describe("ThemeProvider", () => {
	beforeEach(() => {
		window.localStorage.clear();
		document.documentElement.className = "";
		document.documentElement.style.colorScheme = "";
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		document.documentElement.className = "";
		document.documentElement.style.colorScheme = "";
	});

	it("ships exactly the shared four-theme contract (light/dark + high-contrast a11y pair)", () => {
		expect([...THEMES].sort()).toEqual(
			["dark", "high-contrast-dark", "high-contrast-light", "light"].sort(),
		);
	});

	it("applies no class and light color-scheme for the light theme", () => {
		render(
			<ThemeProvider defaultTheme="light">
				<Probe />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("resolved").textContent).toBe("light");
		expect(document.documentElement.className).toBe("");
		expect(document.documentElement.style.colorScheme).toBe("light");
	});

	it("applies the dark class and color-scheme for defaultTheme dark", () => {
		render(
			<ThemeProvider defaultTheme="dark">
				<Probe />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("resolved").textContent).toBe("dark");
		expect(document.documentElement.classList.contains("dark")).toBe(true);
		expect(document.documentElement.style.colorScheme).toBe("dark");
	});

	it("applies the high-contrast classes with matching color-scheme", () => {
		render(
			<ThemeProvider defaultTheme="high-contrast-light">
				<Probe />
			</ThemeProvider>,
		);
		expect(
			document.documentElement.classList.contains("high-contrast-light"),
		).toBe(true);
		expect(document.documentElement.style.colorScheme).toBe("light");
	});

	it("setTheme swaps classes, syncs color-scheme and persists the choice", () => {
		function Switcher() {
			const { setTheme } = useTheme();
			return (
				<button type="button" onClick={() => setTheme("dark")}>
					switch
				</button>
			);
		}
		render(
			<ThemeProvider defaultTheme="light">
				<Switcher />
			</ThemeProvider>,
		);
		expect(document.documentElement.className).toBe("");

		act(() => {
			screen.getByRole("button", { name: "switch" }).click();
		});

		expect(document.documentElement.classList.contains("dark")).toBe(true);
		expect(document.documentElement.style.colorScheme).toBe("dark");
		expect(window.localStorage.getItem("kala-ui-theme")).toBe("dark");
	});

	it("switches theme classes without leaving stale ones behind", () => {
		function Switcher() {
			const { setTheme } = useTheme();
			return (
				<button type="button" onClick={() => setTheme("high-contrast-dark")}>
					switch
				</button>
			);
		}
		render(
			<ThemeProvider defaultTheme="light">
				<Switcher />
			</ThemeProvider>,
		);

		act(() => {
			screen.getByRole("button", { name: "switch" }).click();
		});

		expect(
			document.documentElement.classList.contains("high-contrast-dark"),
		).toBe(true);
		for (const cls of ALL_THEME_CLASSES) {
			if (cls === "high-contrast-dark") continue;
			expect(document.documentElement.classList.contains(cls)).toBe(false);
		}
	});

	it("falls back to defaultTheme when the stored theme is a removed variant", () => {
		window.localStorage.setItem("kala-ui-theme", "neutral");
		render(
			<ThemeProvider defaultTheme="light">
				<Probe />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("resolved").textContent).toBe("light");
		expect(document.documentElement.className).toBe("");
	});

	it("falls back to defaultTheme for a stored accent variant too", () => {
		window.localStorage.setItem("kala-ui-theme", "accent");
		render(
			<ThemeProvider defaultTheme="dark">
				<Probe />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("resolved").textContent).toBe("dark");
		expect(document.documentElement.classList.contains("accent")).toBe(false);
	});

	it("restores a persisted theme over defaultTheme", () => {
		window.localStorage.setItem("kala-ui-theme", "high-contrast-dark");
		render(
			<ThemeProvider defaultTheme="light">
				<Probe />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("theme").textContent).toBe("high-contrast-dark");
		expect(
			document.documentElement.classList.contains("high-contrast-dark"),
		).toBe(true);
	});

	it("resolves system mode to dark when the OS prefers dark", () => {
		stubMatchMedia(true);
		render(
			<ThemeProvider defaultTheme="system">
				<Probe />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("theme").textContent).toBe("system");
		expect(screen.getByTestId("resolved").textContent).toBe("dark");
		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});

	it("follows OS preference changes while in system mode", () => {
		const media = stubMatchMedia(false);
		render(
			<ThemeProvider defaultTheme="system">
				<Probe />
			</ThemeProvider>,
		);
		expect(screen.getByTestId("resolved").textContent).toBe("light");

		act(() => {
			media.emit(true);
		});

		expect(screen.getByTestId("resolved").textContent).toBe("dark");
		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});

	it("skips colorScheme syncing when disabled", () => {
		render(
			<ThemeProvider defaultTheme="dark" enableColorScheme={false}>
				<Probe />
			</ThemeProvider>,
		);

		expect(document.documentElement.classList.contains("dark")).toBe(true);
		expect(document.documentElement.style.colorScheme).toBe("");
	});

	it("useTheme throws outside a ThemeProvider", () => {
		expect(() => renderHook(() => useTheme())).toThrow(/ThemeProvider/);
	});

	it("setTheme persists to localStorage under the configured key", () => {
		function Switcher() {
			const { setTheme } = useTheme();
			return (
				<button type="button" onClick={() => setTheme("high-contrast-light")}>
					switch
				</button>
			);
		}
		render(
			<ThemeProvider defaultTheme="light" storageKey="app-theme">
				<Switcher />
			</ThemeProvider>,
		);

		act(() => {
			screen.getByRole("button", { name: "switch" }).click();
		});

		expect(window.localStorage.getItem("app-theme")).toBe(
			"high-contrast-light",
		);
		expect(
			document.documentElement.classList.contains("high-contrast-light"),
		).toBe(true);
	});
});

describe("theme registration", () => {
	beforeEach(() => {
		window.localStorage.clear();
		document.documentElement.className = "";
		document.documentElement.style.colorScheme = "";
		document.documentElement.removeAttribute("data-theme");
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		document.documentElement.className = "";
		document.documentElement.style.colorScheme = "";
		document.documentElement.removeAttribute("data-theme");
	});

	const corp: ThemeRegistration = {
		name: "corp",
		className: "corp-theme",
		colorScheme: "dark",
	};

	it("applies a registered class theme with its color-scheme", () => {
		render(
			<ThemeProvider defaultTheme="corp" themes={[corp]}>
				<Probe />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("resolved").textContent).toBe("corp");
		expect(document.documentElement.classList.contains("corp-theme")).toBe(
			true,
		);
		expect(document.documentElement.style.colorScheme).toBe("dark");
	});

	it("sets registered token maps inline while active and clears them on switch", () => {
		function Switcher() {
			const { setTheme } = useTheme();
			return (
				<button type="button" onClick={() => setTheme("light")}>
					switch
				</button>
			);
		}
		render(
			<ThemeProvider
				defaultTheme="brand"
				themes={[
					{
						name: "brand",
						tokens: {
							"--primary": "#7c3aed",
							"--kala-radius-control": "9999px",
						},
					},
				]}
			>
				<Switcher />
			</ThemeProvider>,
		);
		expect(document.documentElement.style.getPropertyValue("--primary")).toBe(
			"#7c3aed",
		);
		expect(
			document.documentElement.style.getPropertyValue("--kala-radius-control"),
		).toBe("9999px");

		act(() => {
			screen.getByRole("button", { name: "switch" }).click();
		});

		expect(document.documentElement.style.getPropertyValue("--primary")).toBe(
			"",
		);
		expect(
			document.documentElement.style.getPropertyValue("--kala-radius-control"),
		).toBe("");
	});

	it("lets a registered className override a built-in name", () => {
		render(
			<ThemeProvider
				defaultTheme="dark"
				themes={[{ name: "dark", className: "midnight" }]}
			>
				<Probe />
			</ThemeProvider>,
		);

		expect(document.documentElement.classList.contains("midnight")).toBe(true);
		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});

	it("applies a registered token-only override of a built-in name without the built-in class", () => {
		render(
			<ThemeProvider
				defaultTheme="dark"
				themes={[{ name: "dark", tokens: { "--primary": "red" } }]}
			>
				<Probe />
			</ThemeProvider>,
		);

		expect(document.documentElement.style.getPropertyValue("--primary")).toBe(
			"red",
		);
		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});

	it("setTheme accepts registered names; unknown names fall back to defaultTheme", () => {
		function Switcher({ target }: { target: string }) {
			const { setTheme } = useTheme();
			return (
				<button type="button" onClick={() => setTheme(target as never)}>
					switch
				</button>
			);
		}
		const { rerender } = render(
			<ThemeProvider defaultTheme="light" themes={[corp]}>
				<Probe />
				<Switcher target="corp" />
			</ThemeProvider>,
		);

		act(() => {
			screen.getByRole("button", { name: "switch" }).click();
		});
		expect(document.documentElement.classList.contains("corp-theme")).toBe(
			true,
		);
		expect(window.localStorage.getItem("kala-ui-theme")).toBe("corp");

		rerender(
			<ThemeProvider defaultTheme="light" themes={[corp]}>
				<Probe />
				<Switcher target="nope" />
			</ThemeProvider>,
		);
		act(() => {
			screen.getByRole("button", { name: "switch" }).click();
		});
		expect(screen.getByTestId("resolved").textContent).toBe("light");
		expect(document.documentElement.classList.contains("corp-theme")).toBe(
			false,
		);
	});

	it("exposes built-ins plus registered names in registration order", () => {
		const { result } = renderHook(() => useTheme(), {
			wrapper: ({ children }) => (
				<ThemeProvider themes={[corp, { name: "brand" }]}>
					{children}
				</ThemeProvider>
			),
		});

		expect([...result.current.themes]).toEqual([...THEMES, "corp", "brand"]);
	});

	it("does not crash when localStorage is unavailable", () => {
		vi.stubGlobal("localStorage", {
			getItem: () => {
				throw new Error("blocked");
			},
			setItem: () => {},
		});
		render(
			<ThemeProvider defaultTheme="dark">
				<Probe />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("resolved").textContent).toBe("dark");
	});
});

describe("attribute mode", () => {
	beforeEach(() => {
		window.localStorage.clear();
		document.documentElement.className = "";
		document.documentElement.style.colorScheme = "";
		document.documentElement.removeAttribute("data-theme");
	});

	afterEach(() => {
		document.documentElement.className = "";
		document.documentElement.removeAttribute("data-theme");
	});

	it("writes the resolved theme to data-theme instead of a class", () => {
		render(
			<ThemeProvider defaultTheme="dark" attribute="data-theme">
				<Probe />
			</ThemeProvider>,
		);

		expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
		expect(document.documentElement.classList.contains("dark")).toBe(false);
		expect(document.documentElement.style.colorScheme).toBe("dark");
	});

	it("writes registered theme names to data-theme and applies their tokens", () => {
		render(
			<ThemeProvider
				defaultTheme="corp"
				attribute="data-theme"
				themes={[{ name: "corp", tokens: { "--primary": "red" } }]}
			>
				<Probe />
			</ThemeProvider>,
		);

		expect(document.documentElement.getAttribute("data-theme")).toBe("corp");
		expect(document.documentElement.style.getPropertyValue("--primary")).toBe(
			"red",
		);
	});
});

describe("createThemeScript", () => {
	beforeEach(() => {
		window.localStorage.clear();
		document.documentElement.className = "";
		document.documentElement.style.colorScheme = "";
		document.documentElement.removeAttribute("data-theme");
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		document.documentElement.className = "";
		document.documentElement.style.colorScheme = "";
		document.documentElement.removeAttribute("data-theme");
	});

	it("applies a stored built-in theme synchronously", () => {
		window.localStorage.setItem("kala-ui-theme", "dark");
		new Function(createThemeScript())();

		expect(document.documentElement.classList.contains("dark")).toBe(true);
		expect(document.documentElement.style.colorScheme).toBe("dark");
	});

	it("resolves system through matchMedia when nothing is stored", () => {
		stubMatchMedia(true);
		new Function(createThemeScript())();

		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});

	it("falls back to defaultTheme for an invalid stored value", () => {
		window.localStorage.setItem("kala-ui-theme", "neutral");
		new Function(createThemeScript({ defaultTheme: "high-contrast-dark" }))();

		expect(
			document.documentElement.classList.contains("high-contrast-dark"),
		).toBe(true);
	});

	it("falls back to defaultTheme when matchMedia is unavailable", () => {
		new Function(createThemeScript({ defaultTheme: "high-contrast-dark" }))();

		expect(
			document.documentElement.classList.contains("high-contrast-dark"),
		).toBe(true);
	});

	it("supports attribute mode", () => {
		window.localStorage.setItem("kala-ui-theme", "dark");
		new Function(createThemeScript({ attribute: "data-theme" }))();

		expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});
});
