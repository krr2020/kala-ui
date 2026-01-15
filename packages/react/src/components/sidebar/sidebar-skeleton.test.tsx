import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SidebarSkeleton } from "./sidebar-skeleton";

describe("SidebarSkeleton", () => {
	it("should render with default props", () => {
		render(<SidebarSkeleton />);
		const sidebar = screen.getByTestId("sidebar-skeleton");
		expect(sidebar).toBeInTheDocument();
		expect(sidebar).toHaveAttribute("aria-busy", "true");
		expect(sidebar).toHaveAttribute("aria-label", "Loading sidebar");
	});

	it("should render expanded sidebar by default", () => {
		render(<SidebarSkeleton />);
		const sidebar = screen.getByTestId("sidebar-skeleton");
		expect(sidebar.className).toContain("w-64");
	});

	it("should render collapsed sidebar when collapsed is true", () => {
		render(<SidebarSkeleton collapsed />);
		const sidebar = screen.getByTestId("sidebar-skeleton");
		expect(sidebar.className).toContain("w-16");
	});

	it("should show header by default", () => {
		const { container } = render(<SidebarSkeleton />);
		const header = container.querySelector(".h-16.border-b");
		expect(header).toBeInTheDocument();
	});

	it("should hide header when showHeader is false", () => {
		const { container } = render(<SidebarSkeleton showHeader={false} />);
		const header = container.querySelector(".h-16.border-b");
		expect(header).not.toBeInTheDocument();
	});

	it("should show footer by default", () => {
		const { container } = render(<SidebarSkeleton />);
		const footer = container.querySelector(".border-t");
		expect(footer).toBeInTheDocument();
	});

	it("should hide footer when showFooter is false", () => {
		const { container } = render(<SidebarSkeleton showFooter={false} />);
		const footer = container.querySelector(".border-t");
		expect(footer).not.toBeInTheDocument();
	});

	it("should render correct number of sections", () => {
		const { container } = render(<SidebarSkeleton sectionCount={2} />);
		const sections = container.querySelectorAll(".overflow-y-auto > div");
		expect(sections).toHaveLength(2);
	});

	it("should render default 3 sections", () => {
		const { container } = render(<SidebarSkeleton />);
		const sections = container.querySelectorAll(".overflow-y-auto > div");
		expect(sections).toHaveLength(3);
	});

	it("should render correct items per section", () => {
		const { container } = render(
			<SidebarSkeleton sectionCount={1} itemsPerSection={2} />,
		);
		const items = container.querySelectorAll(".space-y-2 > div");
		expect(items).toHaveLength(2);
	});

	it("should hide labels when collapsed", () => {
		const { container } = render(<SidebarSkeleton collapsed />);
		// In collapsed state, item labels should not be visible (they use flex-1 inside items)
		const itemContainers = container.querySelectorAll(".space-y-2 > div");
		itemContainers.forEach((item) => {
			const label = item.querySelector(".flex-1");
			expect(label).not.toBeInTheDocument();
		});
	});

	it("should show user profile avatar in footer", () => {
		const { container } = render(<SidebarSkeleton />);
		const avatar = container.querySelector(".h-10.w-10.rounded-full");
		expect(avatar).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		render(<SidebarSkeleton className="custom-class" />);
		const sidebar = screen.getByTestId("sidebar-skeleton");
		expect(sidebar).toHaveClass("custom-class");
	});

	it("should accept custom data-testid", () => {
		render(<SidebarSkeleton data-testid="custom-sidebar-skeleton" />);
		const sidebar = screen.getByTestId("custom-sidebar-skeleton");
		expect(sidebar).toBeInTheDocument();
	});
});
