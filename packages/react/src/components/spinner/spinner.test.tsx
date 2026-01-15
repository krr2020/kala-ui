import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./spinner";

describe("Spinner", () => {
	it("should render spinner with default size", () => {
		const { container } = render(<Spinner />);
		const output = container.querySelector("output");
		expect(output).toBeInTheDocument();
		expect(output?.tagName.toLowerCase()).toBe("output");
	});

	it("should render with small size", () => {
		const { container } = render(<Spinner size="sm" />);
		const spinner = container.querySelector("svg");
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveClass("h-4", "w-4");
	});

	it("should render with medium size", () => {
		const { container } = render(<Spinner size="md" />);
		const spinner = container.querySelector("svg");
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveClass("h-6", "w-6");
	});

	it("should render with large size", () => {
		const { container } = render(<Spinner size="lg" />);
		const spinner = container.querySelector("svg");
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveClass("h-8", "w-8");
	});

	it("should render with default label", () => {
		render(<Spinner />);
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("should render with custom label", () => {
		render(<Spinner label="Processing" />);
		expect(screen.getByText("Processing")).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(<Spinner className="text-blue-600" />);
		const output = container.querySelector("output");
		expect(output).toHaveClass("text-blue-600");
	});

	it("should have sr-only text for accessibility", () => {
		const { container } = render(<Spinner />);
		const srText = container.querySelector(".sr-only");
		expect(srText).toBeInTheDocument();
		expect(srText).toHaveTextContent("Loading...");
	});
});
