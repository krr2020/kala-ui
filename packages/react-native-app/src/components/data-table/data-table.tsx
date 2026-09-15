/**
 * DataTable: read-only mobile table — header row plus pressable rows in
 * a FlatList. Sorting/filters/pagination stay web-only; a phone table
 * is a list with columns, not a spreadsheet.
 */
import type { ReactElement } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { DataTableColumn, DataTableProps } from "./data-table.types";
import { DataTableSkeleton } from "./data-table-skeleton";

interface ThemeShape {
	background: string;
	foreground: string;
	mutedForeground: string;
	border: string;
}

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
	const { theme } = useUnistyles() as unknown as { theme: ThemeShape };

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
		<View
			testID={testID}
			style={[
				{ borderWidth: 1, borderColor: theme.border },
				style,
				styles?.root,
			]}
		>
			<View style={{ flexDirection: "row", backgroundColor: theme.background }}>
				{columns.map((column) => (
					<Text
						key={String(column.key)}
						testID={`k-data-table-header-${String(column.key)}`}
						numberOfLines={1}
						style={{
							flex: 1,
							fontSize: 12,
							fontWeight: "600",
							color: theme.mutedForeground,
							paddingHorizontal: 12,
							paddingVertical: 8,
						}}
					>
						{column.header}
					</Text>
				))}
			</View>
			{rows.length === 0 ? (
				<Text
					style={{
						color: theme.mutedForeground,
						padding: 16,
						textAlign: "center",
					}}
				>
					{emptyMessage}
				</Text>
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
								style={{
									flexDirection: "row",
									minHeight: 44,
									alignItems: "center",
									borderTopWidth: 1,
									borderTopColor: theme.border,
								}}
							>
								{columns.map((column) => (
									<View
										key={String(column.key)}
										style={{ flex: 1, paddingHorizontal: 12 }}
									>
										{column.cell ? (
											column.cell(item)
										) : (
											<Text
												numberOfLines={1}
												style={{ color: theme.foreground, fontSize: 14 }}
											>
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
