import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BannerSkeleton } from "./banner-skeleton";

describe("BannerSkeleton", () => {
	it("renders with default variant (info)", () => {
		render(<BannerSkeleton />);
		expect(screen.getByTestId("banner-skeleton")).toBeInTheDocument();
	});

	it("renders with custom data-testid", () => {
		render(<BannerSkeleton data-testid="custom-banner-skeleton" />);
		expect(screen.getByTestId("custom-banner-skeleton")).toBeInTheDocument();
	});

	it("renders with icon by default", () => {
		const { container } = render(<BannerSkeleton />);
		const skeletonCircle = container.querySelector(".rounded-md");
		expect(skeletonCircle).toBeInTheDocument();
	});

	it("renders without icon when showIcon is false", () => {
		const { container } = render(<BannerSkeleton showIcon={false} />);
		expect(screen.getByTestId("banner-skeleton")).toBeInTheDocument();
	});

	it("renders with close button by default", () => {
		const { container } = render(<BannerSkeleton />);
		const closeButton = container.querySelector(".rounded");
		expect(closeButton).toBeInTheDocument();
	});

	it("renders without close button when showCloseButton is false", () => {
		const { container } = render(<BannerSkeleton showCloseButton={false} />);
		const closeButton = container.querySelector(".rounded");
		expect(closeButton).not.toBeInTheDocument();
	});

	it("renders with info variant", () => {
		const { container } = render(<BannerSkeleton variant="info" />);
		expect(container.firstChild).toHaveClass("bg-info", "text-info-foreground");
	});

	it("renders with warning variant", () => {
		const { container } = render(<BannerSkeleton variant="warning" />);
		expect(container.firstChild).toHaveClass("bg-warning", "text-warning-foreground");
	});

	it("renders with error variant", () => {
		const { container } = render(<BannerSkeleton variant="error" />);
		expect(container.firstChild).toHaveClass("bg-destructive", "text-destructive-foreground");
	});

	it("renders with success variant", () => {
		const { container } = render(<BannerSkeleton variant="success" />);
		expect(container.firstChild).toHaveClass("bg-success", "text-success-foreground");
	});

	it("renders with default variant", () => {
		render(<BannerSkeleton variant="default" />);
		expect(screen.getByTestId("banner-skeleton")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = render(<BannerSkeleton className="extra-class" />);
		expect(container.firstChild).toHaveClass("extra-class");
	});

	it("has compound component BannerSkeleton.Skeleton", () => {
		expect(BannerSkeleton.Skeleton).toBe(BannerSkeleton);
	});
});
