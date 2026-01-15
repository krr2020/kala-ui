import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MultiSelect, type MultiSelectOption } from "./multi-select";

const mockOptions: MultiSelectOption[] = [
	{ value: "option1", label: "Option 1" },
	{ value: "option2", label: "Option 2" },
	{ value: "option3", label: "Option 3" },
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
		// Option 3 should be disabled because max selected reached
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
});
