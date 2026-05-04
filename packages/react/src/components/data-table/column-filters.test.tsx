import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ColumnFilters } from "./column-filters";
import type { FilterableColumn, FilterConfig } from "./data-table.types";

interface TestRow {
	name: string;
	status: string;
}

const selectColumn: FilterableColumn<TestRow> = {
	key: "status",
	label: "Status",
	type: "select",
	options: [
		{ label: "Active", value: "active" },
		{ label: "Inactive", value: "inactive" },
	],
};

const textColumn: FilterableColumn<TestRow> = {
	key: "name",
	label: "Name",
	type: "text",
	placeholder: "Search by name",
};

describe("ColumnFilters", () => {
	it("renders without crashing", () => {
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[selectColumn]}
				activeFilters={[]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		expect(screen.getByText("Status:")).toBeInTheDocument();
	});

	it("returns null when filterableColumns is empty", () => {
		const { container } = render(
			<ColumnFilters<TestRow>
				filterableColumns={[]}
				activeFilters={[]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		expect(container.innerHTML).toBe("");
	});

	it("renders select filter with label", () => {
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[selectColumn]}
				activeFilters={[]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		expect(screen.getByText("Status:")).toBeInTheDocument();
	});

	it("renders text filter with label", () => {
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[textColumn]}
				activeFilters={[]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		expect(screen.getByText("Name:")).toBeInTheDocument();
	});

	it("renders text filter input with correct placeholder", () => {
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[textColumn]}
				activeFilters={[]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		const input = screen.getByPlaceholderText("Search by name");
		expect(input).toBeInTheDocument();
	});

	it("renders text filter with default placeholder when none provided", () => {
		const columnWithoutPlaceholder: FilterableColumn<TestRow> = {
			key: "name",
			label: "Name",
			type: "text",
		};
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[columnWithoutPlaceholder]}
				activeFilters={[]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		const input = screen.getByPlaceholderText("Filter by Name");
		expect(input).toBeInTheDocument();
	});

	it("renders both select and text filters", () => {
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[selectColumn, textColumn]}
				activeFilters={[]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		expect(screen.getByText("Status:")).toBeInTheDocument();
		expect(screen.getByText("Name:")).toBeInTheDocument();
	});

	it("does not show Clear filters button when no active filters", () => {
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[selectColumn]}
				activeFilters={[]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Clear filters")).not.toBeInTheDocument();
	});

	it("shows Clear filters button when active filters exist", () => {
		const activeFilter: FilterConfig<TestRow> = {
			key: "status",
			operator: "equals",
			value: "active",
		};
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[selectColumn]}
				activeFilters={[activeFilter]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		expect(screen.getByText("Clear filters")).toBeInTheDocument();
	});

	it("calls onClearAll when Clear filters is clicked", () => {
		const onClearAll = vi.fn();
		const activeFilter: FilterConfig<TestRow> = {
			key: "status",
			operator: "equals",
			value: "active",
		};
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[selectColumn]}
				activeFilters={[activeFilter]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={onClearAll}
			/>,
		);
		screen.getByText("Clear filters").click();
		expect(onClearAll).toHaveBeenCalledOnce();
	});

	it("renders text filter with active value", () => {
		const activeFilter: FilterConfig<TestRow> = {
			key: "name",
			operator: "contains",
			value: "John",
		};
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[textColumn]}
				activeFilters={[activeFilter]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		const input = screen.getByPlaceholderText("Search by name") as HTMLInputElement;
		expect(input.value).toBe("John");
	});

	it("calls onFilterChange when text input changes", () => {
		const onFilterChange = vi.fn();
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[textColumn]}
				activeFilters={[]}
				onFilterChange={onFilterChange}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		const input = screen.getByPlaceholderText("Search by name");
		// Need to use fireEvent because userEvent is not imported
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			"value",
		)?.set;
		nativeInputValueSetter?.call(input, "test");
		input.dispatchEvent(new Event("change", { bubbles: true }));
		expect(onFilterChange).toHaveBeenCalledWith({
			key: "name",
			operator: "contains",
			value: "test",
		});
	});

	it("calls onFilterRemove when text input is cleared", () => {
		const onFilterRemove = vi.fn();
		const activeFilter: FilterConfig<TestRow> = {
			key: "name",
			operator: "contains",
			value: "John",
		};
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[textColumn]}
				activeFilters={[activeFilter]}
				onFilterChange={vi.fn()}
				onFilterRemove={onFilterRemove}
				onClearAll={vi.fn()}
			/>,
		);
		const input = screen.getByPlaceholderText("Search by name");
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			"value",
		)?.set;
		nativeInputValueSetter?.call(input, "");
		input.dispatchEvent(new Event("change", { bubbles: true }));
		expect(onFilterRemove).toHaveBeenCalledWith("name");
	});

	it("shows clear button for active text filter with correct aria-label", () => {
		const activeFilter: FilterConfig<TestRow> = {
			key: "name",
			operator: "contains",
			value: "John",
		};
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[textColumn]}
				activeFilters={[activeFilter]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		const clearBtn = screen.getByRole("button", {
			name: "Clear Name filter",
		});
		expect(clearBtn).toBeInTheDocument();
	});

	it("calls onFilterRemove when clear button is clicked", () => {
		const onFilterRemove = vi.fn();
		const activeFilter: FilterConfig<TestRow> = {
			key: "name",
			operator: "contains",
			value: "John",
		};
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[textColumn]}
				activeFilters={[activeFilter]}
				onFilterChange={vi.fn()}
				onFilterRemove={onFilterRemove}
				onClearAll={vi.fn()}
			/>,
		);
		screen.getByRole("button", { name: "Clear Name filter" }).click();
		expect(onFilterRemove).toHaveBeenCalledWith("name");
	});

	it("does not show clear button when text filter has no value", () => {
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[textColumn]}
				activeFilters={[]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		expect(
			screen.queryByRole("button", { name: "Clear Name filter" }),
		).not.toBeInTheDocument();
	});

	it("renders wrapper with flex layout", () => {
		const { container } = render(
			<ColumnFilters<TestRow>
				filterableColumns={[selectColumn]}
				activeFilters={[]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper).toHaveClass("flex", "flex-wrap", "items-center", "gap-2");
	});

	it("ignores unknown filter types and does not render them", () => {
		const unknownColumn = {
			key: "name" as keyof TestRow,
			label: "Name",
			type: "unknown" as const,
		};
		render(
			<ColumnFilters<TestRow>
				filterableColumns={[unknownColumn]}
				activeFilters={[]}
				onFilterChange={vi.fn()}
				onFilterRemove={vi.fn()}
				onClearAll={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Name:")).not.toBeInTheDocument();
	});
});
