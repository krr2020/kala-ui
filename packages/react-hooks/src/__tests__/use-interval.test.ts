import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInterval } from "../use-interval/use-interval";

describe("useInterval", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("does not start until start() with autoInvoke off", () => {
		const fn = vi.fn();
		const { result } = renderHook(() => useInterval(fn, 100));

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(fn).not.toHaveBeenCalled();
		expect(result.current.active).toBe(false);
	});

	it("autoInvoke starts the interval on mount", () => {
		const fn = vi.fn();
		renderHook(() => useInterval(fn, 100, { autoInvoke: true }));

		act(() => {
			vi.advanceTimersByTime(350);
		});
		expect(fn).toHaveBeenCalledTimes(3);
	});

	it("start/stop control the interval", () => {
		const fn = vi.fn();
		const { result } = renderHook(() => useInterval(fn, 100));

		act(() => {
			result.current.start();
		});
		expect(result.current.active).toBe(true);

		act(() => {
			vi.advanceTimersByTime(250);
		});
		expect(fn).toHaveBeenCalledTimes(2);

		act(() => {
			result.current.stop();
		});
		expect(result.current.active).toBe(false);

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(fn).toHaveBeenCalledTimes(2);
	});

	it("toggle flips between running and stopped", () => {
		const fn = vi.fn();
		const { result } = renderHook(() => useInterval(fn, 100));

		act(() => {
			result.current.toggle();
		});
		expect(result.current.active).toBe(true);

		act(() => {
			result.current.toggle();
		});
		expect(result.current.active).toBe(false);
	});

	it("stops the interval on unmount", () => {
		const fn = vi.fn();
		const { result, unmount } = renderHook(() => useInterval(fn, 100));

		act(() => {
			result.current.start();
		});
		unmount();

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(fn).not.toHaveBeenCalled();
	});

	it("calls the latest fn after rerender", () => {
		const first = vi.fn();
		const second = vi.fn();
		const { result, rerender } = renderHook(({ fn }) => useInterval(fn, 100), {
			initialProps: { fn: first },
		});

		act(() => {
			result.current.start();
		});
		rerender({ fn: second });

		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledTimes(1);
	});
});
