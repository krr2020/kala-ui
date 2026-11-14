import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./label";

describe("Label", () => {
	it("renders children correctly", () => {
		render(<Label>Test Label</Label>);
		expect(screen.getByText("Test Label")).toBeInTheDocument();
	});

	it("shows required indicator when required prop is true", () => {
		render(<Label required>Required Field</Label>);
		expect(screen.getByText("Required Field")).toBeInTheDocument();
		expect(screen.getByText("*")).toBeInTheDocument();
	});

	it("does not show required indicator when required prop is false", () => {
		render(<Label>Optional Field</Label>);
		expect(screen.queryByText("*")).not.toBeInTheDocument();
	});

	it("accepts htmlFor prop for accessibility", () => {
		render(<Label htmlFor="input-id">Associated Label</Label>);
		const label = screen.getByText("Associated Label").closest("label");
		expect(label).toHaveAttribute("for", "input-id");
	});

	it("accepts custom className", () => {
		render(<Label className="custom-class">Custom</Label>);
		expect(screen.getByText("Custom").closest("label")).toHaveClass("custom-class");
	});

	it("applies label-base styles", () => {
		render(<Label>Styled Label</Label>);
		const label = screen.getByText("Styled Label").closest("label");
		expect(label).toHaveClass("text-sm");
		expect(label).toHaveClass("font-medium");
	});

	it("forwards ref correctly", () => {
		const ref = { current: null };
		render(<Label ref={ref}>Label</Label>);
		expect(ref.current).toBeInstanceOf(HTMLLabelElement);
	});

	it("renders required indicator with correct styling", () => {
		render(<Label required>Field</Label>);
		const asterisk = screen.getByText("*");
		expect(asterisk).toHaveClass("text-destructive");
	});
});
