import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCounter } from "../use-counter/use-counter";

describe("useCounter", () => {
	it("starts at the initial value and increments/decrements", () => {
		const { result } = renderHook(() => useCounter(5));

		act(() => {
			result.current[1].increment();
		});
		expect(result.current[0]).toBe(6);

		act(() => {
			result.current[1].decrement();
		});
		expect(result.current[0]).toBe(5);
	});

	it("clamps increment at max and decrement at min", () => {
		const { result } = renderHook(() => useCounter(1, { min: 0, max: 2 }));

		act(() => {
			result.current[1].decrement();
		});
		expect(result.current[0]).toBe(0);

		act(() => {
			result.current[1].decrement();
		});
		expect(result.current[0]).toBe(0);

		act(() => {
			result.current[1].increment();
		});
		act(() => {
			result.current[1].increment();
		});
		expect(result.current[0]).toBe(2);

		act(() => {
			result.current[1].increment();
		});
		expect(result.current[0]).toBe(2);
	});

	it("set clamps out-of-range values into bounds", () => {
		const { result } = renderHook(() => useCounter(0, { min: 0, max: 10 }));

		act(() => {
			result.current[1].set(50);
		});
		expect(result.current[0]).toBe(10);

		act(() => {
			result.current[1].set(-5);
		});
		expect(result.current[0]).toBe(0);

		act(() => {
			result.current[1].set(7);
		});
		expect(result.current[0]).toBe(7);
	});

	it("reset returns to the initial value", () => {
		const { result } = renderHook(() => useCounter(3));

		act(() => {
			result.current[1].increment();
		});
		act(() => {
			result.current[1].increment();
		});
		act(() => {
			result.current[1].reset();
		});
		expect(result.current[0]).toBe(3);
	});
});
