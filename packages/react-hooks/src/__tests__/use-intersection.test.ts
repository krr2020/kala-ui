import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIntersection } from "../use-intersection/use-intersection";

describe("useIntersection", () => {
	let observerCallback: IntersectionObserverCallback;
	let observe: ReturnType<typeof vi.fn>;
	let disconnect: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		observe = vi.fn();
		disconnect = vi.fn();
		class MockIntersectionObserver {
			constructor(callback: IntersectionObserverCallback) {
				observerCallback = callback;
			}
			observe = observe;
			disconnect = disconnect;
			unobserve = vi.fn();
			takeRecords = vi.fn(() => []);
		}
		vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("observes the attached node and exposes the latest entry", () => {
		const { result } = renderHook(() => useIntersection({ threshold: 0.5 }));

		const node = document.createElement("div");
		act(() => {
			result.current.ref(node);
		});

		expect(observe).toHaveBeenCalledWith(node);
		expect(result.current.entry).toBeNull();

		const entry = {
			isIntersecting: true,
			intersectionRatio: 0.6,
		} as IntersectionObserverEntry;
		act(() => {
			observerCallback([entry], {} as IntersectionObserver);
		});

		expect(result.current.entry).toBe(entry);
	});

	it("re-observes when the node swaps", () => {
		const { result } = renderHook(() => useIntersection());

		const first = document.createElement("div");
		const second = document.createElement("div");

		act(() => {
			result.current.ref(first);
		});
		expect(observe).toHaveBeenLastCalledWith(first);

		act(() => {
			result.current.ref(second);
		});
		expect(observe).toHaveBeenLastCalledWith(second);
	});

	it("disconnects on unmount", () => {
		const { result, unmount } = renderHook(() => useIntersection());

		const node = document.createElement("div");
		act(() => {
			result.current.ref(node);
		});

		unmount();
		expect(disconnect).toHaveBeenCalled();
	});

	it("disconnectOnIntersect stops observing after the first intersection", () => {
		const { result } = renderHook(() =>
			useIntersection({ disconnectOnIntersect: true }),
		);

		const node = document.createElement("div");
		act(() => {
			result.current.ref(node);
		});

		act(() => {
			observerCallback(
				[{ isIntersecting: true }] as IntersectionObserverEntry[],
				{} as IntersectionObserver,
			);
		});

		expect(disconnect).toHaveBeenCalled();
		expect(result.current.entry?.isIntersecting).toBe(true);
	});

	it("ignores empty callback entries", () => {
		const { result } = renderHook(() => useIntersection());

		const node = document.createElement("div");
		act(() => {
			result.current.ref(node);
		});

		act(() => {
			observerCallback([], {} as IntersectionObserver);
		});
		expect(result.current.entry).toBeNull();
	});
});
