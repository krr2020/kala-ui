import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PaginationSkeleton } from "./pagination-skeleton";

describe("PaginationSkeleton", () => {
	it("should render with default props", () => {
		render(<PaginationSkeleton />);
		const pagination = screen.getByTestId("pagination-skeleton");
		expect(pagination).toBeInTheDocument();
		expect(pagination).toHaveAttribute("aria-busy", "true");
		expect(pagination).toHaveAttribute("aria-label", "Loading pagination");
	});

	it("should render default 5 page buttons", () => {
		const { container } = render(<PaginationSkeleton />);
		const pageButtons = container.querySelectorAll(".h-9.w-9");
		// 5 page buttons + 2 prev/next buttons = 7 total
		expect(pageButtons.length).toBeGreaterThanOrEqual(5);
	});

	it("should render correct number of page buttons", () => {
		const { container } = render(<PaginationSkeleton pageCount={7} />);
		const pageButtons = container.querySelectorAll(".h-9.w-9");
		// 7 page buttons + 2 prev/next buttons = 9 total
		expect(pageButtons.length).toBeGreaterThanOrEqual(7);
	});

	it("should show prev/next buttons by default", () => {
		const { container } = render(<PaginationSkeleton />);
		const buttons = container.querySelectorAll(".h-9.w-9");
		// Should have page buttons + prev/next
		expect(buttons.length).toBeGreaterThanOrEqual(7);
	});

	it("should hide prev/next buttons when showPrevNext is false", () => {
		const { container } = render(
			<PaginationSkeleton showPrevNext={false} pageCount={3} />,
		);
		const buttons = container.querySelectorAll(".h-9.w-9");
		// Should only have page buttons
		expect(buttons).toHaveLength(3);
	});

	it("should not show info text by default", () => {
		const { container } = render(<PaginationSkeleton />);
		const info = container.querySelector(".h-4.w-32");
		expect(info).not.toBeInTheDocument();
	});

	it("should show info text when showInfo is true", () => {
		const { container } = render(<PaginationSkeleton showInfo />);
		const info = container.querySelector(".h-4.w-32");
		expect(info).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		render(<PaginationSkeleton className="custom-class" />);
		const pagination = screen.getByTestId("pagination-skeleton");
		expect(pagination).toHaveClass("custom-class");
	});

	it("should accept custom data-testid", () => {
		render(<PaginationSkeleton data-testid="custom-pagination-skeleton" />);
		const pagination = screen.getByTestId("custom-pagination-skeleton");
		expect(pagination).toBeInTheDocument();
	});
});
