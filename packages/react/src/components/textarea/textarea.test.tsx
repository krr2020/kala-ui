import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
	it("should render textarea", () => {
		render(<Textarea />);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toBeInTheDocument();
	});

	it("should render with placeholder", () => {
		render(<Textarea placeholder="Enter text..." />);
		expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
	});

	it("should accept value prop", () => {
		render(<Textarea value="Test content" readOnly />);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveValue("Test content");
	});

	it("should handle onChange events", async () => {
		const handleChange = vi.fn();
		render(<Textarea onChange={handleChange} />);

		const textarea = screen.getByRole("textbox");
		await userEvent.type(textarea, "test");

		expect(handleChange).toHaveBeenCalled();
	});

	it("should be disabled when disabled prop is true", () => {
		render(<Textarea disabled />);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toBeDisabled();
	});

	it("should apply custom className", () => {
		const { container } = render(<Textarea className="custom-textarea" />);
		const textarea = container.querySelector('[data-slot="textarea"]');
		expect(textarea).toHaveClass("custom-textarea");
	});

	it("should render with aria-invalid when invalid", () => {
		render(<Textarea aria-invalid />);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveAttribute("aria-invalid");
	});

	it("should be readonly when readonly prop is true", () => {
		render(<Textarea readOnly />);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveAttribute("readonly");
	});
});
