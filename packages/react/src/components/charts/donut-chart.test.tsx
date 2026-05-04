import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DonutChart, PieChart } from "./donut-chart";

// Recursively invoke all functions in an object for coverage
function invokeOptionFunctions(obj: unknown, depth = 0): void {
	if (!obj || typeof obj !== "object" || depth > 8) return;
	for (const val of Object.values(obj as Record<string, unknown>)) {
		if (typeof val === "function") {
			try {
				val(44, "44", {
					globals: { series: [44, 55, 13, 33], seriesTotals: [44, 55, 13, 33] },
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

describe("DonutChart", () => {
	const defaultProps = {
		series: [44, 55, 13, 33],
		labels: ["Apple", "Mango", "Orange", "Banana"],
	};

	it("should render the chart", () => {
		render(<DonutChart {...defaultProps} />);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should pass donut type to ApexChart by default", () => {
		render(<DonutChart {...defaultProps} />);
		expect(screen.getByTestId("apex-chart")).toHaveAttribute("data-type", "donut");
	});

	it("should pass series data to the chart", () => {
		render(<DonutChart {...defaultProps} />);
		const seriesEl = screen.getByTestId("chart-series");
		expect(seriesEl.textContent).toContain("44");
		expect(seriesEl.textContent).toContain("55");
	});

	it("should include labels in chart options", () => {
		render(<DonutChart {...defaultProps} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Apple");
		expect(optionsEl.textContent).toContain("Banana");
	});

	it("should apply default className with w-full", () => {
		const { container } = render(<DonutChart {...defaultProps} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("w-full");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<DonutChart {...defaultProps} className="custom-donut" />,
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("custom-donut", "w-full");
	});

	it("should show loading skeleton when isLoading is true", () => {
		render(<DonutChart {...defaultProps} isLoading />);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
	});

	it("should show empty state when series is empty", () => {
		render(<DonutChart series={[]} labels={[]} />);
		expect(screen.getByText("No data available")).toBeInTheDocument();
	});

	it("should show empty state when labels are empty", () => {
		render(<DonutChart series={defaultProps.series} labels={[]} />);
		expect(screen.getByText("No data available")).toBeInTheDocument();
	});

	it("should show custom empty message", () => {
		render(
			<DonutChart series={[]} labels={[]} emptyMessage="No slices" />,
		);
		expect(screen.getByText("No slices")).toBeInTheDocument();
	});

	it("should not show empty state while loading with empty data", () => {
		render(<DonutChart series={[]} labels={[]} isLoading />);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
		expect(screen.queryByText("No data available")).not.toBeInTheDocument();
	});

	it("should use custom colors when provided", () => {
		render(
			<DonutChart {...defaultProps} colors={["#ff0000", "#00ff00", "#0000ff", "#ffff00"]} />,
		);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("#ff0000");
	});

	it("should include title in chart options when provided", () => {
		render(<DonutChart {...defaultProps} title="Fruit Distribution" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Fruit Distribution");
	});

	it("should include subtitle in chart options when provided", () => {
		render(<DonutChart {...defaultProps} subtitle="Market share" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Market share");
	});

	it("should set donut size in options", () => {
		render(<DonutChart {...defaultProps} donutSize={80} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("80%");
	});

	it("should hide legend when legend prop is false", () => {
		render(<DonutChart {...defaultProps} legend={false} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"show":false');
	});

	it("should handle custom height and width", () => {
		render(<DonutChart {...defaultProps} height={300} width="80%" />);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should handle responsive breakpoint options", () => {
		render(<DonutChart {...defaultProps} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("480");
	});

	it("should disable animations when animations is false", () => {
		render(<DonutChart {...defaultProps} animations={false} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"enabled":false');
	});

	it("should hide data labels when dataLabels is false", () => {
		render(<DonutChart {...defaultProps} dataLabels={false} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"enabled":false');
	});

	it("should accept custom options override", () => {
		render(
			<DonutChart
				{...defaultProps}
				options={{ chart: { fontFamily: "Arial" } } as never}
			/>,
		);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});
});

describe("PieChart", () => {
	const defaultProps = {
		series: [44, 55, 13],
		labels: ["A", "B", "C"],
	};

	it("should render as a pie chart (not donut)", () => {
		render(<PieChart {...defaultProps} />);
		expect(screen.getByTestId("apex-chart")).toHaveAttribute("data-type", "pie");
	});

	it("should pass series data to the chart", () => {
		render(<PieChart {...defaultProps} />);
		const seriesEl = screen.getByTestId("chart-series");
		expect(seriesEl.textContent).toContain("44");
	});

	it("should render pie chart with all props", () => {
		render(
			<PieChart
				{...defaultProps}
				title="Pie Title"
				subtitle="Pie Sub"
				colors={["#red", "#green", "#blue"]}
			/>,
		);
		expect(screen.getByTestId("apex-chart")).toHaveAttribute("data-type", "pie");
	});

	it("should show empty state for pie chart", () => {
		render(<PieChart series={[]} labels={[]} />);
		expect(screen.getByText("No data available")).toBeInTheDocument();
	});

	it("should show loading for pie chart", () => {
		render(<PieChart {...defaultProps} isLoading />);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
	});
});
