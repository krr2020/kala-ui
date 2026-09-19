/**
 * Integration seam: pins the Accordion API surface exactly as the native
 * playground demo consumes it (packages/react-native ↔ apps/native-playground).
 * If a rename or behavior change breaks the demo-facing contract — variant
 * blocks, selection semantics, disabled gating, trigger a11y — this fails
 * before the playground does.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Accordion } from "../accordion";

const incl = { includeHiddenElements: true } as const;

const flat = (node: { props: { style?: unknown } }) =>
	require("react-native").StyleSheet.flatten(node.props.style) as Record<
		string,
		number | string
	>;

// Mirrors apps/native-playground/src/demos/components/accordion-demo.tsx.
describe("Accordion ↔ playground demo contract", () => {
	it("default block: controlled single with readout semantics", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Accordion type="single" value="billing" onValueChange={onValueChange}>
				<Accordion.Item value="billing">
					<Accordion.Trigger accessibilityLabel="Billing">Billing</Accordion.Trigger>
					<Accordion.Content>invoices email on the first of each month</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="account">
					<Accordion.Trigger accessibilityLabel="Account">Account</Accordion.Trigger>
					<Accordion.Content>change email or password any time</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		const trigger = screen.getAllByTestId("k-accordion-trigger", incl)[0];
		expect(trigger.props.accessibilityRole).toBe("button");
		expect(trigger.props.accessibilityLabel).toBe("Billing");
		expect(trigger.props.accessibilityState.expanded).toBe(true);
		expect(screen.getAllByTestId("k-accordion-content", incl)).toHaveLength(1);
		await fireEvent.press(screen.getAllByTestId("k-accordion-trigger", incl)[1]);
		expect(onValueChange).toHaveBeenCalledWith("account");
	});

	it("bordered block: multiple selection with boxed surfaces", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Accordion
				type="multiple"
				variant="bordered"
				defaultValue={["shipping"]}
				onValueChange={onValueChange}
			>
				<Accordion.Item value="shipping">
					<Accordion.Trigger accessibilityLabel="Shipping">Shipping</Accordion.Trigger>
					<Accordion.Content>free over $50, arrives in 3-5 days</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="returns">
					<Accordion.Trigger accessibilityLabel="Returns">Returns</Accordion.Trigger>
					<Accordion.Content>30-day window, no questions asked</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		const rows = screen.getAllByTestId("k-accordion-item", incl).map(flat);
		expect(Number(rows[0].borderWidth)).toBe(1);
		expect(Number(rows[0].marginBottom)).toBe(8);
		expect(rows[1].marginBottom ?? 0).toBe(0);
		await fireEvent.press(screen.getAllByTestId("k-accordion-trigger", incl)[1]);
		expect(onValueChange).toHaveBeenCalledWith(["shipping", "returns"]);
	});

	it("filled block: locked item never fires", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Accordion type="single" variant="filled" defaultValue="faq" onValueChange={onValueChange}>
				<Accordion.Item value="faq">
					<Accordion.Trigger accessibilityLabel="FAQ">FAQ</Accordion.Trigger>
					<Accordion.Content>answers to the questions support gets most</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="legacy" disabled>
					<Accordion.Trigger accessibilityLabel="Legacy settings">
						Legacy settings
					</Accordion.Trigger>
					<Accordion.Content>migrated accounts only</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		const triggers = screen.getAllByTestId("k-accordion-trigger", incl);
		expect(triggers[0].props.accessibilityState.expanded).toBe(true);
		await fireEvent.press(triggers[1]);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(triggers[1].props.accessibilityState.disabled).toBe(true);
	});

	it("whole-group disabled block: every trigger gated", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Accordion type="single" defaultValue="a" disabled onValueChange={onValueChange}>
				<Accordion.Item value="a">
					<Accordion.Trigger accessibilityLabel="A">A</Accordion.Trigger>
				</Accordion.Item>
				<Accordion.Item value="b">
					<Accordion.Trigger accessibilityLabel="B">B</Accordion.Trigger>
				</Accordion.Item>
			</Accordion>,
		);
		await fireEvent.press(screen.getAllByTestId("k-accordion-trigger", incl)[1]);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(
			screen
				.getAllByTestId("k-accordion-trigger", incl)
				.every((t) => t.props.accessibilityState.disabled),
		).toBe(true);
	});
});
