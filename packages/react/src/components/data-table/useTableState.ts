/**
 * useTableState Hook
 * Manages table state including sorting, filtering, pagination, and search
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
	ColumnDef,
	FilterConfig,
	SearchConfig,
	SortConfig,
	TableState,
} from "./data-table.types";

interface UseTableStateOptions<TData> {
	data: TData[];
	columns: ColumnDef<TData>[];
	defaultSort?: SortConfig<TData>;
	defaultFilters?: FilterConfig<TData>[];
	searchConfig?: SearchConfig<TData> | boolean;
	pageSize?: number;
	total?: number;
	/** Callback when sort changes */
	onSortChange?: (sort: SortConfig<TData> | null) => void;
	/** Callback when filters change */
	onFilterChange?: (filters: FilterConfig<TData>[]) => void;
	/** Callback when search query changes */
	onSearchChange?: (query: string) => void;
	/** Callback when pagination changes */
	onPaginationChange?: (page: number, pageSize: number) => void;
}

/**
 * Hook to manage table state (sorting, filtering, search, pagination)
 */
export function useTableState<TData>({
	data,
	columns,
	defaultSort,
	defaultFilters = [],
	searchConfig,
	pageSize: initialPageSize = 10,
	total: manualTotal,
	onSortChange,
	onFilterChange,
	onSearchChange,
	onPaginationChange,
}: UseTableStateOptions<TData>): TableState<TData> {
	// State
	const [sortConfig, setSortConfig] = useState<SortConfig<TData> | null>(
		defaultSort ?? null,
	);
	const [filterConfigs, setFilterConfigs] =
		useState<FilterConfig<TData>[]>(defaultFilters);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);

	// Sync pageSize when initialPageSize changes (e.g. data loads and pagination is false)
	useEffect(() => {
		setPageSize(initialPageSize);
	}, [initialPageSize]);

	// Get search keys
	const searchKeys = useMemo(() => {
		if (!searchConfig) return [];
		const defaultKeys = columns
			.filter((col) => col.accessorKey)
			.map((col) => col.accessorKey as keyof TData);
		if (typeof searchConfig === "boolean") {
			return defaultKeys;
		}
		return searchConfig.searchKeys ?? defaultKeys;
	}, [searchConfig, columns]);

	// Filter data based on search query
	// When onSearchChange is provided, data is already server-filtered — skip client-side filtering
	const searchedData = useMemo(() => {
		if (onSearchChange) return data;
		if (!searchQuery.trim() || searchKeys.length === 0) return data;

		const query = searchQuery.toLowerCase();
		return data.filter((row) => {
			return searchKeys.some((key) => {
				const value = row[key];
				if (value === null || value === undefined) return false;
				return String(value).toLowerCase().includes(query);
			});
		});
	}, [data, searchQuery, searchKeys, onSearchChange]);

	// Apply filters
	const filteredData = useMemo(() => {
		if (filterConfigs.length === 0) return searchedData;

		return searchedData.filter((row) => {
			return filterConfigs.every((filter) => {
				const value = row[filter.key];
				const filterValue = filter.value;

				switch (filter.operator) {
					case "equals":
						return value === filterValue;
					case "contains":
						return String(value)
							.toLowerCase()
							.includes(String(filterValue).toLowerCase());
					case "startsWith":
						return String(value)
							.toLowerCase()
							.startsWith(String(filterValue).toLowerCase());
					case "endsWith":
						return String(value)
							.toLowerCase()
							.endsWith(String(filterValue).toLowerCase());
					case "in":
						return Array.isArray(filterValue) && filterValue.includes(value);
					default:
						return true;
				}
			});
		});
	}, [searchedData, filterConfigs]);

	// Apply sorting
	const sortedData = useMemo(() => {
		if (!sortConfig) return filteredData;

		const { key, direction } = sortConfig;
		const column = columns.find((col) => col.accessorKey === key);

		return [...filteredData].sort((a, b) => {
			// Use custom sort function if provided
			if (column?.sortFn) {
				return column.sortFn(a, b, direction);
			}

			// Default sort
			const aValue = a[key];
			const bValue = b[key];

			if (aValue === bValue) return 0;
			if (aValue === null || aValue === undefined) return 1;
			if (bValue === null || bValue === undefined) return -1;

			// Handle different types
			if (typeof aValue === "string" && typeof bValue === "string") {
				const result = aValue.localeCompare(bValue);
				return direction === "asc" ? result : -result;
			}

			if (typeof aValue === "number" && typeof bValue === "number") {
				return direction === "asc" ? aValue - bValue : bValue - aValue;
			}

			if (aValue instanceof Date && bValue instanceof Date) {
				return direction === "asc"
					? aValue.getTime() - bValue.getTime()
					: bValue.getTime() - aValue.getTime();
			}

			// Fallback to string comparison
			const result = String(aValue).localeCompare(String(bValue));
			return direction === "asc" ? result : -result;
		});
	}, [filteredData, sortConfig, columns]);

	// Pagination
	const totalPages = Math.ceil((manualTotal ?? sortedData.length) / pageSize);
	const hasNextPage = currentPage < totalPages;
	const hasPreviousPage = currentPage > 1;

	const pageData = useMemo(() => {
		// If manualTotal AND onPaginationChange are provided, assume server-side pagination
		// Otherwise, do client-side pagination
		if (manualTotal !== undefined && onPaginationChange !== undefined) {
			return sortedData;
		}
		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		return sortedData.slice(startIndex, endIndex);
	}, [sortedData, currentPage, pageSize, manualTotal, onPaginationChange]);

	// Toggle sort
	const toggleSort = useCallback(
		(key: keyof TData) => {
			setSortConfig((prev) => {
				let newSort: SortConfig<TData> | null;
				if (!prev || prev.key !== key) {
					newSort = { key, direction: "asc" };
				} else if (prev.direction === "asc") {
					newSort = { key, direction: "desc" };
				} else {
					newSort = null; // Clear sort
				}
				return newSort;
			});
			setCurrentPage(1); // Reset to first page when sorting changes
		},
		[],
	);

	// Notify parent of sort changes after render (avoids setState-during-render)
	const prevSortRef = useRef<SortConfig<TData> | null>(defaultSort ?? null);
	useEffect(() => {
		if (sortConfig !== prevSortRef.current) {
			prevSortRef.current = sortConfig;
			onSortChange?.(sortConfig);
		}
	});

	// Filter management
	const setFilter = useCallback(
		(filter: FilterConfig<TData>) => {
			setFilterConfigs((prev) => {
				const filtered = prev.filter((f) => f.key !== filter.key);
				const newFilters = [...filtered, filter];
				onFilterChange?.(newFilters);
				return newFilters;
			});
			setCurrentPage(1); // Reset to first page when filter changes
		},
		[onFilterChange],
	);

	const removeFilter = useCallback(
		(key: keyof TData) => {
			setFilterConfigs((prev) => {
				const newFilters = prev.filter((f) => f.key !== key);
				onFilterChange?.(newFilters);
				return newFilters;
			});
			setCurrentPage(1);
		},
		[onFilterChange],
	);

	const clearFilters = useCallback(() => {
		setFilterConfigs([]);
		onFilterChange?.([]);
		setCurrentPage(1);
	}, [onFilterChange]);

	// Extract debounce ms from searchConfig
	const debounceMs = useMemo(() => {
		if (!searchConfig || typeof searchConfig === "boolean") return 0;
		return searchConfig.debounce ?? 0;
	}, [searchConfig]);

	const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Search management
	const handleSetSearchQuery = useCallback(
		(query: string) => {
			setSearchQuery(query);
			if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
			if (debounceMs > 0) {
				searchDebounceRef.current = setTimeout(() => {
					setCurrentPage(1);
					onSearchChange?.(query);
				}, debounceMs);
			} else {
				setCurrentPage(1);
				onSearchChange?.(query);
			}
		},
		[onSearchChange, debounceMs],
	);

	// Set current page and notify server-side listener
	const handleSetCurrentPage = useCallback(
		(pageOrUpdater: number | ((prev: number) => number)) => {
			setCurrentPage((prev) => {
				const newPage =
					typeof pageOrUpdater === "function"
						? pageOrUpdater(prev)
						: pageOrUpdater;
				onPaginationChange?.(newPage, pageSize);
				return newPage;
			});
		},
		[onPaginationChange, pageSize],
	);

	// Pagination navigation
	const nextPage = useCallback(() => {
		if (hasNextPage) {
			handleSetCurrentPage((prev: number) => prev + 1);
		}
	}, [hasNextPage, handleSetCurrentPage]);

	const previousPage = useCallback(() => {
		if (hasPreviousPage) {
			handleSetCurrentPage((prev: number) => prev - 1);
		}
	}, [hasPreviousPage, handleSetCurrentPage]);

	// Page size change
	const handleSetPageSize = useCallback(
		(size: number) => {
			setPageSize(size);
			setCurrentPage(1); // Reset to first page when page size changes
			onPaginationChange?.(1, size);
		},
		[onPaginationChange],
	);

	return {
		processedData: sortedData,
		pageData,
		sortConfig,
		setSortConfig,
		toggleSort,
		filterConfigs,
		setFilter,
		removeFilter,
		clearFilters,
		searchQuery,
		setSearchQuery: handleSetSearchQuery,
		currentPage,
		setCurrentPage: handleSetCurrentPage,
		pageSize,
		setPageSize: handleSetPageSize,
		totalPages,
		hasNextPage,
		hasPreviousPage,
		nextPage,
		previousPage,
	};
}
