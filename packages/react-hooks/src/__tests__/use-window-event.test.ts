import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useWindowEvent } from "../use-window-event/use-window-event";

describe("useWindowEvent", () => {
	it("calls the listener when the event fires", () => {
		const listener = vi.fn();
		renderHook(() => useWindowEvent("resize", listener));

		act(() => {
			window.dispatchEvent(new Event("resize"));
		});

		expect(listener).toHaveBeenCalledTimes(1);
	});

	it("does not call listeners for other event types", () => {
		const listener = vi.fn();
		renderHook(() => useWindowEvent("scroll", listener));

		act(() => {
			window.dispatchEvent(new Event("resize"));
		});

		expect(listener).not.toHaveBeenCalled();
	});

	it("removes the listener on unmount", () => {
		const listener = vi.fn();
		const { unmount } = renderHook(() => useWindowEvent("resize", listener));

		unmount();
		window.dispatchEvent(new Event("resize"));

		expect(listener).not.toHaveBeenCalled();
	});

	it("rebinds when the listener identity changes", () => {
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = renderHook(
			({ listener }) => useWindowEvent("resize", listener),
			{ initialProps: { listener: first } },
		);

		rerender({ listener: second });
		window.dispatchEvent(new Event("resize"));

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledTimes(1);
	});
});
