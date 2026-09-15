/**
 * Table: data grid. RN has no table element, so the web's compound
 * thead/tbody primitives collapse into a data-driven columns/rows API
 * (the Select convention): header and body share a flexBasis width
 * scheme per column so the grid never drifts.
 */
import type { ReactElement } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { TableColumn, TableProps, TableRow } from "./table.types";
import { TableSkeleton } from "./table-skeleton";

const alignToJustify = {
	left: "flex-start",
	center: "center",
	right: "flex-end",
} as const;

function cellStyle(column: TableColumn) {
	return {
		flex: column.width === undefined ? 1 : undefined,
		flexBasis: column.width,
		justifyContent: alignToJustify[column.align ?? "left"],
	};
}

export function Table({
	columns,
	rows,
	onRowPress,
	isLoading,
	skeletonConfig,
	emptyMessage = "No rows",
	style,
	styles,
	testID = "k-table",
}: TableProps): ReactElement {
	const { theme } = useUnistyles() as unknown as {
		theme: Record<string, string>;
	};

	if (isLoading) {
		return <TableSkeleton {...skeletonConfig} styles={styles} />;
	}

	const renderRow = (row: TableRow, index: number) => {
		const cells = (
			<>
				{columns.map((column) => (
					<View
						key={column.key}
						testID="k-table-cell"
						style={[
							{ minHeight: 20 },
							cellStyle(column),
							applySlot({}, styles?.cell),
						]}
					>
						<RNText
							numberOfLines={1}
							style={{ fontSize: 14, color: theme.foreground }}
						>
							{row[column.key] === undefined || row[column.key] === null
								? ""
								: String(row[column.key])}
						</RNText>
					</View>
				))}
			</>
		);

		if (onRowPress) {
			return (
				<Pressable
					key={`row-${index}`}
					testID="k-table-row"
					accessibilityRole="button"
					accessibilityLabel={`Row ${index + 1}`}
					onPress={() => onRowPress(row)}
					style={[
						{
							flexDirection: "row",
							paddingVertical: 10,
							paddingHorizontal: 12,
							gap: 8,
							borderTopWidth: 1,
							borderTopColor: theme.border,
						},
						applySlot({}, styles?.row),
					]}
				>
					{cells}
				</Pressable>
			);
		}

		return (
			<View
				key={`row-${index}`}
				testID="k-table-row"
				style={[
					{
						flexDirection: "row",
						paddingVertical: 10,
						paddingHorizontal: 12,
						gap: 8,
						borderTopWidth: 1,
						borderTopColor: theme.border,
					},
					applySlot({}, styles?.row),
				]}
			>
				{cells}
			</View>
		);
	};

	return (
		<View
			testID={testID}
			style={[
				{
					borderWidth: 1,
					borderRadius: 8,
					borderColor: theme.border,
					backgroundColor: theme.card,
					overflow: "hidden",
				},
				applySlot(applySlot({}, style), styles?.root),
			]}
		>
			<View
				testID="k-table-header"
				accessibilityLabel={columns
					.map((column) =>
						typeof column.header === "string" ? column.header : "",
					)
					.filter(Boolean)
					.join(", ")}
				style={applySlot(
					{
						flexDirection: "row",
						backgroundColor: theme.muted,
						paddingVertical: 10,
						paddingHorizontal: 12,
						gap: 8,
					},
					styles?.head,
				)}
			>
				{columns.map((column) => (
					<View
						key={column.key}
						testID="k-table-head"
						style={cellStyle(column)}
					>
						<RNText
							numberOfLines={1}
							style={{
								fontSize: 12,
								fontWeight: "600",
								color: theme.foreground,
							}}
						>
							{typeof column.header === "string"
								? column.header
								: column.header}
						</RNText>
					</View>
				))}
			</View>
			{rows.length === 0 ? (
				<View
					testID="k-table-empty"
					style={{ paddingVertical: 20, alignItems: "center" }}
				>
					<RNText style={{ fontSize: 14, color: theme.mutedForeground }}>
						{emptyMessage}
					</RNText>
				</View>
			) : (
				rows.map(renderRow)
			)}
		</View>
	);
}
