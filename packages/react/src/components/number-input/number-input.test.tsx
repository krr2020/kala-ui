import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NumberInput } from "./number-input";

describe("NumberInput", () => {
	it("renders correctly", () => {
		render(<NumberInput placeholder="Test input" />);
		expect(screen.getByPlaceholderText("Test input")).toBeInTheDocument();
	});

	it("handles numeric input", () => {
		const handleChange = vi.fn();
		render(<NumberInput onChange={handleChange} />);
		const input = screen.getByRole("spinbutton");

		fireEvent.change(input, { target: { value: "123" } });
		expect(input).toHaveValue("123");
		expect(handleChange).toHaveBeenCalledWith(123);

		// Should ignore non-numeric
		fireEvent.change(input, { target: { value: "abc" } });
		expect(input).toHaveValue("123"); // Should not change
	});

	it("handles min/max constraints on blur", () => {
		const handleChange = vi.fn();
		render(<NumberInput min={0} max={10} onChange={handleChange} />);
		const input = screen.getByRole("spinbutton");

		// Test max
		fireEvent.change(input, { target: { value: "15" } });
		fireEvent.blur(input);
		expect(input).toHaveValue("10");
		expect(handleChange).toHaveBeenLastCalledWith(10);

		// Test min
		fireEvent.change(input, { target: { value: "-5" } });
		fireEvent.blur(input);
		expect(input).toHaveValue("0");
		expect(handleChange).toHaveBeenLastCalledWith(0);
	});

	it("increments and decrements with controls", () => {
		const handleChange = vi.fn();
		render(<NumberInput defaultValue={0} step={5} onChange={handleChange} />);

		// Find chevron buttons (they don't have text, but we can find by button role)
		const buttons = screen.getAllByRole("button");
		const upBtn = buttons[0];
		const downBtn = buttons[1];

		fireEvent.click(upBtn);
		expect(screen.getByRole("spinbutton")).toHaveValue("5");
		expect(handleChange).toHaveBeenCalledWith(5);

		fireEvent.click(downBtn);
		expect(screen.getByRole("spinbutton")).toHaveValue("0");
		expect(handleChange).toHaveBeenCalledWith(0);
	});
});
