/**
 * ColumnFilters Component
 * Renders filter controls for filterable columns in DataTable
 */

"use client";

import { X } from "lucide-react";

import { Button } from "../button";
import { Input } from "../input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../select";
import type { FilterableColumn, FilterConfig } from "./data-table.types";

interface ColumnFiltersProps<TData> {
	filterableColumns: FilterableColumn<TData>[];
	activeFilters: FilterConfig<TData>[];
	onFilterChange: (filter: FilterConfig<TData>) => void;
	onFilterRemove: (key: keyof TData) => void;
	onClearAll: () => void;
}

export function ColumnFilters<TData>({
	filterableColumns,
	activeFilters,
	onFilterChange,
	onFilterRemove,
	onClearAll,
}: ColumnFiltersProps<TData>) {
	if (filterableColumns.length === 0) {
		return null;
	}

	const hasActiveFilters = activeFilters.length > 0;

	return (
		<div className="flex flex-wrap items-center gap-2">
			{filterableColumns.map((column) => {
				const activeFilter = activeFilters.find((f) => f.key === column.key);
				const filterValue = activeFilter?.value;

				if (column.type === "select" && column.options) {
					return (
						<div key={String(column.key)} className="flex items-center gap-2">
							<span className="text-sm font-medium text-foreground">
								{column.label}:
							</span>
							<Select
								{...(filterValue ? { value: String(filterValue) } : {})}
								onValueChange={(value) => {
									if (value === "__clear__") {
										onFilterRemove(column.key);
									} else {
										onFilterChange({
											key: column.key,
											operator: column.operator || "equals",
											value,
										});
									}
								}}
							>
								<SelectTrigger className="w-[180px] h-9">
									<SelectValue placeholder={`All ${column.label}`} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__clear__">All {column.label}</SelectItem>
									{column.options.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					);
				}

				if (column.type === "text") {
					return (
						<div key={String(column.key)} className="flex items-center gap-2">
							<span className="text-sm font-medium text-foreground">
								{column.label}:
							</span>
							<div className="relative">
								<Input
									type="text"
									placeholder={
										column.placeholder || `Filter by ${column.label}`
									}
									value={filterValue ? String(filterValue) : ""}
									onChange={(e) => {
										const value = e.target.value;
										if (value) {
											onFilterChange({
												key: column.key,
												operator: column.operator || "contains",
												value,
											});
										} else {
											onFilterRemove(column.key);
										}
									}}
									className="w-[200px] h-9 pr-8"
								/>
								{filterValue ? (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => onFilterRemove(column.key)}
										className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
										aria-label={`Clear ${String(column.label)} filter`}
									>
										<X className="h-3 w-3" />
									</Button>
								) : null}
							</div>
						</div>
					);
				}

				return null;
			})}

			{hasActiveFilters && (
				<Button
					variant="ghost"
					size="sm"
					onClick={onClearAll}
					className="h-9 text-muted-foreground hover:text-foreground"
				>
					<X className="h-4 w-4 mr-1.5" />
					Clear filters
				</Button>
			)}
		</div>
	);
}
