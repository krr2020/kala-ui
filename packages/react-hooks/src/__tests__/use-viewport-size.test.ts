import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useViewportSize } from "../use-viewport-size/use-viewport-size";

function setViewport(width: number, height: number) {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		value: width,
	});
	Object.defineProperty(window, "innerHeight", {
		configurable: true,
		value: height,
	});
}

describe("useViewportSize", () => {
	afterEach(() => {
		setViewport(1024, 768);
	});

	it("reads the viewport size after mount", () => {
		setViewport(1280, 720);
		const { result } = renderHook(() => useViewportSize());

		expect(result.current).toEqual({ width: 1280, height: 720 });
	});

	it("updates on resize events", () => {
		setViewport(1280, 720);
		const { result } = renderHook(() => useViewportSize());

		setViewport(375, 667);
		act(() => {
			window.dispatchEvent(new Event("resize"));
		});

		expect(result.current).toEqual({ width: 375, height: 667 });
	});

	it("updates on orientationchange", () => {
		const { result } = renderHook(() => useViewportSize());

		setViewport(667, 375);
		act(() => {
			window.dispatchEvent(new Event("orientationchange"));
		});

		expect(result.current).toEqual({ width: 667, height: 375 });
	});
});
