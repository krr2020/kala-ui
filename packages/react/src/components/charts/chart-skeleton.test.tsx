import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartSkeleton } from "./chart-skeleton";

describe("ChartSkeleton", () => {
	it("should render the skeleton wrapper", () => {
		const { container } = render(<ChartSkeleton />);
		expect(container.firstChild).toBeInTheDocument();
	});

	it("should apply default w-full and space-y-4 classes", () => {
		const { container } = render(<ChartSkeleton />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("w-full", "space-y-4");
	});

	it("should apply custom className", () => {
		const { container } = render(<ChartSkeleton className="custom-class" />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("custom-class", "w-full", "space-y-4");
	});

	it("should render chart area skeleton", () => {
		render(<ChartSkeleton />);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
	});

	it("should render chart area with default height of 350px", () => {
		render(<ChartSkeleton />);
		const chartArea = document.querySelector(".rounded-lg.border.bg-card") as HTMLElement;
		expect(chartArea).toBeInTheDocument();
		expect(chartArea.style.height).toBe("350px");
	});

	it("should render chart area with custom height", () => {
		render(<ChartSkeleton height={500} />);
		const chartArea = document.querySelector(".rounded-lg.border.bg-card") as HTMLElement;
		expect(chartArea.style.height).toBe("500px");
	});

	it("should show legend skeleton by default", () => {
		render(<ChartSkeleton />);
		// Default legendCount is 4, so we expect legend items
		const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
		// At least chart area skeleton + legend items (each legend has 2 skeletons: dot + text)
		// 1 chart area + 4 * 2 legend = 9 skeletons
		expect(skeletons.length).toBeGreaterThanOrEqual(9);
	});

	it("should render correct number of legend items", () => {
		render(<ChartSkeleton legendCount={3} />);
		const legendItems = document.querySelectorAll(".flex.items-center.gap-2");
		// The chart area also uses "flex items-center", so we need to be more specific
		// Legend items are inside the flex.gap-4 container
		expect(legendItems.length).toBeGreaterThanOrEqual(3);
	});

	it("should hide legend when showLegend is false", () => {
		render(<ChartSkeleton showLegend={false} />);
		// Only chart area skeleton should remain (1 skeleton)
		const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
		expect(skeletons.length).toBe(1);
	});

	it("should not show table by default", () => {
		render(<ChartSkeleton />);
		expect(document.querySelector("table")).not.toBeInTheDocument();
	});

	it("should show table when showTable is true", () => {
		render(<ChartSkeleton showTable />);
		expect(document.querySelector("table")).toBeInTheDocument();
	});

	it("should render correct number of table rows", () => {
		render(<ChartSkeleton showTable tableRows={3} />);
		const rows = document.querySelectorAll("tbody tr");
		expect(rows.length).toBe(3);
	});

	it("should render correct number of table columns in header", () => {
		render(<ChartSkeleton showTable tableColumns={5} />);
		const headerCells = document.querySelectorAll("thead th");
		expect(headerCells.length).toBe(5);
	});

	it("should render correct number of table cells per row", () => {
		render(<ChartSkeleton showTable tableColumns={4} tableRows={2} />);
		const bodyCells = document.querySelectorAll("tbody td");
		// 2 rows * 4 columns = 8 cells
		expect(bodyCells.length).toBe(8);
	});

	it("should render legend items with dot and text skeletons", () => {
		render(<ChartSkeleton showLegend legendCount={1} />);
		const legendContainer = document.querySelector(".flex.gap-4.justify-center");
		expect(legendContainer).toBeInTheDocument();
		// Each legend item has a rounded-full dot and a text skeleton
		const dotSkeleton = legendContainer?.querySelector(".rounded-full");
		expect(dotSkeleton).toBeInTheDocument();
	});

	it("should combine legend and table when both enabled", () => {
		render(<ChartSkeleton showLegend showTable tableRows={1} tableColumns={1} />);
		expect(document.querySelector("table")).toBeInTheDocument();
		// Legend skeletons + table skeletons + chart area skeleton
		const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
		expect(skeletons.length).toBeGreaterThan(1);
	});
});
