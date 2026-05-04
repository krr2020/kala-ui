import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Chart, getTooltipTheme } from "./chart";

// Mock react-apexcharts
vi.mock("react-apexcharts", () => ({
	default: ({
		options,
		series,
		type,
	}: {
		options?: unknown;
		series?: unknown;
		type?: string;
	}) => (
		<div data-testid="apex-chart" data-type={type}>
			<div data-testid="chart-options">{JSON.stringify(options)}</div>
			<div data-testid="chart-series">{JSON.stringify(series)}</div>
		</div>
	),
}));

describe("Chart", () => {
	const mockOptions = {
		chart: {
			id: "basic-chart",
		},
		xaxis: {
			categories: ["Jan", "Feb", "Mar"],
		},
	};

	const mockSeries = [
		{
			name: "series-1",
			data: [30, 40, 45],
		},
	];

	it("should render chart component", () => {
		render(<Chart options={mockOptions} series={mockSeries} type="line" />);

		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should pass options to ApexChart", () => {
		render(<Chart options={mockOptions} series={mockSeries} type="line" />);

		const optionsElement = screen.getByTestId("chart-options");
		expect(optionsElement.textContent).toContain("basic-chart");
	});

	it("should pass series data to ApexChart", () => {
		render(<Chart options={mockOptions} series={mockSeries} type="line" />);

		const seriesElement = screen.getByTestId("chart-series");
		expect(seriesElement.textContent).toContain("series-1");
		expect(seriesElement.textContent).toContain("30");
	});

	it("should pass chart type to ApexChart", () => {
		render(<Chart options={mockOptions} series={mockSeries} type="bar" />);

		const chart = screen.getByTestId("apex-chart");
		expect(chart).toHaveAttribute("data-type", "bar");
	});

	it("should apply default className with w-full", () => {
		const { container } = render(
			<Chart options={mockOptions} series={mockSeries} type="line" />,
		);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("w-full");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<Chart
				className="custom-chart-class"
				options={mockOptions}
				series={mockSeries}
				type="line"
			/>,
		);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("custom-chart-class", "w-full");
	});

	it("should render with line chart type", () => {
		render(<Chart options={mockOptions} series={mockSeries} type="line" />);

		expect(screen.getByTestId("apex-chart")).toHaveAttribute(
			"data-type",
			"line",
		);
	});

	it("should render with bar chart type", () => {
		render(<Chart options={mockOptions} series={mockSeries} type="bar" />);

		expect(screen.getByTestId("apex-chart")).toHaveAttribute(
			"data-type",
			"bar",
		);
	});

	it("should render with area chart type", () => {
		render(<Chart options={mockOptions} series={mockSeries} type="area" />);

		expect(screen.getByTestId("apex-chart")).toHaveAttribute(
			"data-type",
			"area",
		);
	});

	it("should render with pie chart type", () => {
		render(<Chart options={mockOptions} series={[44, 55, 13]} type="pie" />);

		expect(screen.getByTestId("apex-chart")).toHaveAttribute(
			"data-type",
			"pie",
		);
	});

	it("should handle height prop", () => {
		render(
			<Chart
				options={mockOptions}
				series={mockSeries}
				type="line"
				height={350}
			/>,
		);

		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should handle width prop", () => {
		render(
			<Chart
				options={mockOptions}
				series={mockSeries}
				type="line"
				width="100%"
			/>,
		);

		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should pass all additional props to ReactApexChart", () => {
		render(
			<Chart
				options={mockOptions}
				series={mockSeries}
				type="line"
				height={300}
				width="500"
			/>,
		);

		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should show loading skeleton when isLoading is true", () => {
		render(
			<Chart options={mockOptions} series={mockSeries} type="line" isLoading />,
		);
		expect(
			document.querySelector('[data-slot="skeleton"]'),
		).toBeInTheDocument();
		expect(screen.queryByTestId("apex-chart")).not.toBeInTheDocument();
	});

	it("should show loading skeleton with skeletonConfig when isLoading is true", () => {
		render(
			<Chart
				options={mockOptions}
				series={mockSeries}
				type="line"
				isLoading
				skeletonConfig={{ height: 200, showLegend: false }}
			/>,
		);
		expect(
			document.querySelector('[data-slot="skeleton"]'),
		).toBeInTheDocument();
	});

	it("should show custom skeleton when isLoading is true and skeleton is provided", () => {
		render(
			<Chart
				options={mockOptions}
				series={mockSeries}
				type="line"
				isLoading
				skeleton={<div data-testid="custom-skeleton">Loading...</div>}
			/>,
		);
		expect(screen.getByTestId("custom-skeleton")).toBeInTheDocument();
		expect(
			document.querySelector('[data-slot="skeleton"]'),
		).not.toBeInTheDocument();
	});

	it("should show empty state when isEmpty is true", () => {
		render(
			<Chart options={mockOptions} series={mockSeries} type="line" isEmpty />,
		);
		expect(screen.getByText("No data available")).toBeInTheDocument();
		expect(screen.queryByTestId("apex-chart")).not.toBeInTheDocument();
	});

	it("should show custom empty message when isEmpty is true", () => {
		render(
			<Chart
				options={mockOptions}
				series={mockSeries}
				type="line"
				isEmpty
				emptyMessage="Nothing here"
			/>,
		);
		expect(screen.getByText("Nothing here")).toBeInTheDocument();
	});

	it("should show empty state with default height when no height prop", () => {
		render(<Chart options={mockOptions} series={mockSeries} type="line" isEmpty />);
		const emptyState = screen.getByText("No data available").closest("div");
		expect(emptyState).toHaveStyle({ height: "350px" });
	});

	it("should show empty state with height from height prop", () => {
		render(
			<Chart
				options={mockOptions}
				series={mockSeries}
				type="line"
				isEmpty
				height={500}
			/>,
		);
		const emptyState = screen.getByText("No data available").closest("div");
		expect(emptyState).toHaveStyle({ height: "500px" });
	});

	it("should show empty state with height from skeletonConfig", () => {
		render(
			<Chart
				options={mockOptions}
				series={mockSeries}
				type="line"
				isEmpty
				skeletonConfig={{ height: 250 }}
			/>,
		);
		const emptyState = screen.getByText("No data available").closest("div");
		expect(emptyState).toHaveStyle({ height: "250px" });
	});

	it("should apply className to empty state", () => {
		render(
			<Chart
				options={mockOptions}
				series={mockSeries}
				type="line"
				isEmpty
				className="empty-class"
			/>,
		);
		const emptyState = screen.getByText("No data available").closest("div");
		expect(emptyState).toHaveClass("empty-class");
	});
});

describe("getTooltipTheme", () => {
	it("should return light when document has no dark class", () => {
		document.documentElement.classList.remove("dark");
		expect(getTooltipTheme()).toBe("light");
	});

	it("should return dark when document has dark class", () => {
		document.documentElement.classList.add("dark");
		expect(getTooltipTheme()).toBe("dark");
		document.documentElement.classList.remove("dark");
	});
});
