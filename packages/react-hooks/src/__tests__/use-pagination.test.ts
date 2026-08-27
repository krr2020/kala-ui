import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DOTS, usePagination } from "../use-pagination/use-pagination";

describe("usePagination", () => {
	it("returns the full range when total fits without dots", () => {
		const { result } = renderHook(() => usePagination({ total: 5 }));

		expect(result.current.range).toEqual([1, 2, 3, 4, 5]);
		expect(result.current.active).toBe(1);
		expect(result.current.total).toBe(5);
	});

	it("shows dots on the right when active page is near the start", () => {
		const { result } = renderHook(() => usePagination({ total: 20 }));

		expect(result.current.range).toEqual([1, 2, 3, 4, 5, DOTS, 20]);
	});

	it("shows dots on both sides in the middle", () => {
		const { result } = renderHook(() =>
			usePagination({ total: 20, defaultPage: 10 }),
		);

		expect(result.current.range).toEqual([1, DOTS, 9, 10, 11, DOTS, 20]);
	});

	it("shows dots on the left when active page is near the end", () => {
		const { result } = renderHook(() =>
			usePagination({ total: 20, defaultPage: 20 }),
		);

		expect(result.current.range).toEqual([1, DOTS, 16, 17, 18, 19, 20]);
	});

	it("respects siblings and boundaries", () => {
		const { result } = renderHook(() =>
			usePagination({ total: 30, siblings: 2, boundaries: 2, defaultPage: 15 }),
		);

		expect(result.current.range).toEqual([
			1,
			2,
			DOTS,
			13,
			14,
			15,
			16,
			17,
			DOTS,
			29,
			30,
		]);
	});

	it("navigates with next/previous/first/last", () => {
		const onPageChange = vi.fn();
		const { result } = renderHook(() =>
			usePagination({ total: 10, defaultPage: 2, onPageChange }),
		);

		act(() => {
			result.current.next();
		});
		expect(result.current.active).toBe(3);

		act(() => {
			result.current.previous();
		});
		expect(result.current.active).toBe(2);

		act(() => {
			result.current.first();
		});
		expect(result.current.active).toBe(1);

		act(() => {
			result.current.last();
		});
		expect(result.current.active).toBe(10);

		expect(onPageChange).toHaveBeenNthCalledWith(1, 3);
		expect(onPageChange).toHaveBeenLastCalledWith(10);
	});

	it("clamps setPage into the page bounds", () => {
		const { result } = renderHook(() => usePagination({ total: 10 }));

		act(() => {
			result.current.setPage(0);
		});
		expect(result.current.active).toBe(1);

		act(() => {
			result.current.setPage(99);
		});
		expect(result.current.active).toBe(10);

		act(() => {
			result.current.setPage(5);
		});
		expect(result.current.active).toBe(5);
	});

	it("follows the controlled page prop", () => {
		const { result, rerender } = renderHook(
			({ page }) => usePagination({ total: 10, page }),
			{ initialProps: { page: 4 } },
		);

		expect(result.current.active).toBe(4);

		rerender({ page: 7 });
		expect(result.current.active).toBe(7);
	});

	it("truncates a negative or fractional total", () => {
		const { result } = renderHook(() => usePagination({ total: -3.7 }));

		expect(result.current.total).toBe(0);
		expect(result.current.range).toEqual([]);
	});
});
