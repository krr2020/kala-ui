import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useWindowScroll } from "../use-window-scroll/use-window-scroll";

function setScroll(x: number, y: number) {
	Object.defineProperty(window, "scrollX", { configurable: true, value: x });
	Object.defineProperty(window, "scrollY", { configurable: true, value: y });
}

describe("useWindowScroll", () => {
	afterEach(() => {
		setScroll(0, 0);
	});

	it("reads the initial scroll position", () => {
		setScroll(10, 20);
		const { result } = renderHook(() => useWindowScroll());

		expect(result.current).toEqual({ x: 10, y: 20 });
	});

	it("updates on scroll events", () => {
		const { result } = renderHook(() => useWindowScroll());

		setScroll(100, 200);
		act(() => {
			window.dispatchEvent(new Event("scroll"));
		});

		expect(result.current).toEqual({ x: 100, y: 200 });
	});

	it("stops updating after unmount", () => {
		const { result, unmount } = renderHook(() => useWindowScroll());

		unmount();
		setScroll(500, 500);
		window.dispatchEvent(new Event("scroll"));

		expect(result.current).toEqual({ x: 0, y: 0 });
	});
});
