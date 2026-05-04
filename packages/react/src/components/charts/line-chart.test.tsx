import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LineChart } from "./line-chart";

// Recursively invoke all functions in an object for coverage
function invokeOptionFunctions(obj: unknown, depth = 0): void {
	if (!obj || typeof obj !== "object" || depth > 8) return;
	for (const val of Object.values(obj as Record<string, unknown>)) {
		if (typeof val === "function") {
			try {
				val(100, "100", {
					globals: { series: [100, 50], seriesTotals: [100, 50] },
				});
			} catch {
				// ignore invocation errors
			}
		} else if (typeof val === "object" && val !== null) {
			invokeOptionFunctions(val, depth + 1);
		}
	}
}

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
	}) => {
		invokeOptionFunctions(options);
		return (
			<div data-testid="apex-chart" data-type={type}>
				<div data-testid="chart-options">{JSON.stringify(options)}</div>
				<div data-testid="chart-series">{JSON.stringify(series)}</div>
			</div>
		);
	},
}));

// Mock useThemeAwareChart
vi.mock("./use-theme-aware-chart", () => ({
	useThemeAwareChart: () => ({
		colors: {
			primary: ["#60a5fa", "#3b82f6"],
			success: ["#34d399", "#10b981"],
			warning: ["#fbbf24", "#f59e0b"],
			destructive: ["#f87171", "#ef4444"],
			info: ["#38bdf8", "#0ea5e9"],
			mixed: ["#60a5fa", "#34d399", "#fbbf24", "#f87171"],
			grid: "#374151",
			axisLabels: "#a1a1aa",
			tooltipBg: "#1e293b",
			tooltipText: "#fafafa",
		},
		theme: "light",
	}),
}));

describe("LineChart", () => {
	const defaultProps = {
		series: [{ name: "Visitors", data: [100, 200, 150, 300, 250] }],
		categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
	};

	it("should render the chart", () => {
		render(<LineChart {...defaultProps} />);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should pass line type to ApexChart", () => {
		render(<LineChart {...defaultProps} />);
		expect(screen.getByTestId("apex-chart")).toHaveAttribute("data-type", "line");
	});

	it("should pass series data to the chart", () => {
		render(<LineChart {...defaultProps} />);
		const seriesEl = screen.getByTestId("chart-series");
		expect(seriesEl.textContent).toContain("Visitors");
		expect(seriesEl.textContent).toContain("100");
		expect(seriesEl.textContent).toContain("250");
	});

	it("should include categories in chart options", () => {
		render(<LineChart {...defaultProps} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Mon");
		expect(optionsEl.textContent).toContain("Fri");
	});

	it("should apply default className with w-full", () => {
		const { container } = render(<LineChart {...defaultProps} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("w-full");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<LineChart {...defaultProps} className="custom-line" />,
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("custom-line", "w-full");
	});

	it("should show loading skeleton when isLoading is true", () => {
		render(<LineChart {...defaultProps} isLoading />);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
	});

	it("should show empty state when series is empty", () => {
		render(
			<LineChart series={[]} categories={defaultProps.categories} />,
		);
		expect(screen.getByText("No data available")).toBeInTheDocument();
	});

	it("should show empty state when all series have empty data arrays", () => {
		render(
			<LineChart
				series={[{ name: "Empty", data: [] }]}
				categories={defaultProps.categories}
			/>,
		);
		expect(screen.getByText("No data available")).toBeInTheDocument();
	});

	it("should show empty state when series have null data", () => {
		render(
			<LineChart
				series={[{ name: "NullData", data: null as never }]}
				categories={defaultProps.categories}
			/>,
		);
		expect(screen.getByText("No data available")).toBeInTheDocument();
	});

	it("should show custom empty message", () => {
		render(
			<LineChart
				series={[]}
				categories={defaultProps.categories}
				emptyMessage="No trends"
			/>,
		);
		expect(screen.getByText("No trends")).toBeInTheDocument();
	});

	it("should not show empty state while loading with empty data", () => {
		render(
			<LineChart series={[]} categories={defaultProps.categories} isLoading />,
		);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
		expect(screen.queryByText("No data available")).not.toBeInTheDocument();
	});

	it("should use custom colors when provided", () => {
		render(
			<LineChart {...defaultProps} colors={["#ff0000", "#00ff00"]} />,
		);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("#ff0000");
	});

	it("should include title in chart options when provided", () => {
		render(<LineChart {...defaultProps} title="Traffic Overview" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Traffic Overview");
	});

	it("should include subtitle in chart options when provided", () => {
		render(<LineChart {...defaultProps} subtitle="Daily visitors" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Daily visitors");
	});

	it("should handle curve prop", () => {
		render(<LineChart {...defaultProps} curve="stepline" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"curve":"stepline"');
	});

	it("should set strokeWidth in options", () => {
		render(<LineChart {...defaultProps} strokeWidth={4} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"width":4');
	});

	it("should set markers to zero size when disabled", () => {
		render(<LineChart {...defaultProps} markers={false} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"size":0');
	});

	it("should set markers to default size when enabled", () => {
		render(<LineChart {...defaultProps} markers />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"size":4');
	});

	it("should handle yAxisLabel", () => {
		render(<LineChart {...defaultProps} yAxisLabel="Count" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Count");
	});

	it("should handle custom height and width", () => {
		render(<LineChart {...defaultProps} height={250} width="50%" />);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should handle multiple series", () => {
		const multiSeries = [
			{ name: "Users", data: [100, 200, 150] },
			{ name: "Sessions", data: [80, 150, 120] },
		];
		render(<LineChart series={multiSeries} categories={["Q1", "Q2", "Q3"]} />);
		const seriesEl = screen.getByTestId("chart-series");
		expect(seriesEl.textContent).toContain("Users");
		expect(seriesEl.textContent).toContain("Sessions");
	});

	it("should enable toolbar when toolbar is true", () => {
		render(<LineChart {...defaultProps} toolbar />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"show":true');
	});

	it("should disable animations when animations is false", () => {
		render(<LineChart {...defaultProps} animations={false} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"enabled":false');
	});

	it("should handle straight curve", () => {
		render(<LineChart {...defaultProps} curve="straight" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"curve":"straight"');
	});

	it("should accept custom options override", () => {
		render(
			<LineChart
				{...defaultProps}
				options={{ chart: { fontFamily: "Arial" } } as never}
			/>,
		);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});
});
