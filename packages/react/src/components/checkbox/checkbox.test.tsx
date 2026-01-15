import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
	it("should render checkbox", () => {
		render(<Checkbox />);
		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).toBeInTheDocument();
	});

	it("should be unchecked by default", () => {
		render(<Checkbox />);
		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).not.toBeChecked();
	});

	it("should toggle checked state when clicked", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(<Checkbox onCheckedChange={handleChange} />);
		const checkbox = screen.getByRole("checkbox");

		await user.click(checkbox);
		expect(handleChange).toHaveBeenCalledWith(true);
	});

	it("should render as checked when checked prop is true", () => {
		render(<Checkbox checked={true} />);
		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).toBeChecked();
	});

	it("should be disabled when disabled prop is true", () => {
		render(<Checkbox disabled />);
		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).toBeDisabled();
	});

	it("should apply custom className", () => {
		const { container } = render(<Checkbox className="custom-checkbox" />);
		const checkbox = container.querySelector('[data-slot="checkbox"]');
		expect(checkbox).toHaveClass("custom-checkbox");
	});

	it("should render with aria-invalid when invalid", () => {
		render(<Checkbox aria-invalid />);
		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).toHaveAttribute("aria-invalid");
	});

	it("should render check icon when checked", () => {
		const { container } = render(<Checkbox checked={true} />);
		const indicator = container.querySelector(
			'[data-slot="checkbox-indicator"]',
		);
		expect(indicator).toBeInTheDocument();
	});
});
