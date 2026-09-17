import { render } from "@testing-library/react-native";
import { themes } from "../../themes";
import { Label } from "../label";
import * as labelStyle from "../label/label.styles";

type Screen = Awaited<ReturnType<typeof render>>;

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

describe("Label", () => {
	it("renders the k-label marker", async () => {
		const screen: Screen = await render(<Label>email</Label>);
		expect(screen.getByTestId("k-label")).toBeTruthy();
	});

	it("typography: 14/500 themed foreground — light and dark pure-fn arms", () => {
		expect(labelStyle.label(themes.light)).toEqual({
			fontSize: 14,
			fontWeight: "500",
			color: themes.light.foreground,
		});
		expect(labelStyle.label(themes.dark).color).toBe(themes.dark.foreground);
		expect(labelStyle.required(themes.light).color).toBe(
			themes.light.destructive,
		);
		expect(labelStyle.required(themes.dark).color).toBe(
			themes.dark.destructive,
		);
	});

	it("required appends the destructive ' *' exactly once; plain has none", async () => {
		const screen: Screen = await render(<Label required>slug</Label>);
		expect(screen.getAllByText(" *").length).toBe(1);
		expect(flatStyle(screen.getByText(" *")).color).toBe(
			themes.light.destructive,
		);
		const plain: Screen = await render(<Label>notes</Label>);
		expect(plain.queryAllByText(" *").length).toBe(0);
	});

	it("slot precedence: slotStyles.root wins over style; style wins over library", async () => {
		const withSlot: Screen = await render(
			<Label style={{ fontSize: 20 }} slotStyles={{ root: { fontSize: 30 } }}>
				x
			</Label>,
		);
		expect(flatStyle(withSlot.getByTestId("k-label")).fontSize).toBe(30);
		const withStyle: Screen = await render(
			<Label style={{ fontSize: 20 }}>x</Label>,
		);
		expect(flatStyle(withStyle.getByTestId("k-label")).fontSize).toBe(20);
	});
});
