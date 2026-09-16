import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { LoadingOverlay } from "../loading-overlay";

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

describe("LoadingOverlay", () => {
	it("hidden renders nothing", async () => {
		const screen: Screen = await render(<LoadingOverlay visible={false} />);
		expect(screen.queryByTestId("k-loading-overlay")).toBeNull();
		expect(screen.toJSON()).toBeNull();
	});

	it("visible renders the absolute-fill surface with the default spinner", async () => {
		const screen: Screen = await render(<LoadingOverlay visible />);
		const root = screen.getByTestId("k-loading-overlay");
		const s = flatStyle(root);
		expect(s.position).toBe("absolute");
		expect(Number(s.top)).toBe(0);
		expect(Number(s.bottom)).toBe(0);
		expect(screen.getByTestId("k-spinner")).toBeTruthy();
		expect(root.props.accessibilityLabel).toBe("Loading");
	});

	it("children replace the spinner as the loader node", async () => {
		const screen: Screen = await render(
			<LoadingOverlay visible>
				<Text>fetching orders…</Text>
			</LoadingOverlay>,
		);
		expect(screen.queryByTestId("k-spinner")).toBeNull();
		expect(screen.getByText("fetching orders…")).toBeTruthy();
	});

	it("zIndex lands on the root style", async () => {
		const screen: Screen = await render(
			<LoadingOverlay visible zIndex={900} />,
		);
		expect(flatStyle(screen.getByTestId("k-loading-overlay")).zIndex).toBe(900);
	});

	it("slotStyles.root slot wins over the library surface", async () => {
		const screen: Screen = await render(
			<LoadingOverlay visible slotStyles={{ root: { zIndex: 55 } }} />,
		);
		expect(flatStyle(screen.getByTestId("k-loading-overlay")).zIndex).toBe(55);
	});
});
