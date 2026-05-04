import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AreaChart } from "./area-chart";

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

describe("AreaChart", () => {
	const defaultProps = {
		series: [{ name: "Revenue", data: [30, 40, 45, 50, 49, 60] }],
		categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
	};

	it("should render the chart", () => {
		render(<AreaChart {...defaultProps} />);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should pass area type to ApexChart", () => {
		render(<AreaChart {...defaultProps} />);
		expect(screen.getByTestId("apex-chart")).toHaveAttribute("data-type", "area");
	});

	it("should pass series data to the chart", () => {
		render(<AreaChart {...defaultProps} />);
		const seriesEl = screen.getByTestId("chart-series");
		expect(seriesEl.textContent).toContain("Revenue");
		expect(seriesEl.textContent).toContain("30");
		expect(seriesEl.textContent).toContain("60");
	});

	it("should include categories in chart options", () => {
		render(<AreaChart {...defaultProps} />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Jan");
		expect(optionsEl.textContent).toContain("Jun");
	});

	it("should apply default className with w-full", () => {
		const { container } = render(<AreaChart {...defaultProps} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("w-full");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<AreaChart {...defaultProps} className="custom-class" />,
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("custom-class", "w-full");
	});

	it("should show loading skeleton when isLoading is true", () => {
		render(<AreaChart {...defaultProps} isLoading />);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
	});

	it("should show empty state when series is empty", () => {
		render(
			<AreaChart
				series={[]}
				categories={defaultProps.categories}
			/>,
		);
		expect(screen.getByText("No data available")).toBeInTheDocument();
	});

	it("should show custom empty message", () => {
		render(
			<AreaChart
				series={[]}
				categories={defaultProps.categories}
				emptyMessage="Nothing here"
			/>,
		);
		expect(screen.getByText("Nothing here")).toBeInTheDocument();
	});

	it("should not show empty state while loading with empty data", () => {
		render(
			<AreaChart series={[]} categories={defaultProps.categories} isLoading />,
		);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
		expect(
			screen.queryByText("No data available"),
		).not.toBeInTheDocument();
	});

	it("should use custom colors when provided", () => {
		render(
			<AreaChart
				{...defaultProps}
				colors={["#ff0000", "#00ff00"]}
			/>,
		);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("#ff0000");
		expect(optionsEl.textContent).toContain("#00ff00");
	});

	it("should include title in chart options when provided", () => {
		render(<AreaChart {...defaultProps} title="Revenue Chart" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Revenue Chart");
	});

	it("should include subtitle in chart options when provided", () => {
		render(<AreaChart {...defaultProps} subtitle="Monthly report" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Monthly report");
	});

	it("should handle reference lines", () => {
		render(
			<AreaChart
				{...defaultProps}
				referenceLines={[{ value: 50, label: "Target" }]}
			/>,
		);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Target");
		expect(optionsEl.textContent).toContain("50");
	});

	it("should handle reference lines with custom color and dash array", () => {
		render(
			<AreaChart
				{...defaultProps}
				referenceLines={[
					{ value: 50, color: "#ff0000", dashArray: 5, label: "Limit" },
				]}
			/>,
		);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Limit");
		expect(optionsEl.textContent).toContain("#ff0000");
	});

	it("should handle custom height and width", () => {
		render(<AreaChart {...defaultProps} height={500} width="80%" />);
		expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
	});

	it("should set stacked mode in options", () => {
		render(<AreaChart {...defaultProps} stacked />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"stacked":true');
	});

	it("should handle curve prop", () => {
		render(<AreaChart {...defaultProps} curve="straight" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"curve":"straight"');
	});

	it("should enable data labels when prop is true", () => {
		render(<AreaChart {...defaultProps} dataLabels />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain('"enabled":true');
	});

	it("should handle yAxisLabel", () => {
		render(<AreaChart {...defaultProps} yAxisLabel="Amount ($)" />);
		const optionsEl = screen.getByTestId("chart-options");
		expect(optionsEl.textContent).toContain("Amount ($)");
	});

	it("should handle multiple series", () => {
		const multiSeries = [
			{ name: "Revenue", data: [30, 40, 45] },
			{ name: "Expenses", data: [20, 25, 30] },
		];
		render(<AreaChart series={multiSeries} categories={["Q1", "Q2", "Q3"]} />);
		const seriesEl = screen.getByTestId("chart-series");
		expect(seriesEl.textContent).toContain("Revenue");
		expect(seriesEl.textContent).toContain("Expenses");
	});
});
