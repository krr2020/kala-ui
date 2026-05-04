import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "../input";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldTitle,
} from "./field";

describe("Field", () => {
	it("should render field with label", () => {
		render(
			<Field>
				<FieldLabel>Username</FieldLabel>
				<Input />
			</Field>,
		);
		expect(screen.getByText("Username")).toBeInTheDocument();
	});

	it("should render field with description", () => {
		render(
			<Field>
				<FieldLabel>Email</FieldLabel>
				<Input />
				<FieldDescription>Enter your email address</FieldDescription>
			</Field>,
		);
		expect(screen.getByText("Enter your email address")).toBeInTheDocument();
	});

	it("should render field with error message", () => {
		render(
			<Field>
				<FieldLabel>Password</FieldLabel>
				<Input />
				<FieldError>Password is required</FieldError>
			</Field>,
		);
		expect(screen.getByText("Password is required")).toBeInTheDocument();
	});

	it("should render field with multiple errors", () => {
		render(
			<Field>
				<FieldLabel>Password</FieldLabel>
				<Input />
				<FieldError>
					{["Password is required", "Password must be at least 8 characters"]}
				</FieldError>
			</Field>,
		);
		// FieldError renders array children as-is, they appear concatenated in DOM
		const errorElement = screen.getByRole("alert");
		expect(errorElement).toHaveTextContent("Password is required");
		expect(errorElement).toHaveTextContent(
			"Password must be at least 8 characters",
		);
	});

	it("should apply custom className to field", () => {
		const { container } = render(
			<Field className="custom-field">
				<FieldLabel>Username</FieldLabel>
				<Input />
			</Field>,
		);
		const field = container.querySelector('[data-slot="field"]');
		expect(field).toHaveClass("custom-field");
	});

	it("should render field separator", () => {
		const { container } = render(
			<Field>
				<FieldLabel>Section Title</FieldLabel>
				<FieldSeparator />
				<Input />
			</Field>,
		);
		const separator = container.querySelector('[data-slot="field-separator"]');
		expect(separator).toBeInTheDocument();
	});

	it("should render horizontal orientation", () => {
		const { container } = render(
			<Field orientation="horizontal">
				<FieldLabel>Username</FieldLabel>
				<Input />
			</Field>,
		);
		const field = container.querySelector('[data-slot="field"]');
		expect(field).toHaveAttribute("data-orientation", "horizontal");
	});
});

describe("FieldSet", () => {
	it("should render fieldset element with data-slot", () => {
		const { container } = render(
			<FieldSet>
				<Input />
			</FieldSet>,
		);
		const fieldset = container.querySelector("fieldset");
		expect(fieldset).toBeInTheDocument();
		expect(fieldset).toHaveAttribute("data-slot", "field-set");
	});

	it("should have default classes", () => {
		const { container } = render(
			<FieldSet>
				<Input />
			</FieldSet>,
		);
		const fieldset = container.querySelector('[data-slot="field-set"]');
		expect(fieldset).toHaveClass("flex", "flex-col", "gap-6");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<FieldSet className="my-fieldset">
				<Input />
			</FieldSet>,
		);
		const fieldset = container.querySelector('[data-slot="field-set"]');
		expect(fieldset).toHaveClass("my-fieldset");
	});

	it("should render children", () => {
		render(
			<FieldSet>
				<span>Child content</span>
			</FieldSet>,
		);
		expect(screen.getByText("Child content")).toBeInTheDocument();
	});
});

describe("FieldLegend", () => {
	it("should render legend element with data-slot", () => {
		const { container } = render(<FieldLegend>Group Label</FieldLegend>);
		const legend = container.querySelector("legend");
		expect(legend).toBeInTheDocument();
		expect(legend).toHaveAttribute("data-slot", "field-legend");
	});

	it("should default to legend variant", () => {
		const { container } = render(<FieldLegend>Group Label</FieldLegend>);
		const legend = container.querySelector('[data-slot="field-legend"]');
		expect(legend).toHaveAttribute("data-variant", "legend");
	});

	it("should have default classes", () => {
		const { container } = render(<FieldLegend>Group Label</FieldLegend>);
		const legend = container.querySelector('[data-slot="field-legend"]');
		expect(legend).toHaveClass("mb-3", "font-medium");
	});

	it("should apply label variant", () => {
		const { container } = render(
			<FieldLegend variant="label">Label Text</FieldLegend>,
		);
		const legend = container.querySelector('[data-slot="field-legend"]');
		expect(legend).toHaveAttribute("data-variant", "label");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<FieldLegend className="custom-legend">Group Label</FieldLegend>,
		);
		const legend = container.querySelector('[data-slot="field-legend"]');
		expect(legend).toHaveClass("custom-legend");
	});
});

