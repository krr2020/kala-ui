import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useHover } from "../use-hover/use-hover";

describe("useHover", () => {
	it("tracks pointerenter and pointerleave on the attached node", () => {
		const { result } = renderHook(() => useHover<HTMLDivElement>());

		const node = document.createElement("div");
		act(() => {
			result.current.ref(node);
		});

		expect(result.current.hovered).toBe(false);

		act(() => {
			node.dispatchEvent(new PointerEvent("pointerenter"));
		});
		expect(result.current.hovered).toBe(true);

		act(() => {
			node.dispatchEvent(new PointerEvent("pointerleave"));
		});
		expect(result.current.hovered).toBe(false);
	});

	it("resets hovered when the node detaches", () => {
		const { result } = renderHook(() => useHover<HTMLDivElement>());

		const node = document.createElement("div");
		act(() => {
			result.current.ref(node);
		});
		act(() => {
			node.dispatchEvent(new PointerEvent("pointerenter"));
		});
		expect(result.current.hovered).toBe(true);

		act(() => {
			result.current.ref(null);
		});
		expect(result.current.hovered).toBe(false);
	});

	it("stops listening to a detached node", () => {
		const { result } = renderHook(() => useHover<HTMLDivElement>());

		const node = document.createElement("div");
		act(() => {
			result.current.ref(node);
		});
		act(() => {
			result.current.ref(null);
		});

		node.dispatchEvent(new PointerEvent("pointerenter"));
		expect(result.current.hovered).toBe(false);
	});

	it("binds to a late-attached node", () => {
		const { result } = renderHook(() => useHover<HTMLSpanElement>());

		const node = document.createElement("span");
		// Attach after mount — the effect re-runs and binds listeners.
		act(() => {
			result.current.ref(node);
		});

		act(() => {
			node.dispatchEvent(new PointerEvent("pointerenter"));
		});
		expect(result.current.hovered).toBe(true);
	});
});
