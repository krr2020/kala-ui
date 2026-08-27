import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIdle } from "../use-idle/use-idle";

describe("useIdle", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("starts active and becomes idle after the timeout", () => {
		const { result } = renderHook(() => useIdle(5000));

		expect(result.current).toBe(false);

		act(() => {
			vi.advanceTimersByTime(4999);
		});
		expect(result.current).toBe(false);

		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(result.current).toBe(true);
	});

	it("activity resets the idle timer", () => {
		const { result } = renderHook(() => useIdle(5000));

		act(() => {
			vi.advanceTimersByTime(4000);
			window.dispatchEvent(new MouseEvent("click"));
			vi.advanceTimersByTime(4000);
		});
		expect(result.current).toBe(false);

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current).toBe(true);
	});

	it("respects a custom event list", () => {
		const { result } = renderHook(() =>
			useIdle(1000, { events: ["keypress"] }),
		);

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current).toBe(true);

		// mousemove is not listened to with the custom events list.
		act(() => {
			window.dispatchEvent(new MouseEvent("mousemove"));
		});
		expect(result.current).toBe(true);

		act(() => {
			window.dispatchEvent(new KeyboardEvent("keypress"));
		});
		expect(result.current).toBe(false);
	});

	it("supports an initial idle state", () => {
		const { result } = renderHook(() => useIdle(5000, { initialState: true }));
		expect(result.current).toBe(true);

		// Mount-time handleEvent flips it back to active.
		act(() => {
			window.dispatchEvent(new MouseEvent("click"));
		});
		expect(result.current).toBe(false);
	});
});
