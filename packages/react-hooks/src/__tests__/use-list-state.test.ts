import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useListState } from "../use-list-state/use-list-state";

describe("useListState", () => {
	it("appends and prepends items", () => {
		const { result } = renderHook(() => useListState<number>([2]));

		act(() => {
			result.current[1].append(3, 4);
		});
		expect(result.current[0]).toEqual([2, 3, 4]);

		act(() => {
			result.current[1].prepend(0, 1);
		});
		expect(result.current[0]).toEqual([0, 1, 2, 3, 4]);
	});

	it("inserts at an index", () => {
		const { result } = renderHook(() => useListState<number>([1, 4]));

		act(() => {
			result.current[1].insert(1, 2, 3);
		});
		expect(result.current[0]).toEqual([1, 2, 3, 4]);
	});

	it("pop and shift remove from either end", () => {
		const { result } = renderHook(() => useListState<number>([1, 2, 3]));

		act(() => {
			result.current[1].pop();
		});
		expect(result.current[0]).toEqual([1, 2]);

		act(() => {
			result.current[1].shift();
		});
		expect(result.current[0]).toEqual([2]);
	});

	it("remove deletes by indices", () => {
		const { result } = renderHook(() => useListState<number>([1, 2, 3, 4]));

		act(() => {
			result.current[1].remove(1, 3);
		});
		expect(result.current[0]).toEqual([1, 3]);
	});

	it("reorder moves an item", () => {
		const { result } = renderHook(() => useListState(["a", "b", "c", "d"]));

		act(() => {
			result.current[1].reorder({ from: 3, to: 0 });
		});
		expect(result.current[0]).toEqual(["d", "a", "b", "c"]);
	});

	it("swap exchanges two items in place", () => {
		const { result } = renderHook(() => useListState(["a", "b", "c"]));

		act(() => {
			result.current[1].swap({ from: 0, to: 2 });
		});
		expect(result.current[0]).toEqual(["c", "b", "a"]);
	});

	it("setItem and setItemProp replace entries", () => {
		const { result } = renderHook(() =>
			useListState([{ name: "Ada", done: false }]),
		);

		act(() => {
			result.current[1].setItem(0, { name: "Grace", done: true });
		});
		expect(result.current[0]).toEqual([{ name: "Grace", done: true }]);

		act(() => {
			result.current[1].setItemProp(0, "done", false);
		});
		expect(result.current[0][0]).toEqual({ name: "Grace", done: false });
	});

	it("apply maps over every item", () => {
		const { result } = renderHook(() => useListState<number>([1, 2, 3]));

		act(() => {
			result.current[1].apply((item, index) => item + index);
		});
		expect(result.current[0]).toEqual([1, 3, 5]);
	});

	it("applyWhere maps only matching items", () => {
		const { result } = renderHook(() => useListState<number>([1, 2, 3, 4]));

		act(() => {
			result.current[1].applyWhere(
				(item) => item % 2 === 0,
				(item) => item * 10,
			);
		});
		expect(result.current[0]).toEqual([1, 20, 3, 40]);
	});

	it("filter keeps matching items", () => {
		const { result } = renderHook(() => useListState<number>([1, 2, 3, 4]));

		act(() => {
			result.current[1].filter((item) => item > 2);
		});
		expect(result.current[0]).toEqual([3, 4]);
	});

	it("setState accepts raw updater functions", () => {
		const { result } = renderHook(() => useListState<number>([1]));

		act(() => {
			result.current[1].setState((current) => [...current, 2]);
		});
		expect(result.current[0]).toEqual([1, 2]);
	});
});
