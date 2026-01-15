import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../components/button";

describe("Button", () => {
	it("should render with default variant", () => {
		render(<Button>Click me</Button>);
		const button = screen.getByRole("button", { name: /click me/i });
		expect(button).toBeInTheDocument();
	});

	it("should render with destructive variant", () => {
		render(<Button variant="destructive">Delete</Button>);
		const button = screen.getByRole("button", { name: /delete/i });
		expect(button).toBeInTheDocument();
	});

	it("should render with outline variant", () => {
		render(<Button variant="outline">Cancel</Button>);
		const button = screen.getByRole("button", { name: /cancel/i });
		expect(button).toBeInTheDocument();
	});

	it("should render with secondary variant", () => {
		render(<Button variant="secondary">Secondary</Button>);
		const button = screen.getByRole("button", { name: /secondary/i });
		expect(button).toBeInTheDocument();
	});

	it("should render with ghost variant", () => {
		render(<Button variant="ghost">Ghost</Button>);
		const button = screen.getByRole("button", { name: /ghost/i });
		expect(button).toBeInTheDocument();
	});

	it("should render with small size", () => {
		render(<Button size="sm">Small</Button>);
		const button = screen.getByRole("button", { name: /small/i });
		expect(button).toBeInTheDocument();
	});

	it("should render with large size", () => {
		render(<Button size="lg">Large</Button>);
		const button = screen.getByRole("button", { name: /large/i });
		expect(button).toBeInTheDocument();
	});

	it("should render with icon size", () => {
		render(
			<Button size="icon" aria-label="icon button">
				X
			</Button>,
		);
		const button = screen.getByRole("button", { name: /icon button/i });
		expect(button).toBeInTheDocument();
	});

	it("should be disabled when disabled prop is true", () => {
		render(<Button disabled>Disabled</Button>);
		const button = screen.getByRole("button", { name: /disabled/i });
		expect(button).toBeDisabled();
	});

	it("should accept custom className", () => {
		render(<Button className="custom-class">Custom</Button>);
		const button = screen.getByRole("button", { name: /custom/i });
		expect(button).toHaveClass("custom-class");
	});

	it("should handle onClick events", () => {
		let clicked = false;
		render(
			<Button
				onClick={() => {
					clicked = true;
				}}
			>
				Click me
			</Button>,
		);
		const button = screen.getByRole("button", { name: /click me/i });
		button.click();
		expect(clicked).toBe(true);
	});
});
