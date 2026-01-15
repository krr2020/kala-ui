import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SparklineChart } from "./sparkline-chart";

// Mock react-apexcharts
vi.mock("react-apexcharts", () => ({
	default: ({
		options,
		series,
		type,
		height,
		width,
	}: {
		options?: unknown;
		series?: unknown;
		type?: string;
		height?: number;
		width?: number;
	}) => (
		<div
			data-testid="sparkline-chart"
			data-type={type}
			data-height={height}
			data-width={width}
		>
			<div data-testid="chart-options">{JSON.stringify(options)}</div>
			<div data-testid="chart-series">{JSON.stringify(series)}</div>
		</div>
	),
}));

describe("SparklineChart", () => {
	const mockData = [30, 40, 35, 50, 49, 60, 70, 91];

	it("should render sparkline chart", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		expect(getByTestId("sparkline-chart")).toBeInTheDocument();
	});

	it("should render with line type by default", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		expect(getByTestId("sparkline-chart")).toHaveAttribute("data-type", "line");
	});

	it("should render with area type", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} type="area" />,
		);

		expect(getByTestId("sparkline-chart")).toHaveAttribute("data-type", "area");
	});

	it("should render with bar type", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} type="bar" />,
		);

		expect(getByTestId("sparkline-chart")).toHaveAttribute("data-type", "bar");
	});

	it("should use default color", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.colors).toEqual(["#3B82F6"]);
	});

	it("should apply custom color", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} color="#FF5733" />,
		);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.colors).toEqual(["#FF5733"]);
	});

	it("should use default dimensions", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		expect(getByTestId("sparkline-chart")).toHaveAttribute(
			"data-width",
			"100%",
		);
		expect(getByTestId("sparkline-chart")).toHaveAttribute("data-height", "64");
	});

	it("should apply custom width and height", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} width={200} height={100} />,
		);

		expect(getByTestId("sparkline-chart")).toHaveAttribute("data-width", "200");
		expect(getByTestId("sparkline-chart")).toHaveAttribute(
			"data-height",
			"100",
		);
	});

	it("should disable tooltip by default", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.tooltip.enabled).toBe(false);
	});

	it("should enable tooltip when specified", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} tooltip={true} />,
		);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.tooltip.enabled).toBe(true);
	});

	it("should enable animations by default", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.chart.animations.enabled).toBe(true);
	});

	it("should disable animations when specified", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} animated={false} />,
		);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.chart.animations.enabled).toBe(false);
	});

	it("should be non-interactive by default", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.states.hover.filter.type).toBe("none");
		expect(options.markers.hover.size).toBe(0);
	});

	it("should enable interactive mode", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} interactive={true} />,
		);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.states.hover.filter.type).toBe("lighten");
		expect(options.markers.hover.size).toBe(4);
	});

	it("should apply gradient for area charts", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} type="area" />,
		);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.fill.type).toBe("gradient");
	});

	it("should not apply gradient for line charts", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} type="line" />,
		);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.fill.type).toBe("solid");
	});

	it("should apply custom gradient colors for area charts", () => {
		const { getByTestId } = render(
			<SparklineChart
				data={mockData}
				type="area"
				gradientFrom="#FF0000"
				gradientTo="#00FF00"
			/>,
		);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.fill.gradient.colorStops).toBeDefined();
		expect(options.fill.gradient.colorStops[0].color).toBe("#FF0000");
		expect(options.fill.gradient.colorStops[1].color).toBe("#00FF00");
	});

	it("should use smooth stroke curve for line charts", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} type="line" />,
		);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.stroke.curve).toBe("smooth");
	});

	it("should set stroke width for line charts", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} type="line" />,
		);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.stroke.width).toBe(2);
	});

	it("should set zero stroke width for non-line charts", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} type="bar" />,
		);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.stroke.width).toBe(0);
	});

	it("should pass data as series", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		const series = JSON.parse(getByTestId("chart-series").textContent || "[]");
		expect(series[0].name).toBe("Value");
		expect(series[0].data).toEqual(mockData);
	});

	it("should apply custom className", () => {
		const { container } = render(
			<SparklineChart data={mockData} className="custom-sparkline" />,
		);

		expect(container.firstChild).toHaveClass(
			"custom-sparkline",
			"sparkline-chart",
		);
	});

	it("should enable sparkline mode", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.chart.sparkline.enabled).toBe(true);
	});

	it("should hide grid", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.grid.show).toBe(false);
	});

	it("should hide axis labels", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.xaxis.labels.show).toBe(false);
		expect(options.yaxis.labels.show).toBe(false);
	});

	it("should hide toolbar", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.chart.toolbar.show).toBe(false);
	});

	it("should disable zoom", () => {
		const { getByTestId } = render(<SparklineChart data={mockData} />);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.chart.zoom.enabled).toBe(false);
	});

	it("should set bar column width for bar charts", () => {
		const { getByTestId } = render(
			<SparklineChart data={mockData} type="bar" />,
		);

		const options = JSON.parse(
			getByTestId("chart-options").textContent || "{}",
		);
		expect(options.plotOptions.bar.columnWidth).toBe("80%");
	});

	it("should handle empty data array", () => {
		const { getByTestId } = render(<SparklineChart data={[]} />);

		const series = JSON.parse(getByTestId("chart-series").textContent || "[]");
		expect(series[0].data).toEqual([]);
	});

	it("should handle single data point", () => {
		const { getByTestId } = render(<SparklineChart data={[42]} />);

		const series = JSON.parse(getByTestId("chart-series").textContent || "[]");
		expect(series[0].data).toEqual([42]);
	});

	it("should handle negative values", () => {
		const negativeData = [10, -5, 20, -15, 30];
		const { getByTestId } = render(<SparklineChart data={negativeData} />);

		const series = JSON.parse(getByTestId("chart-series").textContent || "[]");
		expect(series[0].data).toEqual(negativeData);
	});
});
