import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	generatePagination,
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "./pagination";

describe("Pagination", () => {
	it("renders with proper ARIA attributes", () => {
		render(
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationLink href="#">1</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>,
		);

		const nav = screen.getByRole("navigation");
		expect(nav).toBeInTheDocument();
		expect(nav).toHaveAttribute("aria-label", "Pagination");
	});

	it("renders custom ARIA label", () => {
		render(
			<Pagination aria-label="Product pagination">
				<PaginationContent>
					<PaginationItem>
						<PaginationLink href="#">1</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>,
		);

		expect(screen.getByRole("navigation")).toHaveAttribute(
			"aria-label",
			"Product pagination",
		);
	});

	it("marks active page with aria-current", () => {
		render(
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationLink href="#" isActive>
							2
						</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>,
		);

		const link = screen.getByText("2");
		expect(link).toHaveAttribute("aria-current", "page");
	});

	it("renders previous button with correct label", () => {
		render(
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="#" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>,
		);

		expect(screen.getByText("Previous")).toBeInTheDocument();
		expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
	});

	it("renders next button with correct label", () => {
		render(
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationNext href="#" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>,
		);

		expect(screen.getByText("Next")).toBeInTheDocument();
		expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
	});

	it("renders icon-only navigation buttons", () => {
		render(
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="#" showLabel={false} />
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="#" showLabel={false} />
					</PaginationItem>
				</PaginationContent>
			</Pagination>,
		);

		expect(screen.queryByText("Previous")).not.toBeInTheDocument();
		expect(screen.queryByText("Next")).not.toBeInTheDocument();
		expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
		expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
	});

	it("renders ellipsis with proper ARIA attributes", () => {
		render(
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				</PaginationContent>
			</Pagination>,
		);

		const ellipsis = screen.getByText("More pages");
		expect(ellipsis).toHaveClass("sr-only");
	});

	it("applies variant classes", () => {
		const { container } = render(
			<Pagination>
				<PaginationContent variant="circle">
					<PaginationItem>
						<PaginationLink href="#">1</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>,
		);

		const list = container.querySelector("ul");
		expect(list).toHaveAttribute("data-variant", "circle");
	});

	it("applies spaced layout", () => {
		const { container } = render(
			<Pagination>
				<PaginationContent spaced>
					<PaginationItem>
						<PaginationLink href="#">1</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>,
		);

		const list = container.querySelector("ul");
		expect(list).toHaveClass("gap-2");
	});
});

describe("generatePagination", () => {
	it("shows all pages when total is small", () => {
		const result = generatePagination(2, 5);
		expect(result).toHaveLength(5);
		expect(result.every((item) => item.type === "page")).toBe(true);
	});

	it("adds ellipsis for large page ranges", () => {
		const result = generatePagination(5, 10);
		const hasEllipsis = result.some((item) => item.type === "ellipsis");
		expect(hasEllipsis).toBe(true);
	});

	it("always includes first and last page", () => {
		const result = generatePagination(5, 10);
		const pages = result
			.filter((item) => item.type === "page")
			.map((item) => item.page);
		expect(pages).toContain(1);
		expect(pages).toContain(10);
	});

	it("includes current page and siblings", () => {
		const result = generatePagination(5, 10, 1);
		const pages = result
			.filter((item) => item.type === "page")
			.map((item) => item.page);
		expect(pages).toContain(4); // left sibling
		expect(pages).toContain(5); // current
		expect(pages).toContain(6); // right sibling
	});

	it("handles edge case at start", () => {
		const result = generatePagination(1, 10);
		const pages = result
			.filter((item) => item.type === "page")
			.map((item) => item.page);
		expect(pages[0]).toBe(1);
	});

	it("handles edge case at end", () => {
		const result = generatePagination(10, 10);
		const pages = result
			.filter((item) => item.type === "page")
			.map((item) => item.page);
		expect(pages[pages.length - 1]).toBe(10);
	});
});
