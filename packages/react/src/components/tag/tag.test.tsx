import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tag } from "./tag";

describe("Tag", () => {
	it("should render label", () => {
		render(<Tag>React</Tag>);
		expect(screen.getByText("React")).toBeInTheDocument();
	});

	it("should render with data-slot", () => {
		const { container } = render(<Tag>Test</Tag>);
		expect(container.querySelector('[data-slot="tag"]')).toBeInTheDocument();
	});

	it("should render remove button when onRemove is provided", () => {
		render(<Tag onRemove={vi.fn()}>React</Tag>);
		expect(screen.getByLabelText("Remove")).toBeInTheDocument();
	});

	it("should call onRemove when remove button is clicked", async () => {
		const user = userEvent.setup();
		const handleRemove = vi.fn();
		render(<Tag onRemove={handleRemove}>React</Tag>);

		await user.click(screen.getByLabelText("Remove"));
		expect(handleRemove).toHaveBeenCalled();
	});

	it("should not render remove button without onRemove", () => {
		render(<Tag>React</Tag>);
		expect(screen.queryByLabelText("Remove")).toBeNull();
	});

	it("should render icon before label", () => {
		const { container } = render(
			<Tag icon={<span data-testid="icon" />}>Label</Tag>,
		);
		expect(container.querySelector('[data-testid="icon"]')).toBeInTheDocument();
	});

	it("should apply variant classes", () => {
		const { container } = render(
			<Tag variant="outline" color="success">
				Tag
			</Tag>,
		);
		expect(container.querySelector('[data-slot="tag"]')).toHaveClass(
			"border-success",
		);
	});

	it("should apply filled variant", () => {
		const { container } = render(
			<Tag variant="filled" color="primary">
				Tag
			</Tag>,
		);
		expect(container.querySelector('[data-slot="tag"]')).toHaveClass(
			"bg-primary",
		);
	});

	it("should apply small size", () => {
		const { container } = render(<Tag size="sm">Small</Tag>);
		expect(container.querySelector('[data-slot="tag"]')).toHaveClass("text-xs");
	});

	it("should apply custom className", () => {
		const { container } = render(<Tag className="custom-tag">Tag</Tag>);
		expect(container.querySelector('[data-slot="tag"]')).toHaveClass(
			"custom-tag",
		);
	});
});
