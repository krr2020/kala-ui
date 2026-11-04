import { useMediaQuery } from "@kala-ui/react-hooks";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	DEFAULT_MOBILE_BREAKPOINT,
	useMobileLayout,
} from "./use-mobile-layout";

vi.mock("@kala-ui/react-hooks", () => ({
	useMediaQuery: vi.fn(() => false),
}));

describe("useMobileLayout", () => {
	beforeEach(() => {
		vi.mocked(useMediaQuery).mockClear();
	});

	it("returns false for scroll mode even when the media query matches", () => {
		vi.mocked(useMediaQuery).mockReturnValue(true);
		const { result } = renderHook(() => useMobileLayout("scroll"));
		expect(result.current).toBe(false);
	});

	it("returns the media query result for cards and stack modes", () => {
		vi.mocked(useMediaQuery).mockReturnValue(true);
		expect(renderHook(() => useMobileLayout("cards")).result.current).toBe(
			true,
		);
		expect(renderHook(() => useMobileLayout("stack")).result.current).toBe(
			true,
		);
		vi.mocked(useMediaQuery).mockReturnValue(false);
		expect(renderHook(() => useMobileLayout("cards")).result.current).toBe(
			false,
		);
	});

	it("queries just below the default breakpoint", () => {
		renderHook(() => useMobileLayout("cards"));
		expect(useMediaQuery).toHaveBeenCalledWith(
			`(max-width: ${DEFAULT_MOBILE_BREAKPOINT - 1}px)`,
		);
	});

	it("honors a custom breakpoint", () => {
		renderHook(() => useMobileLayout("stack", 1024));
		expect(useMediaQuery).toHaveBeenCalledWith("(max-width: 1023px)");
	});
});
