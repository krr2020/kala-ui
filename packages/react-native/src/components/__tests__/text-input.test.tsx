import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { TextInput } from "../text-input";

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

describe("TextInput section slots", () => {
	it("renders sections in order inside k-text-input-group; marker stays on the input", async () => {
		const screen: Screen = await render(
			<TextInput
				leftSection={<Text testID="k-demo-left">₹</Text>}
				rightSection={<Text testID="k-demo-right">kg</Text>}
			/>,
		);
		expect(screen.getByTestId("k-text-input-group")).toBeTruthy();
		expect(screen.getByTestId("k-text-input")).toBeTruthy();
		const wrap = screen.getByTestId("k-text-input-group");
		// row layout, section wrappers flank the input in order
		const kids = wrap.props.children as Array<{ props: { testID?: string } }>;
		expect(kids).toHaveLength(3);
		expect(kids[0].props.testID).toBe("k-text-input-section-left");
		expect(kids[1].props.testID).toBe("k-text-input");
		expect(kids[2].props.testID).toBe("k-text-input-section-right");
		expect(screen.getByTestId("k-demo-left")).toBeTruthy();
		expect(screen.getByTestId("k-demo-right")).toBeTruthy();
		expect(flatStyle(wrap).flexDirection).toBe("row");
	});

	it("no sections → no wrapper view, exact legacy single-input path", async () => {
		const screen: Screen = await render(<TextInput placeholder="plain" />);
		expect(screen.queryByTestId("k-text-input-group")).toBeNull();
		const input = screen.getByTestId("k-text-input");
		expect(flatStyle(input).borderWidth).toBe(1);
		expect(flatStyle(input).minHeight).toBe(44);
	});

	it("only leftSection still wraps", async () => {
		const screen: Screen = await render(
			<TextInput leftSection={<Text>₹</Text>} />,
		);
		expect(screen.getByTestId("k-text-input-group")).toBeTruthy();
	});

	it("sections combine with hasError (destructive border on the wrapper)", async () => {
		const plain: Screen = await render(
			<TextInput leftSection={<Text>₹</Text>} />,
		);
		const errored: Screen = await render(
			<TextInput leftSection={<Text>₹</Text>} hasError />,
		);
		expect(
			flatStyle(plain.getByTestId("k-text-input-group")).borderColor,
		).not.toBe(
			flatStyle(errored.getByTestId("k-text-input-group")).borderColor,
		);
	});

	it("sections combine with disabled (opacity on wrapper, editable false)", async () => {
		const screen: Screen = await render(
			<TextInput leftSection={<Text>₹</Text>} disabled />,
		);
		const wrap = screen.getByTestId("k-text-input-group");
		expect(flatStyle(wrap).opacity).toBe(0.5);
		expect(screen.getByTestId("k-text-input").props.editable).toBe(false);
	});
});
