import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Chart } from "./chart";

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
});
