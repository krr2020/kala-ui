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
});
