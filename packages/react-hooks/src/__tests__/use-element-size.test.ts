import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useElementSize } from "../use-element-size/use-element-size";

describe("useElementSize", () => {
	let observerCallback: ResizeObserverCallback;
	let observe: ReturnType<typeof vi.fn>;
	let disconnect: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		observe = vi.fn();
		disconnect = vi.fn();
		class MockResizeObserver {
			constructor(callback: ResizeObserverCallback) {
				observerCallback = callback;
			}
			observe = observe;
			disconnect = disconnect;
			unobserve = vi.fn();
		}
		vi.stubGlobal("ResizeObserver", MockResizeObserver);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("observes the node attached through the ref and reports its size", () => {
		const { result } = renderHook(() => useElementSize<HTMLDivElement>());

		const node = document.createElement("div");
		act(() => {
			result.current[0](node);
		});

		expect(observe).toHaveBeenCalledWith(node);
		expect(result.current[1]).toEqual({ width: 0, height: 0 });

		act(() => {
			observerCallback(
				[
					{ contentRect: { width: 320, height: 240 } },
				] as unknown as ResizeObserverEntry[],
				{} as ResizeObserver,
			);
		});
		expect(result.current[1]).toEqual({ width: 320, height: 240 });
	});

	it("re-observes when the node swaps and resets size while detached", () => {
		const { result } = renderHook(() => useElementSize<HTMLDivElement>());

		const first = document.createElement("div");
		const second = document.createElement("div");

		act(() => {
			result.current[0](first);
		});
		act(() => {
			observerCallback(
				[
					{ contentRect: { width: 100, height: 80 } },
				] as unknown as ResizeObserverEntry[],
				{} as ResizeObserver,
			);
		});
		expect(result.current[1]).toEqual({ width: 100, height: 80 });

		act(() => {
			result.current[0](second);
		});
		expect(disconnect).toHaveBeenCalled();
		expect(observe).toHaveBeenLastCalledWith(second);
		// Detaching the old node zeroes the reported size.
		expect(result.current[1]).toEqual({ width: 0, height: 0 });
	});

	it("disconnects on unmount", () => {
		const { result, unmount } = renderHook(() =>
			useElementSize<HTMLDivElement>(),
		);

		const node = document.createElement("div");
		act(() => {
			result.current[0](node);
		});

		unmount();
		expect(disconnect).toHaveBeenCalled();
	});
});
