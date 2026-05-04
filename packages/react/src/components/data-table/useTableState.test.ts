import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useTableState } from "./useTableState";
import type { ColumnDef, FilterConfig, SortConfig } from "./data-table.types";

interface TestRow {
	id: string;
	name: string;
	age: number;
	status: string;
}

const columns: ColumnDef<TestRow>[] = [
	{ id: "name", header: "Name", accessorKey: "name" },
	{ id: "age", header: "Age", accessorKey: "age" },
	{ id: "status", header: "Status", accessorKey: "status" },
];

const data: TestRow[] = [
	{ id: "1", name: "Alice", age: 30, status: "active" },
	{ id: "2", name: "Bob", age: 25, status: "inactive" },
	{ id: "3", name: "Charlie", age: 35, status: "active" },
	{ id: "4", name: "Diana", age: 28, status: "pending" },
	{ id: "5", name: "Eve", age: 40, status: "active" },
];

describe("useTableState", () => {
	describe("initial state", () => {
		it("returns correct initial state", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			expect(result.current.sortConfig).toBeNull();
			expect(result.current.searchQuery).toBe("");
			expect(result.current.currentPage).toBe(1);
			expect(result.current.pageSize).toBe(10);
			expect(result.current.filterConfigs).toEqual([]);
			expect(result.current.totalPages).toBe(1);
			expect(result.current.hasNextPage).toBe(false);
			expect(result.current.hasPreviousPage).toBe(false);
		});

		it("initializes with defaultSort", () => {
			const defaultSort: SortConfig<TestRow> = { key: "name", direction: "asc" };
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10, defaultSort }),
			);
			expect(result.current.sortConfig).toEqual(defaultSort);
			expect(result.current.processedData[0].name).toBe("Alice");
		});

		it("initializes with defaultFilters", () => {
			const defaultFilters: FilterConfig<TestRow>[] = [
				{ key: "status", operator: "equals", value: "active" },
			];
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10, defaultFilters }),
			);
			expect(result.current.filterConfigs).toEqual(defaultFilters);
			expect(result.current.processedData).toHaveLength(3);
		});
	});

	describe("sorting", () => {
		it("sorts ascending on first toggle", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.toggleSort("age");
			});
			expect(result.current.sortConfig).toEqual({
				key: "age",
				direction: "asc",
			});
			expect(result.current.processedData[0].age).toBe(25);
		});

		it("sorts descending on second toggle", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.toggleSort("age");
			});
			act(() => {
				result.current.toggleSort("age");
			});
			expect(result.current.sortConfig).toEqual({
				key: "age",
				direction: "desc",
			});
			expect(result.current.processedData[0].age).toBe(40);
		});

		it("clears sort on third toggle", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.toggleSort("name");
			});
			act(() => {
				result.current.toggleSort("name");
			});
			act(() => {
				result.current.toggleSort("name");
			});
			expect(result.current.sortConfig).toBeNull();
		});

		it("resets to page 1 when sorting changes", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 2 }),
			);
			act(() => {
				result.current.setCurrentPage(3);
			});
			act(() => {
				result.current.toggleSort("name");
			});
			expect(result.current.currentPage).toBe(1);
		});

		it("calls onSortChange callback", () => {
			const onSortChange = vi.fn();
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10, onSortChange }),
			);
			act(() => {
				result.current.toggleSort("name");
			});
			expect(onSortChange).toHaveBeenCalledWith({
				key: "name",
				direction: "asc",
			});
		});

		it("uses custom sortFn when provided", () => {
			const customColumns: ColumnDef<TestRow>[] = [
				{
					id: "name",
					header: "Name",
					accessorKey: "name",
					sortFn: (a, b) => b.name.localeCompare(a.name),
				},
			];
			const { result } = renderHook(() =>
				useTableState({ data, columns: customColumns, pageSize: 10 }),
			);
			act(() => {
				result.current.toggleSort("name");
			});
			// Custom sortFn always sorts descending regardless of direction
			expect(result.current.processedData[0].name).toBe("Eve");
		});

		it("handles null/undefined values in sorting", () => {
			const dataWithNulls: TestRow[] = [
				{ id: "1", name: "Alice", age: 30, status: "active" },
				{ id: "2", name: null as unknown as string, age: 25, status: "inactive" },
				{ id: "3", name: "Charlie", age: undefined as unknown as number, status: "active" },
			];
			const { result } = renderHook(() =>
				useTableState({ data: dataWithNulls, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.toggleSort("name");
			});
			// Should not crash
			expect(result.current.processedData).toHaveLength(3);
		});
	});

	describe("filtering", () => {
		it("applies equals filter", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.setFilter({
					key: "status",
					operator: "equals",
					value: "active",
				});
			});
			expect(result.current.processedData).toHaveLength(3);
			expect(result.current.processedData.every((r) => r.status === "active")).toBe(true);
		});

		it("applies contains filter", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.setFilter({
					key: "name",
					operator: "contains",
					value: "li",
				});
			});
			expect(result.current.processedData).toHaveLength(2);
		});

		it("applies startsWith filter", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.setFilter({
					key: "name",
					operator: "startsWith",
					value: "A",
				});
			});
			expect(result.current.processedData).toHaveLength(1);
			expect(result.current.processedData[0].name).toBe("Alice");
		});

		it("applies endsWith filter", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.setFilter({
					key: "name",
					operator: "endsWith",
					value: "e",
				});
			});
			// "Alice", "Charlie", "Eve" all end with "e"
			expect(result.current.processedData).toHaveLength(3);
		});

		it("applies in filter with array values", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.setFilter({
					key: "status",
					operator: "in",
					value: ["active", "pending"],
				});
			});
			expect(result.current.processedData).toHaveLength(4);
		});

		it("replaces existing filter for same key", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.setFilter({
					key: "status",
					operator: "equals",
					value: "active",
				});
			});
			act(() => {
				result.current.setFilter({
					key: "status",
					operator: "equals",
					value: "inactive",
				});
			});
			expect(result.current.filterConfigs).toHaveLength(1);
			expect(result.current.processedData).toHaveLength(1);
		});

		it("removes filter by key", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.setFilter({
					key: "status",
					operator: "equals",
					value: "active",
				});
			});
			act(() => {
				result.current.removeFilter("status");
			});
			expect(result.current.filterConfigs).toHaveLength(0);
			expect(result.current.processedData).toHaveLength(5);
		});

		it("clears all filters", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.setFilter({
					key: "status",
					operator: "equals",
					value: "active",
				});
			});
			act(() => {
				result.current.setFilter({
					key: "name",
					operator: "contains",
					value: "a",
				});
			});
			act(() => {
				result.current.clearFilters();
			});
			expect(result.current.filterConfigs).toHaveLength(0);
			expect(result.current.processedData).toHaveLength(5);
		});

		it("resets to page 1 when filter changes", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 2 }),
			);
			act(() => {
				result.current.setCurrentPage(3);
			});
			act(() => {
				result.current.setFilter({
					key: "status",
					operator: "equals",
					value: "active",
				});
			});
			expect(result.current.currentPage).toBe(1);
		});

		it("calls onFilterChange callback", () => {
			const onFilterChange = vi.fn();
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10, onFilterChange }),
			);
			act(() => {
				result.current.setFilter({
					key: "status",
					operator: "equals",
					value: "active",
				});
			});
			expect(onFilterChange).toHaveBeenCalled();
		});
	});

	describe("search", () => {
		it("searches across all string columns by default", () => {
			const { result } = renderHook(() =>
				useTableState({
					data,
					columns,
					pageSize: 10,
					searchConfig: true,
				}),
			);
			act(() => {
				result.current.setSearchQuery("Alice");
			});
			expect(result.current.processedData).toHaveLength(1);
		});

		it("uses searchKeys from searchConfig when provided", () => {
			const { result } = renderHook(() =>
				useTableState({
					data,
					columns,
					pageSize: 10,
					searchConfig: {
						searchKeys: ["status"],
						placeholder: "Search",
						ariaLabel: "Search",
					},
				}),
			);
			act(() => {
				result.current.setSearchQuery("active");
			});
			// "active" matches "active" and "inactive"
			expect(result.current.processedData).toHaveLength(4);
		});

		it("does not search when onSearchChange is provided (server-side)", () => {
			const onSearchChange = vi.fn();
			const { result } = renderHook(() =>
				useTableState({
					data,
					columns,
					pageSize: 10,
					searchConfig: {
						placeholder: "Search",
						ariaLabel: "Search",
					},
					onSearchChange,
				}),
			);
			act(() => {
				result.current.setSearchQuery("Alice");
			});
			// Server-side: all data returned since client-side filtering is skipped
			expect(result.current.processedData).toHaveLength(5);
			expect(onSearchChange).toHaveBeenCalledWith("Alice");
		});

		it("resets to page 1 when search changes", () => {
			const { result } = renderHook(() =>
				useTableState({
					data,
					columns,
					pageSize: 2,
					searchConfig: true,
				}),
			);
			act(() => {
				result.current.setCurrentPage(3);
			});
			act(() => {
				result.current.setSearchQuery("test");
			});
			expect(result.current.currentPage).toBe(1);
		});

		it("handles empty search query", () => {
			const { result } = renderHook(() =>
				useTableState({
					data,
					columns,
					pageSize: 10,
					searchConfig: true,
				}),
			);
			act(() => {
				result.current.setSearchQuery("");
			});
			expect(result.current.processedData).toHaveLength(5);
		});

		it("debounces search when debounce is configured", async () => {
			vi.useFakeTimers();
			const onSearchChange = vi.fn();
			const { result } = renderHook(() =>
				useTableState({
					data,
					columns,
					pageSize: 10,
					searchConfig: {
						debounce: 300,
						placeholder: "Search",
						ariaLabel: "Search",
					},
					onSearchChange,
				}),
			);
			act(() => {
				result.current.setSearchQuery("test");
			});
			expect(onSearchChange).not.toHaveBeenCalled();
			act(() => {
				vi.advanceTimersByTime(300);
			});
			expect(onSearchChange).toHaveBeenCalledWith("test");
			vi.useRealTimers();
		});
	});

	describe("pagination", () => {
		it("paginates data correctly", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 2 }),
			);
			expect(result.current.pageData).toHaveLength(2);
			expect(result.current.totalPages).toBe(3);
		});

		it("navigates to next page", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 2 }),
			);
			act(() => {
				result.current.nextPage();
			});
			expect(result.current.currentPage).toBe(2);
		});

		it("navigates to previous page", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 2 }),
			);
			act(() => {
				result.current.setCurrentPage(3);
			});
			act(() => {
				result.current.previousPage();
			});
			expect(result.current.currentPage).toBe(2);
		});

		it("does not navigate past last page", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 2 }),
			);
			act(() => {
				result.current.setCurrentPage(3);
			});
			act(() => {
				result.current.nextPage();
			});
			expect(result.current.currentPage).toBe(3);
		});

		it("does not navigate before first page", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 2 }),
			);
			act(() => {
				result.current.previousPage();
			});
			expect(result.current.currentPage).toBe(1);
		});

		it("sets current page directly", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 2 }),
			);
			act(() => {
				result.current.setCurrentPage(2);
			});
			expect(result.current.currentPage).toBe(2);
		});

		it("sets page size and resets to page 1", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.setCurrentPage(2);
			});
			act(() => {
				result.current.setPageSize(2);
			});
			expect(result.current.pageSize).toBe(2);
			expect(result.current.currentPage).toBe(1);
			expect(result.current.totalPages).toBe(3);
		});

		it("calls onPaginationChange when page changes", () => {
			const onPaginationChange = vi.fn();
			const { result } = renderHook(() =>
				useTableState({
					data,
					columns,
					pageSize: 2,
					onPaginationChange,
				}),
			);
			act(() => {
				result.current.setCurrentPage(2);
			});
			expect(onPaginationChange).toHaveBeenCalledWith(2, 2);
		});

		it("calls onPaginationChange when page size changes", () => {
			const onPaginationChange = vi.fn();
			const { result } = renderHook(() =>
				useTableState({
					data,
					columns,
					pageSize: 10,
					onPaginationChange,
				}),
			);
			act(() => {
				result.current.setPageSize(5);
			});
			expect(onPaginationChange).toHaveBeenCalledWith(1, 5);
		});

		it("uses manualTotal for server-side pagination", () => {
			const { result } = renderHook(() =>
				useTableState({
					data: data.slice(0, 2),
					columns,
					pageSize: 2,
					total: 100,
					onPaginationChange: vi.fn(),
				}),
			);
			expect(result.current.totalPages).toBe(50);
			expect(result.current.hasNextPage).toBe(true);
		});

		it("returns all data when server-side pagination (manualTotal + onPaginationChange)", () => {
			const { result } = renderHook(() =>
				useTableState({
					data: data.slice(0, 2),
					columns,
					pageSize: 2,
					total: 100,
					onPaginationChange: vi.fn(),
				}),
			);
			// Server-side: pageData should return all data (not sliced)
			expect(result.current.pageData).toHaveLength(2);
		});

		it("computes hasNextPage and hasPreviousPage correctly", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 2 }),
			);
			expect(result.current.hasPreviousPage).toBe(false);
			expect(result.current.hasNextPage).toBe(true);
			act(() => {
				result.current.setCurrentPage(3);
			});
			expect(result.current.hasPreviousPage).toBe(true);
			expect(result.current.hasNextPage).toBe(false);
		});

		it("syncs pageSize when initialPageSize changes", () => {
			const { rerender, result } = renderHook(
				({ ps }) => useTableState({ data, columns, pageSize: ps }),
				{ initialProps: { ps: 10 } },
			);
			expect(result.current.pageSize).toBe(10);
			rerender({ ps: 5 });
			expect(result.current.pageSize).toBe(5);
		});
	});

	describe("combined operations", () => {
		it("sorts filtered data", () => {
			const { result } = renderHook(() =>
				useTableState({ data, columns, pageSize: 10 }),
			);
			act(() => {
				result.current.setFilter({
					key: "status",
					operator: "equals",
					value: "active",
				});
			});
			act(() => {
				result.current.toggleSort("name");
			});
			expect(result.current.processedData).toHaveLength(3);
			expect(result.current.processedData[0].name).toBe("Alice");
		});

		it("searches within filtered data", () => {
			const { result } = renderHook(() =>
				useTableState({
					data,
					columns,
					pageSize: 10,
					searchConfig: true,
				}),
			);
			act(() => {
				result.current.setFilter({
					key: "status",
					operator: "equals",
					value: "active",
				});
			});
			act(() => {
				result.current.setSearchQuery("Alice");
			});
			expect(result.current.processedData).toHaveLength(1);
		});

		it("paginates sorted and filtered data", () => {
			const largeData = Array.from({ length: 20 }, (_, i) => ({
				id: String(i),
				name: `Name ${i}`,
				age: 20 + i,
				status: i % 2 === 0 ? "active" : "inactive",
			}));
			const { result } = renderHook(() =>
				useTableState({ data: largeData, columns, pageSize: 3 }),
			);
			act(() => {
				result.current.setFilter({
					key: "status",
					operator: "equals",
					value: "active",
				});
			});
			expect(result.current.totalPages).toBe(Math.ceil(10 / 3));
			expect(result.current.pageData).toHaveLength(3);
		});
	});
});