describe("FieldGroup", () => {
	it("should render div with data-slot", () => {
		const { container } = render(
			<FieldGroup>
				<span>Content</span>
			</FieldGroup>,
		);
		const group = container.querySelector('[data-slot="field-group"]');
		expect(group).toBeInTheDocument();
		expect(group?.tagName).toBe("DIV");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<FieldGroup className="my-group">
				<span>Content</span>
			</FieldGroup>,
		);
		const group = container.querySelector('[data-slot="field-group"]');
		expect(group).toHaveClass("my-group");
	});

	it("should render children", () => {
		render(
			<FieldGroup>
				<span>Grouped content</span>
			</FieldGroup>,
		);
		expect(screen.getByText("Grouped content")).toBeInTheDocument();
	});
});

describe("FieldContent", () => {
	it("should render div with data-slot", () => {
		const { container } = render(
			<FieldContent>
				<Input />
			</FieldContent>,
		);
		const content = container.querySelector('[data-slot="field-content"]');
		expect(content).toBeInTheDocument();
		expect(content?.tagName).toBe("DIV");
	});

	it("should have default classes", () => {
		const { container } = render(
			<FieldContent>
				<Input />
			</FieldContent>,
		);
		const content = container.querySelector('[data-slot="field-content"]');
		expect(content).toHaveClass("flex", "flex-1", "flex-col");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<FieldContent className="my-content">
				<Input />
			</FieldContent>,
		);
		const content = container.querySelector('[data-slot="field-content"]');
		expect(content).toHaveClass("my-content");
	});

	it("should render children", () => {
		render(
			<FieldContent>
				<span>Field content</span>
			</FieldContent>,
		);
		expect(screen.getByText("Field content")).toBeInTheDocument();
	});
});

describe("FieldTitle", () => {
	it("should render div with data-slot field-label", () => {
		const { container } = render(<FieldTitle>Title Text</FieldTitle>);
		const title = container.querySelector('[data-slot="field-label"]');
		expect(title).toBeInTheDocument();
		expect(title?.tagName).toBe("DIV");
	});

	it("should have default classes", () => {
		const { container } = render(<FieldTitle>Title Text</FieldTitle>);
		const title = container.querySelector('[data-slot="field-label"]');
		expect(title).toHaveClass("text-sm", "font-medium");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<FieldTitle className="my-title">Title Text</FieldTitle>,
		);
		const title = container.querySelector('[data-slot="field-label"]');
		expect(title).toHaveClass("my-title");
	});

	it("should render children text", () => {
		render(<FieldTitle>My Title</FieldTitle>);
		expect(screen.getByText("My Title")).toBeInTheDocument();
	});
});

describe("FieldError", () => {
	it("should render single error from errors prop", () => {
		render(
			<FieldError
				errors={[{ message: "Required" }]}
			/>,
		);
		const alert = screen.getByRole("alert");
		expect(alert).toHaveTextContent("Required");
	});

	it("should render multiple errors as list from errors prop", () => {
		render(
			<FieldError
				errors={[
					{ message: "Required" },
					{ message: "Must be at least 8 characters" },
				]}
			/>,
		);
		const alert = screen.getByRole("alert");
		const list = alert.querySelector("ul");
		expect(list).toBeInTheDocument();
		const items = list?.querySelectorAll("li");
		expect(items?.length).toBe(2);
		expect(items?.[0]).toHaveTextContent("Required");
		expect(items?.[1]).toHaveTextContent("Must be at least 8 characters");
	});

	it("should render nothing with empty errors array", () => {
		const { container } = render(<FieldError errors={[]} />);
		expect(container.innerHTML).toBe("");
	});

	it("should render nothing with undefined errors", () => {
		const { container } = render(<FieldError errors={undefined} />);
		expect(container.innerHTML).toBe("");
	});

	it("should deduplicate errors with same message", () => {
		render(
			<FieldError
				errors={[
					{ message: "Required" },
					{ message: "Required" },
				]}
			/>,
		);
		const alert = screen.getByRole("alert");
		// Single error should render as text, not list
		expect(alert).toHaveTextContent("Required");
		expect(alert.querySelector("ul")).not.toBeInTheDocument();
	});

	it("should skip errors with undefined message", () => {
		const { container } = render(
			<FieldError
				errors={[{ message: undefined }]}
			/>,
		);
		expect(container.innerHTML).toBe("");
	});

	it("should skip errors with undefined message in list context", () => {
		render(
			<FieldError
				errors={[
					{ message: "Valid error" },
					{ message: undefined },
				]}
			/>,
		);
		const alert = screen.getByRole("alert");
		expect(alert).toHaveTextContent("Valid error");
		// Two entries in uniqueErrors (one with undefined key), so it renders as <ul>
		// The undefined message is filtered out by `error?.message &&` in the <li> map
		const list = alert.querySelector("ul");
		expect(list).toBeInTheDocument();
		const items = list?.querySelectorAll("li");
		expect(items?.length).toBe(1);
		expect(items?.[0]).toHaveTextContent("Valid error");
	});

	it("should render children over errors when both provided", () => {
		render(
			<FieldError errors={[{ message: "From errors prop" }]}>
				From children
			</FieldError>,
		);
		const alert = screen.getByRole("alert");
		expect(alert).toHaveTextContent("From children");
		expect(alert).not.toHaveTextContent("From errors prop");
	});

	it("should render null when no content", () => {
		const { container } = render(<FieldError />);
		expect(container.innerHTML).toBe("");
	});

	it("should have data-slot field-error", () => {
		render(<FieldError>Some error</FieldError>);
		const alert = screen.getByRole("alert");
		expect(alert).toHaveAttribute("data-slot", "field-error");
	});

	it("should apply custom className", () => {
		render(<FieldError className="my-error">Custom error</FieldError>);
		const alert = screen.getByRole("alert");
		expect(alert).toHaveClass("my-error");
	});
});

