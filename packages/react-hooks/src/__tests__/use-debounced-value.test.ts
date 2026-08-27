import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedValue } from "../use-debounced-value/use-debounced-value";

describe("useDebouncedValue", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("updates the debounced value after the wait", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value, 300),
			{ initialProps: { value: "first" } },
		);

		expect(result.current[0]).toBe("first");

		rerender({ value: "second" });
		expect(result.current[0]).toBe("first");

		act(() => {
			vi.advanceTimersByTime(300);
		});
		expect(result.current[0]).toBe("second");
	});

	it("collapses rapid changes into the last value", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value, 300),
			{ initialProps: { value: 0 } },
		);

		rerender({ value: 1 });
		act(() => {
			vi.advanceTimersByTime(200);
		});
		rerender({ value: 2 });
		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(result.current[0]).toBe(0);

		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(result.current[0]).toBe(2);
	});

	it("cancel drops a pending update", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value, 300),
			{ initialProps: { value: "first" } },
		);

		rerender({ value: "second" });
		act(() => {
			result.current[1]();
			vi.advanceTimersByTime(1000);
		});
		expect(result.current[0]).toBe("first");
	});

	it("leading option fires immediately then debounces subsequent changes", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value, 300, { leading: true }),
			{ initialProps: { value: "first" } },
		);

		rerender({ value: "second" });
		// Leading edge: updated synchronously.
		expect(result.current[0]).toBe("second");

		rerender({ value: "third" });
		expect(result.current[0]).toBe("second");

		act(() => {
			vi.advanceTimersByTime(300);
		});
		expect(result.current[0]).toBe("third");
	});
});
