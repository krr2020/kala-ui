import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DialogSkeleton } from "./dialog-skeleton";

describe("DialogSkeleton", () => {
	it("should render with default props", () => {
		render(<DialogSkeleton />);
		const dialog = screen.getByTestId("dialog-skeleton");
		expect(dialog).toBeInTheDocument();
		expect(dialog).toHaveAttribute("aria-busy", "true");
		expect(dialog).toHaveAttribute("aria-label", "Loading dialog");
	});

	it("should show header by default", () => {
		const { container } = render(<DialogSkeleton />);
		// Header contains title (w-48) and close button (w-5)
		const header = container.querySelector(".h-6.w-48");
		expect(header).toBeInTheDocument();
	});

	it("should hide header when showHeader is false", () => {
		const { container } = render(<DialogSkeleton showHeader={false} />);
		const header = container.querySelector(".h-6.w-48");
		expect(header).not.toBeInTheDocument();
	});

	it("should show footer by default", () => {
		const { container } = render(<DialogSkeleton />);
		const footer = container.querySelector(".justify-end.gap-2");
		expect(footer).toBeInTheDocument();
		// Footer should have 2 buttons
		const buttons = container.querySelectorAll(".h-10.w-24");
		expect(buttons).toHaveLength(2);
	});

	it("should hide footer when showFooter is false", () => {
		const { container } = render(<DialogSkeleton showFooter={false} />);
		const footer = container.querySelector(".justify-end.gap-2");
		expect(footer).not.toBeInTheDocument();
	});

	it("should render default 4 content rows", () => {
		const { container } = render(<DialogSkeleton />);
		const contentRows = container.querySelectorAll(".space-y-3 > *");
		expect(contentRows).toHaveLength(4);
	});

	it("should render correct number of content rows", () => {
		const { container } = render(<DialogSkeleton contentRows={6} />);
		const contentRows = container.querySelectorAll(".space-y-3 > *");
		expect(contentRows).toHaveLength(6);
	});

	it("should apply custom className", () => {
		render(<DialogSkeleton className="custom-class" />);
		const dialog = screen.getByTestId("dialog-skeleton");
		expect(dialog).toHaveClass("custom-class");
	});

	it("should accept custom data-testid", () => {
		render(<DialogSkeleton data-testid="custom-dialog-skeleton" />);
		const dialog = screen.getByTestId("custom-dialog-skeleton");
		expect(dialog).toBeInTheDocument();
	});
});
