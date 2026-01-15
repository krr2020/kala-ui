import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DrawerSkeleton } from "./drawer-skeleton";

describe("DrawerSkeleton", () => {
	it("should render with default props", () => {
		render(<DrawerSkeleton />);
		const drawer = screen.getByTestId("drawer-skeleton");
		expect(drawer).toBeInTheDocument();
		expect(drawer).toHaveAttribute("aria-busy", "true");
	});

	it("should render similar to DialogSkeleton", () => {
		const { container } = render(<DrawerSkeleton />);
		// Should have header, body, and footer sections
		const header = container.querySelector(".h-6.w-48");
		expect(header).toBeInTheDocument();
	});

	it("should show header by default", () => {
		const { container } = render(<DrawerSkeleton />);
		const header = container.querySelector(".h-6.w-48");
		expect(header).toBeInTheDocument();
	});

	it("should hide header when showHeader is false", () => {
		const { container } = render(<DrawerSkeleton showHeader={false} />);
		const header = container.querySelector(".h-6.w-48");
		expect(header).not.toBeInTheDocument();
	});

	it("should show footer by default", () => {
		const { container } = render(<DrawerSkeleton />);
		const buttons = container.querySelectorAll(".h-10.w-24");
		expect(buttons).toHaveLength(2);
	});

	it("should hide footer when showFooter is false", () => {
		const { container } = render(<DrawerSkeleton showFooter={false} />);
		const buttons = container.querySelectorAll(".h-10.w-24");
		expect(buttons).toHaveLength(0);
	});

	it("should render default 4 content rows", () => {
		const { container } = render(<DrawerSkeleton />);
		const contentRows = container.querySelectorAll(".space-y-3 > *");
		expect(contentRows).toHaveLength(4);
	});

	it("should render correct number of content rows", () => {
		const { container } = render(<DrawerSkeleton contentRows={5} />);
		const contentRows = container.querySelectorAll(".space-y-3 > *");
		expect(contentRows).toHaveLength(5);
	});

	it("should apply custom className", () => {
		render(<DrawerSkeleton className="custom-class" />);
		const drawer = screen.getByTestId("drawer-skeleton");
		expect(drawer).toHaveClass("custom-class");
	});

	it("should accept custom data-testid", () => {
		render(<DrawerSkeleton data-testid="custom-drawer-skeleton" />);
		const drawer = screen.getByTestId("custom-drawer-skeleton");
		expect(drawer).toBeInTheDocument();
	});
});
