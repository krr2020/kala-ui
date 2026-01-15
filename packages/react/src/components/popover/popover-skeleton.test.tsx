import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PopoverSkeleton } from "./popover-skeleton";

describe("PopoverSkeleton", () => {
	it("should render with default props", () => {
		render(<PopoverSkeleton />);
		const popover = screen.getByTestId("popover-skeleton");
		expect(popover).toBeInTheDocument();
		expect(popover).toHaveAttribute("aria-busy", "true");
		expect(popover).toHaveAttribute("aria-label", "Loading popover");
	});

	it("should render default 3 content rows", () => {
		const { container } = render(<PopoverSkeleton />);
		const contentRows = container.querySelectorAll(".h-4.w-48");
		expect(contentRows).toHaveLength(3);
	});

	it("should render correct number of content rows", () => {
		const { container } = render(<PopoverSkeleton contentRows={5} />);
		const contentRows = container.querySelectorAll(".h-4.w-48");
		expect(contentRows).toHaveLength(5);
	});

	it("should use compact spacing by default", () => {
		render(<PopoverSkeleton />);
		const popover = screen.getByTestId("popover-skeleton");
		expect(popover.className).toContain("p-2");
	});

	it("should use normal spacing when compact is false", () => {
		render(<PopoverSkeleton compact={false} />);
		const popover = screen.getByTestId("popover-skeleton");
		expect(popover.className).toContain("p-4");
	});

	it("should apply custom className", () => {
		render(<PopoverSkeleton className="custom-class" />);
		const popover = screen.getByTestId("popover-skeleton");
		expect(popover).toHaveClass("custom-class");
	});

	it("should accept custom data-testid", () => {
		render(<PopoverSkeleton data-testid="custom-popover-skeleton" />);
		const popover = screen.getByTestId("custom-popover-skeleton");
		expect(popover).toBeInTheDocument();
	});
});
