import { fireEvent, render } from "@testing-library/react-native";
import { DataTable, DataTableSkeleton } from "../data-table";

interface Row {
	id: string;
	name: string;
	role: string;
}

const rows: Row[] = [
	{ id: "u1", name: "Ada Lovelace", role: "admin" },
	{ id: "u2", name: "Grace Hopper", role: "editor" },
];

const columns = [
	{ key: "name" as const, header: "Name" },
	{ key: "role" as const, header: "Role" },
];

describe("DataTable", () => {
	it("renders its marker, one header cell per column, one row per entry", async () => {
		const screen = await render(
			<DataTable columns={columns} rows={rows} rowKey="id" />,
		);
		expect(screen.getByTestId("k-data-table")).toBeTruthy();
		expect(screen.getByTestId("k-data-table-header-name")).toBeTruthy();
		expect(screen.getByTestId("k-data-table-header-role")).toBeTruthy();
		expect(screen.getByTestId("k-data-table-row-u1")).toBeTruthy();
		expect(screen.getByTestId("k-data-table-row-u2")).toBeTruthy();
	});

	it("fires onRowPress once with the pressed row", async () => {
		const onRowPress = jest.fn();
		const screen = await render(
			<DataTable
				columns={columns}
				rows={rows}
				rowKey="id"
				onRowPress={onRowPress}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-data-table-row-u2"));
		expect(onRowPress).toHaveBeenCalledTimes(1);
		expect(onRowPress).toHaveBeenCalledWith(rows[1]);
	});

	it("announces each row as a button labelled by its cells", async () => {
		const screen = await render(
			<DataTable
				columns={columns}
				rows={rows}
				rowKey="id"
				onRowPress={() => undefined}
			/>,
		);
		expect(
			screen.getByRole("button", { name: "Grace Hopper, editor" }),
		).toBeTruthy();
	});

	it("renders the empty arm for empty rows", async () => {
		const screen = await render(
			<DataTable columns={columns} rows={[]} rowKey="id" />,
		);
		expect(screen.getByText("No rows")).toBeTruthy();
		expect(screen.queryByTestId("k-data-table-row-u1")).toBeNull();
	});

	it("index-suffixes duplicate row keys", async () => {
		const dupes: Row[] = [
			{ id: "same", name: "First", role: "admin" },
			{ id: "same", name: "Second", role: "editor" },
		];
		const screen = await render(
			<DataTable columns={columns} rows={dupes} rowKey="id" />,
		);
		expect(screen.getByTestId("k-data-table-row-same")).toBeTruthy();
		expect(screen.getByTestId("k-data-table-row-same-1")).toBeTruthy();
	});

	it("falls back to the row index when no rowKey is given", async () => {
		const screen = await render(<DataTable columns={columns} rows={rows} />);
		expect(screen.getByTestId("k-data-table-row-0")).toBeTruthy();
		expect(screen.getByTestId("k-data-table-row-1")).toBeTruthy();
	});

	it("keeps the marker on the skeleton while loading", async () => {
		const screen = await render(
			<DataTable columns={columns} rows={rows} rowKey="id" isLoading />,
		);
		expect(screen.getByTestId("k-data-table")).toBeTruthy();
		expect(screen.queryByTestId("k-data-table-row-u1")).toBeNull();
	});
});

describe("DataTableSkeleton", () => {
	it("carries its own marker by default", async () => {
		const screen = await render(<DataTableSkeleton />);
		expect(screen.getByTestId("k-data-table")).toBeTruthy();
	});
});
