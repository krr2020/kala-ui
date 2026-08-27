import { act, renderHook } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { useMergedRef } from "../use-merged-ref/use-merged-ref";

describe("useMergedRef", () => {
	it("assigns the node to every ref", () => {
		const objectRef = createRef<HTMLDivElement>();
		const callbackRef = vi.fn();
		const { result } = renderHook(() =>
			useMergedRef<HTMLDivElement>(objectRef, callbackRef),
		);

		const node = document.createElement("div");
		act(() => {
			result.current(node);
		});

		expect(objectRef.current).toBe(node);
		expect(callbackRef).toHaveBeenCalledWith(node);
	});

	it("ignores undefined refs", () => {
		const callbackRef = vi.fn();
		const { result } = renderHook(() =>
			useMergedRef<HTMLDivElement>(undefined, callbackRef),
		);

		const node = document.createElement("div");
		act(() => {
			result.current(node);
		});

		expect(callbackRef).toHaveBeenCalledWith(node);
	});

	it("assigns null to every ref on detach", () => {
		const objectRef = createRef<HTMLDivElement>();
		const callbackRef = vi.fn();
		const { result } = renderHook(() =>
			useMergedRef<HTMLDivElement>(objectRef, callbackRef),
		);

		const node = document.createElement("div");
		act(() => {
			result.current(node);
			result.current(null);
		});

		expect(objectRef.current).toBeNull();
		expect(callbackRef).toHaveBeenLastCalledWith(null);
	});

	it("keeps identity stable while the refs stay stable", () => {
		const objectRef = createRef<HTMLDivElement>();
		const { result, rerender } = renderHook(() =>
			useMergedRef<HTMLDivElement>(objectRef),
		);

		const first = result.current;
		rerender();
		expect(result.current).toBe(first);
	});

	it("updates identity when a ref changes", () => {
		const firstRef = createRef<HTMLDivElement>();
		const secondRef = createRef<HTMLDivElement>();
		const { result, rerender } = renderHook(
			({ ref }) => useMergedRef<HTMLDivElement>(ref),
			{ initialProps: { ref: firstRef as React.Ref<HTMLDivElement> } },
		);

		const first = result.current;
		rerender({ ref: secondRef as React.Ref<HTMLDivElement> });

		expect(result.current).not.toBe(first);

		const node = document.createElement("div");
		act(() => {
			result.current(node);
		});
		expect(firstRef.current).toBeNull();
		expect(secondRef.current).toBe(node);
	});
});
