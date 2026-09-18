/**
 * Marker convention for the relocated composite family: every
 * @kala-ui/react-native-app component keeps its stable `k-*` testID
 * contract unchanged from its life in the core package.
 */
import { fireEvent, render } from "@testing-library/react-native";
import {
	CopyButton,
	EmptyState,
	ErrorBoundary,
	PasswordStrengthIndicator,
	Steps,
	Timeline,
} from "@kala-ui/react-native-app";

const inclHidden = { includeHiddenElements: true } as const;

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

describe("composite markers", () => {
	it("CopyButton renders k-copy-button", async () => {
		const screen = await render(
			<CopyButton value="demo" writeClipboard={async () => undefined} />,
		);
		expect(screen.getByTestId("k-copy-button")).toBeTruthy();
	});

	it("EmptyState renders icon/title/description/action; isLoading swaps to skeleton", async () => {
		const onPress = jest.fn();
		const screen = await render(
			<EmptyState
				title="No projects"
				description="Create your first one"
				action={{ label: "New project", onPress }}
			/>,
		);
		expect(screen.getByTestId("k-empty-state-icon", inclHidden)).toBeTruthy();
		expect(screen.getByText("No projects")).toBeTruthy();
		expect(screen.getByText("Create your first one")).toBeTruthy();
		await fireEvent.press(screen.getByTestId("k-empty-state-action"));
		expect(onPress).toHaveBeenCalledTimes(1);

		await screen.rerender(<EmptyState title="No projects" isLoading />);
		expect(screen.queryByText("No projects")).toBeNull();
		expect(
			screen.getAllByTestId("k-skeleton", inclHidden).length,
		).toBeGreaterThan(0);
	});

	it("EmptyState renders its k-empty-state marker alongside core peers", async () => {
		const screen = await render(<EmptyState title="No projects yet" />);
		expect(screen.getByTestId("k-empty-state")).toBeTruthy();
	});

	it("EmptyState size arms produce distinct heights; destructive tint differs", async () => {
		const seen = new Set<number>();
		const screen = await render(<EmptyState title="t" size="sm" />);
		for (const size of ["sm", "md", "lg"] as const) {
			await screen.rerender(<EmptyState title="t" size={size} />);
			seen.add(
				Number(flatStyle(screen.getByTestId("k-empty-state")).minHeight),
			);
		}
		expect(seen.size).toBe(3);

		await screen.rerender(<EmptyState title="t" />);
		const def = flatStyle(screen.getByTestId("k-empty-state"));
		await screen.rerender(<EmptyState title="t" color="destructive" />);
		const dest = flatStyle(screen.getByTestId("k-empty-state"));
		expect(dest.borderColor).not.toBe(def.borderColor);
		expect(String(dest.backgroundColor).startsWith("#")).toBe(true);
	});

	it("ErrorBoundary renders the fallback markers on crash", async () => {
		const Boom = (): never => {
			throw new Error("markers");
		};
		const screen = await render(
			<ErrorBoundary>
				<Boom />
			</ErrorBoundary>,
		);
		expect(screen.getByTestId("k-error-fallback")).toBeTruthy();
		expect(screen.getByTestId("k-error-fallback-title")).toBeTruthy();
		expect(screen.getByTestId("k-error-fallback-description")).toBeTruthy();
		expect(screen.getByTestId("k-error-fallback-reset")).toBeTruthy();
	});

	it("PasswordStrengthIndicator renders root and segment markers", async () => {
		const screen = await render(
			<PasswordStrengthIndicator password="Aaaaaaaaaaaa1!" />,
		);
		expect(screen.getByTestId("k-password-strength-indicator")).toBeTruthy();
		expect(screen.getAllByTestId("k-password-strength-segment")).toHaveLength(
			4,
		);
	});

	it("Steps renders root, row, indicator and line markers", async () => {
		const screen = await render(
			<Steps items={[{ title: "one" }, { title: "two" }]} value={1} />,
		);
		expect(screen.getByTestId("k-steps")).toBeTruthy();
		expect(screen.getAllByTestId("k-step")).toHaveLength(2);
		expect(screen.getByTestId("k-step-indicator-1")).toBeTruthy();
		expect(screen.getAllByTestId("k-step-line")).toHaveLength(1);
	});

	it("Timeline exposes item, dot and line markers", async () => {
		const screen = await render(
			<Timeline
				items={[{ title: "one", status: "success" }, { title: "two" }]}
			/>,
		);
		expect(screen.getByTestId("k-timeline")).toBeTruthy();
		expect(screen.getAllByTestId("k-timeline-item")).toHaveLength(2);
		expect(screen.getAllByTestId("k-timeline-dot")).toHaveLength(2);
		expect(screen.getAllByTestId("k-timeline-line")).toHaveLength(1);
	});
});
