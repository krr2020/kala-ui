import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTableFilterChips } from "./data-table-filter-chips";
import type { FilterConfig, FilterableColumn } from "./data-table.types";

interface TestRow {
	id: string;
	name: string;
	status: string;
	role: string;
}

const filterableColumns: FilterableColumn<TestRow>[] = [
	{ key: "status", label: "Status", type: "select", options: [] },
	{ key: "role", label: "Role", type: "select", options: [] },
];

const baseProps = {
	filterableColumns,
	onSetFilter: vi.fn(),
	onRemoveFilter: vi.fn(),
	onClearFilters: vi.fn(),
};

describe("DataTableFilterChips", () => {
	it("returns null when no filters are active", () => {
		const { container } = render(
			<DataTableFilterChips<TestRow> {...baseProps} filterConfigs={[]} />,
		);
		expect(container.innerHTML).toBe("");
	});

it("renders chips for single-value filters (no matching option – shows raw value)", () => {
		const filterConfigs: FilterConfig<TestRow>[] = [
			{ key: "status", operator: "equals", value: "active" },
		];
		render(
			<DataTableFilterChips<TestRow>
				{...baseProps}
				filterConfigs={filterConfigs}
			/>,
		);
		expect(screen.getByText(/Active filters/)).toBeInTheDocument();
		expect(screen.getByText("active")).toBeInTheDocument();
	});

	it("renders option labels when options match", () => {
		const columnsWithLabels: FilterableColumn<TestRow>[] = [
			{ key: "status", label: "Status", type: "select", options: [{ label: "Active", value: "active" }, { label: "Pending", value: "pending" }] },
		];
		const filterConfigs: FilterConfig<TestRow>[] = [
			{ key: "status", operator: "equals", value: "active" },
		];
		render(
			<DataTableFilterChips<TestRow>
				{...baseProps}
				filterableColumns={columnsWithLabels}
				filterConfigs={filterConfigs}
			/>,
		);
		expect(screen.getByText("Active")).toBeInTheDocument();
		expect(screen.queryByText("active")).not.toBeInTheDocument();
	});

	it("renders chips for multi-value (array) filters", () => {
		const filterConfigs: FilterConfig<TestRow>[] = [
			{ key: "role", operator: "in", value: ["admin", "user"] },
		];
		render(
			<DataTableFilterChips<TestRow>
				{...baseProps}
				filterConfigs={filterConfigs}
			/>,
		);
		expect(screen.getByText("admin")).toBeInTheDocument();
		expect(screen.getByText("user")).toBeInTheDocument();
	});

	it("calls onRemoveFilter when removing single-value filter", async () => {
		const user = userEvent.setup();
		const filterConfigs: FilterConfig<TestRow>[] = [
			{ key: "status", operator: "equals", value: "active" },
		];
		render(
			<DataTableFilterChips<TestRow>
				{...baseProps}
				filterConfigs={filterConfigs}
			/>,
		);

		const removeBtn = screen.getByRole("button", {
			name: "Remove active",
		});
		await user.click(removeBtn);
		expect(baseProps.onRemoveFilter).toHaveBeenCalledWith("status");
	});

	it("calls onSetFilter with updated values when removing from multi-value filter", async () => {
		const user = userEvent.setup();
		const filterConfigs: FilterConfig<TestRow>[] = [
			{ key: "role", operator: "in", value: ["admin", "user", "editor"] },
		];
		render(
			<DataTableFilterChips<TestRow>
				{...baseProps}
				filterConfigs={filterConfigs}
			/>,
		);

		const removeBtn = screen.getByRole("button", {
			name: "Remove admin",
		});
		await user.click(removeBtn);
		expect(baseProps.onSetFilter).toHaveBeenCalledWith({
			key: "role",
			operator: "in",
			value: ["user", "editor"],
		});
	});

	it("calls onClearFilters when clicking Clear all", async () => {
		const user = userEvent.setup();
		const filterConfigs: FilterConfig<TestRow>[] = [
			{ key: "status", operator: "equals", value: "active" },
		];
		render(
			<DataTableFilterChips<TestRow>
				{...baseProps}
				filterConfigs={filterConfigs}
			/>,
		);

		await user.click(screen.getByRole("button", { name: /Clear all/ }));
		expect(baseProps.onClearFilters).toHaveBeenCalled();
	});

	it("skips filters for columns not found in filterableColumns", () => {
		const filterConfigs: FilterConfig<TestRow>[] = [
			{ key: "unknown" as keyof TestRow, operator: "equals", value: "test" },
		];
		render(
			<DataTableFilterChips<TestRow>
				{...baseProps}
				filterConfigs={filterConfigs}
			/>,
		);
		expect(screen.getByText(/Active filters/)).toBeInTheDocument();
		// No chips should be rendered for unknown column
		expect(screen.queryByText("test")).not.toBeInTheDocument();
	});

	it("renders correct aria-label for remove buttons", () => {
		const filterConfigs: FilterConfig<TestRow>[] = [
			{ key: "status", operator: "in", value: ["active", "pending"] },
		];
		render(
			<DataTableFilterChips<TestRow>
				{...baseProps}
				filterConfigs={filterConfigs}
			/>,
		);
		expect(
			screen.getByRole("button", { name: "Remove active" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Remove pending" }),
		).toBeInTheDocument();
	});
});
