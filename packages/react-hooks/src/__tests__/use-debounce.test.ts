import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDebounce } from "../use-debounce/use-debounce";

describe("useDebounce", () => {
	it("should debounce value changes", async () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: "initial", delay: 500 } },
		);

		expect(result.current).toBe("initial");

		// Change value
		rerender({ value: "updated", delay: 500 });

		// Value should not update immediately
		expect(result.current).toBe("initial");

		// Wait for debounce
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 600));
		});

		// Now value should be updated
		expect(result.current).toBe("updated");
	});

	it("should cancel previous timeout on rapid changes", async () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, 500),
			{ initialProps: { value: "first" } },
		);

		rerender({ value: "second" });
		rerender({ value: "third" });

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 600));
		});

		// Should only have the last value
		expect(result.current).toBe("third");
	});
});
