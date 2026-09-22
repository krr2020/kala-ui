/**
 * DataTable: read-only mobile table — header row plus pressable rows in
 * a FlatList. Sorting/filters/pagination stay web-only; a phone table
 * is a list with columns, not a spreadsheet.
 */
import type { ReactElement } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import {
	cellStyle,
	cellTextStyle,
	emptyTextStyle,
	headerCellStyle,
	headerRowStyle,
	rootStyle,
	rowStyle,
} from "./data-table.styles";
import type { DataTableColumn, DataTableProps } from "./data-table.types";
import { DataTableSkeleton } from "./data-table-skeleton";

export function DataTable<T>({
	columns,
	rows,
	rowKey,
	onRowPress,
	emptyMessage = "No rows",
	isLoading = false,
	style,
	styles,
	testID = "k-data-table",
}: DataTableProps<T>): ReactElement {
	const { theme } = useUnistyles();

	if (isLoading) {
		return <DataTableSkeleton style={style} styles={styles} testID={testID} />;
	}

	const rowId = (row: T, index: number): string => {
		const raw = rowKey ? row[rowKey] : undefined;
		return raw === undefined || raw === null || raw === ""
			? String(index)
			: String(raw);
	};

	const cellText = (column: DataTableColumn<T>, row: T): string => {
		const value = row[column.key];
		return value === undefined || value === null ? "" : String(value);
	};

	return (
		<View testID={testID} style={[rootStyle(theme), style, styles?.root]}>
			<View style={headerRowStyle(theme)}>
				{columns.map((column) => (
					<Text
						key={String(column.key)}
						testID={`k-data-table-header-${String(column.key)}`}
						numberOfLines={1}
						style={headerCellStyle(theme)}
					>
						{column.header}
					</Text>
				))}
			</View>
			{rows.length === 0 ? (
				<Text style={emptyTextStyle(theme)}>{emptyMessage}</Text>
			) : (
				<FlatList<T>
					data={rows}
					initialNumToRender={8}
					keyExtractor={(row, index) => {
						const id = rowId(row, index);
						// duplicate keys would crash FlatList's keying — suffix the
						// repeats so markers stay unique and stable per render
						const seen = rows
							.slice(0, index)
							.filter((r, i) => rowId(r, i) === id).length;
						return seen > 0 ? `${id}-${index}` : id;
					}}
					renderItem={({ item, index }) => {
						const id = rowId(item, index);
						const seen = rows
							.slice(0, index)
							.filter((r, i) => rowId(r, i) === id).length;
						const marker =
							seen > 0
								? `k-data-table-row-${id}-${index}`
								: `k-data-table-row-${id}`;
						return (
							<Pressable
								testID={marker}
								accessibilityRole="button"
								accessibilityLabel={columns
									.map((column) => cellText(column, item))
									.filter(Boolean)
									.join(", ")}
								disabled={!onRowPress}
								onPress={onRowPress ? () => onRowPress(item) : undefined}
								style={rowStyle(theme)}
							>
								{columns.map((column) => (
									<View key={String(column.key)} style={cellStyle}>
										{column.cell ? (
											column.cell(item)
										) : (
											<Text numberOfLines={1} style={cellTextStyle(theme)}>
												{cellText(column, item)}
											</Text>
										)}
									</View>
								))}
							</Pressable>
						);
					}}
				/>
			)}
		</View>
	);
}
