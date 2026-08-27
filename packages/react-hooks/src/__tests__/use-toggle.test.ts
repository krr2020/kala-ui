import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useToggle } from "../use-toggle/use-toggle";

describe("useToggle", () => {
	it("toggles between false and true by default", () => {
		const { result } = renderHook(() => useToggle());

		expect(result.current[0]).toBe(false);

		act(() => {
			result.current[1]();
		});
		expect(result.current[0]).toBe(true);

		act(() => {
			result.current[1]();
		});
		expect(result.current[0]).toBe(false);
	});

	it("toggles between a custom pair of values", () => {
		const { result } = renderHook(() => useToggle(["light", "dark"] as const));

		expect(result.current[0]).toBe("light");

		act(() => {
			result.current[1]();
		});
		expect(result.current[0]).toBe("dark");

		act(() => {
			result.current[1]();
		});
		expect(result.current[0]).toBe("light");
	});

	it("sets an explicit value without toggling", () => {
		const { result } = renderHook(() => useToggle(["light", "dark"] as const));

		act(() => {
			result.current[1]("dark");
		});
		expect(result.current[0]).toBe("dark");

		act(() => {
			result.current[1]("dark");
		});
		expect(result.current[0]).toBe("dark");
	});

	it("starts at the first value of the pair", () => {
		const { result } = renderHook(() => useToggle(["on", "off"] as const));
		expect(result.current[0]).toBe("on");
	});
});
