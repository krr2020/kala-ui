import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ColumnHeaderFilter } from "./column-header-filter";
import type { FilterableColumn, FilterConfig } from "./data-table.types";

interface TestRow {
	id: string;
	name: string;
	status: string;
}

const selectColumn: FilterableColumn<TestRow> = {
	key: "status",
	label: "Status",
	type: "select",
	options: [
		{ value: "active", label: "Active" },
		{ value: "inactive", label: "Inactive" },
		{ value: "pending", label: "Pending" },
	],
};

const textColumn: FilterableColumn<TestRow> = {
	key: "name",
	label: "Name",
	type: "text",
	placeholder: "Filter by name",
};

describe("ColumnHeaderFilter", () => {
	const baseProps = {
		column: selectColumn,
		activeFilters: [] as FilterConfig<TestRow>[],
		onFilterChange: vi.fn(),
		onFilterRemove: vi.fn(),
	};

	it("renders filter button with correct aria-label", () => {
		render(<ColumnHeaderFilter {...baseProps} />);
		expect(
			screen.getByRole("button", { name: "Filter by Status" }),
		).toBeInTheDocument();
	});

	it("shows filter icon in muted color when no active filter", () => {
		const { container } = render(<ColumnHeaderFilter {...baseProps} />);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("class")).toContain("text-muted-foreground");
	});

	it("shows active filter badge when filter is active (select)", () => {
		render(
			<ColumnHeaderFilter
				{...baseProps}
				activeFilters={[
					{ key: "status", operator: "in", value: ["active", "pending"] },
				]}
			/>,
		);
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("shows active filter badge with count 1 for text filter", () => {
		render(
			<ColumnHeaderFilter
				{...baseProps}
				column={textColumn}
				activeFilters={[
					{ key: "name", operator: "contains", value: "test" },
				]}
			/>,
		);
		expect(screen.getByText("1")).toBeInTheDocument();
	});

	it("opens popover and renders select options when clicked", async () => {
		const user = userEvent.setup();
		render(<ColumnHeaderFilter {...baseProps} />);
		await user.click(
			screen.getByRole("button", { name: "Filter by Status" }),
		);
		expect(screen.getByText("Filter by Status")).toBeInTheDocument();
		expect(screen.getByText("Active")).toBeInTheDocument();
		expect(screen.getByText("Inactive")).toBeInTheDocument();
		expect(screen.getByText("Pending")).toBeInTheDocument();
	});

	it("calls onFilterChange when selecting a checkbox option", async () => {
		const user = userEvent.setup();
		const onFilterChange = vi.fn();
		render(
			<ColumnHeaderFilter
				{...baseProps}
				onFilterChange={onFilterChange}
			/>,
		);
		await user.click(
			screen.getByRole("button", { name: "Filter by Status" }),
		);
		await user.click(screen.getByText("Active"));
		expect(onFilterChange).toHaveBeenCalledWith({
			key: "status",
			operator: "in",
			value: ["active"],
		});
	});

	it("calls onFilterRemove when deselecting the only selected option", async () => {
		const user = userEvent.setup();
		const onFilterRemove = vi.fn();
		render(
			<ColumnHeaderFilter
				{...baseProps}
				activeFilters={[
					{ key: "status", operator: "in", value: ["active"] },
				]}
				onFilterRemove={onFilterRemove}
			/>,
		);
		await user.click(
			screen.getByRole("button", { name: "Filter by Status" }),
		);
		await user.click(screen.getByText("Active"));
		expect(onFilterRemove).toHaveBeenCalledWith("status");
	});

	it("calls onFilterChange with multiple values when selecting multiple options", async () => {
		const user = userEvent.setup();
		const onFilterChange = vi.fn();
		render(
			<ColumnHeaderFilter
				{...baseProps}
				activeFilters={[
					{ key: "status", operator: "in", value: ["active"] },
				]}
				onFilterChange={onFilterChange}
			/>,
		);
		await user.click(
			screen.getByRole("button", { name: "Filter by Status" }),
		);
		await user.click(screen.getByText("Pending"));
		expect(onFilterChange).toHaveBeenCalledWith({
			key: "status",
			operator: "in",
			value: ["active", "pending"],
		});
	});

	it("renders text input for text type column", async () => {
		const user = userEvent.setup();
		render(
			<ColumnHeaderFilter {...baseProps} column={textColumn} />,
		);
		await user.click(
			screen.getByRole("button", { name: "Filter by Name" }),
		);
		expect(
			screen.getByPlaceholderText("Filter by name"),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Apply/ })).toBeInTheDocument();
	});

	it("calls onFilterChange when applying text filter", async () => {
		const user = userEvent.setup();
		const onFilterChange = vi.fn();
		render(
			<ColumnHeaderFilter
				{...baseProps}
				column={textColumn}
				onFilterChange={onFilterChange}
			/>,
		);
		await user.click(
			screen.getByRole("button", { name: "Filter by Name" }),
		);
		await user.type(screen.getByPlaceholderText("Filter by name"), "test");
		await user.click(screen.getByRole("button", { name: /Apply/ }));
		expect(onFilterChange).toHaveBeenCalledWith({
			key: "name",
			operator: "contains",
			value: "test",
		});
	});

	it("calls onFilterChange when pressing Enter in text input", async () => {
		const user = userEvent.setup();
		const onFilterChange = vi.fn();
		render(
			<ColumnHeaderFilter
				{...baseProps}
				column={textColumn}
				onFilterChange={onFilterChange}
			/>,
		);
		await user.click(
			screen.getByRole("button", { name: "Filter by Name" }),
		);
		await user.type(screen.getByPlaceholderText("Filter by name"), "test{Enter}");
		expect(onFilterChange).toHaveBeenCalledWith({
			key: "name",
			operator: "contains",
			value: "test",
		});
	});

	it("uses custom operator for text column", async () => {
		const user = userEvent.setup();
		const onFilterChange = vi.fn();
		const customTextColumn: FilterableColumn<TestRow> = {
			...textColumn,
			operator: "startsWith",
		};
		render(
			<ColumnHeaderFilter
				{...baseProps}
				column={customTextColumn}
				onFilterChange={onFilterChange}
			/>,
		);
		await user.click(
			screen.getByRole("button", { name: "Filter by Name" }),
		);
		await user.type(screen.getByPlaceholderText("Filter by name"), "abc{Enter}");
		expect(onFilterChange).toHaveBeenCalledWith({
			key: "name",
			operator: "startsWith",
			value: "abc",
		});
	});

	it("does not apply empty text filter", async () => {
		const user = userEvent.setup();
		const onFilterChange = vi.fn();
		render(
			<ColumnHeaderFilter
				{...baseProps}
				column={textColumn}
				onFilterChange={onFilterChange}
			/>,
		);
		await user.click(
			screen.getByRole("button", { name: "Filter by Name" }),
		);
		await user.click(screen.getByRole("button", { name: /Apply/ }));
		expect(onFilterChange).not.toHaveBeenCalled();
	});

	it("renders Clear button when filter is active", async () => {
		const user = userEvent.setup();
		render(
			<ColumnHeaderFilter
				{...baseProps}
				activeFilters={[
					{ key: "status", operator: "in", value: ["active"] },
				]}
			/>,
		);
		await user.click(
			screen.getByRole("button", { name: "Filter by Status" }),
		);
		expect(screen.getByRole("button", { name: /Clear/ })).toBeInTheDocument();
	});

	it("calls onFilterRemove when clicking Clear button", async () => {
		const user = userEvent.setup();
		const onFilterRemove = vi.fn();
		render(
			<ColumnHeaderFilter
				{...baseProps}
				activeFilters={[
					{ key: "status", operator: "in", value: ["active"] },
				]}
				onFilterRemove={onFilterRemove}
			/>,
		);
		await user.click(
			screen.getByRole("button", { name: "Filter by Status" }),
		);
		await user.click(screen.getByRole("button", { name: /Clear/ }));
		expect(onFilterRemove).toHaveBeenCalledWith("status");
	});

	it("does not render Clear button when no active filter", async () => {
		const user = userEvent.setup();
		render(<ColumnHeaderFilter {...baseProps} />);
		await user.click(
			screen.getByRole("button", { name: "Filter by Status" }),
		);
		expect(
			screen.queryByRole("button", { name: /Clear/ }),
		).not.toBeInTheDocument();
	});

	it("uses default placeholder for text column without placeholder", async () => {
		const user = userEvent.setup();
		const noPlaceholderColumn: FilterableColumn<TestRow> = {
			...textColumn,
			placeholder: undefined,
		};
		render(
			<ColumnHeaderFilter
				{...baseProps}
				column={noPlaceholderColumn}
			/>,
		);
		await user.click(
			screen.getByRole("button", { name: "Filter by Name" }),
		);
		expect(
			screen.getByPlaceholderText("Filter by Name"),
		).toBeInTheDocument();
	});

	it("shows filter icon in primary color when filter is active", () => {
		const { container } = render(
			<ColumnHeaderFilter
				{...baseProps}
				activeFilters={[
					{ key: "status", operator: "in", value: ["active"] },
				]}
			/>,
		);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("class")).toContain("text-primary");
	});
});
