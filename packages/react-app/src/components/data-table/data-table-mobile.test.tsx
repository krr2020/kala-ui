import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ColumnDef } from "./data-table.types";
import { DataTableMobileList } from "./data-table-mobile";

interface TestUser {
	id: string;
	name: string;
	email: string;
	role: string;
	status: string;
}

const users: TestUser[] = [
	{
		id: "1",
		name: "Alice Johnson",
		email: "alice@example.com",
		role: "admin",
		status: "active",
	},
	{
		id: "2",
		name: "Bob Smith",
		email: "bob@example.com",
		role: "user",
		status: "inactive",
	},
];

const cardColumns: ColumnDef<TestUser>[] = [
	{ id: "name", header: "Name", accessorKey: "name", mobile: "title" },
	{ id: "email", header: "Email", accessorKey: "email", mobile: "hidden" },
	{ id: "role", header: "Role", accessorKey: "role", mobile: "meta" },
	{ id: "status", header: "Status", accessorKey: "status", mobile: "badge" },
	{ id: "extra", header: "Notes", accessorKey: "role" },
];

function setupCards(overrides?: { columns?: ColumnDef<TestUser>[] }) {
	return render(
		<DataTableMobileList
			displayData={users}
			columns={overrides?.columns ?? cardColumns}
			mode="cards"
			selectedIds={new Set()}
			onSelectRow={vi.fn()}
		/>,
	);
}

describe("DataTableMobileList cards mode", () => {
	it("renders title, badges, meta and stacked rows; hidden columns are omitted", () => {
		const { container } = setupCards();
		expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
		expect(screen.queryByText("alice@example.com")).not.toBeInTheDocument();
		expect(screen.getAllByText("admin").length).toBe(2);
		expect(screen.getByText("active").closest("span")).not.toBeNull();
		expect(screen.getAllByText("Notes").length).toBe(2);
		expect(
			container.querySelectorAll('[data-kala-component="data-table-mobile"] *')
				.length,
		).toBeGreaterThan(0);
	});

	it("falls back to the first visible column as title when none is marked", () => {
		const columns: ColumnDef<TestUser>[] = [
			{ id: "name", header: "Name", accessorKey: "name" },
			{ id: "role", header: "Role", accessorKey: "role" },
		];
		setupCards({ columns });
		expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
		expect(screen.getAllByText("Role").length).toBe(2);
	});

	it("uses only the first marked title and demotes extras to stacked rows", () => {
		const columns: ColumnDef<TestUser>[] = [
			{ id: "name", header: "Name", accessorKey: "name", mobile: "title" },
			{ id: "role", header: "Role", accessorKey: "role", mobile: "title" },
		];
		setupCards({ columns });
		expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
		expect(screen.getAllByText("Role").length).toBe(2);
	});

	it("still shows the first column as title when every column is hidden", () => {
		const columns: ColumnDef<TestUser>[] = [
			{ id: "name", header: "Name", accessorKey: "name", mobile: "hidden" },
			{ id: "role", header: "Role", accessorKey: "role", mobile: "hidden" },
		];
		setupCards({ columns });
		expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
	});

	it("renders badges inline on the title row, not as a separate row", () => {
		setupCards();
		const headerRow = screen.getByText("Alice Johnson").closest("div");
		expect(headerRow).not.toBeNull();
		expect(within(headerRow as HTMLElement).getByText("active")).toBeInTheDocument();
	});

	it("omits empty badge and meta values while stacked rows keep the placeholder", () => {
		const sparse: TestUser[] = [
			{ id: "1", name: "Only Name", email: "", role: "", status: "" },
		];
		render(
			<DataTableMobileList
				displayData={sparse}
				columns={[
					{ id: "name", header: "Name", accessorKey: "name", mobile: "title" },
					{ id: "status", header: "Status", accessorKey: "status", mobile: "badge" },
					{ id: "role", header: "Role", accessorKey: "role", mobile: "meta" },
					{ id: "email", header: "Email", accessorKey: "email" },
				]}
				mode="cards"
				selectedIds={new Set()}
				onSelectRow={vi.fn()}
			/>,
		);
		expect(screen.getByText("Only Name")).toBeInTheDocument();
		expect(screen.getAllByText("—")).toHaveLength(1);
		expect(screen.queryByText(/·/)).not.toBeInTheDocument();
	});

	it("omits empty custom cell output from badge and meta slots", () => {
		const sparse: TestUser[] = [
			{ id: "1", name: "Only Name", email: "", role: "", status: "" },
		];
		render(
			<DataTableMobileList
				displayData={sparse}
				columns={[
					{ id: "name", header: "Name", accessorKey: "name", mobile: "title" },
					{
						id: "status",
						header: "Status",
						cell: () => null,
						mobile: "badge",
					},
					{
						id: "role",
						header: "Role",
						cell: () => "",
						mobile: "meta",
					},
					{ id: "email", header: "Email", accessorKey: "email" },
				]}
				mode="cards"
				selectedIds={new Set()}
				onSelectRow={vi.fn()}
			/>,
		);
		expect(screen.queryByText("active")).not.toBeInTheDocument();
		expect(screen.queryByText(/·/)).not.toBeInTheDocument();
		expect(screen.getAllByText("—")).toHaveLength(1);
	});

	it("does not trigger row click when Space toggles the inner checkbox", async () => {
		const user = userEvent.setup();
		const onSelectRow = vi.fn();
		const onRowClick = vi.fn();
		render(
			<DataTableMobileList
				displayData={users.slice(0, 1)}
				columns={[
					{ id: "name", header: "Name", accessorKey: "name", mobile: "title" },
				]}
				mode="cards"
				selection={{
					enabled: true,
					selectedIds: new Set(),
					getRowId: (row: TestUser) => row.id,
					onSelectionChange: vi.fn(),
				}}
				selectedIds={new Set()}
				onSelectRow={onSelectRow}
				onRowClick={onRowClick}
			/>,
		);
		const checkbox = screen.getByRole("checkbox", { name: "Select row 1" });
		checkbox.focus();
		await user.keyboard(" ");
		expect(onRowClick).not.toHaveBeenCalled();
		expect(onSelectRow).toHaveBeenCalledTimes(1);
	});

	it("renders custom cell renderers as-is", () => {
		const columns: ColumnDef<TestUser>[] = [
			{ id: "name", header: "Name", accessorKey: "name", mobile: "title" },
			{
				id: "status",
				header: "Status",
				cell: (row) => <em data-testid={`custom-${row.id}`}>{row.status}</em>,
				mobile: "badge",
			},
		];
		setupCards({ columns });
		expect(screen.getByTestId("custom-1")).toBeInTheDocument();
	});
});

