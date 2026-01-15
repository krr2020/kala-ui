import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CalendarSkeleton } from "./calendar-skeleton";

describe("CalendarSkeleton", () => {
	it("should render with default props", () => {
		render(<CalendarSkeleton />);
		const calendar = screen.getByTestId("calendar-skeleton");
		expect(calendar).toBeInTheDocument();
		expect(calendar).toHaveAttribute("aria-busy", "true");
		expect(calendar).toHaveAttribute("aria-label", "Loading calendar");
	});

	it("should show header by default", () => {
		const { container } = render(<CalendarSkeleton />);
		const header = container.querySelector(".mb-4");
		expect(header).toBeInTheDocument();
		// Header should have prev button, month/year, and next button
		const headerItems = container.querySelectorAll(".mb-4 > *");
		expect(headerItems).toHaveLength(3);
	});

	it("should hide header when showHeader is false", () => {
		const { container } = render(<CalendarSkeleton showHeader={false} />);
		const header = container.querySelector(".mb-4");
		expect(header).not.toBeInTheDocument();
	});

	it("should show day labels by default", () => {
		const { container } = render(<CalendarSkeleton />);
		const dayLabels = container.querySelector(".grid-cols-7.mb-2");
		expect(dayLabels).toBeInTheDocument();
		const labels = container.querySelectorAll(".grid-cols-7.mb-2 > *");
		expect(labels).toHaveLength(7); // 7 days of the week
	});

	it("should hide day labels when showDayLabels is false", () => {
		const { container } = render(<CalendarSkeleton showDayLabels={false} />);
		const dayLabels = container.querySelector(".grid-cols-7.mb-2");
		expect(dayLabels).not.toBeInTheDocument();
	});

	it("should render default 5 weeks (35 days)", () => {
		const { container } = render(<CalendarSkeleton />);
		const dayCells = container.querySelectorAll(".grid-cols-7:not(.mb-2) > *");
		expect(dayCells).toHaveLength(35);
	});

	it("should render correct number of weeks", () => {
		const { container } = render(<CalendarSkeleton weekCount={6} />);
		const dayCells = container.querySelectorAll(".grid-cols-7:not(.mb-2) > *");
		expect(dayCells).toHaveLength(42); // 6 weeks * 7 days
	});

	it("should render calendar in 7-column grid", () => {
		const { container } = render(<CalendarSkeleton />);
		const grid = container.querySelectorAll(".grid-cols-7");
		expect(grid.length).toBeGreaterThanOrEqual(1);
	});

	it("should apply custom className", () => {
		render(<CalendarSkeleton className="custom-class" />);
		const calendar = screen.getByTestId("calendar-skeleton");
		expect(calendar).toHaveClass("custom-class");
	});

	it("should accept custom data-testid", () => {
		render(<CalendarSkeleton data-testid="custom-calendar-skeleton" />);
		const calendar = screen.getByTestId("custom-calendar-skeleton");
		expect(calendar).toBeInTheDocument();
	});
});
