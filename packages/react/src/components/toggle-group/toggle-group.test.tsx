import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

describe("ToggleGroup", () => {
	it("should render toggle group with items", () => {
		render(
			<ToggleGroup type="single">
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="center">Center</ToggleGroupItem>
				<ToggleGroupItem value="right">Right</ToggleGroupItem>
			</ToggleGroup>,
		);

		expect(screen.getByText("Left")).toBeInTheDocument();
		expect(screen.getByText("Center")).toBeInTheDocument();
		expect(screen.getByText("Right")).toBeInTheDocument();
	});

	it("should set data-slot on root", () => {
		const { container } = render(
			<ToggleGroup type="single">
				<ToggleGroupItem value="a">A</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(
			container.querySelector('[data-slot="toggle-group"]'),
		).toBeInTheDocument();
	});

	it("should set data-slot on items", () => {
		const { container } = render(
			<ToggleGroup type="single">
				<ToggleGroupItem value="a">A</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(
			container.querySelector('[data-slot="toggle-group-item"]'),
		).toBeInTheDocument();
	});

	it("should select item in single mode", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(
			<ToggleGroup type="single" onValueChange={handleChange}>
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="center">Center</ToggleGroupItem>
			</ToggleGroup>,
		);

		await user.click(screen.getByText("Left"));
		expect(handleChange).toHaveBeenCalledWith("left");
	});

	it("should select multiple items in multiple mode", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(
			<ToggleGroup type="multiple" onValueChange={handleChange}>
				<ToggleGroupItem value="bold">Bold</ToggleGroupItem>
				<ToggleGroupItem value="italic">Italic</ToggleGroupItem>
			</ToggleGroup>,
		);

		await user.click(screen.getByText("Bold"));
		await user.click(screen.getByText("Italic"));
		expect(handleChange).toHaveBeenCalledTimes(2);
	});

	it("should reflect controlled value", () => {
		render(
			<ToggleGroup type="single" value="center">
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="center">Center</ToggleGroupItem>
			</ToggleGroup>,
		);

		const centerBtn = screen.getByText("Center").closest("button");
		expect(centerBtn).toHaveAttribute("data-state", "on");
	});

	it("should pass variant to items via context", () => {
		const { container } = render(
			<ToggleGroup type="single" variant="outline">
				<ToggleGroupItem value="a">A</ToggleGroupItem>
			</ToggleGroup>,
		);

		const item = container.querySelector('[data-slot="toggle-group-item"]');
		expect(item).toHaveClass("border");
	});

	it("should render with icons", () => {
		render(
			<ToggleGroup type="single">
				<ToggleGroupItem value="left" aria-label="Left align">
					<AlignLeft />
				</ToggleGroupItem>
				<ToggleGroupItem value="center" aria-label="Center align">
					<AlignCenter />
				</ToggleGroupItem>
				<ToggleGroupItem value="right" aria-label="Right align">
					<AlignRight />
				</ToggleGroupItem>
			</ToggleGroup>,
		);

		expect(screen.getByLabelText("Left align")).toBeInTheDocument();
		expect(screen.getByLabelText("Center align")).toBeInTheDocument();
	});

	it("should apply custom className to group", () => {
		const { container } = render(
			<ToggleGroup type="single" className="custom-group">
				<ToggleGroupItem value="a">A</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(container.querySelector('[data-slot="toggle-group"]')).toHaveClass(
			"custom-group",
		);
	});

	it("should be disabled when item is disabled", () => {
		render(
			<ToggleGroup type="single">
				<ToggleGroupItem value="a" disabled>
					Disabled
				</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(screen.getByText("Disabled").closest("button")).toBeDisabled();
	});
});
