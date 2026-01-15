import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TabsSkeleton } from "./tabs-skeleton";

describe("TabsSkeleton", () => {
	it("should render with default props", () => {
		render(<TabsSkeleton />);
		const tabs = screen.getByTestId("tabs-skeleton");
		expect(tabs).toBeInTheDocument();
		expect(tabs).toHaveAttribute("aria-busy", "true");
		expect(tabs).toHaveAttribute("aria-label", "Loading tabs");
	});

	it("should render default 4 tabs", () => {
		const { container } = render(<TabsSkeleton />);
		const tabButtons = container.querySelectorAll(".h-10.w-24");
		expect(tabButtons).toHaveLength(4);
	});

	it("should render correct number of tabs", () => {
		const { container } = render(<TabsSkeleton tabCount={3} />);
		const tabButtons = container.querySelectorAll(".h-10.w-24");
		expect(tabButtons).toHaveLength(3);
	});

	it("should render default variant with border", () => {
		const { container } = render(<TabsSkeleton />);
		const tabList = container.querySelector(".border-b");
		expect(tabList).toBeInTheDocument();
	});

	it("should render pills variant", () => {
		const { container } = render(<TabsSkeleton variant="pills" />);
		const tabs = container.querySelectorAll(".rounded-lg");
		expect(tabs.length).toBeGreaterThan(0);
	});

	it("should render underline variant", () => {
		const { container } = render(<TabsSkeleton variant="underline" />);
		const tabList = container.querySelector(".border-b");
		expect(tabList).toBeInTheDocument();
	});

	it("should show content by default", () => {
		const { container } = render(<TabsSkeleton />);
		const content = container.querySelector(".p-4.space-y-3");
		expect(content).toBeInTheDocument();
	});

	it("should hide content when showContent is false", () => {
		const { container } = render(<TabsSkeleton showContent={false} />);
		const content = container.querySelector(".p-4.space-y-3");
		expect(content).not.toBeInTheDocument();
	});

	it("should render default 4 content rows", () => {
		const { container } = render(<TabsSkeleton />);
		const contentRows = container.querySelectorAll(".p-4.space-y-3 > *");
		expect(contentRows).toHaveLength(4);
	});

	it("should render correct number of content rows", () => {
		const { container } = render(<TabsSkeleton contentRows={6} />);
		const contentRows = container.querySelectorAll(".p-4.space-y-3 > *");
		expect(contentRows).toHaveLength(6);
	});

	it("should apply custom className", () => {
		render(<TabsSkeleton className="custom-class" />);
		const tabs = screen.getByTestId("tabs-skeleton");
		expect(tabs).toHaveClass("custom-class");
	});

	it("should accept custom data-testid", () => {
		render(<TabsSkeleton data-testid="custom-tabs-skeleton" />);
		const tabs = screen.getByTestId("custom-tabs-skeleton");
		expect(tabs).toBeInTheDocument();
	});
});
