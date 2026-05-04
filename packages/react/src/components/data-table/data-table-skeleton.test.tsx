import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DataTableSkeleton } from "./data-table-skeleton";
import type { ColumnDef } from "./data-table.types";

interface TestRow {
	id: string;
	name: string;
	email: string;
	status: string;
}

const columns: ColumnDef<TestRow>[] = [
	{ id: "name", header: "Name", accessorKey: "name" },
	{ id: "email", header: "Email", accessorKey: "email" },
	{ id: "status", header: "Status", accessorKey: "status" },
];

describe("DataTableSkeleton", () => {
	it("renders skeleton rows matching column count", () => {
		render(<DataTableSkeleton rows={3} columns={columns} />);
		// Each row has cells for each column
		const cells = screen.getAllByRole("cell");
		expect(cells.length).toBe(3 * 3); // 3 rows * 3 columns
	});

	it("renders default 5 rows when rows not specified", () => {
		render(<DataTableSkeleton columns={columns} />);
		const cells = screen.getAllByRole("cell");
		expect(cells.length).toBe(5 * 3);
	});

	it("does not render search bar by default", () => {
		render(<DataTableSkeleton columns={columns} />);
		expect(
			screen.queryByPlaceholderText("Search..."),
		).not.toBeInTheDocument();
	});

	it("renders search bar when showSearch is true", () => {
		render(<DataTableSkeleton columns={columns} showSearch />);
		expect(
			screen.getByPlaceholderText("Search..."),
		).toBeInTheDocument();
	});

	it("renders disabled search input", () => {
		render(<DataTableSkeleton columns={columns} showSearch />);
		const input = screen.getByPlaceholderText("Search...");
		expect(input).toBeDisabled();
	});

	it("does not render filter pills by default", () => {
		render(<DataTableSkeleton columns={columns} />);
		expect(screen.queryByText("Active filters:")).not.toBeInTheDocument();
	});

	it("renders filter pills when showFilters is true", () => {
		render(
			<DataTableSkeleton columns={columns} showFilters filterCount={2} />,
		);
		expect(screen.getByText("Active filters:")).toBeInTheDocument();
		const filterTexts = screen.getAllByText("Filter: Value");
		expect(filterTexts).toHaveLength(2);
	});

	it("renders default 3 filter pills when filterCount not specified", () => {
		render(<DataTableSkeleton columns={columns} showFilters />);
		// 3 "Filter: Value" badges
		const filterTexts = screen.getAllByText("Filter: Value");
		expect(filterTexts).toHaveLength(3);
	});

	it("renders Clear all button when showFilters is true", () => {
		render(<DataTableSkeleton columns={columns} showFilters />);
		expect(
			screen.getByRole("button", { name: /Clear all/ }),
		).toBeInTheDocument();
	});

	it("does not render pagination by default", () => {
		const { container } = render(<DataTableSkeleton columns={columns} />);
		// No page size selector text
		expect(container.querySelector("select")).not.toBeInTheDocument();
	});

	it("renders pagination skeleton when showPagination is true", () => {
		render(<DataTableSkeleton columns={columns} showPagination />);
		expect(screen.getByText("Rows per page:")).toBeInTheDocument();
	});

	it("renders selection checkboxes when showSelection is true", () => {
		render(<DataTableSkeleton columns={columns} showSelection />);
		// Header checkbox + 5 row checkboxes = 6
		const checkboxes = screen.getAllByRole("checkbox");
		expect(checkboxes.length).toBe(6);
	});

	it("does not render selection checkboxes by default", () => {
		render(<DataTableSkeleton columns={columns} />);
		expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
	});

	it("renders bulk actions bar when showBulkActions and showSearch are true", () => {
		render(
			<DataTableSkeleton
				columns={columns}
				showSearch
				showBulkActions
			/>,
		);
		expect(screen.getByText("0 selected")).toBeInTheDocument();
		expect(screen.getByText("Edit")).toBeInTheDocument();
		expect(screen.getByText("Delete")).toBeInTheDocument();
	});

	it("does not render bulk actions when showBulkActions is false", () => {
		render(<DataTableSkeleton columns={columns} showSearch />);
		expect(screen.queryByText("0 selected")).not.toBeInTheDocument();
	});

	it("renders column headers from column definitions", () => {
		render(<DataTableSkeleton columns={columns} />);
		const headers = screen.getAllByRole("columnheader");
		expect(headers).toHaveLength(3);
	});

	it("renders with stickyHeader class", () => {
		const { container } = render(
			<DataTableSkeleton columns={columns} stickyHeader />,
		);
		const header = container.querySelector("thead");
		expect(header?.className).toContain("sticky");
	});

	it("renders without stickyHeader class when disabled", () => {
		const { container } = render(
			<DataTableSkeleton columns={columns} stickyHeader={false} />,
		);
		const header = container.querySelector("thead");
		expect(header?.className).not.toContain("sticky");
	});

	it("renders with stickyFooter class when enabled", () => {
		const { container } = render(
			<DataTableSkeleton
				columns={columns}
				showPagination
				stickyFooter
			/>,
		);
		const pagination = container.querySelector(".sticky.bottom-0");
		expect(pagination).toBeInTheDocument();
	});

	it("renders rounded-t-lg container when pagination is shown", () => {
		const { container } = render(
			<DataTableSkeleton columns={columns} showPagination />,
		);
		const tableContainer = container.querySelector(
			".border.relative.overflow-hidden",
		);
		expect(tableContainer?.className).toContain("rounded-t-lg");
	});

	it("renders rounded-lg container when pagination is not shown", () => {
		const { container } = render(
			<DataTableSkeleton columns={columns} />,
		);
		const tableContainer = container.querySelector(
			".border.relative.overflow-hidden",
		);
		expect(tableContainer?.className).toContain("rounded-lg");
	});
});
