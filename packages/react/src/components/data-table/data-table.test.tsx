/**
 * DataTable Component Tests
 * Tests for sorting, filtering, search, pagination, selection, and accessibility
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "./data-table";
import type { ColumnDef } from "./data-table.types";

// Test data
interface TestUser {
	id: string;
	name: string;
	email: string;
	role: string;
	status: "active" | "inactive";
	createdAt: Date;
}

const mockUsers: TestUser[] = [
	{
		id: "1",
		name: "Alice Johnson",
		email: "alice@example.com",
		role: "admin",
		status: "active",
		createdAt: new Date("2024-01-01"),
	},
	{
		id: "2",
		name: "Bob Smith",
		email: "bob@example.com",
		role: "user",
		status: "active",
		createdAt: new Date("2024-01-02"),
	},
	{
		id: "3",
		name: "Charlie Brown",
		email: "charlie@example.com",
		role: "user",
		status: "inactive",
		createdAt: new Date("2024-01-03"),
	},
	{
		id: "4",
		name: "Diana Prince",
		email: "diana@example.com",
		role: "moderator",
		status: "active",
		createdAt: new Date("2024-01-04"),
	},
	{
		id: "5",
		name: "Eve Adams",
		email: "eve@example.com",
		role: "user",
		status: "inactive",
		createdAt: new Date("2024-01-05"),
	},
];

const mockColumns: ColumnDef<TestUser>[] = [
	{
		id: "name",
		header: "Name",
		accessorKey: "name",
		enableSorting: true,
	},
	{
		id: "email",
		header: "Email",
		accessorKey: "email",
		enableSorting: true,
	},
	{
		id: "role",
		header: "Role",
		accessorKey: "role",
	},
	{
		id: "status",
		header: "Status",
		accessorKey: "status",
	},
];

describe("DataTable", () => {
	describe("Rendering", () => {
		it("renders table with data", () => {
			render(<DataTable data={mockUsers} columns={mockColumns} />);

			expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
			expect(screen.getByText("alice@example.com")).toBeInTheDocument();
			expect(screen.getByText("admin")).toBeInTheDocument();
		});

		it("renders all column headers", () => {
			render(<DataTable data={mockUsers} columns={mockColumns} />);

			expect(screen.getByText("Name")).toBeInTheDocument();
			expect(screen.getByText("Email")).toBeInTheDocument();
			expect(screen.getByText("Role")).toBeInTheDocument();
			expect(screen.getByText("Status")).toBeInTheDocument();
		});

		it("renders empty state when no data", () => {
			render(<DataTable data={[]} columns={mockColumns} />);

			expect(screen.getByText(/no data available/i)).toBeInTheDocument();
		});

		it("renders loading state", () => {
			render(
				<DataTable
					data={mockUsers}
					columns={mockColumns}
					isLoading
					loadingConfig={{ rows: 3 }}
				/>,
			);

			// Should show skeleton rows
			const skeletons = screen.getAllByRole("row");
			expect(skeletons.length).toBeGreaterThan(1); // Header + skeleton rows
		});
	});

	describe("Sorting", () => {
		it("sorts by column when header is clicked", async () => {
			const user = userEvent.setup();
			render(<DataTable data={mockUsers} columns={mockColumns} />);

			// Click Name header to sort ascending
			const nameHeader = screen.getByRole("button", { name: /sort by name/i });
			await user.click(nameHeader);

			const rows = screen.getAllByRole("row");
			// First data row (index 1) should be Alice
			expect(
				within(rows[1] as HTMLElement).getByText("Alice Johnson"),
			).toBeInTheDocument();
		});

		it("toggles sort direction on repeated clicks", async () => {
			const user = userEvent.setup();
			render(<DataTable data={mockUsers} columns={mockColumns} />);

			const nameHeader = screen.getByRole("button", { name: /sort by name/i });

			// First click - ascending
			await user.click(nameHeader);
			let rows = screen.getAllByRole("row");
			expect(
				within(rows[1] as HTMLElement).getByText("Alice Johnson"),
			).toBeInTheDocument();

			// Second click - descending
			await user.click(nameHeader);
			rows = screen.getAllByRole("row");
			expect(
				within(rows[1] as HTMLElement).getByText("Eve Adams"),
			).toBeInTheDocument();

			// Third click - clear sort (back to original)
			await user.click(nameHeader);
			rows = screen.getAllByRole("row");
			expect(
				within(rows[1] as HTMLElement).getByText("Alice Johnson"),
			).toBeInTheDocument();
		});

		it("displays sort indicators", async () => {
			const user = userEvent.setup();
			render(<DataTable data={mockUsers} columns={mockColumns} />);

			const nameHeader = screen.getByRole("button", { name: /sort by name/i });

			// Indicator is present but hidden initially
			const svg = nameHeader.querySelector("svg");
			expect(svg).toBeInTheDocument();
			expect(svg).toHaveClass("opacity-0");

			// Click to sort ascending
			await user.click(nameHeader);
			expect(nameHeader.querySelector("svg")).toBeInTheDocument();
			expect(nameHeader.querySelector("svg")).not.toHaveClass("opacity-0");
		});
	});

	describe("Search", () => {
		it("renders search input when searchable prop is true", () => {
			render(<DataTable data={mockUsers} columns={mockColumns} searchable />);

			expect(screen.getByRole("searchbox")).toBeInTheDocument();
		});

		it("filters data based on search query", async () => {
			const user = userEvent.setup();
			render(<DataTable data={mockUsers} columns={mockColumns} searchable />);

			const searchInput = screen.getByRole("searchbox");
			await user.type(searchInput, "alice");

			// Should only show Alice
			expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
			expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
		});

		it("shows empty state when search returns no results", async () => {
			const user = userEvent.setup();
			render(<DataTable data={mockUsers} columns={mockColumns} searchable />);

			const searchInput = screen.getByRole("searchbox");
			await user.type(searchInput, "nonexistent");

			const emptyMessages = screen.getAllByText(/no results found/i);
			expect(emptyMessages.length).toBeGreaterThan(0);
		});

		it("searches across multiple columns", async () => {
			const user = userEvent.setup();
			render(<DataTable data={mockUsers} columns={mockColumns} searchable />);

			const searchInput = screen.getByRole("searchbox");

			// Search by email
			await user.clear(searchInput);
			await user.type(searchInput, "diana@example.com");
			expect(screen.getByText("Diana Prince")).toBeInTheDocument();
		});
	});

	describe("Pagination", () => {
		it("renders pagination controls", () => {
			render(<DataTable data={mockUsers} columns={mockColumns} pagination />);

			expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/go to next page/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/go to previous page/i)).toBeInTheDocument();
		});

		it("paginates data correctly", () => {
			render(
				<DataTable
					data={mockUsers}
					columns={mockColumns}
					pagination={{ page: 1, pageSize: 2, total: mockUsers.length }}
				/>,
			);

			// Should show first 2 users
			expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
			expect(screen.getByText("Bob Smith")).toBeInTheDocument();
			expect(screen.queryByText("Charlie Brown")).not.toBeInTheDocument();
		});

		it("navigates to next page", async () => {
			const user = userEvent.setup();
			render(
				<DataTable
					data={mockUsers}
					columns={mockColumns}
					pagination={{ page: 1, pageSize: 2, total: mockUsers.length }}
				/>,
			);

			const nextButton = screen.getByLabelText(/go to next page/i);
			await user.click(nextButton);

			// Should show next 2 users
			expect(screen.getByText("Charlie Brown")).toBeInTheDocument();
			expect(screen.getByText("Diana Prince")).toBeInTheDocument();
		});

		it("disables previous button on first page", () => {
			render(
				<DataTable
					data={mockUsers}
					columns={mockColumns}
					pagination={{ page: 1, pageSize: 2, total: mockUsers.length }}
				/>,
			);

			const prevButton = screen.getByLabelText(/go to previous page/i);
			expect(prevButton).toBeDisabled();
		});

		it("shows correct page info", () => {
			render(
				<DataTable
					data={mockUsers}
					columns={mockColumns}
					pagination={{ page: 1, pageSize: 2, total: mockUsers.length }}
				/>,
			);

			expect(
				screen.getByText(/showing 1 to 2 of 5 results/i),
			).toBeInTheDocument();
		});
	});

	describe("Row Selection", () => {
		const selectionConfig = {
			enabled: true,
			selectedIds: new Set<string>(),
			getRowId: (row: TestUser) => row.id,
			onSelectionChange: vi.fn(),
		};

		it("renders checkboxes when selection is enabled", () => {
			render(
				<DataTable
					data={mockUsers}
					columns={mockColumns}
					selection={selectionConfig}
				/>,
			);

			const checkboxes = screen.getAllByRole("checkbox");
			expect(checkboxes.length).toBeGreaterThan(0);
		});

		it("renders select all checkbox", () => {
			render(
				<DataTable
					data={mockUsers}
					columns={mockColumns}
					selection={selectionConfig}
				/>,
			);

			expect(screen.getByLabelText(/select all rows/i)).toBeInTheDocument();
		});

		it("selects row when checkbox is clicked", async () => {
			const user = userEvent.setup();
			const onSelectionChange = vi.fn();
			const config = { ...selectionConfig, onSelectionChange };

			render(
				<DataTable data={mockUsers} columns={mockColumns} selection={config} />,
			);

			const checkboxes = screen.getAllByLabelText(/select row/i);
			await user.click(checkboxes[0] as HTMLElement);

			expect(onSelectionChange).toHaveBeenCalled();
		});

		it("selects all rows when select all is clicked", async () => {
			const user = userEvent.setup();
			const onSelectionChange = vi.fn();
			const config = { ...selectionConfig, onSelectionChange };

			render(
				<DataTable data={mockUsers} columns={mockColumns} selection={config} />,
			);

			const selectAllCheckbox = screen.getByLabelText(/select all rows/i);
			await user.click(selectAllCheckbox);

			expect(onSelectionChange).toHaveBeenCalled();
		});
	});

	describe("Accessibility", () => {
		it("has proper ARIA attributes", () => {
			render(
				<DataTable
					data={mockUsers}
					columns={mockColumns}
					ariaLabel="Users table"
				/>,
			);

			const region = screen.getByRole("region", { name: "Users table" });
			expect(region).toBeInTheDocument();
		});

		it("has sortable column indicators", async () => {
			const user = userEvent.setup();
			render(<DataTable data={mockUsers} columns={mockColumns} />);

			const nameHeader = screen.getByRole("button", { name: /sort by name/i });
			await user.click(nameHeader);

			// Check for aria-sort attribute
			const headerCell = nameHeader.closest("th");
			expect(headerCell).toHaveAttribute("aria-sort");
		});

		it("supports keyboard navigation for row clicks", async () => {
			const onRowClick = vi.fn();
			const { container } = render(
				<DataTable
					data={mockUsers}
					columns={mockColumns}
					onRowClick={onRowClick}
				/>,
			);

			// Find tbody rows (data rows, not header)
			const tbody = container.querySelector("tbody");
			const firstRow = tbody?.querySelector("tr");

			if (firstRow) {
				firstRow.focus();
				await userEvent.keyboard("{Enter}");
				expect(onRowClick).toHaveBeenCalled();
			}
		});

		it("has proper labels for search input", () => {
			render(
				<DataTable
					data={mockUsers}
					columns={mockColumns}
					searchable={{
						placeholder: "Search users...",
						ariaLabel: "Search users table",
					}}
				/>,
			);

			const searchInput = screen.getByRole("searchbox");
			expect(searchInput).toHaveAttribute("aria-label", "Search users table");
		});

		it("has proper labels for pagination buttons", () => {
			render(<DataTable data={mockUsers} columns={mockColumns} pagination />);

			expect(screen.getByLabelText(/go to next page/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/go to previous page/i)).toBeInTheDocument();
		});
	});

	describe("Custom Rendering", () => {
		it("uses custom cell renderer", () => {
			const customColumns: ColumnDef<TestUser>[] = [
				{
					id: "name",
					header: "Name",
					cell: (row) => <strong>{row.name.toUpperCase()}</strong>,
				},
			];

			render(<DataTable data={mockUsers} columns={customColumns} />);

			expect(screen.getByText("ALICE JOHNSON")).toBeInTheDocument();
		});

		it("applies custom row className", () => {
			const getRowClassName = (row: TestUser) =>
				row.status === "inactive" ? "opacity-50" : "";

			const { container } = render(
				<DataTable
					data={mockUsers}
					columns={mockColumns}
					getRowClassName={getRowClassName}
				/>,
			);

			const rows = container.querySelectorAll("tbody tr");
			expect(rows[2]).toHaveClass("opacity-50"); // Charlie Brown is inactive
		});

		it("handles row click events", async () => {
			const user = userEvent.setup();
			const onRowClick = vi.fn();

			const { container } = render(
				<DataTable
					data={mockUsers}
					columns={mockColumns}
					onRowClick={onRowClick}
				/>,
			);

			// Find tbody rows (data rows, not header)
			const tbody = container.querySelector("tbody");
			const firstRow = tbody?.querySelector("tr");

			if (firstRow) {
				await user.click(firstRow);
				expect(onRowClick).toHaveBeenCalledWith(mockUsers[0]);
			}
		});
	});

	describe("Empty States", () => {
		it("shows custom empty state", () => {
			render(
				<DataTable
					data={[]}
					columns={mockColumns}
					emptyState={{
						title: "No users found",
						description: "Add your first user to get started",
					}}
				/>,
			);

			expect(screen.getByText("No users found")).toBeInTheDocument();
			expect(
				screen.getByText("Add your first user to get started"),
			).toBeInTheDocument();
		});

		it("shows different empty state for search", async () => {
			const user = userEvent.setup();
			render(<DataTable data={mockUsers} columns={mockColumns} searchable />);

			const searchInput = screen.getByRole("searchbox");
			await user.type(searchInput, "nonexistent");

			const emptyMessages = screen.getAllByText(/no results found/i);
			expect(emptyMessages.length).toBeGreaterThan(0);
		});
	});
});
