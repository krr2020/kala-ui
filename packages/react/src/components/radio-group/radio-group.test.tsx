import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
	describe("Basic Functionality", () => {
		it("should render radio group", () => {
			render(
				<RadioGroup>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="option1" id="option1" />
						<Label htmlFor="option1">Option 1</Label>
					</div>
				</RadioGroup>,
			);
			const radioGroup = screen.getByRole("radiogroup");
			expect(radioGroup).toBeInTheDocument();
		});

		it("should render multiple radio items", () => {
			render(
				<RadioGroup>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="option1" id="option1" />
						<Label htmlFor="option1">Option 1</Label>
					</div>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="option2" id="option2" />
						<Label htmlFor="option2">Option 2</Label>
					</div>
				</RadioGroup>,
			);
			expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
			expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
		});

		it("should select radio item when clicked", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(
				<RadioGroup onValueChange={handleChange}>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="option1" id="option1" />
						<Label htmlFor="option1">Option 1</Label>
					</div>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="option2" id="option2" />
						<Label htmlFor="option2">Option 2</Label>
					</div>
				</RadioGroup>,
			);

			await user.click(screen.getByLabelText("Option 1"));
			expect(handleChange).toHaveBeenCalledWith("option1");
		});

		it("should render with default value", () => {
			render(
				<RadioGroup defaultValue="option2">
					<div className="flex items-center gap-2">
						<RadioGroupItem value="option1" id="option1" />
						<Label htmlFor="option1">Option 1</Label>
					</div>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="option2" id="option2" />
						<Label htmlFor="option2">Option 2</Label>
					</div>
				</RadioGroup>,
			);
			const option2 = screen.getByLabelText("Option 2");
			expect(option2).toBeChecked();
		});

		it("should disable radio item when disabled prop is true", () => {
			render(
				<RadioGroup>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="option1" id="option1" disabled />
						<Label htmlFor="option1">Option 1</Label>
					</div>
				</RadioGroup>,
			);
			const option1 = screen.getByLabelText("Option 1");
			expect(option1).toBeDisabled();
		});
	});

	describe("Labels and Descriptions", () => {
		it("should render with label prop", () => {
			render(
				<RadioGroup>
					<RadioGroupItem value="option1" id="option1" label="Test Label" />
				</RadioGroup>,
			);
			expect(screen.getByText("Test Label")).toBeInTheDocument();
		});

		it("should render with description prop", () => {
			render(
				<RadioGroup>
					<RadioGroupItem
						value="option1"
						id="option1"
						label="Test Label"
						description="Test description"
					/>
				</RadioGroup>,
			);
			expect(screen.getByText("Test description")).toBeInTheDocument();
		});

		it("should render label without description", () => {
			render(
				<RadioGroup>
					<RadioGroupItem value="option1" id="option1" label="Only Label" />
				</RadioGroup>,
			);
			expect(screen.getByText("Only Label")).toBeInTheDocument();
		});
	});

	describe("Variants", () => {
		it("should apply default variant", () => {
			const { container } = render(
				<RadioGroup variant="default">
					<RadioGroupItem value="option1" id="option1" />
				</RadioGroup>,
			);
			const radioGroup = container.querySelector('[data-slot="radio-group"]');
			expect(radioGroup).toHaveClass("grid");
		});

		it("should apply cards variant", () => {
			const { container } = render(
				<RadioGroup variant="cards">
					<RadioGroupItem value="option1" id="option1" label="Card Option" />
				</RadioGroup>,
			);
			const radioGroup = container.querySelector('[data-slot="radio-group"]');
			expect(radioGroup).toHaveClass("grid");
		});

		it("should apply buttons variant", () => {
			const { container } = render(
				<RadioGroup variant="buttons">
					<RadioGroupItem value="option1" id="option1" label="Button Option" />
				</RadioGroup>,
			);
			const radioGroup = container.querySelector('[data-slot="radio-group"]');
			expect(radioGroup).toHaveClass("flex");
		});
	});

	describe("Sizes", () => {
		it("should apply small size", () => {
			const { container } = render(
				<RadioGroup size="sm">
					<RadioGroupItem value="option1" id="option1" />
				</RadioGroup>,
			);
			const radioItem = container.querySelector(
				'[data-slot="radio-group-item"]',
			);
			expect(radioItem).toHaveClass("size-3");
		});

		it("should apply medium size", () => {
			const { container } = render(
				<RadioGroup size="md">
					<RadioGroupItem value="option1" id="option1" />
				</RadioGroup>,
			);
			const radioItem = container.querySelector(
				'[data-slot="radio-group-item"]',
			);
			expect(radioItem).toHaveClass("size-4");
		});

		it("should apply large size", () => {
			const { container } = render(
				<RadioGroup size="lg">
					<RadioGroupItem value="option1" id="option1" />
				</RadioGroup>,
			);
			const radioItem = container.querySelector(
				'[data-slot="radio-group-item"]',
			);
			expect(radioItem).toHaveClass("size-5");
		});
	});

	describe("Error State", () => {
		it("should apply error styling when error prop is true", () => {
			render(
				<RadioGroup>
					<RadioGroupItem
						value="option1"
						id="option1"
						label="Error Option"
						error
					/>
				</RadioGroup>,
			);
			const label = screen.getByText("Error Option");
			expect(label).toHaveClass("text-destructive");
		});

		it("should apply error styling to description", () => {
			render(
				<RadioGroup>
					<RadioGroupItem
						value="option1"
						id="option1"
						label="Error Option"
						description="Error description"
						error
					/>
				</RadioGroup>,
			);
			const description = screen.getByText("Error description");
			expect(description).toHaveClass("text-destructive/80");
		});
	});

	describe("Custom className", () => {
		it("should apply custom className to radio group", () => {
			const { container } = render(
				<RadioGroup className="custom-radio-group">
					<div className="flex items-center gap-2">
						<RadioGroupItem value="option1" id="option1" />
						<Label htmlFor="option1">Option 1</Label>
					</div>
				</RadioGroup>,
			);
			const radioGroup = container.querySelector('[data-slot="radio-group"]');
			expect(radioGroup).toHaveClass("custom-radio-group");
		});

		it("should apply custom className to radio item with label", () => {
			const { container } = render(
				<RadioGroup>
					<RadioGroupItem
						value="option1"
						id="option1"
						label="Option"
						className="custom-item"
					/>
				</RadioGroup>,
			);
			expect(container.querySelector(".custom-item")).toBeInTheDocument();
		});
	});

	describe("Accessibility", () => {
		it("should have proper ARIA attributes", () => {
			render(
				<RadioGroup>
					<RadioGroupItem value="option1" id="option1" />
				</RadioGroup>,
			);
			const radioGroup = screen.getByRole("radiogroup");
			expect(radioGroup).toBeInTheDocument();
		});

		it("should render indicator SVG with title", () => {
			const { container } = render(
				<RadioGroup defaultValue="option1">
					<RadioGroupItem value="option1" id="option1" />
				</RadioGroup>,
			);
			const svg = container.querySelector("svg");
			expect(svg).toBeInTheDocument();
			expect(svg?.querySelector("title")).toHaveTextContent("Selected");
		});
	});
});
