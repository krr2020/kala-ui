import { render } from "@testing-library/react-native";
import { Progress } from "../progress";

const inclHidden = { includeHiddenElements: true } as const;

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

const theme = () => require("../../themes").themes.light;

describe("Progress resolved style tables", () => {
	it("value text disables Android font padding so it never clips inside the pill", async () => {
		const screen = await render(<Progress value={50} showValue />);
		const value = screen.getByText("50%", inclHidden);
		const s = flatStyle(value);
		expect(s.includeFontPadding).toBe(false);
		expect(s.textAlignVertical).toBe("center");
	});

	it("value text color follows the color arm's foreground token", async () => {
		const screen = await render(
			<>
				<Progress value={50} color="primary" showValue />
				<Progress value={50} color="success" showValue />
				<Progress value={50} color="warning" showValue />
			</>,
		);
		const [primary, success, warning] = screen.getAllByText("50%", inclHidden);
		expect(flatStyle(primary).color).toBe(theme().primaryForeground);
		expect(flatStyle(success).color).toBe(theme().successForeground);
		expect(flatStyle(warning).color).toBe(theme().warningForeground);
	});

	it("font-padding fix survives every consumer override path", async () => {
		// no prop reaches the inner text: style/slotStyles land on the track
		// and indicator, the text stays table-styled
		const screen = await render(
			<Progress
				value={50}
				showValue
				style={{ padding: 40 }}
				slotStyles={{
					root: { padding: 40 },
					indicator: { padding: 40 },
				}}
			/>,
		);
		expect(flatStyle(screen.getByText("50%", inclHidden)).includeFontPadding).toBe(
			false,
		);
	});

	it("clamped values render clamped text: 120 reads 100%, -20 reads 0%", async () => {
		const screen = await render(<Progress value={120} showValue />);
		expect(screen.getByText("100%", inclHidden)).toBeTruthy();
		await screen.rerender(<Progress value={-20} showValue />);
		expect(screen.getByText("0%", inclHidden)).toBeTruthy();
	});

	it("md track auto-grows to 16dp only when it carries inner text", async () => {
		// bar-only default stays the 10dp pill
		const bare = await render(<Progress value={50} />);
		expect(flatStyle(bare.getByTestId("k-progress")).height).toBe(10);
		await bare.rerender(<Progress value={50} showValue />);
		expect(flatStyle(bare.getByTestId("k-progress")).height).toBe(16);
		await bare.rerender(<Progress value={50} label="Half" />);
		expect(flatStyle(bare.getByTestId("k-progress")).height).toBe(16);
		// both label and showValue → still one 16dp pill, label wins
		await bare.rerender(<Progress value={50} label="Half" showValue />);
		expect(flatStyle(bare.getByTestId("k-progress")).height).toBe(16);
		expect(bare.getByText("Half", inclHidden)).toBeTruthy();
		// lg already fits text; sm suppresses text so it never grows
		await bare.rerender(<Progress value={50} size="lg" showValue />);
		expect(flatStyle(bare.getByTestId("k-progress")).height).toBe(16);
		await bare.rerender(<Progress value={50} size="sm" showValue />);
		expect(flatStyle(bare.getByTestId("k-progress")).height).toBe(4);
	});

	it("custom min/max maps the shown percentage, not the raw value", async () => {
		const screen = await render(
			<Progress value={50} min={10} max={90} showValue />,
		);
		expect(screen.getByText("50%", inclHidden)).toBeTruthy();
		await screen.rerender(<Progress value={10} min={10} max={90} showValue />);
		expect(screen.getByText("0%", inclHidden)).toBeTruthy();
		await screen.rerender(<Progress value={90} min={10} max={90} showValue />);
		expect(screen.getByText("100%", inclHidden)).toBeTruthy();
	});
});