describe("FieldSeparator", () => {
	it("should render with data-slot", () => {
		const { container } = render(<FieldSeparator />);
		const separator = container.querySelector('[data-slot="field-separator"]');
		expect(separator).toBeInTheDocument();
	});

	it("should have data-content=false when no children", () => {
		const { container } = render(<FieldSeparator />);
		const separator = container.querySelector('[data-slot="field-separator"]');
		expect(separator).toHaveAttribute("data-content", "false");
	});

	it("should have data-content=true when children provided", () => {
		const { container } = render(<FieldSeparator>or</FieldSeparator>);
		const separator = container.querySelector('[data-slot="field-separator"]');
		expect(separator).toHaveAttribute("data-content", "true");
	});

	it("should render children in span with data-slot field-separator-content", () => {
		render(<FieldSeparator>or</FieldSeparator>);
		const contentSpan = screen.getByText("or");
		expect(contentSpan).toBeInTheDocument();
		expect(contentSpan).toHaveAttribute(
			"data-slot",
			"field-separator-content",
		);
		expect(contentSpan.tagName).toBe("SPAN");
	});

	it("should not render content span when no children", () => {
		const { container } = render(<FieldSeparator />);
		const contentSpan = container.querySelector(
			'[data-slot="field-separator-content"]',
		);
		expect(contentSpan).not.toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<FieldSeparator className="my-separator">or</FieldSeparator>,
		);
		const separator = container.querySelector('[data-slot="field-separator"]');
		expect(separator).toHaveClass("my-separator");
	});
});

describe("Field responsive orientation", () => {
	it("should render responsive orientation", () => {
		const { container } = render(
			<Field orientation="responsive">
				<FieldLabel>Username</FieldLabel>
				<Input />
			</Field>,
		);
		const field = container.querySelector('[data-slot="field"]');
		expect(field).toHaveAttribute("data-orientation", "responsive");
	});
});

describe("Field invalid state", () => {
	it("should apply data-invalid attribute", () => {
		const { container } = render(
			<Field data-invalid="true">
				<FieldLabel>Username</FieldLabel>
				<Input />
			</Field>,
		);
		const field = container.querySelector('[data-slot="field"]');
		expect(field).toHaveAttribute("data-invalid", "true");
	});

	it("should have data-[invalid=true]:text-destructive variant class", () => {
		const { container } = render(
			<Field data-invalid="true">
				<FieldLabel>Username</FieldLabel>
				<Input />
			</Field>,
		);
		const field = container.querySelector('[data-slot="field"]');
		expect(field?.className).toContain("data-[invalid=true]:text-destructive");
	});
});

describe("FieldDescription", () => {
	it("should render p element with data-slot", () => {
		const { container } = render(<FieldDescription>Some description</FieldDescription>);
		const desc = container.querySelector('[data-slot="field-description"]');
		expect(desc).toBeInTheDocument();
		expect(desc?.tagName).toBe("P");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<FieldDescription className="my-desc">Some description</FieldDescription>,
		);
		const desc = container.querySelector('[data-slot="field-description"]');
		expect(desc).toHaveClass("my-desc");
	});
});

describe("FieldLabel", () => {
	it("should have data-slot field-label", () => {
		const { container } = render(<FieldLabel>Label</FieldLabel>);
		const label = container.querySelector('[data-slot="field-label"]');
		expect(label).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<FieldLabel className="my-label">Label</FieldLabel>,
		);
		const label = container.querySelector('[data-slot="field-label"]');
		expect(label).toHaveClass("my-label");
	});
});
