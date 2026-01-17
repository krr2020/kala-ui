import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
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


