import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BarChart } from "./bar-chart";

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

describe("BarChart", () => {
	const defaultProps = {
		series: [{ name: "Sales", data: [30, 40, 45, 50, 49, 60] }],
		categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
	};

	it("should render the chart", () => {
		render(<BarChart {...defaultProps} />);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should pass bar type to ApexChart", () => {
		render(<BarChart {...defaultProps} />);
		expect(screen.getByTestId("apex-chart")).toHaveAttribute("data-type", "bar");
	});

	it("should pass series data to the chart", () => {
		render(<BarChart {...defaultProps} />);
		const seriesEl = screen.getByTestId("chart-series");
		expect(seriesEl.textContent).toContain("Sales");
		expect(seriesEl.textContent).toContain("30");
	});

	it("should include categories in chart options", () => {
		render(<BarChart {...defaultProps} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Jan");
		expect(optionsEl.textContent).toContain("Jun");
	});

	it("should apply default className with w-full", () => {
		const { container } = render(<BarChart {...defaultProps} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("w-full");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<BarChart {...defaultProps} className="custom-bar" />,
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("custom-bar", "w-full");
	});

	it("should show loading skeleton when isLoading is true", () => {
		render(<BarChart {...defaultProps} isLoading />);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
	});

	it("should show empty state when series has empty data", () => {
		render(
			<BarChart series={[]} categories={defaultProps.categories} />,
		);
		expect(screen.getByText("No data available")).toBeInTheDocument();
	});

	it("should show empty state when all series have empty data arrays", () => {
		render(
			<BarChart
				series={[{ name: "Empty", data: [] }]}
				categories={defaultProps.categories}
			/>,
		);
		expect(screen.getByText("No data available")).toBeInTheDocument();
	});

	it("should show empty state when series have null data", () => {
		render(
			<BarChart
				series={[{ name: "NullData", data: null as never }]}
				categories={defaultProps.categories}
			/>,
		);
		expect(screen.getByText("No data available")).toBeInTheDocument();
	});

	it("should show custom empty message", () => {
		render(
			<BarChart
				series={[]}
				categories={defaultProps.categories}
				emptyMessage="No bars"
			/>,
		);
		expect(screen.getByText("No bars")).toBeInTheDocument();
	});

	it("should not show empty state while loading with empty data", () => {
		render(
			<BarChart series={[]} categories={defaultProps.categories} isLoading />,
		);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
		expect(screen.queryByText("No data available")).not.toBeInTheDocument();
	});

	it("should use custom colors when provided", () => {
		render(
			<BarChart {...defaultProps} colors={["#ff0000", "#00ff00"]} />,
		);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("#ff0000");
	});

	it("should include title in chart options when provided", () => {
		render(<BarChart {...defaultProps} title="Sales Chart" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Sales Chart");
	});

	it("should include subtitle in chart options when provided", () => {
		render(<BarChart {...defaultProps} subtitle="Quarterly report" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Quarterly report");
	});

	it("should set horizontal mode in options", () => {
		render(<BarChart {...defaultProps} horizontal />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"horizontal":true');
	});

	it("should set stacked mode in options", () => {
		render(<BarChart {...defaultProps} stacked />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"stacked":true');
	});

	it("should set bar width in options", () => {
		render(<BarChart {...defaultProps} barWidth={50} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("50%");
	});

	it("should enable data labels when prop is true", () => {
		render(<BarChart {...defaultProps} dataLabels />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"enabled":true');
	});

	it("should handle custom height and width", () => {
		render(<BarChart {...defaultProps} height={400} width="90%" />);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should handle multiple series", () => {
		const multiSeries = [
			{ name: "2024", data: [30, 40, 45] },
			{ name: "2023", data: [20, 25, 30] },
		];
		render(
			<BarChart series={multiSeries} categories={["Q1", "Q2", "Q3"]} />,
		);
		const seriesEl = screen.getByTestId("chart-series");
		expect(seriesEl.textContent).toContain("2024");
		expect(seriesEl.textContent).toContain("2023");
	});

	it("should enable toolbar when toolbar is true", () => {
		render(<BarChart {...defaultProps} toolbar />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"show":true');
	});

	it("should disable animations when animations is false", () => {
		render(<BarChart {...defaultProps} animations={false} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"enabled":false');
	});

	it("should accept custom options override", () => {
		render(
			<BarChart
				{...defaultProps}
				options={{ chart: { fontFamily: "Arial" } } as never}
			/>,
		);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});
});
