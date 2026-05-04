import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MultiSelect, type MultiSelectOption } from "./multi-select";

const mockOptions: MultiSelectOption[] = [
	{ value: "option1", label: "Option 1" },
	{ value: "option2", label: "Option 2" },
	{ value: "option3", label: "Option 3" },
];

const groupedOptions: MultiSelectOption[] = [
	{ value: "a1", label: "A1", group: "Group A" },
	{ value: "a2", label: "A2", group: "Group A" },
	{ value: "b1", label: "B1", group: "Group B" },
];

const optionsWithIcons: MultiSelectOption[] = [
	{ value: "opt1", label: "Opt 1", icon: <span data-testid="icon-opt1">I1</span> },
	{ value: "opt2", label: "Opt 2" },
];

const optionsWithDisabled: MultiSelectOption[] = [
	{ value: "enabled1", label: "Enabled 1" },
	{ value: "disabled1", label: "Disabled 1", disabled: true },
	{ value: "enabled2", label: "Enabled 2" },
];

describe("MultiSelect", () => {
	it("renders with placeholder", () => {
		render(
			<MultiSelect options={mockOptions} placeholder="Select options..." />,
		);

		const button = screen.getByRole("combobox");
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent("Select options...");
	});

	it("shows selected values as chips", () => {
		render(
			<MultiSelect options={mockOptions} value={["option1", "option2"]} />,
		);

		const button = screen.getByRole("combobox");
		expect(button).toHaveTextContent("Option 1");
		expect(button).toHaveTextContent("Option 2");
	});

	it("opens popover on click", async () => {
		const user = userEvent.setup();
		render(<MultiSelect options={mockOptions} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
		});
	});

	it("selects multiple options", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect
				options={mockOptions}
				value={[]}
				onValueChange={handleChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const option1 = within(listbox).getByRole("option", { name: "Option 1" });
		await user.click(option1);

		expect(handleChange).toHaveBeenCalledWith(["option1"]);
	});

	it("deselects option when clicked again", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect
				options={mockOptions}
				value={["option1"]}
				onValueChange={handleChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const option1 = within(listbox).getByRole("option", { name: "Option 1" });
		await user.click(option1);

		expect(handleChange).toHaveBeenCalledWith([]);
	});

	it("removes option via chip remove button", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect
				options={mockOptions}
				value={["option1"]}
				onValueChange={handleChange}
			/>,
		);

		const removeButton = screen.getByLabelText("Remove Option 1");
		await user.click(removeButton);

		expect(handleChange).toHaveBeenCalledWith([]);
	});

	it("selects all options", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect
				options={mockOptions}
				value={[]}
				onValueChange={handleChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const selectAll = within(listbox).getByRole("option", {
			name: "Select All",
		});
		await user.click(selectAll);

		expect(handleChange).toHaveBeenCalledWith([
			"option1",
			"option2",
			"option3",
		]);
	});

	it("deselects all when already all selected via select all", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect
				options={mockOptions}
				value={["option1", "option2", "option3"]}
				onValueChange={handleChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const selectAll = within(listbox).getByRole("option", {
			name: "Select All",
		});
		await user.click(selectAll);

		expect(handleChange).toHaveBeenCalledWith([]);
	});

	it("clears all options via trigger button", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect
				options={mockOptions}
				value={["option1", "option2"]}
				onValueChange={handleChange}
			/>,
		);

		const clearAll = screen.getByLabelText("Clear all");
		await user.click(clearAll);

		expect(handleChange).toHaveBeenCalledWith([]);
	});

	it("respects maxSelected limit", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect
				options={mockOptions}
				value={["option1", "option2"]}
				maxSelected={2}
				onValueChange={handleChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const option3 = within(listbox).getByRole("option", { name: "Option 3" });
		expect(option3).toHaveAttribute("aria-disabled", "true");

		await user.click(option3);
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("renders disabled state", () => {
		render(<MultiSelect options={mockOptions} disabled />);

		const button = screen.getByRole("combobox");
		expect(button).toBeDisabled();
	});

	it("renders chips in selection order when preserveSelectionOrder is true", () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={["option3", "option1"]}
				preserveSelectionOrder
			/>,
		);

		const button = screen.getByRole("combobox");
		const chips = within(button).getAllByText(/Option \d/);
		expect(chips[0]).toHaveTextContent("Option 3");
		expect(chips[1]).toHaveTextContent("Option 1");
	});

	it("renders chips in option order when preserveSelectionOrder is false", () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={["option3", "option1"]}
				preserveSelectionOrder={false}
			/>,
		);

		const button = screen.getByRole("combobox");
		const chips = within(button).getAllByText(/Option \d/);
		expect(chips[0]).toHaveTextContent("Option 1");
		expect(chips[1]).toHaveTextContent("Option 3");
	});

	it("hides select all action when showActions is false", async () => {
		const user = userEvent.setup();
		render(<MultiSelect options={mockOptions} showActions={false} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			expect(within(listbox).queryByText("Select All")).not.toBeInTheDocument();
		});
	});

	it("respects maxVisibleSelections prop", () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={["option1", "option2", "option3"]}
				maxVisibleSelections={2}
			/>,
		);

		const button = screen.getByRole("combobox");
		expect(within(button).getByText("Option 1")).toBeInTheDocument();
		expect(within(button).getByText("Option 2")).toBeInTheDocument();
		expect(within(button).queryByText("Option 3")).not.toBeInTheDocument();
		expect(within(button).getByText("+1 more")).toBeInTheDocument();
	});

	it("does not show +N more when maxVisibleSelections is 0", () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={["option1", "option2", "option3"]}
				maxVisibleSelections={0}
			/>,
		);

		const button = screen.getByRole("combobox");
		expect(within(button).queryByText("+")).not.toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(
			<MultiSelect options={mockOptions} className="custom-ms" />,
		);

		const button = screen.getByRole("combobox");
		expect(button).toHaveClass("custom-ms");
	});

	it("renders grouped options", async () => {
		const user = userEvent.setup();
		render(<MultiSelect options={groupedOptions} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			expect(screen.getByText("Group A")).toBeInTheDocument();
			expect(screen.getByText("Group B")).toBeInTheDocument();
		});
	});

	it("selects grouped option", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect options={groupedOptions} onValueChange={handleChange} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const a1 = within(listbox).getByRole("option", { name: "A1" });
		await user.click(a1);

		expect(handleChange).toHaveBeenCalledWith(["a1"]);
	});

	it("selects all skips disabled options", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect
				options={optionsWithDisabled}
				onValueChange={handleChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const selectAll = within(listbox).getByRole("option", {
			name: "Select All",
		});
		await user.click(selectAll);

		// Should only select enabled options
		expect(handleChange).toHaveBeenCalledWith(["enabled1", "enabled2"]);
	});

	it("renders options with icons in chips", () => {
		render(
			<MultiSelect options={optionsWithIcons} value={["opt1"]} />,
		);

		expect(screen.getByTestId("icon-opt1")).toBeInTheDocument();
		expect(screen.getByText("Opt 1")).toBeInTheDocument();
	});

	it("renders options with icons in dropdown", async () => {
		const user = userEvent.setup();
		render(<MultiSelect options={optionsWithIcons} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			expect(screen.getByTestId("icon-opt1")).toBeInTheDocument();
		});
	});

	it("uses custom searchPlaceholder", async () => {
		const user = userEvent.setup();
		render(
			<MultiSelect options={mockOptions} searchPlaceholder="Type here..." />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			expect(screen.getByPlaceholderText("Type here...")).toBeInTheDocument();
		});
	});

	it("uses custom emptyText", async () => {
		const user = userEvent.setup();
		render(
			<MultiSelect options={mockOptions} emptyText="No matches" />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		// Type something that won't match
		const searchInput = await screen.findByPlaceholderText("Search...");
		await user.type(searchInput, "zzz");

		await waitFor(() => {
			expect(screen.getByText("No matches")).toBeInTheDocument();
		});
	});

	it("applies matchTriggerWidth=false style", async () => {
		const user = userEvent.setup();
		render(
			<MultiSelect options={mockOptions} matchTriggerWidth={false} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			// matchTriggerWidth=false applies min-w-[200px] to the Command element, not the listbox
			expect(document.querySelector(".min-w-\\[200px\\]")).toBeInTheDocument();
		});
	});

	it("shows separators between options when showSeparators is true", async () => {
		const user = userEvent.setup();
		render(
			<MultiSelect options={mockOptions} showSeparators />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			// Separator component renders a div, not role="separator"
			expect(document.querySelector('[data-slot="separator"]')).toBeInTheDocument();
		});
	});

	it("hides clear all when showClearAll is false", () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={["option1"]}
				showClearAll={false}
			/>,
		);

		expect(screen.queryByLabelText("Clear all")).not.toBeInTheDocument();
	});

	it("hides clear all when no values selected", () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={[]}
				showClearAll
			/>,
		);

		expect(screen.queryByLabelText("Clear all")).not.toBeInTheDocument();
	});

	it("allows already selected item to be deselected when maxSelected is reached", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect
				options={mockOptions}
				value={["option1", "option2"]}
				maxSelected={2}
				onValueChange={handleChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		// Already-selected item should NOT be disabled even at max
		const option1 = within(listbox).getByRole("option", { name: "Option 1" });
		expect(option1).not.toHaveAttribute("aria-disabled", "true");

		await user.click(option1);
		expect(handleChange).toHaveBeenCalledWith(["option2"]);
	});

	it("shows indeterminate checkbox when some but not all selected", async () => {
		const user = userEvent.setup();
		render(
			<MultiSelect
				options={mockOptions}
				value={["option1"]}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const checkboxes = within(listbox).getAllByRole("checkbox");
		expect(checkboxes.length).toBeGreaterThan(0);
		expect(checkboxes[0]).toHaveAttribute("data-state", "indeterminate");
	});

	it("forwards ref to trigger button", () => {
		const ref = vi.fn();
		render(<MultiSelect options={mockOptions} ref={ref} />);

		expect(ref).toHaveBeenCalled();
	});

	it("renders trigger with aria-disabled when disabled", () => {
		render(<MultiSelect options={mockOptions} disabled />);
		const button = screen.getByRole("combobox");
		expect(button).toHaveAttribute("aria-disabled", "true");
	});

	it("renders trigger with aria-expanded when open", async () => {
		const user = userEvent.setup();
		render(<MultiSelect options={mockOptions} />);

		const button = screen.getByRole("combobox");
		expect(button).toHaveAttribute("aria-expanded", "false");

		await user.click(button);
		expect(button).toHaveAttribute("aria-expanded", "true");
	});

	it("hides select all when showSelectAll is false", async () => {
		const user = userEvent.setup();
		render(
			<MultiSelect options={mockOptions} showSelectAll={false} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			expect(within(listbox).queryByText("Select All")).not.toBeInTheDocument();
		});
	});

	it("shows select all when showActions is true and showSelectAll not explicitly set", async () => {
		const user = userEvent.setup();
		render(<MultiSelect options={mockOptions} showActions />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			expect(within(listbox).queryByText("Select All")).toBeInTheDocument();
		});
	});

	it("shows clear all when showActions is true and showClearAll not explicitly set and values selected", () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={["option1"]}
				showActions
			/>,
		);
		expect(screen.getByLabelText("Clear all")).toBeInTheDocument();
	});

	it("renders all options as chips when maxVisibleSelections is larger than selection", () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={["option1"]}
				maxVisibleSelections={5}
			/>,
		);
		const button = screen.getByRole("combobox");
		expect(within(button).getByText("Option 1")).toBeInTheDocument();
		expect(within(button).queryByText("+")).not.toBeInTheDocument();
	});

	it("searches within the dropdown", async () => {
		const user = userEvent.setup();
		render(<MultiSelect options={mockOptions} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const searchInput = await screen.findByPlaceholderText("Search...");
		await user.type(searchInput, "Option 3");

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			expect(
				within(listbox).getByRole("option", { name: "Option 3" }),
			).toBeInTheDocument();
		});
	});

	it("shows disabled option in dropdown", async () => {
		const user = userEvent.setup();
		render(<MultiSelect options={optionsWithDisabled} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			expect(
				within(listbox).getByRole("option", { name: "Disabled 1" }),
			).toHaveAttribute("aria-disabled", "true");
		});
	});

	it("renders matchTriggerWidth=true style by default", async () => {
		const user = userEvent.setup();
		render(<MultiSelect options={mockOptions} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			// matchTriggerWidth=true applies w-full to the Command element, not the listbox
			expect(document.querySelector(".w-full")).toBeInTheDocument();
		});
	});

	it("hides select all when maxSelected is set", async () => {
		const user = userEvent.setup();
		render(
			<MultiSelect options={mockOptions} maxSelected={2} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			expect(within(listbox).queryByText("Select All")).not.toBeInTheDocument();
		});
	});

	it("renders only grouped options with no ungrouped options", async () => {
		const user = userEvent.setup();
		const allGrouped: MultiSelectOption[] = [
			{ value: "a1", label: "A1", group: "Group A" },
			{ value: "a2", label: "A2", group: "Group A" },
			{ value: "b1", label: "B1", group: "Group B" },
		];

		render(<MultiSelect options={allGrouped} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			expect(screen.getByText("Group A")).toBeInTheDocument();
			expect(screen.getByText("Group B")).toBeInTheDocument();
			expect(screen.getByRole("option", { name: "A1" })).toBeInTheDocument();
			expect(screen.getByRole("option", { name: "A2" })).toBeInTheDocument();
			expect(screen.getByRole("option", { name: "B1" })).toBeInTheDocument();
		});
	});

	it("selects all grouped options via select all", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect options={groupedOptions} onValueChange={handleChange} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const selectAll = within(listbox).getByRole("option", {
			name: "Select All",
		});
		await user.click(selectAll);

		expect(handleChange).toHaveBeenCalledWith(["a1", "a2", "b1"]);
	});

	it("deselects all grouped options via select all", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect
				options={groupedOptions}
				value={["a1", "a2", "b1"]}
				onValueChange={handleChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const selectAll = within(listbox).getByRole("option", {
			name: "Select All",
		});
		await user.click(selectAll);

		expect(handleChange).toHaveBeenCalledWith([]);
	});

	it("renders grouped options with icons", async () => {
		const user = userEvent.setup();
		const groupedWithIcons: MultiSelectOption[] = [
			{ value: "x1", label: "X1", group: "G1", icon: <span data-testid="g-icon">I</span> },
			{ value: "x2", label: "X2", group: "G1" },
		];

		render(<MultiSelect options={groupedWithIcons} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			expect(screen.getByTestId("g-icon")).toBeInTheDocument();
		});
	});

	it("renders grouped options with separators", async () => {
		const user = userEvent.setup();
		render(
			<MultiSelect options={groupedOptions} showSeparators />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			// Separator component renders a div, not role="separator"
			expect(document.querySelector('[data-slot="separator"]')).toBeInTheDocument();
		});
	});

	it("disables non-selected grouped options when maxSelected is reached", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect
				options={groupedOptions}
				value={["a1"]}
				maxSelected={1}
				onValueChange={handleChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const a2 = within(listbox).getByRole("option", { name: "A2" });
		expect(a2).toHaveAttribute("aria-disabled", "true");

		// Already-selected item should not be disabled
		const a1 = within(listbox).getByRole("option", { name: "A1" });
		expect(a1).not.toHaveAttribute("aria-disabled", "true");
	});

	it("applies truncate class to grouped options when matchTriggerWidth is false", async () => {
		const user = userEvent.setup();
		render(
			<MultiSelect options={groupedOptions} matchTriggerWidth={false} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			// matchTriggerWidth=false applies truncate class to option label spans
			const truncated = document.querySelector(".truncate");
			expect(truncated).toBeInTheDocument();
		});
	});

	it("selects grouped option via click", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<MultiSelect options={groupedOptions} value={["a1"]} onValueChange={handleChange} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const a2 = within(listbox).getByRole("option", { name: "A2" });
		await user.click(a2);

		expect(handleChange).toHaveBeenCalledWith(["a1", "a2"]);
	});

	it("renders grouped options with disabled items", async () => {
		const user = userEvent.setup();
		const groupedWithDisabled: MultiSelectOption[] = [
			{ value: "g1", label: "G1", group: "G", disabled: true },
			{ value: "g2", label: "G2", group: "G" },
		];

		render(<MultiSelect options={groupedWithDisabled} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			expect(
				within(listbox).getByRole("option", { name: "G1" }),
			).toHaveAttribute("aria-disabled", "true");
		});
	});

	it("selects all skips disabled grouped options", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		const groupedDisabled: MultiSelectOption[] = [
			{ value: "g1", label: "G1", group: "G", disabled: true },
			{ value: "g2", label: "G2", group: "G" },
		];

		render(
			<MultiSelect options={groupedDisabled} onValueChange={handleChange} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const selectAll = within(listbox).getByRole("option", {
			name: "Select All",
		});
		await user.click(selectAll);

		expect(handleChange).toHaveBeenCalledWith(["g2"]);
	});

	it("renders chips with icons for selected grouped options", () => {
		const groupedWithIcons: MultiSelectOption[] = [
			{ value: "x1", label: "X1", group: "G1", icon: <span data-testid="chip-icon">I</span> },
		];

		render(<MultiSelect options={groupedWithIcons} value={["x1"]} />);
		expect(screen.getByTestId("chip-icon")).toBeInTheDocument();
	});
});
