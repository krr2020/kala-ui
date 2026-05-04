import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorFallback } from "./error-fallback";

describe("ErrorFallback", () => {
	it("should render with default title and description", () => {
		render(<ErrorFallback />);
		expect(screen.getByText("Something went wrong")).toBeInTheDocument();
		expect(
			screen.getByText("An unexpected error occurred. Please try again."),
		).toBeInTheDocument();
	});

	it("should render with custom title", () => {
		render(<ErrorFallback title="Custom Error Title" />);
		expect(screen.getByText("Custom Error Title")).toBeInTheDocument();
	});

	it("should render with custom description", () => {
		render(<ErrorFallback description="Custom error description text" />);
		expect(screen.getByText("Custom error description text")).toBeInTheDocument();
	});

	it("should have role alert", () => {
		render(<ErrorFallback />);
		expect(screen.getByRole("alert")).toBeInTheDocument();
	});

	it("should have data-comp attribute", () => {
		render(<ErrorFallback />);
		const el = document.querySelector("[data-comp='error-fallback']");
		expect(el).toBeInTheDocument();
	});

	it("should apply default page variant class", () => {
		render(<ErrorFallback />);
		const el = document.querySelector("[data-comp='error-fallback']") as HTMLElement;
		expect(el).toHaveClass("min-h-[400px]");
	});

	it("should apply section variant class when variant is section", () => {
		render(<ErrorFallback variant="section" />);
		const el = document.querySelector("[data-comp='error-fallback']") as HTMLElement;
		expect(el).toHaveClass("min-h-[200px]");
	});

	it("should apply custom className", () => {
		render(<ErrorFallback className="custom-error-class" />);
		const el = document.querySelector("[data-comp='error-fallback']") as HTMLElement;
		expect(el).toHaveClass("custom-error-class");
	});

	it("should not show reset button when reset is not provided", () => {
		render(<ErrorFallback />);
		expect(screen.queryByText("Try Again")).not.toBeInTheDocument();
	});

	it("should show reset button when reset callback is provided", () => {
		const resetFn = vi.fn();
		render(<ErrorFallback reset={resetFn} />);
		expect(screen.getByText("Try Again")).toBeInTheDocument();
	});

	it("should call reset when Try Again button is clicked", () => {
		const resetFn = vi.fn();
		render(<ErrorFallback reset={resetFn} />);
		fireEvent.click(screen.getByText("Try Again"));
		expect(resetFn).toHaveBeenCalledTimes(1);
	});

	it("should render the warning icon container", () => {
		render(<ErrorFallback />);
		const iconContainer = document.querySelector(
			"[data-comp='error-fallback'] > div:first-child",
		) as HTMLElement;
		expect(iconContainer).toHaveClass(
			"mb-4",
			"flex",
			"h-16",
			"w-16",
			"items-center",
			"justify-center",
			"rounded-full",
		);
	});

	it("should apply animate-in fade-in-50 classes", () => {
		render(<ErrorFallback />);
		const el = document.querySelector("[data-comp='error-fallback']") as HTMLElement;
		expect(el).toHaveClass("animate-in", "fade-in-50");
	});

	it("should not show error details in non-development environment", () => {
		const originalNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = "production";
		const error = new Error("test error");
		render(<ErrorFallback error={error} />);
		expect(screen.queryByText("Error Details")).not.toBeInTheDocument();
		process.env.NODE_ENV = originalNodeEnv;
	});

	it("should show error details in development environment", () => {
		const originalNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = "development";
		const error = new Error("test error message");
		render(<ErrorFallback error={error} />);
		expect(screen.getByText("Error Details")).toBeInTheDocument();
		process.env.NODE_ENV = originalNodeEnv;
	});

	it("should display error message in development", () => {
		const originalNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = "development";
		const error = new Error("specific error message");
		render(<ErrorFallback error={error} />);
		expect(screen.getByText(/specific error message/)).toBeInTheDocument();
		process.env.NODE_ENV = originalNodeEnv;
	});

	it("should display error stack in development when available", () => {
		const originalNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = "development";
		const error = new Error("test");
		render(<ErrorFallback error={error} />);
		const pre = document.querySelector("pre");
		expect(pre).toBeInTheDocument();
		expect(pre?.textContent).toContain("test");
		process.env.NODE_ENV = originalNodeEnv;
	});

	it("should not show error details when error is undefined in development", () => {
		const originalNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = "development";
		render(<ErrorFallback />);
		expect(screen.queryByText("Error Details")).not.toBeInTheDocument();
		process.env.NODE_ENV = originalNodeEnv;
	});

	it("should render title as an h2 element", () => {
		render(<ErrorFallback />);
		const heading = screen.getByText("Something went wrong").closest("h2");
		expect(heading).toBeInTheDocument();
	});

	it("should combine all props together", () => {
		const resetFn = vi.fn();
		const error = new Error("combo error");
		const originalNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = "development";

		render(
			<ErrorFallback
				error={error}
				reset={resetFn}
				title="Combo Title"
				description="Combo description"
				variant="section"
				className="combo-class"
			/>,
		);

		expect(screen.getByText("Combo Title")).toBeInTheDocument();
		expect(screen.getByText("Combo description")).toBeInTheDocument();
		expect(screen.getByText("Try Again")).toBeInTheDocument();
		expect(screen.getByText("Error Details")).toBeInTheDocument();

		const el = document.querySelector("[data-comp='error-fallback']") as HTMLElement;
		expect(el).toHaveClass("combo-class", "min-h-[200px]");

		fireEvent.click(screen.getByText("Try Again"));
		expect(resetFn).toHaveBeenCalledTimes(1);

		process.env.NODE_ENV = originalNodeEnv;
	});
});
