import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useId } from "../use-id/use-id";

describe("useId", () => {
	it("returns a non-empty generated id", () => {
		const { result } = renderHook(() => useId());
		expect(typeof result.current).toBe("string");
		expect(result.current.length).toBeGreaterThan(0);
	});

	it("generates different ids per call", () => {
		const { result: first } = renderHook(() => useId());
		const { result: second } = renderHook(() => useId());
		expect(first.current).not.toBe(second.current);
	});

	it("returns the static id when provided", () => {
		const { result } = renderHook(() => useId("my-fixed-id"));
		expect(result.current).toBe("my-fixed-id");
	});

	it("falls back to a generated id when the static id is empty", () => {
		const { result } = renderHook(() => useId(""));
		expect(result.current.length).toBeGreaterThan(0);
	});
});
