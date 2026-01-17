/**
 * Column Header Filter Component
 * Inline filter for DataTable columns with funnel icon and multi-select popover
 */

"use client";

import { Filter, X } from "lucide-react";
import * as React from "react";

import { useDisclosure } from "@kala-ui/react-hooks";
import { Badge } from "../badge";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Flex } from "../flex";
import { Heading } from "../heading";
import { Input } from "../input";
import { Label } from "../label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Stack } from "../stack";
import { Text } from "../text";
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
	const [open, { set: setOpen }] = useDisclosure(false);
	const [textValue, setTextValue] = React.useState("");

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
							className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
						>
							<Text size="xs" weight="bold" className="text-primary-foreground">
								{column.type === "text" ? "1" : activeCount}
							</Text>
						</Badge>
					) : null}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-3" align="start">
				<Stack gap={3}>
					<Flex align="center" justify="between">
						<Heading size="h6" weight="medium" className="text-sm">
							Filter by {column.label}
						</Heading>
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
					</Flex>

					{column.type === "select" && column.options ? (
						<Stack gap={2} className="max-h-[300px] overflow-y-auto">
							{column.options.map((option) => {
								const isChecked = selectedValues.includes(option.value);
								return (
									<Flex
										key={option.value}
										align="center"
										gap={2}
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
									</Flex>
								);
							})}
						</Stack>
					) : (
						<Stack gap={2}>
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
						</Stack>
					)}
				</Stack>
			</PopoverContent>
		</Popover>
	);
}
