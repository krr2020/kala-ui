import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";

describe("Switch", () => {
	it("should render switch", () => {
		const { container } = render(<Switch />);
		const switchElement = container.querySelector('[data-slot="switch"]');
		expect(switchElement).toBeInTheDocument();
	});

	it("should be unchecked by default", () => {
		const { container } = render(<Switch />);
		const switchElement = container.querySelector('[data-slot="switch"]');
		expect(switchElement).toHaveAttribute("data-state", "unchecked");
	});

	it("should toggle checked state when clicked", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		const { container } = render(<Switch onCheckedChange={handleChange} />);
		const switchElement = container.querySelector('[data-slot="switch"]');
		if (!switchElement) throw new Error("Switch element not found");

		await user.click(switchElement);
		expect(handleChange).toHaveBeenCalledWith(true);
	});

	it("should render as checked when checked prop is true", () => {
		const { container } = render(<Switch checked={true} />);
		const switchElement = container.querySelector('[data-slot="switch"]');
		expect(switchElement).toHaveAttribute("data-state", "checked");
	});

	it("should be disabled when disabled prop is true", () => {
		const { container } = render(<Switch disabled />);
		const switchElement = container.querySelector('[data-slot="switch"]');
		expect(switchElement).toBeDisabled();
	});

	it("should apply custom className", () => {
		const { container } = render(<Switch className="custom-switch" />);
		const switchElement = container.querySelector('[data-slot="switch"]');
		expect(switchElement).toHaveClass("custom-switch");
	});

	it("should render thumb element", () => {
		const { container } = render(<Switch />);
		const thumb = container.querySelector('[data-slot="switch-thumb"]');
		expect(thumb).toBeInTheDocument();
	});
});
