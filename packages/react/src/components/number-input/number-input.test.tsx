import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberInput } from "./number-input";

describe("NumberInput", () => {
	it("should render input with increment and decrement buttons", () => {
		render(<NumberInput />);
		expect(screen.getByRole("spinbutton")).toBeInTheDocument();
		expect(screen.getByLabelText("Increase value")).toBeInTheDocument();
		expect(screen.getByLabelText("Decrease value")).toBeInTheDocument();
	});

	it("should render with defaultValue", () => {
		render(<NumberInput defaultValue={5} />);
		expect(screen.getByRole("spinbutton")).toHaveValue(5);
	});

	it("should render controlled value", () => {
		render(<NumberInput value={10} onChange={vi.fn()} />);
		expect(screen.getByRole("spinbutton")).toHaveValue(10);
	});

	it("should increment value when + button is clicked", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<NumberInput defaultValue={5} onChange={handleChange} />);

		await user.click(screen.getByLabelText("Increase value"));
		expect(handleChange).toHaveBeenCalledWith(6);
	});

	it("should decrement value when - button is clicked", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<NumberInput defaultValue={5} onChange={handleChange} />);

		await user.click(screen.getByLabelText("Decrease value"));
		expect(handleChange).toHaveBeenCalledWith(4);
	});

	it("should increment by step amount", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<NumberInput defaultValue={0} step={5} onChange={handleChange} />);

		await user.click(screen.getByLabelText("Increase value"));
		expect(handleChange).toHaveBeenCalledWith(5);
	});

	it("should not exceed max value", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<NumberInput defaultValue={9} max={10} onChange={handleChange} />);

		await user.click(screen.getByLabelText("Increase value"));
		expect(handleChange).toHaveBeenCalledWith(10);

		handleChange.mockClear();
		await user.click(screen.getByLabelText("Increase value"));
		// at max, button is disabled, no call
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("should not go below min value", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<NumberInput defaultValue={1} min={0} onChange={handleChange} />);

		await user.click(screen.getByLabelText("Decrease value"));
		expect(handleChange).toHaveBeenCalledWith(0);

		handleChange.mockClear();
		await user.click(screen.getByLabelText("Decrease value"));
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("should increment on ArrowUp key", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<NumberInput defaultValue={3} onChange={handleChange} />);

		await user.click(screen.getByRole("spinbutton"));
		await user.keyboard("{ArrowUp}");
		expect(handleChange).toHaveBeenCalledWith(4);
	});

	it("should decrement on ArrowDown key", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<NumberInput defaultValue={3} onChange={handleChange} />);

		await user.click(screen.getByRole("spinbutton"));
		await user.keyboard("{ArrowDown}");
		expect(handleChange).toHaveBeenCalledWith(2);
	});

	it("should call onChange with undefined when input is cleared", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<NumberInput defaultValue={5} onChange={handleChange} />);

		const input = screen.getByRole("spinbutton");
		await user.clear(input);
		expect(handleChange).toHaveBeenCalledWith(undefined);
	});

	it("should be disabled when disabled prop is true", () => {
		render(<NumberInput disabled />);
		expect(screen.getByRole("spinbutton")).toBeDisabled();
		expect(screen.getByLabelText("Increase value")).toBeDisabled();
		expect(screen.getByLabelText("Decrease value")).toBeDisabled();
	});

	it("should apply error styling when hasError is true", () => {
		const { container } = render(<NumberInput hasError />);
		const wrapper = container.querySelector('[data-slot="number-input"]');
		expect(wrapper).toHaveClass("border-destructive");
	});

	it("should render loading skeleton when isLoading is true", () => {
		const { container } = render(<NumberInput isLoading />);
		expect(container.querySelector('[data-slot="number-input"]')).toBeNull();
		expect(
			document.querySelector('[data-slot="skeleton"]'),
		).toBeInTheDocument();
	});

	it("should clamp value to range on blur", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<NumberInput min={0} max={100} onChange={handleChange} />);

		const input = screen.getByRole("spinbutton");
		await user.type(input, "150");
		await user.tab(); // trigger blur
		expect(handleChange).toHaveBeenLastCalledWith(100);
	});

	it("should forward ref to the input element", () => {
		let ref: HTMLInputElement | null = null;
		render(
			<NumberInput
				ref={(el) => {
					ref = el;
				}}
			/>,
		);
		expect(ref).not.toBeNull();
		expect(ref).toBeInstanceOf(HTMLInputElement);
	});

	it("should apply custom className", () => {
		const { container } = render(<NumberInput className="custom-class" />);
		const wrapper = container.querySelector('[data-slot="number-input"]');
		expect(wrapper).toHaveClass("custom-class");
	});
});
