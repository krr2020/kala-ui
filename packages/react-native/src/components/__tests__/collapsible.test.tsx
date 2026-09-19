/**
 * Collapsible contracts: the raw disclosure pair — one trigger toggles
 * one content panel. Uncontrolled defaultOpen, the controlled open lock,
 * disabled gating, the marker set, and the expanded announcement.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { View } from "react-native";
import { Collapsible } from "../collapsible";

const incl = { includeHiddenElements: true } as const;

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, unknown> =>
	(require("react-native").StyleSheet.flatten(node.props.style) ?? {}) as Record<
		string,
		unknown
	>;

const rotateOf = (screen: Awaited<ReturnType<typeof render>>) =>
	(
			flatStyle(screen.getByTestId("k-collapsible-chevron", incl)).transform as {
				rotate?: string;
			}[]
	)[0]?.rotate;

const pair = (extra: { open?: boolean; defaultOpen?: boolean } = {}) => (
	<Collapsible {...extra}>
		<Collapsible.Trigger>more</Collapsible.Trigger>
		<Collapsible.Content>detail text</Collapsible.Content>
	</Collapsible>
);

describe("Collapsible", () => {
	it("renders root, trigger and content markers; closed unmounts the content", async () => {
		const screen = await render(pair({ defaultOpen: true }));
		expect(screen.getByTestId("k-collapsible")).toBeTruthy();
		expect(screen.getByTestId("k-collapsible-trigger", incl)).toBeTruthy();
		expect(screen.getByTestId("k-collapsible-content")).toBeTruthy();
		expect(screen.getByText("detail text")).toBeTruthy();

		await screen.rerender(pair({ open: false }));
		expect(screen.queryByTestId("k-collapsible-content")).toBeNull();
		expect(screen.queryByText("detail text")).toBeNull();
		// the trigger survives a close — only the content unmounts
		expect(screen.getByTestId("k-collapsible-trigger", incl)).toBeTruthy();
	});

	it("uncontrolled trigger press toggles with no onOpenChange handler", async () => {
		const screen = await render(pair());
		expect(screen.queryByText("detail text")).toBeNull();
		await fireEvent.press(screen.getByTestId("k-collapsible-trigger", incl));
		expect(screen.getByText("detail text")).toBeTruthy();
		await fireEvent.press(screen.getByTestId("k-collapsible-trigger", incl));
		expect(screen.queryByText("detail text")).toBeNull();
	});

	it("controlled open locks until the parent re-renders while onOpenChange still fires", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Collapsible open={false} onOpenChange={onOpenChange}>
				<Collapsible.Trigger>more</Collapsible.Trigger>
				<Collapsible.Content>detail text</Collapsible.Content>
			</Collapsible>,
		);
		await fireEvent.press(screen.getByTestId("k-collapsible-trigger", incl));
		expect(onOpenChange).toHaveBeenCalledWith(true);
		// controlled lock: state only moves when the parent re-renders
		expect(screen.queryByText("detail text")).toBeNull();

		await screen.rerender(
			<Collapsible open onOpenChange={onOpenChange}>
				<Collapsible.Trigger>more</Collapsible.Trigger>
				<Collapsible.Content>detail text</Collapsible.Content>
			</Collapsible>,
		);
		expect(screen.getByText("detail text")).toBeTruthy();
	});

	it("disabled never fires and the trigger announces disabled + expanded", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Collapsible disabled defaultOpen onOpenChange={onOpenChange}>
				<Collapsible.Trigger>more</Collapsible.Trigger>
				<Collapsible.Content>detail text</Collapsible.Content>
			</Collapsible>,
		);
		const trigger = screen.getByTestId("k-collapsible-trigger", incl);
		expect(trigger.props.accessibilityRole).toBe("button");
		expect(trigger.props.accessibilityState?.expanded).toBe(true);
		expect(trigger.props.accessibilityState?.disabled).toBe(true);
		await fireEvent.press(trigger);
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it("renders an empty root with no children", async () => {
		const screen = await render(<Collapsible />);
		expect(screen.getByTestId("k-collapsible")).toBeTruthy();
	});

	it("chevron flips 180deg between closed and open", async () => {
		const screen = await render(pair());
		expect(rotateOf(screen)).toBe("0deg");
		await fireEvent.press(screen.getByTestId("k-collapsible-trigger", incl));
		expect(rotateOf(screen)).toBe("180deg");
	});

	it("trigger layout arms: string label flexes, chevron rides row end in both arms", async () => {
		const walk = (node: unknown, found: string[]): string[] => {
			if (Array.isArray(node)) {
				for (const child of node) walk(child, found);
				return found;
			}
			if (node && typeof node === "object") {
				const n = node as {
					type?: string;
					props?: { testID?: string; children?: unknown };
				};
				if (n.type === "Text") found.push("text");
				if (n.props?.testID) found.push(n.props.testID);
				walk(n.props?.children, found);
			} else if (node !== null && node !== undefined && node !== false) {
				found.push("str");
			}
			return found;
		};
		const strScreen = await render(
			<Collapsible defaultOpen>
				<Collapsible.Trigger>more</Collapsible.Trigger>
			</Collapsible>,
		);
		const strTrigger = strScreen.getByTestId("k-collapsible-trigger", incl);
		const strFound = walk(strTrigger, []);
		expect(strFound).toEqual([
			"k-collapsible-trigger",
			"str",
			"k-collapsible-chevron",
		]);

		const elScreen = await render(
			<Collapsible defaultOpen>
				<Collapsible.Trigger>
					<View testID="custom-trigger-body" style={{ flex: 1 }} />
				</Collapsible.Trigger>
			</Collapsible>,
		);
		const elTrigger = elScreen.getByTestId("k-collapsible-trigger", incl);
		const elFound = walk(elTrigger, []);
		expect(elFound[elFound.length - 2]).toBe("custom-trigger-body");
		expect(elFound[elFound.length - 1]).toBe("k-collapsible-chevron");
	});

	it("controlled + disabled never fires and open stays locked", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Collapsible open={false} disabled onOpenChange={onOpenChange}>
				<Collapsible.Trigger>more</Collapsible.Trigger>
				<Collapsible.Content>detail text</Collapsible.Content>
			</Collapsible>,
		);
		await fireEvent.press(screen.getByTestId("k-collapsible-trigger", incl));
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(screen.queryByText("detail text")).toBeNull();
	});

	it("multiple content panels mount together or not at all", async () => {
		const screen = await render(
			<Collapsible>
				<Collapsible.Trigger>more</Collapsible.Trigger>
				<Collapsible.Content>first panel</Collapsible.Content>
				<Collapsible.Content>second panel</Collapsible.Content>
			</Collapsible>,
		);
		expect(screen.queryAllByTestId("k-collapsible-content")).toHaveLength(0);
		await fireEvent.press(screen.getByTestId("k-collapsible-trigger", incl));
		expect(screen.getAllByTestId("k-collapsible-content")).toHaveLength(2);
		expect(screen.getByText("first panel")).toBeTruthy();
		expect(screen.getByText("second panel")).toBeTruthy();
	});

	it("slotStyles override root, trigger and content surfaces", async () => {
		const screen = await render(
			<Collapsible
				defaultOpen
				slotStyles={{
					root: { padding: 13 },
					trigger: { minWidth: 120 },
					content: { paddingBottom: 21 },
				}}
			>
				<Collapsible.Trigger>more</Collapsible.Trigger>
				<Collapsible.Content>detail text</Collapsible.Content>
			</Collapsible>,
		);
		expect(flatStyle(screen.getByTestId("k-collapsible")).padding).toBe(13);
		expect(
				flatStyle(screen.getByTestId("k-collapsible-trigger", incl)).minWidth,
		).toBe(120);
		expect(
				flatStyle(screen.getByTestId("k-collapsible-content")).paddingBottom,
		).toBe(21);
	});

	it("onOpenChange reports the NEXT state on every toggle", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Collapsible onOpenChange={onOpenChange}>
				<Collapsible.Trigger>more</Collapsible.Trigger>
				<Collapsible.Content>detail text</Collapsible.Content>
			</Collapsible>,
		);
		await fireEvent.press(screen.getByTestId("k-collapsible-trigger", incl));
		expect(onOpenChange).toHaveBeenLastCalledWith(true);
		await fireEvent.press(screen.getByTestId("k-collapsible-trigger", incl));
		expect(onOpenChange).toHaveBeenLastCalledWith(false);
	});
});
