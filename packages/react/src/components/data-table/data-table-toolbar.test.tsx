import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTableToolbar } from "./data-table-toolbar";
import type { BulkAction, SearchConfig } from "./data-table.types";

interface TestRow {
	id: string;
	name: string;
}

const baseSearchConfig: SearchConfig<TestRow> = {
	placeholder: "Search...",
	ariaLabel: "Search table",
};

describe("DataTableToolbar", () => {
	it("returns null when no search, no bulk actions, no toolbar content", () => {
		const { container } = render(
			<DataTableToolbar<TestRow>
				searchConfig={null}
				searchQuery=""
				onSearchChange={vi.fn()}
				selectedRows={[]}
				selectedIdsCount={0}
				hasData={true}
			/>,
		);
		expect(container.innerHTML).toBe("");
	});

	it("renders search input when searchConfig is provided and hasData is true", () => {
		render(
			<DataTableToolbar<TestRow>
				searchConfig={baseSearchConfig}
				searchQuery=""
				onSearchChange={vi.fn()}
				selectedRows={[]}
				selectedIdsCount={0}
				hasData={true}
			/>,
		);
		expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
	});

	it("renders search input when searchConfig is provided and searchQuery is present", () => {
		render(
			<DataTableToolbar<TestRow>
				searchConfig={baseSearchConfig}
				searchQuery="test"
				onSearchChange={vi.fn()}
				selectedRows={[]}
				selectedIdsCount={0}
				hasData={false}
			/>,
		);
		expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
	});

	it("does not render search input when hasData is false and no query", () => {
		const { container } = render(
			<DataTableToolbar<TestRow>
				searchConfig={baseSearchConfig}
				searchQuery=""
				onSearchChange={vi.fn()}
				selectedRows={[]}
				selectedIdsCount={0}
				hasData={false}
			/>,
		);
		expect(container.innerHTML).toBe("");
	});

	it("calls onSearchChange when typing in search input", async () => {
		const user = userEvent.setup();
		const onSearchChange = vi.fn();
		render(
			<DataTableToolbar<TestRow>
				searchConfig={baseSearchConfig}
				searchQuery=""
				onSearchChange={onSearchChange}
				selectedRows={[]}
				selectedIdsCount={0}
				hasData={true}
			/>,
		);

		await user.type(screen.getByPlaceholderText("Search..."), "hello");
		expect(onSearchChange).toHaveBeenCalled();
	});

	it("renders clear search button when searchQuery is present", () => {
		render(
			<DataTableToolbar<TestRow>
				searchConfig={baseSearchConfig}
				searchQuery="test query"
				onSearchChange={vi.fn()}
				selectedRows={[]}
				selectedIdsCount={0}
				hasData={true}
			/>,
		);
		expect(
			screen.getByRole("button", { name: "Clear search" }),
		).toBeInTheDocument();
	});

	it("calls onSearchChange with empty string when clearing search", async () => {
		const user = userEvent.setup();
		const onSearchChange = vi.fn();
		render(
			<DataTableToolbar<TestRow>
				searchConfig={baseSearchConfig}
				searchQuery="test query"
				onSearchChange={onSearchChange}
				selectedRows={[]}
				selectedIdsCount={0}
				hasData={true}
			/>,
		);

		await user.click(screen.getByRole("button", { name: "Clear search" }));
		expect(onSearchChange).toHaveBeenCalledWith("");
	});

	it("does not render clear button when searchQuery is empty", () => {
		render(
			<DataTableToolbar<TestRow>
				searchConfig={baseSearchConfig}
				searchQuery=""
				onSearchChange={vi.fn()}
				selectedRows={[]}
				selectedIdsCount={0}
				hasData={true}
			/>,
		);
		expect(
			screen.queryByRole("button", { name: "Clear search" }),
		).not.toBeInTheDocument();
	});

	it("renders bulk actions when provided", () => {
		const bulkActions: BulkAction<TestRow>[] = [
			{ id: "delete", label: "Delete", onClick: vi.fn() },
			{ id: "edit", label: "Edit", onClick: vi.fn() },
		];
		render(
			<DataTableToolbar<TestRow>
				searchConfig={null}
				searchQuery=""
				onSearchChange={vi.fn()}
				bulkActions={bulkActions}
				selectedRows={[]}
				selectedIdsCount={2}
				hasData={true}
			/>,
		);
		expect(screen.getByText("2 selected")).toBeInTheDocument();
		expect(screen.getByText("Delete")).toBeInTheDocument();
		expect(screen.getByText("Edit")).toBeInTheDocument();
	});

	it("disables bulk action buttons when no rows selected", () => {
		const bulkActions: BulkAction<TestRow>[] = [
			{ id: "delete", label: "Delete", onClick: vi.fn() },
		];
		render(
			<DataTableToolbar<TestRow>
				searchConfig={null}
				searchQuery=""
				onSearchChange={vi.fn()}
				bulkActions={bulkActions}
				selectedRows={[]}
				selectedIdsCount={0}
				hasData={true}
			/>,
		);
		expect(screen.getByText("Delete")).toBeDisabled();
	});

	it("enables bulk action buttons when rows are selected", () => {
		const bulkActions: BulkAction<TestRow>[] = [
			{ id: "delete", label: "Delete", onClick: vi.fn() },
		];
		render(
			<DataTableToolbar<TestRow>
				searchConfig={null}
				searchQuery=""
				onSearchChange={vi.fn()}
				bulkActions={bulkActions}
				selectedRows={[]}
				selectedIdsCount={3}
				hasData={true}
			/>,
		);
		expect(screen.getByText("Delete")).not.toBeDisabled();
	});

	it("calls bulk action onClick with selectedRows when clicked", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const selectedRows = [{ id: "1", name: "Test" }];
		const bulkActions: BulkAction<TestRow>[] = [
			{ id: "delete", label: "Delete", onClick },
		];
		render(
			<DataTableToolbar<TestRow>
				searchConfig={null}
				searchQuery=""
				onSearchChange={vi.fn()}
				bulkActions={bulkActions}
				selectedRows={selectedRows}
				selectedIdsCount={1}
				hasData={true}
			/>,
		);

		await user.click(screen.getByText("Delete"));
		expect(onClick).toHaveBeenCalledWith(selectedRows);
	});

	it("respects disabled prop on individual bulk action", () => {
		const bulkActions: BulkAction<TestRow>[] = [
			{ id: "delete", label: "Delete", onClick: vi.fn(), disabled: true },
		];
		render(
			<DataTableToolbar<TestRow>
				searchConfig={null}
				searchQuery=""
				onSearchChange={vi.fn()}
				bulkActions={bulkActions}
				selectedRows={[]}
				selectedIdsCount={5}
				hasData={true}
			/>,
		);
		expect(screen.getByText("Delete")).toBeDisabled();
	});

	it("renders toolbarContent when provided", () => {
		render(
			<DataTableToolbar<TestRow>
				searchConfig={null}
				searchQuery=""
				onSearchChange={vi.fn()}
				toolbarContent={<div>Custom Toolbar</div>}
				selectedRows={[]}
				selectedIdsCount={0}
				hasData={true}
			/>,
		);
		expect(screen.getByText("Custom Toolbar")).toBeInTheDocument();
	});

	it("renders bulk action with custom variant", () => {
		const bulkActions: BulkAction<TestRow>[] = [
			{ id: "delete", label: "Delete", onClick: vi.fn(), variant: "destructive" },
		];
		render(
			<DataTableToolbar<TestRow>
				searchConfig={null}
				searchQuery=""
				onSearchChange={vi.fn()}
				bulkActions={bulkActions}
				selectedRows={[]}
				selectedIdsCount={1}
				hasData={true}
			/>,
		);
		const btn = screen.getByText("Delete");
		expect(btn).toBeInTheDocument();
	});

	it("applies className prop", () => {
		const { container } = render(
			<DataTableToolbar<TestRow>
				searchConfig={baseSearchConfig}
				searchQuery=""
				onSearchChange={vi.fn()}
				selectedRows={[]}
				selectedIdsCount={0}
				hasData={true}
				className="custom-class"
			/>,
		);
		const toolbar = container.querySelector(".custom-class");
		expect(toolbar).toBeInTheDocument();
	});

	it("sets aria-label from searchConfig", () => {
		render(
			<DataTableToolbar<TestRow>
				searchConfig={baseSearchConfig}
				searchQuery=""
				onSearchChange={vi.fn()}
				selectedRows={[]}
				selectedIdsCount={0}
				hasData={true}
			/>,
		);
		expect(screen.getByLabelText("Search table")).toBeInTheDocument();
	});

	it("renders both search and bulk actions together", () => {
		const bulkActions: BulkAction<TestRow>[] = [
			{ id: "delete", label: "Delete", onClick: vi.fn() },
		];
		render(
			<DataTableToolbar<TestRow>
				searchConfig={baseSearchConfig}
				searchQuery=""
				onSearchChange={vi.fn()}
				bulkActions={bulkActions}
				selectedRows={[]}
				selectedIdsCount={1}
				hasData={true}
			/>,
		);
		expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
		expect(screen.getByText("Delete")).toBeInTheDocument();
	});
});
