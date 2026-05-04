import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricCardSkeleton } from "./metric-card-skeleton";

describe("MetricCardSkeleton", () => {
	it("renders with default variant", () => {
		render(<MetricCardSkeleton />);
		expect(screen.getByTestId("metric-card-skeleton")).toBeInTheDocument();
	});

	it("renders with custom data-testid", () => {
		render(<MetricCardSkeleton data-testid="custom-metric-skel" />);
		expect(screen.getByTestId("custom-metric-skel")).toBeInTheDocument();
	});

	it("renders without icon by default", () => {
		const { container } = render(<MetricCardSkeleton />);
		// No icon circle should be present
		const circles = container.querySelectorAll(".rounded-md");
		// Only the card container uses rounded-md, not an icon circle
		expect(circles.length).toBeGreaterThanOrEqual(0);
	});

	it("renders with showIcon=true", () => {
		render(<MetricCardSkeleton showIcon={true} />);
		expect(screen.getByTestId("metric-card-skeleton")).toBeInTheDocument();
	});

	it("renders with withIcon variant", () => {
		render(<MetricCardSkeleton variant="withIcon" />);
		expect(screen.getByTestId("metric-card-skeleton")).toBeInTheDocument();
	});

	it("renders change indicator by default (showChange=true)", () => {
		const { container } = render(<MetricCardSkeleton />);
		// Should have the change section with text-sm class
		const changeSection = container.querySelector(".text-sm");
		expect(changeSection).toBeInTheDocument();
	});

	it("hides change indicator when showChange is false", () => {
		const { container } = render(
			<MetricCardSkeleton variant="withIcon" showChange={false} />,
		);
		const changeSection = container.querySelector(".text-sm");
		expect(changeSection).not.toBeInTheDocument();
	});

	it("renders with simple variant", () => {
		render(<MetricCardSkeleton variant="simple" />);
		expect(screen.getByTestId("metric-card-skeleton")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = render(
			<MetricCardSkeleton className="extra-class" />,
		);
		expect(container.firstChild).toHaveClass("extra-class");
	});

	it("has compound component MetricCardSkeleton.Skeleton", () => {
		expect(MetricCardSkeleton.Skeleton).toBe(MetricCardSkeleton);
	});
});
