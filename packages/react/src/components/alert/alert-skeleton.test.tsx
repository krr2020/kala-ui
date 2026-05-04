import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AlertSkeleton } from "./alert-skeleton";

describe("AlertSkeleton", () => {
	it("renders with default variant", () => {
		render(<AlertSkeleton />);
		expect(screen.getByTestId("alert-skeleton")).toBeInTheDocument();
		expect(screen.getByTestId("alert-skeleton")).toHaveAttribute("role", "alert");
	});

	it("renders with custom data-testid", () => {
		render(<AlertSkeleton data-testid="custom-alert-skeleton" />);
		expect(screen.getByTestId("custom-alert-skeleton")).toBeInTheDocument();
	});

	it("renders with icon by default", () => {
		const { container } = render(<AlertSkeleton />);
		// The skeleton circle should be present
		const skeletonCircle = container.querySelector(".rounded-md");
		expect(skeletonCircle).toBeInTheDocument();
	});

	it("renders without icon when showIcon is false", () => {
		const { container } = render(<AlertSkeleton showIcon={false} />);
		// Should still render the text skeletons
		expect(screen.getByTestId("alert-skeleton")).toBeInTheDocument();
	});

	it("renders with primary variant", () => {
		render(<AlertSkeleton variant="primary" />);
		expect(screen.getByTestId("alert-skeleton")).toBeInTheDocument();
	});

	it("renders with warning variant", () => {
		render(<AlertSkeleton variant="warning" />);
		expect(screen.getByTestId("alert-skeleton")).toBeInTheDocument();
	});

	it("renders with success variant", () => {
		render(<AlertSkeleton variant="success" />);
		expect(screen.getByTestId("alert-skeleton")).toBeInTheDocument();
	});

	it("renders with danger variant", () => {
		render(<AlertSkeleton variant="danger" />);
		expect(screen.getByTestId("alert-skeleton")).toBeInTheDocument();
	});

	it("renders with destructive variant", () => {
		render(<AlertSkeleton variant="destructive" />);
		expect(screen.getByTestId("alert-skeleton")).toBeInTheDocument();
	});

	it("renders with info variant", () => {
		render(<AlertSkeleton variant="info" />);
		expect(screen.getByTestId("alert-skeleton")).toBeInTheDocument();
	});

	it("renders with secondary variant", () => {
		render(<AlertSkeleton variant="secondary" />);
		expect(screen.getByTestId("alert-skeleton")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = render(<AlertSkeleton className="extra-class" />);
		expect(container.firstChild).toHaveClass("extra-class");
	});

	it("has compound component AlertSkeleton.Skeleton", () => {
		expect(AlertSkeleton.Skeleton).toBe(AlertSkeleton);
	});
});
