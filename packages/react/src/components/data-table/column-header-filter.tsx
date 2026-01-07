/**
 * Column Header Filter Component
 * Inline filter for DataTable columns with funnel icon and multi-select popover
 */

"use client";

import { Filter, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "../badge";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Input } from "../input";
import { Label } from "../label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import type { FilterableColumn, FilterConfig } from "./data-table.types";

interface ColumnHeaderFilterProps<TData> {
	column: FilterableColumn<TData>;
	activeFilters: FilterConfig<TData>[];
	onFilterChange: (filter: FilterConfig<TData>) => void;
	onFilterRemove: (key: keyof TData) => void;
}

export function ColumnHeaderFilter<TData>({
	column,
	activeFilters,
	onFilterChange,
	onFilterRemove,
}: ColumnHeaderFilterProps<TData>) {
	const [open, setOpen] = useState(false);
	const [textValue, setTextValue] = useState("");

	const activeFilter = activeFilters.find((f) => f.key === column.key);
	const filterValue = activeFilter?.value;

	// For multi-select, track selected values
	const selectedValues = filterValue
		? Array.isArray(filterValue)
			? filterValue
			: [filterValue]
		: [];

	const activeCount = selectedValues.length;
	const hasActiveFilter =
		activeCount > 0 || (column.type === "text" && filterValue);

	const handleCheckboxChange = (optionValue: string, checked: boolean) => {
		let newValues: string[];

		if (checked) {
			newValues = [...selectedValues, optionValue];
		} else {
			newValues = selectedValues.filter((v) => v !== optionValue);
		}

		if (newValues.length === 0) {
			onFilterRemove(column.key);
		} else {
			onFilterChange({
				key: column.key,
				operator: "in",
				value: newValues,
			});
		}
	};

	const handleTextApply = () => {
		if (textValue.trim()) {
			onFilterChange({
				key: column.key,
				operator: column.operator || "contains",
				value: textValue.trim(),
			});
			setOpen(false);
		}
	};

	const handleClear = () => {
		onFilterRemove(column.key);
		setTextValue("");
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 p-0 hover:bg-muted relative"
					aria-label={`Filter by ${column.label}`}
				>
					<Filter
						className={`h-4 w-4 ${hasActiveFilter ? "text-primary" : "text-muted-foreground"}`}
					/>
					{hasActiveFilter ? (
						<Badge
							variant="default"
							className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary"
						>
							{activeCount || 1}
						</Badge>
					) : null}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-3" align="start">
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<h4 className="font-medium text-sm text-foreground">
							Filter by {column.label}
						</h4>
						{hasActiveFilter ? (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleClear}
								className="h-7 px-2 text-xs text-muted-foreground"
							>
								<X className="h-3 w-3 mr-1" />
								Clear
							</Button>
						) : null}
					</div>

					{column.type === "select" && column.options ? (
						<div className="space-y-2 max-h-[300px] overflow-y-auto">
							{column.options.map((option) => {
								const isChecked = selectedValues.includes(option.value);
								return (
									<div
										key={option.value}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={`${String(column.key)}-${option.value}`}
											checked={isChecked}
											onCheckedChange={(checked) =>
												handleCheckboxChange(option.value, checked === true)
											}
										/>
										<Label
											htmlFor={`${String(column.key)}-${option.value}`}
											className="text-sm font-normal cursor-pointer flex-1 text-foreground"
										>
											{option.label}
										</Label>
									</div>
								);
							})}
						</div>
					) : (
						<div className="space-y-2">
							<Input
								type="text"
								placeholder={column.placeholder || `Filter by ${column.label}`}
								value={textValue}
								onChange={(e) => setTextValue(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleTextApply();
									}
								}}
								className="h-9"
							/>
							<Button onClick={handleTextApply} className="w-full" size="sm">
								Apply
							</Button>
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
