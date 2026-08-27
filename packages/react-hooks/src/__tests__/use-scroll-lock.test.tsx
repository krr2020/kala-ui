import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useScrollLock } from "../use-scroll-lock/use-scroll-lock";

describe("useScrollLock", () => {
	it("does not touch body styles or scroll position when mounted unlocked", () => {
		const scrollToSpy = vi
			.spyOn(window, "scrollTo")
			.mockImplementation(() => {});
		renderHook(() => useScrollLock(false));

		expect(document.body.style.overflow).toBe("");
		expect(scrollToSpy).not.toHaveBeenCalled();
		scrollToSpy.mockRestore();
	});

	it("locks body scroll when toggled on and releases when toggled off", () => {
		const scrollToSpy = vi
			.spyOn(window, "scrollTo")
			.mockImplementation(() => {});
		const { result } = renderHook(() => useScrollLock(false));

		act(() => {
			result.current[1](true);
		});
		expect(result.current[0]).toBe(true);
		expect(document.body.style.overflow).toBe("hidden");
		expect(document.body.style.position).toBe("fixed");

		act(() => {
			result.current[1](false);
		});
		expect(result.current[0]).toBe(false);
		expect(document.body.style.overflow).toBe("");
		expect(document.body.style.position).toBe("");
		// Restore scroll to the pre-lock position.
		expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
		scrollToSpy.mockRestore();
	});

	it("releases the lock on unmount while locked", () => {
		const scrollToSpy = vi
			.spyOn(window, "scrollTo")
			.mockImplementation(() => {});
		const { result, unmount } = renderHook(() => useScrollLock(true));
		expect(document.body.style.overflow).toBe("hidden");

		unmount();
		expect(document.body.style.overflow).toBe("");
		expect(result.current[0]).toBe(true);
		scrollToSpy.mockRestore();
	});
});
