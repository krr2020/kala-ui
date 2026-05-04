import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TableSkeleton } from "./table-skeleton";

describe("TableSkeleton", () => {
	it("renders with default rows and columns", () => {
		const { container } = render(<TableSkeleton />);
		expect(container.querySelector('[data-slot="table"]')).toBeInTheDocument();
		expect(container.querySelector('[data-slot="table-header"]')).toBeInTheDocument();
		expect(container.querySelector('[data-slot="table-body"]')).toBeInTheDocument();
	});

	it("renders 5 rows by default", () => {
		const { container } = render(<TableSkeleton />);
		const rows = container.querySelectorAll('tbody [data-slot="table-row"]');
		expect(rows.length).toBe(5);
	});

	it("renders custom number of rows", () => {
		const { container } = render(<TableSkeleton rows={3} />);
		const rows = container.querySelectorAll('tbody [data-slot="table-row"]');
		expect(rows.length).toBe(3);
	});

	it("renders custom number of columns", () => {
		const { container } = render(<TableSkeleton columns={6} />);
		const headerCells = container.querySelectorAll('thead [data-slot="table-head"]');
		expect(headerCells.length).toBe(6);
	});

	it("renders with headers", () => {
		render(<TableSkeleton headers={["Name", "Email", "Role"]} />);
		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(screen.getByText("Email")).toBeInTheDocument();
		expect(screen.getByText("Role")).toBeInTheDocument();
	});

	it("renders skeleton placeholders when no headers", () => {
		const { container } = render(<TableSkeleton columns={3} />);
		const headerSkeletons = container.querySelectorAll('thead [data-slot="skeleton"]');
		expect(headerSkeletons.length).toBe(3);
	});

	it("renders with columnWidths", () => {
		const { container } = render(
			<TableSkeleton columnWidths={["200px", "300px"]} />,
		);
		const headerCells = container.querySelectorAll('thead [data-slot="table-head"]');
		expect((headerCells[0] as HTMLElement).style.width).toBe("200px");
		expect((headerCells[1] as HTMLElement).style.width).toBe("300px");
	});

	it("renders with showActions", () => {
		const { container } = render(<TableSkeleton showActions />);
		const headerCells = container.querySelectorAll('thead [data-slot="table-head"]');
		// 4 default columns + 1 action = 5
		expect(headerCells.length).toBe(5);
	});

	it("renders Actions header text when showActions is true", () => {
		render(<TableSkeleton showActions />);
		expect(screen.getByText("Actions")).toBeInTheDocument();
	});

	it("renders with showCheckboxes", () => {
		const { container } = render(<TableSkeleton showCheckboxes />);
		const headerCells = container.querySelectorAll('thead [data-slot="table-head"]');
		// 1 checkbox + 4 default columns = 5
		expect(headerCells.length).toBe(5);
	});

	it("renders checkbox cell in body rows", () => {
		const { container } = render(<TableSkeleton showCheckboxes />);
		const checkboxCells = container.querySelectorAll('tbody [data-slot="table-cell"]');
		// Each row has 1 checkbox + 4 columns = 5 cells, 5 rows = 25
		expect(checkboxCells.length).toBe(25);
	});

	it("renders action cell in body rows", () => {
		const { container } = render(<TableSkeleton showActions />);
		const actionCells = container.querySelectorAll('tbody [data-slot="table-cell"]');
		// Each row has 4 columns + 1 action = 5 cells, 5 rows = 25
		expect(actionCells.length).toBe(25);
	});

	it("renders with stickyHeader", () => {
		const { container } = render(<TableSkeleton stickyHeader />);
		const thead = container.querySelector('[data-slot="table-header"]');
		expect(thead).toHaveClass("sticky", "top-0", "z-1");
	});

	it("does not apply sticky classes by default", () => {
		const { container } = render(<TableSkeleton />);
		const thead = container.querySelector('[data-slot="table-header"]');
		expect(thead).not.toHaveClass("sticky");
	});

	it("renders with all options", () => {
		const { container } = render(
			<TableSkeleton
				rows={2}
				columns={3}
				headers={["A", "B", "C"]}
				showCheckboxes
				showActions
				stickyHeader
			/>,
		);
		const headerCells = container.querySelectorAll('thead [data-slot="table-head"]');
		// 1 checkbox + 3 columns + 1 action = 5
		expect(headerCells.length).toBe(5);
		const rows = container.querySelectorAll('tbody [data-slot="table-row"]');
		expect(rows.length).toBe(2);
	});

	it("renders data-slot attributes on all elements", () => {
		const { container } = render(<TableSkeleton />);
		expect(container.querySelector('[data-slot="table"]')).toBeInTheDocument();
		expect(container.querySelector('[data-slot="table-header"]')).toBeInTheDocument();
		expect(container.querySelector('[data-slot="table-body"]')).toBeInTheDocument();
	});
});
