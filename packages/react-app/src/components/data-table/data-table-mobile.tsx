/**
 * DataTableMobileList — card and stack layouts for DataTable below the mobile
 * breakpoint. Cards collapse marked columns into title/badge/meta lines; every
 * unmarked column stays visible as a stacked label-value row.
 */

"use client";

import { Badge } from "@kala-ui/react/badge";
import { Box } from "@kala-ui/react/box";
import { Checkbox } from "@kala-ui/react/checkbox";
import { Flex } from "@kala-ui/react/flex";
import { cn } from "@kala-ui/react/lib/utils";
import { Stack } from "@kala-ui/react/stack";
import { Text } from "@kala-ui/react/text";
import { Fragment, type HTMLAttributes, type ReactNode } from "react";
import type { ColumnDef, SelectionConfig } from "./data-table.types";

interface DataTableMobileListProps<TData> {
	displayData: TData[];
	columns: ColumnDef<TData>[];
	mode: "cards" | "stack";
	selection?: SelectionConfig<TData>;
	selectedIds: Set<string>;
	onSelectRow: (row: TData) => void;
	onRowClick?: (row: TData) => void;
	getRowClassName?: (row: TData) => string;
	getRowAttributes?: (row: TData) => HTMLAttributes<HTMLTableRowElement>;
	ariaLabel?: string;
}

function plainText<TData>(column: ColumnDef<TData>, row: TData): string | null {
	if (column.cell) return null;
	const value = column.accessorKey ? row[column.accessorKey] : undefined;
	if (value === null || value === undefined || value === "") return null;
	return String(value);
}

function cellContent<TData>(column: ColumnDef<TData>, row: TData): ReactNode {
	return plainText(column, row) ?? column.cell?.(row) ?? "—";
}

interface ResolvedMobileColumns<TData> {
	title: ColumnDef<TData> | undefined;
	badges: ColumnDef<TData>[];
	metas: ColumnDef<TData>[];
	stacked: ColumnDef<TData>[];
}

function resolveMobileColumns<TData>(
	columns: ColumnDef<TData>[],
	mode: "cards" | "stack",
): ResolvedMobileColumns<TData> {
	if (columns.length === 0) {
		return { title: undefined, badges: [], metas: [], stacked: [] };
	}
	const visible = columns.filter((column) => column.mobile !== "hidden");
	const pool = visible.length > 0 ? visible : [columns[0]];
	const markedTitles = pool.filter((column) => column.mobile === "title");
	const title = markedTitles[0] ?? pool[0];
	const rest = pool.filter((column) => column !== title);
	if (mode === "stack") {
		return { title, badges: [], metas: [], stacked: rest };
	}
	return {
		title,
		badges: rest.filter((column) => column.mobile === "badge"),
		metas: rest.filter((column) => column.mobile === "meta"),
		stacked: rest.filter(
			(column) => column.mobile !== "badge" && column.mobile !== "meta",
		),
	};
}

function isRenderedNode(node: ReactNode): boolean {
	return node !== null && node !== undefined && node !== "" && node !== false;
}

function badgeNodes<TData>(
	columns: ColumnDef<TData>[],
	row: TData,
): ReactNode[] {
	const nodes: ReactNode[] = [];
	for (const column of columns) {
		if (column.cell) {
			const output = column.cell(row);
			if (isRenderedNode(output)) {
				nodes.push(<Fragment key={column.id}>{output}</Fragment>);
			}
			continue;
		}
		const plain = plainText(column, row);
		if (plain !== null) nodes.push(<Badge key={column.id}>{plain}</Badge>);
	}
	return nodes;
}

function metaNodes<TData>(
	columns: ColumnDef<TData>[],
	row: TData,
): ReactNode[] {
	const nodes: ReactNode[] = [];
	for (const column of columns) {
		if (column.cell) {
			const output = column.cell(row);
			if (isRenderedNode(output)) {
				nodes.push(<Fragment key={column.id}>{output}</Fragment>);
			}
			continue;
		}
		const plain = plainText(column, row);
		if (plain !== null) {
			nodes.push(<Fragment key={column.id}>{plain}</Fragment>);
		}
	}
	return nodes;
}

