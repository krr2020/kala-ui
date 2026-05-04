import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PaginationNav } from "./pagination-nav";

describe("PaginationNav", () => {
	const defaultProps = {
		currentPage: 1,
		totalPages: 5,
		hasPreviousPage: false,
		hasNextPage: true,
		onPageChange: vi.fn(),
		onPreviousPage: vi.fn(),
		onNextPage: vi.fn(),
	};

	it("renders previous and next buttons", () => {
		render(<PaginationNav {...defaultProps} />);

		expect(screen.getByRole("button", { name: /previous page/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /next page/i })).toBeInTheDocument();
	});

	it("renders page number buttons", () => {
		render(<PaginationNav {...defaultProps} />);

		expect(screen.getByRole("button", { name: /page 1/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /page 2/i })).toBeInTheDocument();
	});

	it("disables previous button when hasPreviousPage is false", () => {
		render(<PaginationNav {...defaultProps} hasPreviousPage={false} />);

		expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();
	});

	it("enables previous button when hasPreviousPage is true", () => {
		render(<PaginationNav {...defaultProps} hasPreviousPage={true} currentPage={2} />);

		expect(screen.getByRole("button", { name: /previous page/i })).toBeEnabled();
	});

	it("disables next button when hasNextPage is false", () => {
		render(<PaginationNav {...defaultProps} hasNextPage={false} currentPage={5} />);

		expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
	});

	it("enables next button when hasNextPage is true", () => {
		render(<PaginationNav {...defaultProps} />);

		expect(screen.getByRole("button", { name: /next page/i })).toBeEnabled();
	});

	it("calls onPreviousPage when previous button is clicked", async () => {
		const user = userEvent.setup();
		render(<PaginationNav {...defaultProps} hasPreviousPage={true} currentPage={2} />);

		await user.click(screen.getByRole("button", { name: /previous page/i }));
		expect(defaultProps.onPreviousPage).toHaveBeenCalledTimes(1);
	});

	it("calls onNextPage when next button is clicked", async () => {
		const user = userEvent.setup();
		render(<PaginationNav {...defaultProps} />);

		await user.click(screen.getByRole("button", { name: /next page/i }));
		expect(defaultProps.onNextPage).toHaveBeenCalledTimes(1);
	});

	it("calls onPageChange when a page number is clicked", async () => {
		const user = userEvent.setup();
		render(<PaginationNav {...defaultProps} />);

		await user.click(screen.getByRole("button", { name: /page 3/i }));
		expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
	});

	it("marks current page button as aria-current", () => {
		render(<PaginationNav {...defaultProps} currentPage={2} />);

		const currentPageBtn = screen.getByRole("button", { name: /page 2/i });
		expect(currentPageBtn).toHaveAttribute("aria-current", "page");
	});

	it("does not mark non-current page buttons as aria-current", () => {
		render(<PaginationNav {...defaultProps} currentPage={2} />);

		const page1Btn = screen.getByRole("button", { name: /page 1/i });
		expect(page1Btn).not.toHaveAttribute("aria-current");
	});

	it("applies default variant to current page and outline to others", () => {
		render(<PaginationNav {...defaultProps} currentPage={2} />);

		const currentPageBtn = screen.getByRole("button", { name: /page 2/i });
		expect(currentPageBtn).toHaveClass("bg-primary");

		const otherPageBtn = screen.getByRole("button", { name: /page 1/i });
		expect(otherPageBtn).toHaveClass("border");
	});

	it("renders dots for large page ranges", () => {
		render(<PaginationNav {...defaultProps} currentPage={5} totalPages={10} />);

		// Should render ellipsis icons (MoreHorizontal from lucide) as dots indicators
		const ellipsisIcons = document.querySelectorAll('[aria-hidden="true"]');
		expect(ellipsisIcons.length).toBeGreaterThan(0);
	});

	it("renders single page correctly", () => {
		render(
			<PaginationNav
				{...defaultProps}
				currentPage={1}
				totalPages={1}
				hasPreviousPage={false}
				hasNextPage={false}
			/>,
		);

		expect(screen.getByRole("button", { name: /page 1/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();
		expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
	});

	it("verifies previous button is disabled when hasPreviousPage is false", () => {
		render(<PaginationNav {...defaultProps} hasPreviousPage={false} />);
		expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();
	});

	it("verifies next button is disabled when hasNextPage is false", () => {
		render(<PaginationNav {...defaultProps} hasNextPage={false} currentPage={5} />);
		expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
	});

	it("renders dots with aria-hidden for large page ranges", () => {
		render(<PaginationNav {...defaultProps} currentPage={5} totalPages={10} />);

		const hiddenElements = document.querySelectorAll('[aria-hidden="true"]');
		expect(hiddenElements.length).toBeGreaterThan(0);
	});

	it("renders correctly when on first page with next available", () => {
		render(
			<PaginationNav
				{...defaultProps}
				currentPage={1}
				totalPages={3}
				hasPreviousPage={false}
				hasNextPage={true}
			/>,
		);

		expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();
		expect(screen.getByRole("button", { name: /next page/i })).toBeEnabled();
		expect(screen.getByRole("button", { name: /page 1/i })).toBeInTheDocument();
	});

	it("renders correctly when on last page with previous available", () => {
		render(
			<PaginationNav
				{...defaultProps}
				currentPage={5}
				totalPages={5}
				hasPreviousPage={true}
				hasNextPage={false}
			/>,
		);

		expect(screen.getByRole("button", { name: /previous page/i })).toBeEnabled();
		expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
		expect(screen.getByRole("button", { name: /page 5/i })).toHaveAttribute("aria-current", "page");
	});

	it("previous button is disabled when hasPreviousPage is false", () => {
		render(<PaginationNav {...defaultProps} hasPreviousPage={false} />);
		const prevBtn = screen.getByRole("button", { name: /previous page/i });
		expect(prevBtn).toBeDisabled();
	});

	it("next button is disabled when hasNextPage is false", () => {
		render(
			<PaginationNav {...defaultProps} hasNextPage={false} currentPage={5} />,
		);
		const nextBtn = screen.getByRole("button", { name: /next page/i });
		expect(nextBtn).toBeDisabled();
	});

	it("renders with two pages correctly", () => {
		render(
			<PaginationNav
				{...defaultProps}
				currentPage={1}
				totalPages={2}
				hasPreviousPage={false}
				hasNextPage={true}
			/>,
		);

		expect(screen.getByRole("button", { name: /page 1/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /page 2/i })).toBeInTheDocument();
	});
});
