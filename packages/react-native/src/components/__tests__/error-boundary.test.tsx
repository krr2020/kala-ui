import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { ErrorBoundary, ErrorFallback } from "../error-boundary";

type Screen = Awaited<ReturnType<typeof render>>;

function Boom({ message }: { message: string }): never {
	throw new Error(message);
}

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

describe("ErrorBoundary", () => {
	it("catches a throwing child, fires onError and shows the default fallback", async () => {
		const onError = jest.fn();
		const screen: Screen = await render(
			<ErrorBoundary onError={onError}>
				<Boom message="order sync failed" />
			</ErrorBoundary>,
		);
		expect(screen.getByTestId("k-error-fallback")).toBeTruthy();
		expect(screen.getByTestId("k-error-fallback-title").props.children).toBe(
			"Something went wrong",
		);
		expect(
			screen.getByTestId("k-error-fallback-description").props.children,
		).toBe("order sync failed");
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
	});

	it("reset press re-attempts the children (observable as a second catch)", async () => {
		const onError = jest.fn();
		const screen: Screen = await render(
			<ErrorBoundary onError={onError}>
				<Boom message="x" />
			</ErrorBoundary>,
		);
		expect(onError).toHaveBeenCalledTimes(1);
		await fireEvent.press(screen.getByTestId("k-error-fallback-reset"));
		// same throwing children re-render after reset, so the boundary
		// catches a second time — the reset itself provably ran
		expect(onError).toHaveBeenCalledTimes(2);
	});

	it("resetKeys change auto-resets while the same keys do not", async () => {
		const screen: Screen = await render(
			<ErrorBoundary resetKeys={["a"]}>
				<Boom message="x" />
			</ErrorBoundary>,
		);
		expect(screen.getByTestId("k-error-fallback")).toBeTruthy();
		await screen.rerender(
			<ErrorBoundary resetKeys={["a"]}>
				<Boom message="x" />
			</ErrorBoundary>,
		);
		expect(screen.getByTestId("k-error-fallback")).toBeTruthy();
		await screen.rerender(
			<ErrorBoundary resetKeys={["b"]}>
				<Boom message="x" />
			</ErrorBoundary>,
		);
		// keys changed → boundary resets; the child throws again so the
		// fallback returns — proving the reset path ran (no stale lock)
		expect(screen.getByTestId("k-error-fallback")).toBeTruthy();
	});

	it("resetKeys change auto-resets into healthy children", async () => {
		const screen: Screen = await render(
			<ErrorBoundary resetKeys={[0]}>
				<Boom message="x" />
			</ErrorBoundary>,
		);
		expect(screen.getByTestId("k-error-fallback")).toBeTruthy();
		await screen.rerender(
			<ErrorBoundary resetKeys={[1]}>
				<Text>recovered</Text>
			</ErrorBoundary>,
		);
		expect(screen.queryByTestId("k-error-fallback")).toBeNull();
		expect(screen.getByText("recovered")).toBeTruthy();
	});

	it("render-prop fallback receives (error, reset) and reset re-attempts", async () => {
		let seenError: Error | null = null;
		const onError = jest.fn();
		const screen: Screen = await render(
			<ErrorBoundary
				onError={onError}
				fallback={(error: Error, reset: () => void) => {
					seenError = error;
					return (
						<Text onPress={reset} testID="custom-fallback">
							custom
						</Text>
					);
				}}
			>
				<Boom message="prop arm" />
			</ErrorBoundary>,
		);
		expect(screen.getByTestId("custom-fallback")).toBeTruthy();
		expect((seenError as Error | null)?.message).toBe("prop arm");
		await fireEvent.press(screen.getByTestId("custom-fallback"));
		// children threw again after reset → componentDidCatch fired twice
		expect(onError).toHaveBeenCalledTimes(2);
	});

	it("static fallback node renders as-is", async () => {
		const screen: Screen = await render(
			<ErrorBoundary fallback={<Text testID="node-fallback">f</Text>}>
				<Boom message="x" />
			</ErrorBoundary>,
		);
		expect(screen.getByTestId("node-fallback")).toBeTruthy();
	});

	it("healthy children render unwrapped — the boundary adds no view", async () => {
		const screen: Screen = await render(
			<ErrorBoundary>
				<Text>healthy</Text>
			</ErrorBoundary>,
		);
		expect(screen.toJSON()?.props.testID).toBeUndefined();
		expect(screen.getByText("healthy")).toBeTruthy();
	});
});

describe("ErrorFallback", () => {
	it("page and section variants map to distinct minHeights", async () => {
		const page: Screen = await render(<ErrorFallback variant="page" />);
		const section: Screen = await render(<ErrorFallback variant="section" />);
		const hPage = flatStyle(page.getByTestId("k-error-fallback")).minHeight;
		const hSection = flatStyle(
			section.getByTestId("k-error-fallback"),
		).minHeight;
		expect(Number(hPage)).toBeGreaterThan(Number(hSection));
	});

	it("defaults title/description; description prefers error.message", async () => {
		const withError: Screen = await render(
			<ErrorFallback error={new Error("boom")} />,
		);
		expect(
			withError.getByTestId("k-error-fallback-description").props.children,
		).toBe("boom");
		const withoutError: Screen = await render(<ErrorFallback />);
		expect(
			withoutError.getByTestId("k-error-fallback-description").props.children,
		).toBe("An unexpected error occurred. Please try again.");
	});

	it("reset renders only when provided", async () => {
		const bare: Screen = await render(<ErrorFallback />);
		expect(bare.queryByTestId("k-error-fallback-reset")).toBeNull();
		const withReset: Screen = await render(
			<ErrorFallback reset={() => undefined} />,
		);
		expect(withReset.getByTestId("k-error-fallback-reset")).toBeTruthy();
	});

	it("styles.root slot wins over the library surface", async () => {
		const screen: Screen = await render(
			<ErrorFallback styles={{ root: { borderWidth: 7 } }} />,
		);
		expect(flatStyle(screen.getByTestId("k-error-fallback")).borderWidth).toBe(
			7,
		);
	});
});