export function DataTableMobileList<TData>({
	displayData,
	columns,
	mode,
	selection,
	selectedIds,
	onSelectRow,
	onRowClick,
	getRowClassName,
	getRowAttributes,
	ariaLabel,
}: DataTableMobileListProps<TData>) {
	const { title, badges, metas, stacked } = resolveMobileColumns(columns, mode);

	const renderRow = (row: TData, rowIndex: number) => {
		const rowId = selection?.getRowId(row);
		const isSelected = rowId ? selectedIds.has(rowId) : false;
		const isSelectable =
			!selection?.isRowSelectable || selection.isRowSelectable(row);
		const isClickable = !!onRowClick;
		const titleText = title ? plainText(title, row) : null;
		const rowBadges = mode === "cards" ? badgeNodes(badges, row) : [];
		const rowMetas = metaNodes(metas, row);
		const hasHeaderRow = mode === "cards" && (!!title || rowBadges.length > 0);

		return (
			<Box
				key={rowId ?? rowIndex}
				role="listitem"
				{...getRowAttributes?.(row)}
				data-state={isSelected ? "selected" : undefined}
				onClick={() => isClickable && onRowClick(row)}
				onKeyDown={(event) => {
					if (event.target !== event.currentTarget) return;
					if (isClickable && (event.key === "Enter" || event.key === " ")) {
						event.preventDefault();
						onRowClick(row);
					}
				}}
				tabIndex={isClickable ? 0 : undefined}
				aria-label={
					title && titleText !== null
						? `${title.header}: ${titleText}`
						: undefined
				}
				className={cn(
					"min-h-11 px-4 py-3 border-b last:border-b-0",
					isSelected && "bg-accent/50",
					isClickable &&
						"cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
					getRowClassName?.(row),
				)}
			>
				<Flex gap={3}>
					{selection?.enabled ? (
						<Checkbox
							checked={isSelected}
							disabled={!isSelectable}
							aria-label={`Select row ${rowIndex + 1}`}
							onCheckedChange={() => {
								if (isSelectable) onSelectRow(row);
							}}
							onClick={(event) => event.stopPropagation()}
							className="mt-0.5"
						/>
					) : null}
					<Stack gap={1} className="min-w-0 flex-1">
						{mode === "stack" && title ? (
							<Text weight="medium" className="break-words leading-snug">
								{cellContent(title, row)}
							</Text>
						) : null}
						{hasHeaderRow ? (
							<Flex align="start" gap={2} wrap="wrap" className="min-w-0">
								{title ? (
									<Text
										weight="medium"
										className="min-w-0 flex-1 break-words leading-snug"
									>
										{cellContent(title, row)}
									</Text>
								) : null}
								{rowBadges.length > 0 ? (
									<Flex gap={2} wrap="wrap" className="min-w-0 shrink-0">
										{rowBadges}
									</Flex>
								) : null}
							</Flex>
						) : null}
						{rowMetas.length > 0 ? (
							<Text size="sm" className="text-muted-foreground break-words">
								{rowMetas.map((node, index) => (
									<Fragment key={index}>
										{index > 0 ? " · " : null}
										{node}
									</Fragment>
								))}
							</Text>
						) : null}
						{stacked.map((column) => (
							<Flex key={column.id} justify="between" gap={4}>
								<Text
									size="sm"
									className="text-muted-foreground min-w-0 max-w-[60%] break-words"
								>
									{column.header}
								</Text>
								<Text
									size="sm"
									className="min-w-0 flex-1 text-right break-words"
								>
									{cellContent(column, row)}
								</Text>
							</Flex>
						))}
					</Stack>
				</Flex>
			</Box>
		);
	};

	return (
		<Box
			role="list"
			data-kala-component="data-table-mobile"
			aria-label={ariaLabel}
			className="w-full text-sm"
		>
			{displayData.map(renderRow)}
		</Box>
	);
}
