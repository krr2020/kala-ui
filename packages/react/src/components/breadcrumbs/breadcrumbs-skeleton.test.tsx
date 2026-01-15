import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BreadcrumbsSkeleton } from "./breadcrumbs-skeleton";

describe("BreadcrumbsSkeleton", () => {
	it("should render with default props", () => {
		render(<BreadcrumbsSkeleton />);
		const breadcrumbs = screen.getByTestId("breadcrumbs-skeleton");
		expect(breadcrumbs).toBeInTheDocument();
		expect(breadcrumbs).toHaveAttribute("aria-busy", "true");
		expect(breadcrumbs).toHaveAttribute("aria-label", "Loading breadcrumbs");
	});

	it("should render default 3 levels", () => {
		const { container } = render(<BreadcrumbsSkeleton />);
		const items = container.querySelectorAll(".h-4.w-20");
		expect(items).toHaveLength(3);
	});

	it("should render correct number of levels", () => {
		const { container } = render(<BreadcrumbsSkeleton depth={5} />);
		const items = container.querySelectorAll(".h-4.w-20");
		expect(items).toHaveLength(5);
	});

	it("should render separators between items", () => {
		const { container } = render(<BreadcrumbsSkeleton depth={3} />);
		const separators = Array.from(container.querySelectorAll("span")).filter(
			(span) => span.textContent === "/",
		);
		// Should have depth - 1 separators
		expect(separators).toHaveLength(2);
	});

	it("should not show home icon by default", () => {
		const { container } = render(<BreadcrumbsSkeleton />);
		const homeIcon = container.querySelector(".h-4.w-4");
		expect(homeIcon).not.toBeInTheDocument();
	});

	it("should show home icon when showHome is true", () => {
		const { container } = render(<BreadcrumbsSkeleton showHome />);
		const homeIcon = container.querySelector(".h-4.w-4");
		expect(homeIcon).toBeInTheDocument();
	});

	it("should render custom separator", () => {
		const { container } = render(<BreadcrumbsSkeleton separator=">" />);
		const separators = Array.from(container.querySelectorAll("span")).filter(
			(span) => span.textContent === ">",
		);
		expect(separators.length).toBeGreaterThan(0);
	});

	it("should apply custom className", () => {
		render(<BreadcrumbsSkeleton className="custom-class" />);
		const breadcrumbs = screen.getByTestId("breadcrumbs-skeleton");
		expect(breadcrumbs).toHaveClass("custom-class");
	});

	it("should accept custom data-testid", () => {
		render(<BreadcrumbsSkeleton data-testid="custom-breadcrumbs-skeleton" />);
		const breadcrumbs = screen.getByTestId("custom-breadcrumbs-skeleton");
		expect(breadcrumbs).toBeInTheDocument();
	});
});
