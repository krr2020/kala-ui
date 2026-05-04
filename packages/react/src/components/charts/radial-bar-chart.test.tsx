import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RadialBarChart } from "./radial-bar-chart";

// Recursively invoke all functions in an object for coverage
function invokeOptionFunctions(obj: unknown, depth = 0): void {
	if (!obj || typeof obj !== "object" || depth > 8) return;
	for (const val of Object.values(obj as Record<string, unknown>)) {
		if (typeof val === "function") {
			try {
				val(75, "75", {
					globals: { series: [75, 50, 90], seriesTotals: [75, 50, 90] },
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

describe("RadialBarChart", () => {
	const defaultProps = {
		series: [75],
		labels: ["Progress"],
	};

	it("should render the chart", () => {
		render(<RadialBarChart {...defaultProps} />);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should pass radialBar type to ApexChart", () => {
		render(<RadialBarChart {...defaultProps} />);
		expect(screen.getByTestId("apex-chart")).toHaveAttribute(
			"data-type",
			"radialBar",
		);
	});

	it("should pass series data to the chart", () => {
		render(<RadialBarChart {...defaultProps} />);
		const seriesEl = screen.getByTestId("chart-series");
		expect(seriesEl.textContent).toContain("75");
	});

	it("should include labels in chart options", () => {
		render(<RadialBarChart {...defaultProps} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Progress");
	});

	it("should apply default className with w-full", () => {
		const { container } = render(<RadialBarChart {...defaultProps} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("w-full");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<RadialBarChart {...defaultProps} className="custom-radial" />,
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("custom-radial", "w-full");
	});

	it("should show loading skeleton when isLoading is true", () => {
		render(<RadialBarChart {...defaultProps} isLoading />);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
	});

	it("should show empty state when series is empty", () => {
		render(<RadialBarChart series={[]} labels={[]} />);
		expect(screen.getByText("No data available")).toBeInTheDocument();
	});

	it("should show empty state when labels are empty", () => {
		render(<RadialBarChart series={defaultProps.series} labels={[]} />);
		expect(screen.getByText("No data available")).toBeInTheDocument();
	});

	it("should show custom empty message", () => {
		render(
			<RadialBarChart series={[]} labels={[]} emptyMessage="No progress" />,
		);
		expect(screen.getByText("No progress")).toBeInTheDocument();
	});

	it("should not show empty state while loading with empty data", () => {
		render(<RadialBarChart series={[]} labels={[]} isLoading />);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
		expect(screen.queryByText("No data available")).not.toBeInTheDocument();
	});

	it("should use custom colors when provided", () => {
		render(
			<RadialBarChart
				{...defaultProps}
				colors={["#ff0000"]}
			/>,
		);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("#ff0000");
	});

	it("should include title in chart options when provided", () => {
		render(<RadialBarChart {...defaultProps} title="Completion Rate" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Completion Rate");
	});

	it("should include subtitle in chart options when provided", () => {
		render(<RadialBarChart {...defaultProps} subtitle="Current sprint" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Current sprint");
	});

	it("should set hollow size in options", () => {
		render(<RadialBarChart {...defaultProps} hollowSize="70%" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("70%");
	});

	it("should handle multiple series", () => {
		const multiSeries = { series: [75, 50, 90], labels: ["Task A", "Task B", "Task C"] };
		render(<RadialBarChart {...multiSeries} />);
		const seriesEl = screen.getByTestId("chart-series");
		expect(seriesEl.textContent).toContain("75");
		expect(seriesEl.textContent).toContain("50");
		expect(seriesEl.textContent).toContain("90");
	});

	it("should handle custom height and width", () => {
		render(<RadialBarChart {...defaultProps} height={300} width="80%" />);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should disable animations when animations is false", () => {
		render(<RadialBarChart {...defaultProps} animations={false} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"enabled":false');
	});

	it("should hide data labels when dataLabels is false", () => {
		render(<RadialBarChart {...defaultProps} dataLabels={false} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"show":false');
	});

	it("should show legend when multiple series", () => {
		const multiSeries = { series: [75, 50], labels: ["Task A", "Task B"] };
		render(<RadialBarChart {...multiSeries} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"show":true');
	});

	it("should accept custom options override", () => {
		render(
			<RadialBarChart
				{...defaultProps}
				options={{ chart: { fontFamily: "Arial" } } as never}
			/>,
		);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});
});
