import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { RingProgress } from "../ring-progress";

type Screen = Awaited<ReturnType<typeof render>>;

type JsonNode = {
	props?: Record<string, unknown>;
	children?: JsonNode[] | JsonNode | string | null;
};

function flatStyle(node: {
	props: { style?: unknown };
}): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	const walk = (entry: unknown): void => {
		if (Array.isArray(entry)) {
			for (const e of entry) walk(e);
		} else if (entry) {
			Object.assign(out, entry);
		}
	};
	walk(node.props.style ?? []);
	return out;
}

function circlesOf(screen: Screen): Record<string, unknown>[] {
	const found: Record<string, unknown>[] = [];
	const walk = (
		node: JsonNode | JsonNode[] | string | null | undefined,
	): void => {
		if (node == null || typeof node === "string") return;
		if (Array.isArray(node)) {
			node.forEach(walk);
			return;
		}
		if (node.props && "cx" in node.props && "r" in node.props) {
			found.push(node.props);
		}
		walk(node.children);
	};
	walk(screen.toJSON() as JsonNode);
	return found;
}

describe("RingProgress", () => {
	it("renders the root marker with progressbar role and clamped value", async () => {
		const screen: Screen = await render(
			<RingProgress value={64} accessibilityLabel="upload" />,
		);
		const root = screen.getByTestId("k-ring-progress");
		expect(root.props.accessibilityRole).toBe("progressbar");
		expect(root.props.accessibilityValue).toEqual({
			min: 0,
			max: 100,
			now: 64,
		});
		expect(root.props.accessibilityLabel).toBe("upload");
	});

	it("value clamps below 0 and above 100", async () => {
		const low: Screen = await render(<RingProgress value={-20} />);
		expect(
			low.getByTestId("k-ring-progress").props.accessibilityValue.now,
		).toBe(0);
		const high: Screen = await render(<RingProgress value={140} />);
		expect(
			high.getByTestId("k-ring-progress").props.accessibilityValue.now,
		).toBe(100);
	});

	it("sections render one arc each, colored via their tone or the shared color", async () => {
		const single: Screen = await render(<RingProgress value={40} />);
		expect(circlesOf(single)).toHaveLength(2);
		const multi: Screen = await render(
			<RingProgress
				sections={[{ value: 20, color: "success" }, { value: 30 }]}
			/>,
		);
		const circles = circlesOf(multi);
		expect(circles).toHaveLength(3);
		// every arc carries a resolved numeric stroke; the colorless section
		// inherits the shared tone instead of rendering null
		for (const circle of circles) {
			expect(circle.stroke).not.toBeNull();
		}
		// dashoffset shrinks as a segment's own value grows: the 30% arc
		// carries a smaller offset than the 20% arc
		const first = circles[1].strokeDashoffset as number;
		const second = circles[2].strokeDashoffset as number;
		expect(Number(second)).toBeLessThan(Number(first));
	});

	it("zero value renders a full-circumference dashoffset (no visible arc)", async () => {
		const screen: Screen = await render(<RingProgress value={0} />);
		const arc = circlesOf(screen).find((c) => c.strokeDasharray !== undefined);
		expect(arc).toBeTruthy();
		// RNSvg serializes dasharray as [string, string] — a zero arc hides
		// exactly one full circumference behind the offset
		const dash = (arc?.strokeDasharray ?? []) as string[];
		const offset = arc?.strokeDashoffset ?? Number.NaN;
		expect(Number(dash[0])).toBe(Number(offset));
	});

	it("tone colors resolve through theme tokens and stay distinct", async () => {
		const screen: Screen = await render(
			<RingProgress value={50} color="primary" emptyColor="muted" />,
		);
		const circles = circlesOf(screen);
		// RNSvg serializes stroke as a packed numeric color {type, payload}
		const track = circles[0].stroke as { payload: number };
		const arc = circles[1].stroke as { payload: number };
		expect(track.payload).not.toBe(arc.payload);
	});

	it("roundCaps toggles strokeLinecap", async () => {
		// RNSvg maps strokeLinecap to a numeric enum; round !== butt
		const round: Screen = await render(<RingProgress value={10} />);
		const capRound = circlesOf(round)[1].strokeLinecap;
		const butt: Screen = await render(
			<RingProgress value={10} roundCaps={false} />,
		);
		expect(circlesOf(butt)[1].strokeLinecap).not.toBe(capRound);
	});

	it("label renders centered inside the ring", async () => {
		const screen: Screen = await render(
			<RingProgress value={10} label={<Text>64%</Text>} />,
		);
		const label = screen.getByTestId("k-ring-progress-label");
		expect(flatStyle(label).position).toBe("absolute");
		expect(screen.getByText("64%")).toBeTruthy();
	});

	it("geometry guard: thickness >= size collapses radius to 0, never negative", async () => {
		const screen: Screen = await render(
			<RingProgress size={20} thickness={40} value={50} />,
		);
		for (const circle of circlesOf(screen)) {
			expect(Number(circle.r)).toBeGreaterThanOrEqual(0);
			expect(Number.isNaN(Number(circle.r))).toBe(false);
		}
	});

	it("geometry guard: size=0 renders without crashing", async () => {
		const screen: Screen = await render(<RingProgress size={0} value={50} />);
		expect(screen.getByTestId("k-ring-progress")).toBeTruthy();
	});

	it("styles.root slot wins over the library surface", async () => {
		const screen: Screen = await render(
			<RingProgress value={10} styles={{ root: { borderWidth: 7 } }} />,
		);
		expect(flatStyle(screen.getByTestId("k-ring-progress")).borderWidth).toBe(
			7,
		);
	});
});
