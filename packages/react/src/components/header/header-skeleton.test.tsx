import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeaderSkeleton } from "./header-skeleton";

describe("HeaderSkeleton", () => {
	it("should render with default props", () => {
		render(<HeaderSkeleton />);
		const header = screen.getByTestId("header-skeleton");
		expect(header).toBeInTheDocument();
	});

	it("should render logo skeleton", () => {
		const { container } = render(<HeaderSkeleton />);
		const logo = container.querySelector(".h-8.w-32");
		expect(logo).toBeInTheDocument();
	});

	it("should show navigation by default", () => {
		const { container } = render(<HeaderSkeleton />);
		const nav = container.querySelector(".hidden.md\\:flex");
		expect(nav).toBeInTheDocument();
	});

	it("should hide navigation when showNavigation is false", () => {
		const { container } = render(<HeaderSkeleton showNavigation={false} />);
		const nav = container.querySelector(".hidden.md\\:flex.gap-6");
		expect(nav).not.toBeInTheDocument();
	});

	it("should render correct number of navigation items", () => {
		const { container } = render(<HeaderSkeleton navItemCount={3} />);
		const navItems = container.querySelectorAll(".hidden.md\\:flex > *");
		expect(navItems).toHaveLength(3);
	});

	it("should render default 4 navigation items", () => {
		const { container } = render(<HeaderSkeleton />);
		const navItems = container.querySelectorAll(".hidden.md\\:flex > *");
		expect(navItems).toHaveLength(4);
	});

	it("should show search when showSearch is true", () => {
		const { container } = render(<HeaderSkeleton showSearch />);
		const search = container.querySelector(".h-9.w-64.rounded-full");
		expect(search).toBeInTheDocument();
	});

	it("should not show search by default", () => {
		const { container } = render(<HeaderSkeleton />);
		const search = container.querySelector(".h-9.w-64.rounded-full");
		expect(search).not.toBeInTheDocument();
	});

	it("should show notifications when showNotifications is true", () => {
		const { container } = render(<HeaderSkeleton showNotifications />);
		const actions = container.querySelectorAll(".h-9.w-9.rounded-full");
		expect(actions.length).toBeGreaterThanOrEqual(1);
	});

	it("should show user menu by default", () => {
		const { container } = render(<HeaderSkeleton />);
		const userMenu = container.querySelectorAll(".h-9.w-9");
		// At least user menu and mobile trigger
		expect(userMenu.length).toBeGreaterThanOrEqual(2);
	});

	it("should show mobile menu trigger", () => {
		const { container } = render(<HeaderSkeleton />);
		const mobileMenu = container.querySelector(".h-9.w-9.md\\:hidden");
		expect(mobileMenu).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		render(<HeaderSkeleton className="custom-class" />);
		const header = screen.getByTestId("header-skeleton");
		expect(header).toHaveClass("custom-class");
	});

	it("should accept custom data-testid", () => {
		render(<HeaderSkeleton data-testid="custom-header-skeleton" />);
		const header = screen.getByTestId("custom-header-skeleton");
		expect(header).toBeInTheDocument();
	});
});
