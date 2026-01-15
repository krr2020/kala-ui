import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AccordionSkeleton } from "./accordion-skeleton";

describe("AccordionSkeleton", () => {
	it("should render with default props", () => {
		render(<AccordionSkeleton />);
		const accordion = screen.getByTestId("accordion-skeleton");
		expect(accordion).toBeInTheDocument();
		expect(accordion).toHaveAttribute("aria-busy", "true");
		expect(accordion).toHaveAttribute("aria-label", "Loading accordion");
	});

	it("should render default 3 items", () => {
		const { container } = render(<AccordionSkeleton />);
		const items = container.querySelectorAll(".border-b");
		expect(items).toHaveLength(3);
	});

	it("should render correct number of items", () => {
		const { container } = render(<AccordionSkeleton itemCount={5} />);
		const items = container.querySelectorAll(".border-b");
		expect(items).toHaveLength(5);
	});

	it("should not show expanded content by default", () => {
		const { container } = render(<AccordionSkeleton />);
		const expandedContent = container.querySelector(".pt-0.space-y-2");
		expect(expandedContent).not.toBeInTheDocument();
	});

	it("should show expanded content when defaultExpanded is true", () => {
		const { container } = render(<AccordionSkeleton defaultExpanded />);
		const expandedContent = container.querySelector(".pt-0.space-y-2");
		expect(expandedContent).toBeInTheDocument();
	});

	it("should render correct number of content rows when expanded", () => {
		const { container } = render(
			<AccordionSkeleton defaultExpanded contentRows={5} />,
		);
		const contentRows = container.querySelectorAll(".pt-0.space-y-2 > *");
		expect(contentRows).toHaveLength(5);
	});

	it("should render default 3 content rows when expanded", () => {
		const { container } = render(<AccordionSkeleton defaultExpanded />);
		const contentRows = container.querySelectorAll(".pt-0.space-y-2 > *");
		expect(contentRows).toHaveLength(3);
	});

	it("should render header with title and chevron for each item", () => {
		const { container } = render(<AccordionSkeleton itemCount={2} />);
		const headers = container.querySelectorAll(".p-4");
		expect(headers).toHaveLength(2);
		// Each header should have title (w-48) and chevron (w-4)
		const titles = container.querySelectorAll(".h-5.w-48");
		expect(titles).toHaveLength(2);
	});

	it("should apply custom className", () => {
		render(<AccordionSkeleton className="custom-class" />);
		const accordion = screen.getByTestId("accordion-skeleton");
		expect(accordion).toHaveClass("custom-class");
	});

	it("should accept custom data-testid", () => {
		render(<AccordionSkeleton data-testid="custom-accordion-skeleton" />);
		const accordion = screen.getByTestId("custom-accordion-skeleton");
		expect(accordion).toBeInTheDocument();
	});
});
