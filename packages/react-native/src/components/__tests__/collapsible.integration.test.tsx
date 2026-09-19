/**
 * Integration seam: pins the Collapsible API surface exactly as the native
 * playground demo consumes it (packages/react-native ↔ apps/native-playground).
 * If a rename or behavior change breaks the demo-facing contract — controlled
 * readout, defaultOpen arm, disabled gating, chevron rotation — this fails
 * before the playground does.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Collapsible } from "../collapsible";

const incl = { includeHiddenElements: true } as const;

const flat = (node: { props: { style?: unknown } }) =>
	require("react-native").StyleSheet.flatten(node.props.style) as Record<
		string,
		unknown
	>;

const rotateOf = (screen: Awaited<ReturnType<typeof render>>) =>
	(
		flat(screen.getByTestId("k-collapsible-chevron", incl)).transform as {
			rotate?: string;
		}[]
	)?.[0]?.rotate;

// Mirrors apps/native-playground/src/demos/components/collapsible-demo.tsx.
describe("Collapsible ↔ playground demo contract", () => {
	it("controlled block: readout tracks the open state", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Collapsible open={false} onOpenChange={onOpenChange} testID="k-collapsible">
				<Collapsible.Trigger accessibilityLabel="Advanced Filters">
					Advanced Filters
				</Collapsible.Trigger>
				<Collapsible.Content>only verified sellers · min rating 4</Collapsible.Content>
			</Collapsible>,
		);
		await fireEvent.press(screen.getByTestId("k-collapsible-trigger", incl));
		expect(onOpenChange).toHaveBeenCalledWith(true);
		// controlled lock: the parent owns the state
		expect(screen.queryAllByTestId("k-collapsible-content")).toHaveLength(0);
	});

	it("uncontrolled block: defaultOpen starts expanded with rotated chevron", async () => {
		const screen = await render(
			<Collapsible defaultOpen>
				<Collapsible.Trigger accessibilityLabel="Session details">
					Session details
				</Collapsible.Trigger>
				<Collapsible.Content>starts open without local state</Collapsible.Content>
			</Collapsible>,
		);
		expect(screen.getAllByTestId("k-collapsible-content")).toHaveLength(1);
		expect(rotateOf(screen)).toBe("180deg");
		await fireEvent.press(screen.getByTestId("k-collapsible-trigger", incl));
		expect(screen.queryAllByTestId("k-collapsible-content")).toHaveLength(0);
		expect(rotateOf(screen)).toBe("0deg");
	});

	it("disabled block: gated trigger never fires nor rotates", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Collapsible disabled onOpenChange={onOpenChange}>
				<Collapsible.Trigger accessibilityLabel="Locked section">
					Locked section
				</Collapsible.Trigger>
				<Collapsible.Content>never reachable</Collapsible.Content>
			</Collapsible>,
		);
		const trigger = screen.getByTestId("k-collapsible-trigger", incl);
		expect(trigger.props.accessibilityState?.disabled).toBe(true);
		await fireEvent.press(trigger);
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(rotateOf(screen)).toBe("0deg");
	});
});
