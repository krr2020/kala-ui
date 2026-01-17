import { act, renderHook } from "@testing-library/react";
import { useIsMobile } from "../use-mobile";

describe("useIsMobile", () => {
	beforeEach(() => {
		// Reset window width before each test
		vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("initial state", () => {
		it("should return false on desktop (width >= 768px)", () => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);

			const { result } = renderHook(() => useIsMobile());
			expect(result.current).toBe(false);
		});

		it("should return true on mobile (width < 768px)", () => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(767);

			const { result } = renderHook(() => useIsMobile());
			expect(result.current).toBe(true);
		});

		it("should return false exactly at 768px breakpoint", () => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(768);

			const { result } = renderHook(() => useIsMobile());
			expect(result.current).toBe(false);
		});

		it("should return true at 0px width", () => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(0);

			const { result } = renderHook(() => useIsMobile());
			expect(result.current).toBe(true);
		});
	});

	describe("resize event listener", () => {
		it("should add resize event listener on mount", () => {
			const addEventListenerSpy = vi.spyOn(window, "addEventListener");
			renderHook(() => useIsMobile());

			expect(addEventListenerSpy).toHaveBeenCalledWith(
				"resize",
				expect.any(Function),
			);
		});

		it("should remove resize event listener on unmount", () => {
			const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
			const { unmount } = renderHook(() => useIsMobile());

			unmount();

			expect(removeEventListenerSpy).toHaveBeenCalledWith(
				"resize",
				expect.any(Function),
			);
		});
	});

	describe("resize behavior", () => {
		it("should update from desktop to mobile", () => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);

			const { result } = renderHook(() => useIsMobile());

			// Initial desktop state
			expect(result.current).toBe(false);

			// Resize to mobile
			act(() => {
				vi.spyOn(window, "innerWidth", "get").mockReturnValue(767);
				window.dispatchEvent(new Event("resize"));
			});

			// Should update to mobile
			expect(result.current).toBe(true);
		});

		it("should update from mobile to desktop", () => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(767);

			const { result } = renderHook(() => useIsMobile());

			// Initial mobile state
			expect(result.current).toBe(true);

			// Resize to desktop
			act(() => {
				vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
				window.dispatchEvent(new Event("resize"));
			});

			// Should update to desktop
			expect(result.current).toBe(false);
		});

		it("should handle multiple resize events correctly", () => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);

			const { result } = renderHook(() => useIsMobile());

			expect(result.current).toBe(false);

			// First resize to mobile
			act(() => {
				vi.spyOn(window, "innerWidth", "get").mockReturnValue(767);
				window.dispatchEvent(new Event("resize"));
			});

			expect(result.current).toBe(true);

			// Second resize to desktop
			act(() => {
				vi.spyOn(window, "innerWidth", "get").mockReturnValue(1920);
				window.dispatchEvent(new Event("resize"));
			});

			expect(result.current).toBe(false);

			// Third resize to mobile
			act(() => {
				vi.spyOn(window, "innerWidth", "get").mockReturnValue(320);
				window.dispatchEvent(new Event("resize"));
			});

			expect(result.current).toBe(true);
		});

		it("should not update state when resize stays in same category", () => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);

			const { result } = renderHook(() => useIsMobile());

			expect(result.current).toBe(false);

			// Resize within desktop range
			act(() => {
				vi.spyOn(window, "innerWidth", "get").mockReturnValue(1920);
				window.dispatchEvent(new Event("resize"));
			});

			expect(result.current).toBe(false);

			// Resize within mobile range
			act(() => {
				vi.spyOn(window, "innerWidth", "get").mockReturnValue(767);
				window.dispatchEvent(new Event("resize"));
			});

			expect(result.current).toBe(true);

			// Resize within mobile range again
			act(() => {
				vi.spyOn(window, "innerWidth", "get").mockReturnValue(375);
				window.dispatchEvent(new Event("resize"));
			});

			expect(result.current).toBe(true);
		});

		it("should handle breakpoint edge case (767 -> 768)", () => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(767);

			const { result } = renderHook(() => useIsMobile());

			expect(result.current).toBe(true);

			// Resize to desktop breakpoint
			act(() => {
				vi.spyOn(window, "innerWidth", "get").mockReturnValue(768);
				window.dispatchEvent(new Event("resize"));
			});

			expect(result.current).toBe(false);
		});

		it("should handle breakpoint edge case (768 -> 767)", () => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(768);

			const { result } = renderHook(() => useIsMobile());

			expect(result.current).toBe(false);

			// Resize to mobile breakpoint
			act(() => {
				vi.spyOn(window, "innerWidth", "get").mockReturnValue(767);
				window.dispatchEvent(new Event("resize"));
			});

			expect(result.current).toBe(true);
		});
	});

	describe("SSR considerations", () => {
		it("should not crash when window exists", () => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);

			// Should not throw error when window is available
			expect(() => {
				renderHook(() => useIsMobile());
			}).not.toThrow();
		});

		it("should handle SSR gracefully with window check in effect", () => {
			// The hook has a typeof window === "undefined" check in useEffect
			// This test verifies the hook doesn't crash when window exists
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);

			const { result } = renderHook(() => useIsMobile());
			expect(result.current).toBe(false);
		});
	});

	describe("cleanup and unmount", () => {
		it("should not call checkIsMobile after unmount", () => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);

			const { result, unmount } = renderHook(() => useIsMobile());

			unmount();

			// This resize event should not cause any updates after unmount
			act(() => {
				vi.spyOn(window, "innerWidth", "get").mockReturnValue(767);
				window.dispatchEvent(new Event("resize"));
			});

			// State should remain the same (no memory leaks or updates)
			expect(result.current).toBe(false);
		});

		it("should cleanup only one event listener", () => {
			const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
			const { unmount } = renderHook(() => useIsMobile());

			unmount();

			expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe("common device sizes", () => {
		const commonSizes = [
			{ width: 320, expected: true, name: "small mobile" },
			{ width: 375, expected: true, name: "mobile" },
			{ width: 414, expected: true, name: "large mobile" },
			{ width: 768, expected: false, name: "tablet" },
			{ width: 1024, expected: false, name: "laptop" },
			{ width: 1440, expected: false, name: "desktop" },
			{ width: 1920, expected: false, name: "large desktop" },
		];

		it.each(commonSizes)("should return $expected for $name ($width px)", ({
			width,
			expected,
		}) => {
			vi.spyOn(window, "innerWidth", "get").mockReturnValue(width);

			const { result } = renderHook(() => useIsMobile());
			expect(result.current).toBe(expected);
		});
	});
});
