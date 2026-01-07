import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDisclosure } from "../use-disclosure/use-disclosure";

describe("useDisclosure", () => {
	it("should initialize with default state", () => {
		const { result } = renderHook(() => useDisclosure());
		const [opened] = result.current;

		expect(opened).toBe(false);
	});

	it("should initialize with custom state", () => {
		const { result } = renderHook(() => useDisclosure(true));
		const [opened] = result.current;

		expect(opened).toBe(true);
	});

	it("should open, close, and toggle", () => {
		const { result } = renderHook(() => useDisclosure(false));

		// Initial state
		expect(result.current[0]).toBe(false);

		// Open
		act(() => {
			result.current[1].open();
		});
		expect(result.current[0]).toBe(true);

		// Close
		act(() => {
			result.current[1].close();
		});
		expect(result.current[0]).toBe(false);

		// Toggle
		act(() => {
			result.current[1].toggle();
		});
		expect(result.current[0]).toBe(true);

		act(() => {
			result.current[1].toggle();
		});
		expect(result.current[0]).toBe(false);
	});
});
