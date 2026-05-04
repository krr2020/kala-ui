import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RadioGroupSkeleton } from "./radio-group-skeleton";

describe("RadioGroupSkeleton", () => {
	it("renders without crashing", () => {
		render(<RadioGroupSkeleton />);
		const skeleton = screen.getByTestId("radio-group-skeleton");
		expect(skeleton).toBeInTheDocument();
	});

	it("renders with default test id", () => {
		render(<RadioGroupSkeleton />);
		expect(screen.getByTestId("radio-group-skeleton")).toBeInTheDocument();
	});

	it("accepts custom data-testid", () => {
		render(<RadioGroupSkeleton data-testid="custom-rg-skeleton" />);
		expect(screen.getByTestId("custom-rg-skeleton")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<RadioGroupSkeleton className="custom-class" />);
		const skeleton = screen.getByTestId("radio-group-skeleton");
		expect(skeleton).toHaveClass("custom-class");
	});

	it("renders default 3 options", () => {
		const { container } = render(<RadioGroupSkeleton />);
		// Each option has a radio circle (h-4 w-4 rounded-full flex-shrink-0)
		const circles = container.querySelectorAll(".h-4.w-4.rounded-full.flex-shrink-0");
		expect(circles).toHaveLength(3);
	});

	it("renders correct number of options with optionCount prop", () => {
		const { container } = render(<RadioGroupSkeleton optionCount={5} />);
		const circles = container.querySelectorAll(".h-4.w-4.rounded-full.flex-shrink-0");
		expect(circles).toHaveLength(5);
	});

	it("renders vertical layout by default", () => {
		render(<RadioGroupSkeleton />);
		const skeleton = screen.getByTestId("radio-group-skeleton");
		expect(skeleton).toHaveClass("flex-col", "gap-3");
	});

	it("renders horizontal layout when orientation is horizontal", () => {
		render(<RadioGroupSkeleton orientation="horizontal" />);
		const skeleton = screen.getByTestId("radio-group-skeleton");
		expect(skeleton).toHaveClass("flex-row", "gap-4");
	});

	it("does not show descriptions by default", () => {
		const { container } = render(<RadioGroupSkeleton />);
		const descriptions = container.querySelectorAll(".h-3.w-32");
		expect(descriptions).toHaveLength(0);
	});

	it("shows descriptions when showDescription is true", () => {
		const { container } = render(<RadioGroupSkeleton showDescription />);
		const descriptions = container.querySelectorAll(".h-3.w-32");
		expect(descriptions).toHaveLength(3);
	});

	it("renders radio circle and label for each option", () => {
		const { container } = render(<RadioGroupSkeleton />);
		const circles = container.querySelectorAll(".h-4.w-4.rounded-full");
		const labels = container.querySelectorAll(".h-4.w-24");
		expect(circles).toHaveLength(3);
		expect(labels).toHaveLength(3);
	});
});
