import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	FieldGroupSkeleton,
	FormSkeleton,
} from "./form-skeleton";

describe("FormSkeleton", () => {
	describe("Basic Rendering", () => {
		it("renders with default props", () => {
			render(
				<FormSkeleton
					fields={[
						{ type: "input", label: true },
						{ type: "textarea", label: true },
					]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders correct number of fields", () => {
			render(
				<FormSkeleton
					fields={[
						{ type: "input", label: true },
						{ type: "input", label: true },
						{ type: "textarea", label: true },
					]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders with custom className", () => {
			const { container } = render(
				<FormSkeleton
					fields={[{ type: "input", label: true }]}
					className="custom-class"
				/>,
			);
			const formSkeleton = container.querySelector(".custom-class");
			expect(formSkeleton).toBeInTheDocument();
		});
	});

	describe("Submit Button", () => {
		it("does not show submit button by default", () => {
			const { container } = render(
				<FormSkeleton
					fields={[{ type: "input", label: true }]}
				/>,
			);
			const submitButton = container.querySelector(".col-span-full");
			expect(submitButton).not.toBeInTheDocument();
		});

		it("shows submit button when showSubmitButton is true", () => {
			const { container } = render(
				<FormSkeleton
					fields={[{ type: "input", label: true }]}
					showSubmitButton={true}
				/>,
			);
			const submitButton = container.querySelector(".col-span-full");
			expect(submitButton).toBeInTheDocument();
		});

		it("submit button has correct dimensions", () => {
			const { container } = render(
				<FormSkeleton
					fields={[{ type: "input", label: true }]}
					showSubmitButton={true}
				/>,
			);
			const button = container.querySelector(
				".col-span-full .h-10.w-32",
			);
			expect(button).toBeInTheDocument();
		});
	});

	describe("Columns Layout", () => {
		it("uses single column layout by default", () => {
			const { container } = render(
				<FormSkeleton
					fields={[
						{ type: "input", label: true },
						{ type: "input", label: true },
					]}
				/>,
			);
			const formSkeleton = container.querySelector(
				'[data-testid="form-skeleton"]',
			);
			expect(formSkeleton).not.toHaveClass("md:grid-cols-2");
		});

		it("uses 2 column layout when columns={2}", () => {
			const { container } = render(
				<FormSkeleton
					fields={[
						{ type: "input", label: true },
						{ type: "input", label: true },
					]}
					columns={2}
				/>,
			);
			const formSkeleton = container.querySelector(
				'[data-testid="form-skeleton"]',
			);
			expect(formSkeleton).toHaveClass("md:grid-cols-2");
		});

		it("uses 3 column layout when columns={3}", () => {
			const { container } = render(
				<FormSkeleton
					fields={[
						{ type: "input", label: true },
						{ type: "input", label: true },
						{ type: "input", label: true },
					]}
					columns={3}
				/>,
			);
			const formSkeleton = container.querySelector(
				'[data-testid="form-skeleton"]',
			);
			expect(formSkeleton).toHaveClass("lg:grid-cols-3");
		});
	});

	describe("Field Types", () => {
		it("renders input field skeleton", () => {
			render(
				<FormSkeleton
					fields={[{ type: "input", label: true }]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders textarea field skeleton", () => {
			render(
				<FormSkeleton
					fields={[{ type: "textarea", label: true }]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders select field skeleton", () => {
			render(
				<FormSkeleton
					fields={[{ type: "select", label: true }]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders checkbox field skeleton", () => {
			render(
				<FormSkeleton
					fields={[{ type: "checkbox", label: true }]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders radio field skeleton", () => {
			render(
				<FormSkeleton
					fields={[{ type: "radio", label: true }]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders date field skeleton", () => {
			render(
				<FormSkeleton
					fields={[{ type: "date", label: true }]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders file field skeleton", () => {
			render(
				<FormSkeleton
					fields={[{ type: "file", label: true }]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});
	});

	describe("Field Configurations", () => {
		it("renders field with label", () => {
			render(
				<FormSkeleton
					fields={[{ type: "input", label: true }]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders field without label", () => {
			render(
				<FormSkeleton
					fields={[{ type: "input", label: false }]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders field with required indicator", () => {
			render(
				<FormSkeleton
					fields={[{ type: "input", label: true, required: true }]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders field with helper text", () => {
			render(
				<FormSkeleton
					fields={[{ type: "input", label: true, helperText: true }]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders field with custom control height", () => {
			render(
				<FormSkeleton
					fields={[
						{ type: "input", label: true, controlHeight: "5rem" },
					]}
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});
	});

	describe("Complex Forms", () => {
		it("renders form with multiple field types", () => {
			render(
				<FormSkeleton
					fields={[
						{ type: "input", label: true, required: true },
						{ type: "select", label: true },
						{ type: "textarea", label: true, helperText: true },
						{ type: "checkbox", label: true },
					]}
					showSubmitButton
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});

		it("renders form with many fields", () => {
			render(
				<FormSkeleton
					fields={[
						{ type: "input", label: true },
						{ type: "input", label: true },
						{ type: "select", label: true },
						{ type: "input", label: true },
						{ type: "textarea", label: true },
						{ type: "file", label: true },
					]}
					columns={2}
					showSubmitButton
				/>,
			);
			const formSkeleton = screen.getByTestId("form-skeleton");
			expect(formSkeleton).toBeInTheDocument();
		});
	});
});

describe("FieldGroupSkeleton", () => {
	describe("Basic Rendering", () => {
		it("renders with default props", () => {
			render(<FieldGroupSkeleton />);
			const fieldGroup = screen.getByTestId("field-group-skeleton");
			expect(fieldGroup).toBeInTheDocument();
		});

		it("renders with custom className", () => {
			const { container } = render(
				<FieldGroupSkeleton className="custom-class" />,
			);
			const fieldGroup = container.querySelector(".custom-class");
			expect(fieldGroup).toBeInTheDocument();
		});
	});

	describe("Field Count", () => {
		it("renders with default 3 fields", () => {
			render(<FieldGroupSkeleton />);
			const fieldGroup = screen.getByTestId("field-group-skeleton");
			expect(fieldGroup).toBeInTheDocument();
		});

		it("renders with custom field count", () => {
			render(<FieldGroupSkeleton fieldCount={5} />);
			const fieldGroup = screen.getByTestId("field-group-skeleton");
			expect(fieldGroup).toBeInTheDocument();
		});
	});

	describe("Group Label", () => {
		it("shows group label by default", () => {
			const { container } = render(<FieldGroupSkeleton />);
			const groupLabel = container.querySelector(".h-5.w-32");
			expect(groupLabel).toBeInTheDocument();
		});

		it("hides group label when showGroupLabel is false", () => {
			const { container } = render(
				<FieldGroupSkeleton showGroupLabel={false} />,
			);
			const groupLabel = container.querySelector(".h-5.w-32");
			expect(groupLabel).not.toBeInTheDocument();
		});
	});

	describe("Styling", () => {
		it("has border styling", () => {
			const { container } = render(<FieldGroupSkeleton />);
			const fieldGroup = container.querySelector(
				'[data-testid="field-group-skeleton"]',
			);
			expect(fieldGroup).toHaveClass("border");
		});

		it("has rounded corners", () => {
			const { container } = render(<FieldGroupSkeleton />);
			const fieldGroup = container.querySelector(
				'[data-testid="field-group-skeleton"]',
			);
			expect(fieldGroup).toHaveClass("rounded-lg");
		});

		it("has padding", () => {
			const { container } = render(<FieldGroupSkeleton />);
			const fieldGroup = container.querySelector(
				'[data-testid="field-group-skeleton"]',
			);
			expect(fieldGroup).toHaveClass("p-4");
		});
	});

	describe("Helper Text", () => {
		it("shows helper text on first field", () => {
			render(<FieldGroupSkeleton fieldCount={3} />);
			const fieldGroup = screen.getByTestId("field-group-skeleton");
			expect(fieldGroup).toBeInTheDocument();
		});

		it("does not show helper text on other fields", () => {
			render(<FieldGroupSkeleton fieldCount={3} />);
			const fieldGroup = screen.getByTestId("field-group-skeleton");
			expect(fieldGroup).toBeInTheDocument();
		});
	});

	describe("Complex Field Groups", () => {
		it("renders field group with many fields", () => {
			render(<FieldGroupSkeleton fieldCount={6} />);
			const fieldGroup = screen.getByTestId("field-group-skeleton");
			expect(fieldGroup).toBeInTheDocument();
		});

		it("renders field group with no label", () => {
			render(
				<FieldGroupSkeleton fieldCount={4} showGroupLabel={false} />,
			);
			const fieldGroup = screen.getByTestId("field-group-skeleton");
			expect(fieldGroup).toBeInTheDocument();
		});
	});
});
