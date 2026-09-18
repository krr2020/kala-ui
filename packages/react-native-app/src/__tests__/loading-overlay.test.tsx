import { render } from "@testing-library/react-native";
import { LoadingOverlay } from "@kala-ui/react-native-app";
import { Text } from "react-native";

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
		// the spinner inherits the overlay label so SR users hear one message
		expect(screen.getByTestId("k-spinner").props.accessibilityLabel).toBe(
			"Loading",
		);
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

	it("absorbs touches: pointerEvents is auto while visible", async () => {
		const screen: Screen = await render(<LoadingOverlay visible />);
		expect(
			flatStyle(screen.getByTestId("k-loading-overlay")).pointerEvents,
		).toBe("auto");
	});

	it("announces through a polite live region", async () => {
		const screen: Screen = await render(
			<LoadingOverlay visible accessibilityLabel="Fetching orders" />,
		);
		expect(
			screen.getByTestId("k-loading-overlay").props.accessibilityLiveRegion,
		).toBe("polite");
	});

	it("loaderProps tune the default spinner and its label", async () => {
		const screen: Screen = await render(
			<LoadingOverlay visible loaderProps={{ label: "Syncing", size: "sm" }} />,
		);
		expect(screen.getByTestId("k-spinner").props.accessibilityLabel).toBe(
			"Syncing",
		);
	});
});
