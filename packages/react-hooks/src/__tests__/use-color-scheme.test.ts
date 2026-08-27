import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useColorScheme } from "../use-color-scheme/use-color-scheme";

function mockMatchMedia(matches: boolean) {
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockImplementation((query: string) => ({
			matches,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	);
}

describe("useColorScheme", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns light when the system prefers light", () => {
		mockMatchMedia(false);
		const { result } = renderHook(() => useColorScheme());
		expect(result.current).toBe("light");
	});

	it("returns dark when the system prefers dark", () => {
		mockMatchMedia(true);
		const { result } = renderHook(() => useColorScheme());
		expect(result.current).toBe("dark");
	});

	it("falls back to the initial value without matchMedia", () => {
		vi.stubGlobal("matchMedia", undefined);
		const { result } = renderHook(() => useColorScheme("dark"));
		expect(result.current).toBe("dark");
	});
});
