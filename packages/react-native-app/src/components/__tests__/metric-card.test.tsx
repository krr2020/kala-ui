import { render } from "@testing-library/react-native";
import { MetricCard, MetricCardSkeleton } from "../metric-card";

interface TextHost {
	props: { style?: unknown; children?: unknown };
}

function styleColor(node: TextHost): unknown {
	const style = node.props.style;
	const arr = Array.isArray(style) ? style : [style];
	for (const s of arr) {
		if (s && typeof s === "object" && "color" in s) {
			return (s as { color: unknown }).color;
		}
	}
	return undefined;
}

describe("MetricCard", () => {
	it("renders title and en-US formatted numeric value", async () => {
		const screen = await render(
			<MetricCard title="weekly active" value={12345} />,
		);
		expect(screen.getByText("weekly active")).toBeTruthy();
		expect(screen.getByText("12,345")).toBeTruthy();
	});

	it("renders string values verbatim", async () => {
		const screen = await render(<MetricCard title="plan" value="Enterprise" />);
		expect(screen.getByText("Enterprise")).toBeTruthy();
	});

	it("positive change is a success-colored up arrow with the default label", async () => {
		const screen = await render(
			<MetricCard title="signups" value={80} change={5} />,
		);
		const line = screen.getByText(/5% than last week/);
		expect(line.props.children.join("")).toContain("↑");
		expect(styleColor(line as unknown as TextHost)).toBe("#16a249");
	});

	it("negative change is a destructive-colored down arrow", async () => {
		const screen = await render(
			<MetricCard title="churn" value={7} change={-3} />,
		);
		const line = screen.getByText(/3% than last week/);
		expect(line.props.children.join("")).toContain("↓");
		expect(styleColor(line as unknown as TextHost)).toBe("#ef4444");
	});

	it("zero change is neutral with the no-change label", async () => {
		const screen = await render(
			<MetricCard title="seats" value={12} change={0} />,
		);
		const line = screen.getByText(/No change/);
		expect(line.props.children.join("")).toContain("−");
		expect(styleColor(line as unknown as TextHost)).toBe("#64748b");
	});

	it("a custom changeLabel wins over the default", async () => {
		const screen = await render(
			<MetricCard
				title="signups"
				value={80}
				change={5}
				changeLabel="vs yesterday"
			/>,
		);
		expect(screen.getByText(/vs yesterday/)).toBeTruthy();
		expect(screen.queryByText(/than last week/)).toBeNull();
	});

	it("renders the subtitle arm when no change is given", async () => {
		const screen = await render(
			<MetricCard title="seats" value={12} subtitle="of 20 included" />,
		);
		expect(screen.getByText("of 20 included")).toBeTruthy();
	});

	it("tints the accent bar from the theme tone", async () => {
		const screen = await render(
			<MetricCard title="revenue" value={9000} tone="primary" />,
		);
		expect(screen.getByTestId("k-metric-card-accent")).toBeTruthy();
	});

	it("keeps the marker on the skeleton while loading", async () => {
		const screen = await render(
			<MetricCard title="revenue" value={9} isLoading />,
		);
		expect(screen.getByTestId("k-metric-card")).toBeTruthy();
		expect(screen.queryByText("9")).toBeNull();
	});
});

describe("MetricCardSkeleton", () => {
	it("carries its own marker by default", async () => {
		const screen = await render(<MetricCardSkeleton />);
		expect(screen.getByTestId("k-metric-card")).toBeTruthy();
	});
});
