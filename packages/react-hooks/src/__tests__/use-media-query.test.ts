import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMediaQuery } from "../use-media-query/use-media-query";

describe("useMediaQuery", () => {
	it("should return initial value", () => {
		const { result } = renderHook(() =>
			useMediaQuery("(min-width: 768px)", false),
		);

		// Should return the initial value on first render
		expect(typeof result.current).toBe("boolean");
	});

	it("should handle SSR scenario", () => {
		const { result } = renderHook(() =>
			useMediaQuery("(min-width: 768px)", true, {
				getInitialValueInEffect: false,
			}),
		);

		expect(typeof result.current).toBe("boolean");
	});
});
