import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePrevious } from "../use-previous/use-previous";

describe("usePrevious", () => {
	it("returns undefined on the first render", () => {
		const { result } = renderHook(() => usePrevious(10));
		expect(result.current).toBeUndefined();
	});

	it("returns the value from the previous render", () => {
		const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
			initialProps: { value: "first" },
		});

		rerender({ value: "second" });
		expect(result.current).toBe("first");

		rerender({ value: "third" });
		expect(result.current).toBe("second");
	});

	it("works with object values by identity", () => {
		const first = { count: 1 };
		const second = { count: 2 };
		const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
			initialProps: { value: first },
		});

		rerender({ value: second });
		expect(result.current).toBe(first);
	});
});
