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

	it("should forward ref to the textarea element", () => {
		let ref: HTMLTextAreaElement | null = null;
		render(
			<Textarea
				ref={(el) => {
					ref = el;
				}}
			/>,
		);
		expect(ref).not.toBeNull();
		expect(ref).toBeInstanceOf(HTMLTextAreaElement);
	});

	// NEW TESTS BELOW

	it("should render with data-slot='textarea'", () => {
		const { container } = render(<Textarea />);
		const textarea = container.querySelector('[data-slot="textarea"]');
		expect(textarea).toBeInTheDocument();
	});

	it("should render with rows prop", () => {
		render(<Textarea rows={5} />);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveAttribute("rows", "5");
	});

	it("should render with custom id", () => {
		render(<Textarea id="my-textarea" />);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveAttribute("id", "my-textarea");
	});

	it("should render with name prop", () => {
		render(<Textarea name="description" />);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveAttribute("name", "description");
	});

	it("should render with required prop", () => {
		render(<Textarea required />);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toBeRequired();
	});

	it("should render skeleton when isLoading is true", () => {
		const { container } = render(<Textarea isLoading />);
		const textarea = container.querySelector('[data-slot="textarea"]');
		expect(textarea).not.toBeInTheDocument();
		// Should render a skeleton element instead
		const skeleton = container.querySelector('[class*="min-h"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("should render skeleton with correct height based on rows", () => {
		const { container } = render(<Textarea isLoading rows={4} />);
		const skeleton = container.querySelector('[class*="min-h"]') as HTMLElement;
		expect(skeleton).toBeInTheDocument();
		expect(skeleton.style.height).toBe("6rem");
	});

	it("should render skeleton without height when rows is not provided", () => {
		const { container } = render(<Textarea isLoading />);
		const skeleton = container.querySelector('[class*="min-h"]') as HTMLElement;
		expect(skeleton).toBeInTheDocument();
		expect(skeleton.style.height).toBe("");
	});

	it("should apply isLoading skeleton className", () => {
		const { container } = render(
			<Textarea isLoading className="custom-loading" />,
		);
		const skeleton = container.querySelector('[class*="min-h"]');
		expect(skeleton).toHaveClass("custom-loading");
	});

	it("should forward aria-label prop", () => {
		render(<Textarea aria-label="Enter description" />);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveAttribute("aria-label", "Enter description");
	});

	it("should forward style prop", () => {
		render(<Textarea style={{ color: "red" }} />);
		const textarea = screen.getByRole("textbox");
		expect(textarea.style.color).toBe("red");
	});

	it("should render with maxLength prop", () => {
		render(<Textarea maxLength={100} />);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveAttribute("maxLength", "100");
	});
});
