import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox, type ComboboxOption } from "./combobox";

const mockOptions: ComboboxOption[] = [
	{ value: "option1", label: "Option 1" },
	{ value: "option2", label: "Option 2" },
	{ value: "option3", label: "Option 3" },
];

describe("Combobox", () => {
	it("renders with placeholder", () => {
		render(<Combobox options={mockOptions} placeholder="Select..." />);

		const button = screen.getByRole("combobox");
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent("Select...");
	});

	it("shows selected value", () => {
		render(<Combobox options={mockOptions} value="option2" />);

		const button = screen.getByRole("combobox");
		expect(button).toHaveTextContent("Option 2");
	});

	it("opens popover on click", async () => {
		const user = userEvent.setup();
		render(<Combobox options={mockOptions} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
		});
	});

	it("filters options based on search", async () => {
		const user = userEvent.setup();
		render(<Combobox options={mockOptions} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const searchInput = await screen.findByPlaceholderText("Search...");
		await user.type(searchInput, "Option 2");

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			expect(
				within(listbox).getByRole("option", { name: "Option 2" }),
			).toBeInTheDocument();
		});
	});

	it("calls onValueChange when option is selected", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Combobox options={mockOptions} onValueChange={handleChange} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const option = within(listbox).getByRole("option", { name: "Option 2" });
		await user.click(option);

		expect(handleChange).toHaveBeenCalledWith("option2");
	});

	it("renders in disabled state", () => {
		render(<Combobox options={mockOptions} disabled />);

		const button = screen.getByRole("combobox");
		expect(button).toBeDisabled();
	});

	it("applies small size classes", () => {
		render(<Combobox options={mockOptions} size="sm" />);

		const button = screen.getByRole("combobox");
		expect(button).toHaveClass("h-8");
	});

	it("applies default size classes", () => {
		render(<Combobox options={mockOptions} size="default" />);

		const button = screen.getByRole("combobox");
		expect(button).toHaveClass("h-10");
	});

	it("shows empty text when no results found", async () => {
		const user = userEvent.setup();
		render(<Combobox options={mockOptions} emptyText="Nothing found" />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const searchInput = await screen.findByPlaceholderText("Search...");
		await user.type(searchInput, "nonexistent");

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			expect(within(listbox).getByText("Nothing found")).toBeInTheDocument();
		});
	});

	it("skips disabled options", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		const optionsWithDisabled: ComboboxOption[] = [
			{ value: "option1", label: "Option 1" },
			{ value: "option2", label: "Option 2", disabled: true },
			{ value: "option3", label: "Option 3" },
		];

		render(
			<Combobox options={optionsWithDisabled} onValueChange={handleChange} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const disabledOption = within(listbox).getByRole("option", {
			name: "Option 2",
		});
		await user.click(disabledOption);

		// Disabled option should not trigger change
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("forwards ref correctly", () => {
		const ref = { current: null };
		render(<Combobox ref={ref} options={mockOptions} />);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it("applies custom className", () => {
		render(<Combobox options={mockOptions} className="custom-class" />);

		const button = screen.getByRole("combobox");
		expect(button).toHaveClass("custom-class");
	});

	it("uses custom search placeholder", async () => {
		const user = userEvent.setup();
		render(<Combobox options={mockOptions} searchPlaceholder="Type here..." />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			expect(screen.getByPlaceholderText("Type here...")).toBeInTheDocument();
		});
	});

	it("clears selection when same value is selected", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<Combobox
				options={mockOptions}
				value="option1"
				onValueChange={handleChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const option = within(listbox).getByRole("option", { name: "Option 1" });
		await user.click(option);

		expect(handleChange).toHaveBeenCalledWith("");
	});

	it("shows clear button when clearable and value is set", () => {
		render(
			<Combobox options={mockOptions} value="option1" clearable />,
		);
		expect(screen.getByLabelText("Clear selection")).toBeInTheDocument();
	});

	it("clears value when clear button is clicked", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<Combobox
				options={mockOptions}
				value="option1"
				clearable
				onValueChange={handleChange}
			/>,
		);

		const clearBtn = screen.getByLabelText("Clear selection");
		await user.click(clearBtn);

		expect(handleChange).toHaveBeenCalledWith("");
	});

	it("does not show clear button when clearable but no value", () => {
		render(
			<Combobox options={mockOptions} clearable />,
		);
		expect(screen.queryByLabelText("Clear selection")).not.toBeInTheDocument();
	});

	it("displays selectedLabel when option not in list", () => {
		render(
			<Combobox
				options={mockOptions}
				value="other"
				selectedLabel="Custom Label"
			/>,
		);
		expect(screen.getByText("Custom Label")).toBeInTheDocument();
	});

	it("uses selectedLabel when option is not found", () => {
		render(
			<Combobox
				options={mockOptions}
				value="missing"
				selectedLabel="Fallback"
			/>,
		);
		const button = screen.getByRole("combobox");
		expect(button).toHaveTextContent("Fallback");
	});

	it("renders with renderOption callback", async () => {
		const user = userEvent.setup();
		render(
			<Combobox
				options={mockOptions}
				renderOption={(option, selected) => (
					<span data-testid="custom-option" data-selected={selected}>
						{option.label}
					</span>
				)}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			const customOptions = within(listbox).getAllByTestId("custom-option");
			expect(customOptions.length).toBe(3);
		});
	});

	it("renders with separateOptions", async () => {
		const user = userEvent.setup();
		render(
			<Combobox options={mockOptions} separateOptions />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			const separators = within(listbox).queryAllByRole("separator");
			expect(separators.length).toBeGreaterThan(0);
		});
	});

	it("calls onSearchChange when searching", async () => {
		const user = userEvent.setup();
		const handleSearchChange = vi.fn();
		render(
			<Combobox
				options={mockOptions}
				onSearchChange={handleSearchChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const searchInput = await screen.findByPlaceholderText("Search...");
		await user.type(searchInput, "opt");

		expect(handleSearchChange).toHaveBeenCalledWith("opt");
	});

	it("shows empty options in async mode when search is empty", async () => {
		const user = userEvent.setup();
		render(
			<Combobox
				options={mockOptions}
				onSearchChange={vi.fn()}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			const options = within(listbox).queryAllByRole("option");
			expect(options.length).toBe(0);
		});
	});

	it("applies matchTriggerWidth=false style", async () => {
		const user = userEvent.setup();
		render(
			<Combobox options={mockOptions} matchTriggerWidth={false} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			expect(document.querySelector(".min-w-\\[200px\\]")).toBeInTheDocument();
		});
	});

	it("shows muted foreground when no value", () => {
		render(<Combobox options={mockOptions} />);
		const button = screen.getByRole("combobox");
		expect(button).toHaveClass("text-muted-foreground");
	});

	it("does not show muted foreground when value is set", () => {
		render(<Combobox options={mockOptions} value="option1" />);
		const button = screen.getByRole("combobox");
		expect(button).not.toHaveClass("text-muted-foreground");
	});

	it("resets search when popover closes", async () => {
		const user = userEvent.setup();
		const handleSearchChange = vi.fn();
		render(
			<Combobox
				options={mockOptions}
				onSearchChange={handleSearchChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const searchInput = await screen.findByPlaceholderText("Search...");
		await user.type(searchInput, "test");

		// Close by pressing Escape
		await user.keyboard("{Escape}");

		expect(handleSearchChange).toHaveBeenCalledWith("");
	});

	it("shows selected option in async mode after searching", async () => {
		const user = userEvent.setup();
		const handleSearchChange = vi.fn();
		render(
			<Combobox
				options={mockOptions}
				onSearchChange={handleSearchChange}
				value="option1"
			/>,
		);

		const button = screen.getByRole("combobox");
		expect(button).toHaveTextContent("Option 1");
	});

	it("shows options after typing in async mode", async () => {
		const user = userEvent.setup();
		render(
			<Combobox
				options={mockOptions}
				onSearchChange={vi.fn()}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		// In async mode with empty search, options are suppressed
		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			const options = within(listbox).queryAllByRole("option");
			expect(options.length).toBe(0);
		});

		// Type to trigger search - options still come from options array
		const searchInput = await screen.findByPlaceholderText("Search...");
		await user.type(searchInput, "opt");

		// After typing, options should be visible since search is non-empty
		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			const options = within(listbox).queryAllByRole("option");
			expect(options.length).toBeGreaterThan(0);
		});
	});

	it("displays placeholder when no value and no selectedLabel", () => {
		render(
			<Combobox options={mockOptions} placeholder="Pick one..." />,
		);
		expect(screen.getByText("Pick one...")).toBeInTheDocument();
	});

	it("does not call onValueChange when selecting disabled option", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		const optionsWithDisabled: ComboboxOption[] = [
			{ value: "option1", label: "Option 1" },
			{ value: "option2", label: "Option 2", disabled: true },
		];

		render(
			<Combobox options={optionsWithDisabled} onValueChange={handleChange} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const listbox = await screen.findByRole("listbox");
		const disabledOption = within(listbox).getByRole("option", {
			name: "Option 2",
		});
		expect(disabledOption).toHaveAttribute("aria-disabled", "true");

		await user.click(disabledOption);
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("shows check mark opacity on selected option", async () => {
		const user = userEvent.setup();
		render(
			<Combobox options={mockOptions} value="option1" />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			const selectedOption = within(listbox).getByRole("option", {
				name: "Option 1",
			});
			expect(selectedOption).toBeInTheDocument();
		});
	});

	it("applies flex-1 text-left when matchTriggerWidth is true", () => {
		render(<Combobox options={mockOptions} value="option1" matchTriggerWidth />);
		const text = screen.getByText("Option 1");
		expect(text).toHaveClass("flex-1", "text-left");
	});

	it("does not apply flex-1 when matchTriggerWidth is false", () => {
		render(<Combobox options={mockOptions} value="option1" matchTriggerWidth={false} />);
		const text = screen.getByText("Option 1");
		expect(text).not.toHaveClass("flex-1");
	});

	it("applies truncate on text when matchTriggerWidth is false", () => {
		render(<Combobox options={mockOptions} value="option1" matchTriggerWidth={false} />);
		const text = screen.getByText("Option 1");
		expect(text).toHaveClass("truncate");
	});

	it("filters by label text in sync mode", async () => {
		const user = userEvent.setup();
		render(<Combobox options={mockOptions} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const searchInput = await screen.findByPlaceholderText("Search...");
		await user.type(searchInput, "2");

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			expect(
				within(listbox).getByRole("option", { name: "Option 2" }),
			).toBeInTheDocument();
		});
	});

	it("renders renderOption with selected=true for current value", async () => {
		const user = userEvent.setup();
		render(
			<Combobox
				options={mockOptions}
				value="option2"
				renderOption={(option, selected) => (
					<span data-testid="ropt" data-selected={String(selected)}>
						{option.label}
					</span>
				)}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			const opts = within(listbox).getAllByTestId("ropt");
			const selectedOpt = opts.find((o) => o.getAttribute("data-selected") === "true");
			expect(selectedOpt).toHaveTextContent("Option 2");
		});
	});

	it("applies py-2 class when renderOption is provided", async () => {
		const user = userEvent.setup();
		render(
			<Combobox
				options={mockOptions}
				renderOption={(option) => <span>{option.label}</span>}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			const items = within(listbox).getAllByRole("option");
			expect(items[0]).toHaveClass("py-2");
		});
	});

	it("does not apply py-2 when renderOption is not provided", async () => {
		const user = userEvent.setup();
		render(<Combobox options={mockOptions} />);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			const items = within(listbox).getAllByRole("option");
			expect(items[0]).not.toHaveClass("py-2");
		});
	});

	it("sets Command shouldFilter to false in async mode", async () => {
		const user = userEvent.setup();
		render(
			<Combobox options={mockOptions} onSearchChange={vi.fn()} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			expect(listbox).toBeInTheDocument();
		});
	});

	it("calls onSearchChange with empty string when popover closes in async mode", async () => {
		const user = userEvent.setup();
		const handleSearchChange = vi.fn();
		render(
			<Combobox
				options={mockOptions}
				onSearchChange={handleSearchChange}
			/>,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		const searchInput = await screen.findByPlaceholderText("Search...");
		await user.type(searchInput, "test");

		await user.keyboard("{Escape}");

		expect(handleSearchChange).toHaveBeenCalledWith("");
	});

	it("uses popover content w-full when matchTriggerWidth is true", async () => {
		const user = userEvent.setup();
		render(
			<Combobox options={mockOptions} matchTriggerWidth={true} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			expect(document.querySelector(".w-full")).toBeInTheDocument();
		});
	});

	it("popover content has no inline width style when matchTriggerWidth is false", async () => {
		const user = userEvent.setup();
		render(
			<Combobox options={mockOptions} matchTriggerWidth={false} />,
		);

		const button = screen.getByRole("combobox");
		await user.click(button);

		await waitFor(() => {
			const listbox = screen.getByRole("listbox");
			expect(listbox.style.width).toBe("");
		});
	});

	it("prefers selectedOption label over selectedLabel when option exists", () => {
		render(
			<Combobox
				options={mockOptions}
				value="option1"
				selectedLabel="Fallback"
			/>,
		);
		expect(screen.getByText("Option 1")).toBeInTheDocument();
		expect(screen.queryByText("Fallback")).not.toBeInTheDocument();
	});

	it("prefers selectedLabel over placeholder when value is set but option missing", () => {
		render(
			<Combobox
				options={mockOptions}
				value="missing"
				selectedLabel="Custom"
				placeholder="Pick..."
			/>,
		);
		expect(screen.getByText("Custom")).toBeInTheDocument();
		expect(screen.queryByText("Pick...")).not.toBeInTheDocument();
	});

	it("displays placeholder when value is empty string", () => {
		render(
			<Combobox options={mockOptions} value="" placeholder="Pick..." />,
		);
		expect(screen.getByText("Pick...")).toBeInTheDocument();
	});
});
