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

	it("should forward ref to the switch element", () => {
		let ref: HTMLButtonElement | null = null;
		render(
			<Switch
				ref={(el) => {
					ref = el;
				}}
			/>,
		);
		expect(ref).not.toBeNull();
		expect(ref).toBeInstanceOf(HTMLButtonElement);
	});

	it("should render skeleton when isLoading is true", () => {
		const { container } = render(<Switch isLoading />);
		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("should render skeleton with custom className when isLoading is true", () => {
		const { container } = render(
			<Switch isLoading className="loading-switch" />,
		);
		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toHaveClass("loading-switch");
	});

	it("should not render switch root when isLoading is true", () => {
		const { container } = render(<Switch isLoading />);
		const switchElement = container.querySelector('[data-slot="switch"]');
		expect(switchElement).not.toBeInTheDocument();
	});

	it("should render switch root when isLoading is false (explicit)", () => {
		const { container } = render(<Switch isLoading={false} />);
		const switchElement = container.querySelector('[data-slot="switch"]');
		expect(switchElement).toBeInTheDocument();
	});

	it("should render switch root when isLoading is not provided", () => {
		const { container } = render(<Switch />);
		const switchElement = container.querySelector('[data-slot="switch"]');
		expect(switchElement).toBeInTheDocument();
	});
});
