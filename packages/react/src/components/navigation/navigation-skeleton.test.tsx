import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NavigationSkeleton } from "./navigation-skeleton";

describe("NavigationSkeleton", () => {
	it("should render with default props", () => {
		render(<NavigationSkeleton />);
		const nav = screen.getByTestId("navigation-skeleton");
		expect(nav).toBeInTheDocument();
		expect(nav).toHaveAttribute("aria-busy", "true");
		expect(nav).toHaveAttribute("aria-label", "Loading navigation");
	});

	it("should render horizontal orientation by default", () => {
		render(<NavigationSkeleton />);
		const nav = screen.getByTestId("navigation-skeleton");
		expect(nav.className).toContain("flex-row");
	});

	it("should render vertical orientation when specified", () => {
		render(<NavigationSkeleton orientation="vertical" />);
		const nav = screen.getByTestId("navigation-skeleton");
		expect(nav.className).toContain("flex-col");
	});

	it("should render correct number of items", () => {
		const { container } = render(<NavigationSkeleton itemCount={3} />);
		const items = container.querySelectorAll(
			"[data-testid='navigation-skeleton'] > div",
		);
		expect(items).toHaveLength(3);
	});

	it("should render default 5 items", () => {
		const { container } = render(<NavigationSkeleton />);
		const items = container.querySelectorAll(
			"[data-testid='navigation-skeleton'] > div",
		);
		expect(items).toHaveLength(5);
	});

	it("should show icons when showIcons is true", () => {
		const { container } = render(<NavigationSkeleton showIcons />);
		const icons = container.querySelectorAll(".h-4.w-4, .h-5.w-5");
		expect(icons.length).toBeGreaterThan(0);
	});

	it("should show badges when showBadges is true", () => {
		const { container } = render(<NavigationSkeleton showBadges />);
		const badges = container.querySelectorAll(".rounded-full.h-4.w-4");
		expect(badges.length).toBeGreaterThan(0);
	});

	it("should render nested items when nested is true and orientation is vertical", () => {
		const { container } = render(
			<NavigationSkeleton orientation="vertical" nested />,
		);
		const nestedSection = container.querySelector(".ml-8");
		expect(nestedSection).toBeInTheDocument();
	});

	it("should not render nested items when orientation is horizontal", () => {
		const { container } = render(
			<NavigationSkeleton orientation="horizontal" nested />,
		);
		const nestedSection = container.querySelector(".ml-8");
		expect(nestedSection).not.toBeInTheDocument();
	});

	it("should apply custom className", () => {
		render(<NavigationSkeleton className="custom-class" />);
		const nav = screen.getByTestId("navigation-skeleton");
		expect(nav).toHaveClass("custom-class");
	});

	it("should accept custom data-testid", () => {
		render(<NavigationSkeleton data-testid="custom-nav-skeleton" />);
		const nav = screen.getByTestId("custom-nav-skeleton");
		expect(nav).toBeInTheDocument();
	});
});
