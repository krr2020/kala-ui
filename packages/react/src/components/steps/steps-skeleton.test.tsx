import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StepsSkeleton } from "./steps-skeleton";

describe("StepsSkeleton", () => {
	it("should render with default props", () => {
		render(<StepsSkeleton />);
		const steps = screen.getByTestId("steps-skeleton");
		expect(steps).toBeInTheDocument();
		expect(steps).toHaveAttribute("aria-busy", "true");
		expect(steps).toHaveAttribute("aria-label", "Loading steps");
	});

	it("should render horizontal orientation by default", () => {
		render(<StepsSkeleton />);
		const steps = screen.getByTestId("steps-skeleton");
		expect(steps.className).toContain("flex-row");
	});

	it("should render vertical orientation when specified", () => {
		render(<StepsSkeleton orientation="vertical" />);
		const steps = screen.getByTestId("steps-skeleton");
		expect(steps.className).toContain("flex-col");
	});

	it("should render default 4 steps", () => {
		const { container } = render(<StepsSkeleton />);
		const stepIndicators = container.querySelectorAll(
			".h-10.w-10.rounded-full",
		);
		expect(stepIndicators).toHaveLength(4);
	});

	it("should render correct number of steps", () => {
		const { container } = render(<StepsSkeleton stepCount={3} />);
		const stepIndicators = container.querySelectorAll(
			".h-10.w-10.rounded-full",
		);
		expect(stepIndicators).toHaveLength(3);
	});

	it("should show labels by default", () => {
		const { container } = render(<StepsSkeleton stepCount={2} />);
		// Each step should have 2 label skeletons
		const labels = container.querySelectorAll(".h-4, .h-3");
		expect(labels.length).toBeGreaterThanOrEqual(4); // 2 steps * 2 labels each
	});

	it("should hide labels when showLabels is false", () => {
		const { container } = render(<StepsSkeleton showLabels={false} />);
		const stepContainers = container.querySelectorAll(
			"[data-testid='steps-skeleton'] > *",
		);
		// Should only have steps and connectors, no label containers
		stepContainers.forEach((step) => {
			const labelContainer = step.querySelector("div:not(.h-10)");
			expect(labelContainer).not.toBeInTheDocument();
		});
	});

	it("should render connectors between steps", () => {
		const { container } = render(<StepsSkeleton stepCount={3} />);
		// Should have stepCount - 1 connectors
		const connectors = container.querySelectorAll(".h-0\\.5, .w-0\\.5");
		expect(connectors.length).toBeGreaterThanOrEqual(2);
	});

	it("should apply custom className", () => {
		render(<StepsSkeleton className="custom-class" />);
		const steps = screen.getByTestId("steps-skeleton");
		expect(steps).toHaveClass("custom-class");
	});

	it("should accept custom data-testid", () => {
		render(<StepsSkeleton data-testid="custom-steps-skeleton" />);
		const steps = screen.getByTestId("custom-steps-skeleton");
		expect(steps).toBeInTheDocument();
	});
});
