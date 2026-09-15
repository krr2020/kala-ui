/**
 * Collapsible contracts: the raw disclosure pair — one trigger toggles
 * one content panel. Uncontrolled defaultOpen, the controlled open lock,
 * disabled gating, the marker set, and the expanded announcement.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Collapsible } from "../collapsible";

const incl = { includeHiddenElements: true } as const;

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
});
