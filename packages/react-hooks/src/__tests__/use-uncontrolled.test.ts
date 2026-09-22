import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useUncontrolled } from "../use-uncontrolled/use-uncontrolled";

describe("useUncontrolled", () => {
	it("uses defaultValue in uncontrolled mode", () => {
		const { result } = renderHook(() =>
			useUncontrolled<string>({ defaultValue: "initial" }),
		);

		const [value, setValue, controlled] = result.current;
		expect(value).toBe("initial");
		expect(controlled).toBe(false);

		act(() => {
			setValue("next");
		});
		expect(result.current[0]).toBe("next");
	});

	it("falls back to finalValue when no default is given", () => {
		const { result } = renderHook(() =>
			useUncontrolled<number>({ finalValue: 42 }),
		);

		expect(result.current[0]).toBe(42);
	});

	it("reports controlled mode and echoes the value prop", () => {
		const { result, rerender } = renderHook(
			({ value }) => useUncontrolled<string>({ value }),
			{ initialProps: { value: "from-props" } },
		);

		expect(result.current[0]).toBe("from-props");
		expect(result.current[2]).toBe(true);

		rerender({ value: "updated" });
		expect(result.current[0]).toBe("updated");
	});

	it("notifies onChange in uncontrolled mode with payload", () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useUncontrolled<string>({ defaultValue: "a", onChange }),
		);

		act(() => {
			result.current[1]("b", "extra-payload");
		});

		expect(onChange).toHaveBeenCalledWith("b", "extra-payload");
		expect(result.current[0]).toBe("b");
	});

	it("forwards setValue to onChange in controlled mode", () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useUncontrolled<string>({ value: "controlled", onChange }),
		);

		act(() => {
			result.current[1]("next");
		});

		expect(onChange).toHaveBeenCalledWith("next");
		// Controlled: internal state is untouched; the prop still drives it.
		expect(result.current[0]).toBe("controlled");
	});

	it("controlled without onChange: setter is a callable no-op, not a TypeError", () => {
		const { result } = renderHook(() =>
			useUncontrolled<string>({ value: "locked" }),
		);

		expect(() => result.current[1]("next")).not.toThrow();
		expect(result.current[0]).toBe("locked");
	});

	it("controlled setter forwards trailing payload to onChange", () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useUncontrolled<string>({ value: "controlled", onChange }),
		);

		act(() => {
			result.current[1]("next", "meta");
		});

		expect(onChange).toHaveBeenCalledWith("next", "meta");
		expect(result.current[0]).toBe("controlled");
	});
});
