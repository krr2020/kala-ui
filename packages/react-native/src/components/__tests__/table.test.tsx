import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import type { TableColumn } from "../table";
import { Table } from "../table";

type Screen = Awaited<ReturnType<typeof render>>;

const columns: TableColumn[] = [
	{ key: "name", header: "Name" },
	{ key: "role", header: "Role" },
];

const rows = [
	{ name: "Ada Lovelace", role: "engineer" },
	{ name: "Grace Hopper", role: "admiral" },
];

describe("Table", () => {
	it("renders a header per column and a row per record with cells", async () => {
		const screen: Screen = await render(
			<Table columns={columns} rows={rows} />,
		);
		expect(screen.getByTestId("k-table")).toBeTruthy();
		expect(screen.getByTestId("k-table-header")).toBeTruthy();
		expect(screen.getAllByTestId("k-table-head")).toHaveLength(2);
		expect(screen.getAllByTestId("k-table-row")).toHaveLength(2);
		expect(screen.getAllByTestId("k-table-cell")).toHaveLength(4);
		expect(screen.getByText("Ada Lovelace")).toBeTruthy();
		expect(screen.getByText("admiral")).toBeTruthy();
	});

	it("rows are plain views without onRowPress, pressable with it", async () => {
		const plain = await render(<Table columns={columns} rows={rows} />);
		expect(
			plain.getAllByTestId("k-table-row")[0].props.onPress,
		).toBeUndefined();

		const onRowPress = jest.fn();
		const interactive = await render(
			<Table columns={columns} rows={rows} onRowPress={onRowPress} />,
		);
		const row = interactive.getAllByTestId("k-table-row")[0];
		expect(row.props.accessibilityRole).toBe("button");
		await fireEvent.press(row);
		expect(onRowPress).toHaveBeenCalledWith(rows[0]);
	});

	it("isLoading swaps the grid for the skeleton with the configured shape", async () => {
		const screen: Screen = await render(
			<Table
				columns={columns}
				rows={rows}
				isLoading
				skeletonConfig={{ rows: 3, columns: 2 }}
			/>,
		);
		expect(screen.queryByTestId("k-table")).toBeNull();
		expect(screen.getByTestId("k-table-skeleton")).toBeTruthy();
		expect(screen.getAllByTestId("k-table-head")).toHaveLength(2);
		expect(screen.getAllByTestId("k-table-row")).toHaveLength(3);
		expect(screen.getAllByTestId("k-table-cell")).toHaveLength(6);
	});

	it("empty rows render the empty state row", async () => {
		const screen: Screen = await render(<Table columns={columns} rows={[]} />);
		expect(screen.getByTestId("k-table-empty")).toBeTruthy();
	});

	it("column widths align header and body via flexBasis", async () => {
		const wide: TableColumn[] = [
			{ key: "name", header: "Name", width: 200 },
			{ key: "role", header: "Role" },
		];
		const screen: Screen = await render(<Table columns={wide} rows={rows} />);
		const head = StyleSheet.flatten(
			screen.getAllByTestId("k-table-head")[0].props.style,
		);
		const cell = StyleSheet.flatten(
			screen.getAllByTestId("k-table-cell")[0].props.style,
		);
		expect(head.flexBasis).toBe(200);
		expect(cell.flexBasis).toBe(200);
	});

	it("slot style overrides reach the root", async () => {
		const screen: Screen = await render(
			<Table
				columns={columns}
				rows={rows}
				styles={{ root: { borderWidth: 7 } }}
			/>,
		);
		expect(
			StyleSheet.flatten(screen.getByTestId("k-table").props.style).borderWidth,
		).toBe(7);
	});
});
