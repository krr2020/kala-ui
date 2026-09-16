import { render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import type { TimelineItemData } from "../timeline";
import { Timeline } from "../timeline";

type Screen = Awaited<ReturnType<typeof render>>;

const items: TimelineItemData[] = [
	{
		title: "Order placed",
		description: "cart locked",
		timestamp: "09:00",
	},
	{ title: "Shipped", timestamp: "12:30", status: "success" },
	{
		title: "Delivered",
		description: "signed at the door",
		status: "warning",
	},
];

function dotColor(screen: Screen, index: number): string | undefined {
	const dots = screen.getAllByTestId("k-timeline-dot");
	return StyleSheet.flatten(dots[index].props.style)?.backgroundColor;
}

describe("Timeline", () => {
	it("renders one item per entry with dot and line markers", async () => {
		const screen = await render(<Timeline items={items} />);
		expect(screen.getByTestId("k-timeline")).toBeTruthy();
		expect(screen.getAllByTestId("k-timeline-item")).toHaveLength(3);
		expect(screen.getAllByTestId("k-timeline-dot")).toHaveLength(3);
		// connectors between items only — never after the last
		expect(screen.getAllByTestId("k-timeline-line")).toHaveLength(2);
	});

	it("renders title, description and timestamp text", async () => {
		const screen = await render(<Timeline items={items} />);
		expect(screen.getByText("Order placed")).toBeTruthy();
		expect(screen.getByText("cart locked")).toBeTruthy();
		expect(screen.getByText("12:30")).toBeTruthy();
	});

	it("announces each item combining its content", async () => {
		const screen = await render(<Timeline items={items} />);
		const first = screen.getAllByTestId("k-timeline-item")[0];
		expect(first.props.accessibilityLabel).toContain("Order placed");
		expect(first.props.accessibilityLabel).toContain("09:00");
	});

	it("maps every status to a distinct dot color", async () => {
		const screen = await render(
			<Timeline
				items={[
					{ title: "a", status: "default" },
					{ title: "b", status: "success" },
					{ title: "c", status: "error" },
					{ title: "d", status: "warning" },
					{ title: "e", status: "pending" },
				]}
			/>,
		);
		const colors = [0, 1, 2, 3, 4].map((i) => dotColor(screen, i));
		expect(new Set(colors).size).toBe(5);
		// pending is the hollow arm: bordered, not filled
		const pending = screen.getAllByTestId("k-timeline-dot")[4];
		expect(StyleSheet.flatten(pending.props.style).borderWidth).toBe(2);
	});

	it("slot style overrides reach the root", async () => {
		const screen = await render(
			<Timeline items={items} slotStyles={{ root: { borderWidth: 7 } }} />,
		);
		expect(
			StyleSheet.flatten(screen.getByTestId("k-timeline").props.style)
				.borderWidth,
		).toBe(7);
	});
});