describe("DataTableMobileList stack mode", () => {
	it("renders every visible column as label-value rows with the title leading", () => {
		render(
			<DataTableMobileList
				displayData={users.slice(0, 1)}
				columns={cardColumns}
				mode="stack"
				selectedIds={new Set()}
				onSelectRow={vi.fn()}
			/>,
		);
		expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
		expect(screen.queryByText("Email")).not.toBeInTheDocument();
		expect(screen.getAllByText("Role").length).toBe(1);
		expect(screen.getAllByText("Status").length).toBe(1);
		expect(screen.getAllByText("Notes").length).toBe(1);
	});
});

describe("DataTableMobileList interaction", () => {
	it("supports row click and keyboard activation", async () => {
		const user = userEvent.setup();
		const onRowClick = vi.fn();
		const { container } = render(
			<DataTableMobileList
				displayData={users.slice(0, 1)}
				columns={cardColumns}
				mode="cards"
				selectedIds={new Set()}
				onSelectRow={vi.fn()}
				onRowClick={onRowClick}
			/>,
		);
		const row = container.querySelector(
			'[data-kala-component="data-table-mobile"] > div',
		);
		expect(row).not.toBeNull();
		await user.click(row as HTMLElement);
		expect(onRowClick).toHaveBeenCalledTimes(1);
		row?.focus();
		row?.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "Enter",
				bubbles: true,
				cancelable: true,
			}),
		);
		expect(onRowClick).toHaveBeenCalledTimes(2);
	});

	it("renders a leading checkbox that toggles selection without triggering row click", async () => {
		const user = userEvent.setup();
		const onSelectionChange = vi.fn();
		const onRowClick = vi.fn();
		const selection = {
			enabled: true,
			selectedIds: new Set<string>(),
			getRowId: (row: TestUser) => row.id,
			onSelectionChange,
		};
		const columns = cardColumns.filter((column) => column.id !== "email");
		render(
			<DataTableMobileList
				displayData={users.slice(0, 1)}
				columns={columns}
				mode="cards"
				selection={selection}
				selectedIds={new Set()}
				onSelectRow={(row) => {
					selection.selectedIds = new Set([row.id]);
					onSelectionChange(selection.selectedIds);
				}}
				onRowClick={onRowClick}
			/>,
		);
		await user.click(screen.getByRole("checkbox", { name: "Select row 1" }));
		expect(onSelectionChange).toHaveBeenCalledWith(new Set(["1"]));
		expect(onRowClick).not.toHaveBeenCalled();
	});

	it("marks selected rows and honors getRowClassName", () => {
		const { container } = render(
			<DataTableMobileList
				displayData={users.slice(0, 1)}
				columns={cardColumns.filter((column) => column.id !== "email")}
				mode="cards"
				selection={{
					enabled: true,
					selectedIds: new Set<string>(),
					getRowId: (row) => row.id,
					onSelectionChange: vi.fn(),
				}}
				selectedIds={new Set(["1"])}
				onSelectRow={vi.fn()}
				getRowClassName={() => "custom-row"}
			/>,
		);
		const row = container.querySelector(
			'[data-kala-component="data-table-mobile"] > div',
		);
		expect(row?.getAttribute("data-state")).toBe("selected");
		expect(row?.className).toContain("custom-row");
		expect(
			within(row as HTMLElement)
				.getByRole("checkbox")
				.getAttribute("aria-label"),
		).toBe("Select row 1");
	});
});
