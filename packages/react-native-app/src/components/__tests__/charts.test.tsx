import { render } from "@testing-library/react-native";
import { BarChart, ChartSkeleton, DonutChart, Sparkline } from "../charts";

describe("BarChart", () => {
	const data = [
		{ label: "mon", value: 4 },
		{ label: "tue", value: 8 },
	];

	it("renders its marker and one bar per datum", async () => {
		const screen = await render(<BarChart data={data} height={100} />);
		expect(screen.getByTestId("k-bar-chart")).toBeTruthy();
		expect(screen.getByTestId("k-bar-chart-bar-mon")).toBeTruthy();
		expect(screen.getByTestId("k-bar-chart-bar-tue")).toBeTruthy();
	});

	it("normalizes bar heights to the tallest value", async () => {
		const screen = await render(<BarChart data={data} height={100} />);
		const shortBar = Number(
			screen.getByTestId("k-bar-chart-bar-mon").props.height,
		);
		const tallBar = Number(
			screen.getByTestId("k-bar-chart-bar-tue").props.height,
		);
		expect(tallBar).toBe(100);
		expect(shortBar).toBe(50);
	});

	it("resolves tone color names through the theme", async () => {
		const screen = await render(
			<BarChart data={data} height={100} tone="destructive" />,
		);
		expect(screen.getByTestId("k-bar-chart-bar-mon").props.fill.payload).toBe(
			0xffef4444,
		);
	});

	it("renders the empty arm instead of bars for empty data", async () => {
		const screen = await render(<BarChart data={[]} />);
		expect(screen.getByText("No data available")).toBeTruthy();
		expect(screen.queryByTestId("k-bar-chart-bar-mon")).toBeNull();
	});

	it("keeps the marker on the skeleton while loading", async () => {
		const screen = await render(<BarChart data={data} isLoading />);
		expect(screen.getByTestId("k-bar-chart")).toBeTruthy();
		expect(screen.queryByTestId("k-bar-chart-bar-mon")).toBeNull();
	});
});

describe("DonutChart", () => {
	const data = [
		{ label: "direct", value: 1000 },
		{ label: "organic", value: 500 },
	];

	it("renders its marker and one segment per datum", async () => {
		const screen = await render(<DonutChart data={data} />);
		expect(screen.getByTestId("k-donut-chart")).toBeTruthy();
		expect(screen.getByTestId("k-donut-chart-segment-direct")).toBeTruthy();
		expect(screen.getByTestId("k-donut-chart-segment-organic")).toBeTruthy();
	});

	it("shows the en-US formatted sum as the center total", async () => {
		const screen = await render(<DonutChart data={data} />);
		expect(screen.getByText("1,500")).toBeTruthy();
	});

	it("renders the empty arm when the total is zero", async () => {
		const screen = await render(
			<DonutChart data={[{ label: "a", value: 0 }]} />,
		);
		expect(screen.getByText("No data available")).toBeTruthy();
		expect(screen.queryByTestId("k-donut-chart-segment-a")).toBeNull();
	});

	it("clamps negatives so the total never goes below zero", async () => {
		const screen = await render(
			<DonutChart
				data={[
					{ label: "a", value: -10 },
					{ label: "b", value: 10 },
				]}
			/>,
		);
		expect(screen.getByText("10")).toBeTruthy();
	});
});

describe("Sparkline", () => {
	it("renders one polyline point per datum", async () => {
		const screen = await render(<Sparkline data={[1, 2, 3, 4]} />);
		expect(screen.getByTestId("k-sparkline")).toBeTruthy();
		// react-native-svg exposes the derived path (d), not the points string
		const d: string = screen.getByTestId("k-sparkline-line").props.d;
		expect(
			d
				.trim()
				.split(/[\sM]+/)
				.filter(Boolean),
		).toHaveLength(8);
	});

	it("renders a flat line for single-point data", async () => {
		const screen = await render(<Sparkline data={[7]} />);
		const d: string = screen.getByTestId("k-sparkline-line").props.d;
		expect(
			d
				.trim()
				.split(/[\sM]+/)
				.filter(Boolean),
		).toHaveLength(4);
	});

	it("renders the empty arm for empty data", async () => {
		const screen = await render(<Sparkline data={[]} />);
		expect(screen.getByText("No data available")).toBeTruthy();
		expect(screen.queryByTestId("k-sparkline-line")).toBeNull();
	});
});

describe("ChartSkeleton", () => {
	it("carries its own marker by default", async () => {
		const screen = await render(<ChartSkeleton />);
		expect(screen.getByTestId("k-chart-skeleton")).toBeTruthy();
	});
});
