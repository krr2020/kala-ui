/**
 * EmptyState slot-styles contract: the isLoading arm must honor the same
 * declared root slot as the loaded arm, not just the library surface.
 */
import { render } from "@testing-library/react-native";
import { EmptyState } from "../components/empty-state/empty-state";

const incl = { includeHiddenElements: true } as const;

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

describe("EmptyState slotStyles", () => {
	it("isLoading applies slotStyles.root over the library surface", async () => {
		const screen = await render(
			<EmptyState
				isLoading
				title="t"
				slotStyles={{ root: { borderWidth: 7 } }}
			/>,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-empty-state", incl)).borderWidth),
		).toBe(7);
	});

	it("loaded arm still applies slotStyles.root", async () => {
		const screen = await render(
			<EmptyState title="t" slotStyles={{ root: { borderWidth: 7 } }} />,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-empty-state", incl)).borderWidth),
		).toBe(7);
	});
});
