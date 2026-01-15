import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "../input";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldSeparator,
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
