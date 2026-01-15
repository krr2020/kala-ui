import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
	it("renders children correctly", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole("button")).toHaveTextContent("Click me");
	});

	it("handles click events", async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();
		render(<Button onClick={handleClick}>Click me</Button>);

		await user.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("applies default variant styles", () => {
		render(<Button>Default</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("bg-primary");
	});

	it("applies secondary variant styles", () => {
		render(<Button variant="secondary">Secondary</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("bg-secondary");
	});

	it("applies destructive variant styles", () => {
		render(<Button variant="destructive">Delete</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("bg-destructive");
	});

	it("applies outline variant styles", () => {
		render(<Button variant="outline">Outline</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("border");
		expect(button).toHaveClass("bg-card");
	});

	it("applies ghost variant styles", () => {
		render(<Button variant="ghost">Ghost</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("hover:bg-accent");
	});

	it("applies small size styles", () => {
		render(<Button size="sm">Small</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("h-9");
	});

	it("applies large size styles", () => {
		render(<Button size="lg">Large</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("h-11");
	});

	it("applies icon size styles", () => {
		render(<Button size="icon">→</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("h-10");
		expect(button).toHaveClass("w-10");
	});

	it("respects disabled prop", () => {
		render(<Button disabled>Disabled</Button>);
		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
	});

	it("shows loading state", () => {
		render(<Button isLoading>Loading</Button>);
		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
		// Check for spinner svg
		expect(button.querySelector("svg")).toBeInTheDocument();
	});

	it("does not trigger onClick when disabled", async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();
		render(
			<Button onClick={handleClick} disabled>
				Disabled
			</Button>,
		);

		await user.click(screen.getByRole("button"));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("accepts custom className", () => {
		render(<Button className="custom-class">Custom</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("custom-class");
	});

	it("forwards ref correctly", () => {
		const ref = vi.fn();
		render(<Button ref={ref}>Button</Button>);
		expect(ref).toHaveBeenCalled();
	});
});
