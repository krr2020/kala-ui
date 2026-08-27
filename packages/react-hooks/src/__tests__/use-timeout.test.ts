import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTimeout } from "../use-timeout/use-timeout";

describe("useTimeout", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("invokes the callback after the delay", () => {
		const fn = vi.fn();
		renderHook(() => useTimeout(fn, 500));

		act(() => {
			vi.advanceTimersByTime(499);
		});
		expect(fn).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("does not fire again after the delay elapsed", () => {
		const fn = vi.fn();
		renderHook(() => useTimeout(fn, 100));

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("reschedules when the delay changes and clears the old timer", () => {
		const fn = vi.fn();
		const { rerender } = renderHook(({ delay }) => useTimeout(fn, delay), {
			initialProps: { delay: 100 },
		});

		rerender({ delay: 300 });

		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(fn).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("calls the latest callback after rerender", () => {
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = renderHook(({ fn }) => useTimeout(fn, 100), {
			initialProps: { fn: first },
		});

		rerender({ fn: second });

		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledTimes(1);
	});

	it("cancels the pending timeout on unmount", () => {
		const fn = vi.fn();
		const { unmount } = renderHook(() => useTimeout(fn, 100));

		unmount();

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(fn).not.toHaveBeenCalled();
	});
});
