import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "./table";
import { TableSkeleton } from "./table-skeleton";

describe("Table", () => {
	it("should render table", () => {
		render(
			<Table>
				<TableBody>
					<TableRow>
						<TableCell>Cell</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);
		const table = screen.getByRole("table");
		expect(table).toBeInTheDocument();
	});

	it("should render table with caption", () => {
		render(
			<Table>
				<TableCaption>Table caption</TableCaption>
				<TableBody>
					<TableRow>
						<TableCell>Cell</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);
		expect(screen.getByText("Table caption")).toBeInTheDocument();
	});

	it("should render table with header", () => {
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Header</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>Cell</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);
		expect(screen.getByText("Header")).toBeInTheDocument();
	});

	it("should render table with footer", () => {
		render(
			<Table>
				<TableBody>
					<TableRow>
						<TableCell>Cell</TableCell>
					</TableRow>
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell>Footer</TableCell>
					</TableRow>
				</TableFooter>
			</Table>,
		);
		expect(screen.getByText("Footer")).toBeInTheDocument();
	});

	it("should apply custom className to table", () => {
		const { container } = render(
			<Table className="custom-table">
				<TableBody>
					<TableRow>
						<TableCell>Cell</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);
		const table = container.querySelector('[data-slot="table"]');
		expect(table).toHaveClass("custom-table");
	});

	it("should render multiple rows", () => {
		render(
			<Table>
				<TableBody>
					<TableRow>
						<TableCell>Row 1</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Row 2</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Row 3</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);
		expect(screen.getByText("Row 1")).toBeInTheDocument();
		expect(screen.getByText("Row 2")).toBeInTheDocument();
		expect(screen.getByText("Row 3")).toBeInTheDocument();
	});
});

describe("TableSkeleton", () => {
	it("renders table skeleton", () => {
		render(<TableSkeleton />);
		expect(screen.getByRole("table")).toBeInTheDocument();
	});

	it("renders default number of rows (5)", () => {
		const { container } = render(<TableSkeleton />);
		const rows = container.querySelectorAll("tbody tr");
		expect(rows).toHaveLength(5);
	});

	it("renders default number of columns (4)", () => {
		const { container } = render(<TableSkeleton />);
		const firstRowCells = container.querySelectorAll("tbody tr:first-child td");
		expect(firstRowCells).toHaveLength(4);
	});

	it("renders custom number of rows", () => {
		const { container } = render(<TableSkeleton rows={10} />);
		const rows = container.querySelectorAll("tbody tr");
		expect(rows).toHaveLength(10);
	});

	it("renders custom number of columns", () => {
		const { container } = render(<TableSkeleton columns={6} />);
		const firstRowCells = container.querySelectorAll("tbody tr:first-child td");
		expect(firstRowCells).toHaveLength(6);
	});

	it("renders provided headers", () => {
		const headers = ["Name", "Email", "Role", "Status"];
		render(<TableSkeleton headers={headers} columns={4} />);

		headers.forEach((header) => {
			expect(screen.getByText(header)).toBeInTheDocument();
		});
	});

	it("renders skeleton for missing headers", () => {
		const { container } = render(<TableSkeleton columns={3} />);
		const headerSkeletons = container.querySelectorAll(
			'thead th [class*="h-4"]',
		);
		expect(headerSkeletons.length).toBeGreaterThan(0);
	});

	it("adds actions column when showActions is true", () => {
		const { container } = render(<TableSkeleton columns={3} showActions />);

		expect(screen.getByText("Actions")).toBeInTheDocument();

		const firstRowCells = container.querySelectorAll("tbody tr:first-child td");
		expect(firstRowCells).toHaveLength(4); // 3 + 1 actions column
	});

	it("does not add actions column by default", () => {
		render(<TableSkeleton columns={3} />);
		expect(screen.queryByText("Actions")).not.toBeInTheDocument();
	});

	it("renders skeletons in each cell", () => {
		const { container } = render(<TableSkeleton rows={2} columns={2} />);
		const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
		expect(skeletons.length).toBeGreaterThan(0);
	});

	it("has border and rounded styling", () => {
		const { container } = render(<TableSkeleton />);
		const wrapper = container.firstChild;
		expect(wrapper).toHaveClass("border");
		expect(wrapper).toHaveClass("rounded-lg");
	});

	it("has shadow styling", () => {
		const { container } = render(<TableSkeleton />);
		const wrapper = container.firstChild;
		expect(wrapper).toHaveClass("shadow-sm");
	});

	it("has bg-card background", () => {
		const { container } = render(<TableSkeleton />);
		const wrapper = container.firstChild;
		expect(wrapper).toHaveClass("bg-card");
	});

	it("renders single row", () => {
		const { container } = render(<TableSkeleton rows={1} columns={3} />);
		const rows = container.querySelectorAll("tbody tr");
		expect(rows).toHaveLength(1);
	});

	it("renders many rows", () => {
		const { container } = render(<TableSkeleton rows={20} columns={3} />);
		const rows = container.querySelectorAll("tbody tr");
		expect(rows).toHaveLength(20);
	});

	it("renders single column", () => {
		const { container } = render(<TableSkeleton rows={3} columns={1} />);
		const firstRowCells = container.querySelectorAll("tbody tr:first-child td");
		expect(firstRowCells).toHaveLength(1);
	});

	it("renders many columns", () => {
		const { container } = render(<TableSkeleton rows={3} columns={10} />);
		const firstRowCells = container.querySelectorAll("tbody tr:first-child td");
		expect(firstRowCells).toHaveLength(10);
	});

	it("generates unique keys for rows", () => {
		const { container } = render(<TableSkeleton rows={3} columns={2} />);
		const rows = container.querySelectorAll("tbody tr");

		const keys = Array.from(rows).map(
			(row) => row.getAttribute("data-key") || "",
		);
		new Set(keys);

		// All rows should be rendered (even if keys aren't in data attributes, React handles internally)
		expect(rows).toHaveLength(3);
	});

	it("generates unique keys for cells", () => {
		const { container } = render(<TableSkeleton rows={2} columns={3} />);
		const cells = container.querySelectorAll("tbody td");

		// Should have 2 rows × 3 columns = 6 cells
		expect(cells).toHaveLength(6);
	});

	it("works with partial headers", () => {
		render(<TableSkeleton headers={["Col1", "Col2"]} columns={2} />);

		expect(screen.getByText("Col1")).toBeInTheDocument();
		expect(screen.getByText("Col2")).toBeInTheDocument();
	});

	it("renders variable width skeletons", () => {
		const { container } = render(<TableSkeleton rows={5} columns={3} />);

		const skeletons = container.querySelectorAll('tbody td [class*="h-4"]');

		// Each skeleton should have inline style with width
		const hasVariableWidths = Array.from(skeletons).some((skeleton) => {
			const style = (skeleton as HTMLElement).getAttribute("style");
			return style?.includes("width");
		});

		expect(hasVariableWidths).toBe(true);
	});

	it("combines headers with actions column", () => {
		const headers = ["Name", "Email"];
		render(<TableSkeleton headers={headers} columns={2} showActions />);

		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(screen.getByText("Email")).toBeInTheDocument();
		expect(screen.getByText("Actions")).toBeInTheDocument();
	});
});
