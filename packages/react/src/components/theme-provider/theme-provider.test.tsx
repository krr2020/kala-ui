import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./theme-provider";

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
			<ThemeProvider defaultTheme="neutral">
				<Switcher />
			</ThemeProvider>,
		);
		expect(document.documentElement.classList.contains("neutral")).toBe(true);

		act(() => {
			screen.getByRole("button", { name: "switch" }).click();
		});

		expect(
			document.documentElement.classList.contains("high-contrast-dark"),
		).toBe(true);
		expect(document.documentElement.classList.contains("neutral")).toBe(false);
		for (const cls of ALL_THEME_CLASSES) {
			if (cls === "high-contrast-dark") continue;
			expect(document.documentElement.classList.contains(cls)).toBe(false);
		}
	});

	it("restores a persisted theme over defaultTheme", () => {
		window.localStorage.setItem("kala-ui-theme", "accent");
		render(
			<ThemeProvider defaultTheme="light">
				<Probe />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("theme").textContent).toBe("accent");
		expect(document.documentElement.classList.contains("accent")).toBe(true);
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
				<button type="button" onClick={() => setTheme("neutral")}>
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

		expect(window.localStorage.getItem("app-theme")).toBe("neutral");
		expect(document.documentElement.classList.contains("neutral")).toBe(true);
	});
});
