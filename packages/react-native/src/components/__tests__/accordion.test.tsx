/**
 * Accordion contracts: disclosure state (single exclusivity vs multiple
 * independence), controlled/uncontrolled arms, disabled gating at item
 * and group level, the marker set, variant styling arms, and the
 * expanded announcement triggers carry for screen readers.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Accordion } from "../accordion";
import { toValues } from "../accordion/accordion.styles";

const incl = { includeHiddenElements: true } as const;

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

const twoItems = (
	onValueChange?: jest.Mock,
	extra: { disabled?: boolean; firstDisabled?: boolean } = {},
) => (
	<Accordion
		type="single"
		onValueChange={onValueChange}
		disabled={extra.disabled}
	>
		<Accordion.Item value="a" disabled={extra.firstDisabled}>
			<Accordion.Trigger>Alpha</Accordion.Trigger>
			<Accordion.Content>alpha body</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="b">
			<Accordion.Trigger>Beta</Accordion.Trigger>
			<Accordion.Content>beta body</Accordion.Content>
		</Accordion.Item>
	</Accordion>
);

	describe("Accordion", () => {
	it("default variant: only non-last items draw the bottom divider", async () => {
		const screen = await render(
			<Accordion type="single">
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
				</Accordion.Item>
				<Accordion.Item value="b">
					<Accordion.Trigger>Beta</Accordion.Trigger>
				</Accordion.Item>
				<Accordion.Item value="c">
					<Accordion.Trigger>Gamma</Accordion.Trigger>
				</Accordion.Item>
			</Accordion>,
		);
		const rows = screen.getAllByTestId("k-accordion-item", incl).map(flatStyle);
		expect(Number(rows[0].borderBottomWidth)).toBe(1);
		expect(Number(rows[1].borderBottomWidth)).toBe(1);
		// web's last:border-b-0 — the final row carries no divider
		expect(rows[2].borderBottomWidth ?? 0).toBe(0);
	});

	it("single-item default accordion has no divider (first=last)", async () => {
		const screen = await render(
			<Accordion type="single">
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
				</Accordion.Item>
			</Accordion>,
		);
		const row = flatStyle(screen.getByTestId("k-accordion-item", incl));
		expect(row.borderBottomWidth ?? 0).toBe(0);
	});

	it("boxed variants space items between-only: no trailing margin after the last", async () => {
		for (const variant of ["bordered", "filled"] as const) {
			const screen = await render(
				<Accordion type="single" variant={variant}>
					<Accordion.Item value="a">
						<Accordion.Trigger>Alpha</Accordion.Trigger>
					</Accordion.Item>
					<Accordion.Item value="b">
						<Accordion.Trigger>Beta</Accordion.Trigger>
					</Accordion.Item>
				</Accordion>,
			);
			const rows = screen.getAllByTestId("k-accordion-item", incl).map(flatStyle);
			expect(Number(rows[0].marginBottom)).toBe(8);
			expect(Number(rows[0].borderWidth)).toBe(1);
			expect(Number(rows[0].borderRadius)).toBe(8);
			expect(rows[1].marginBottom ?? 0).toBe(0);
		}
	});

	it("rerender re-derives slots: removing the last drops its divider/margin", async () => {
		const three = (
			<Accordion type="single">
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
				</Accordion.Item>
				<Accordion.Item value="b">
					<Accordion.Trigger>Beta</Accordion.Trigger>
				</Accordion.Item>
				<Accordion.Item value="c">
					<Accordion.Trigger>Gamma</Accordion.Trigger>
				</Accordion.Item>
		</Accordion>);
		const screen = await render(three);
		await screen.rerender(
			<Accordion type="single">
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
				</Accordion.Item>
				<Accordion.Item value="b">
					<Accordion.Trigger>Beta</Accordion.Trigger>
				</Accordion.Item>
			</Accordion>,
		);
		const rows = screen.getAllByTestId("k-accordion-item", incl).map(flatStyle);
		expect(Number(rows[0].borderBottomWidth)).toBe(1);
		expect(rows[1].borderBottomWidth ?? 0).toBe(0);
		// and growing back re-adds the divider
		await screen.rerender(three);
		expect(
			Number(flatStyle(screen.getAllByTestId("k-accordion-item", incl)[1]).borderBottomWidth),
		).toBe(1);
	});

	it("non-element children between items do not shift slot derivation", async () => {
		const screen = await render(
			<Accordion type="single">
				{null}
				{false}
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
				</Accordion.Item>
				{null}
				<Accordion.Item value="b">
					<Accordion.Trigger>Beta</Accordion.Trigger>
				</Accordion.Item>
				{null}
			</Accordion>,
		);
		const rows = screen.getAllByTestId("k-accordion-item", incl).map(flatStyle);
		expect(Number(rows[0].borderBottomWidth)).toBe(1);
		expect(rows[1].borderBottomWidth ?? 0).toBe(0);
	});

	it("toValues: '' and undefined normalize to empty; strings and arrays pass through", () => {
		expect(toValues("")).toEqual([]);
		expect(toValues(undefined)).toEqual([]);
		expect(toValues("a")).toEqual(["a"]);
		expect(toValues(["a", "b"])).toEqual(["a", "b"]);
	});

	it("controlled single value='' opens nothing while presses still report", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Accordion type="single" value="" onValueChange={onValueChange}>
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
					<Accordion.Content>alpha body</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		expect(screen.queryAllByTestId("k-accordion-content")).toHaveLength(0);
		await fireEvent.press(screen.getByTestId("k-accordion-trigger", incl));
		expect(onValueChange).toHaveBeenCalledWith("a");
		expect(screen.queryAllByTestId("k-accordion-content")).toHaveLength(0);
	});

	it("renders root, item, trigger and content markers when open; closed content unmounts", async () => {
		const screen = await render(
			<Accordion type="single" defaultValue="a">
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
					<Accordion.Content>alpha body</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		expect(screen.getByTestId("k-accordion")).toBeTruthy();
		expect(screen.getByTestId("k-accordion-item")).toBeTruthy();
		expect(screen.getByTestId("k-accordion-trigger", incl)).toBeTruthy();
		expect(screen.getByTestId("k-accordion-content")).toBeTruthy();
		expect(screen.getByText("alpha body")).toBeTruthy();

		await screen.rerender(
			<Accordion type="single" value="">
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
					<Accordion.Content>alpha body</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		expect(screen.queryByTestId("k-accordion-content")).toBeNull();
		expect(screen.queryByText("alpha body")).toBeNull();
		// only the content unmounts — item and trigger survive a close
		expect(screen.getByTestId("k-accordion-item")).toBeTruthy();
		expect(screen.getByTestId("k-accordion-trigger", incl)).toBeTruthy();
	});

	it("single mode opens one item, toggles it closed, and switches exclusivity", async () => {
		const onValueChange = jest.fn();
		const screen = await render(twoItems(onValueChange));
		const triggers = screen.getAllByTestId("k-accordion-trigger", incl);

		await fireEvent.press(triggers[0]);
		expect(onValueChange).toHaveBeenCalledWith("a");
		expect(screen.getByText("alpha body")).toBeTruthy();

		// pressing the open item closes it — the deselect arm
		onValueChange.mockClear();
		await fireEvent.press(triggers[0]);
		expect(onValueChange).toHaveBeenCalledWith("");
		expect(screen.queryByText("alpha body")).toBeNull();

		// a new item replaces the old one — exclusivity switch
		await fireEvent.press(triggers[1]);
		expect(onValueChange).toHaveBeenLastCalledWith("b");
		expect(screen.queryByText("alpha body")).toBeNull();
		expect(screen.getByText("beta body")).toBeTruthy();
	});

	it("multiple mode toggles items independently and reports arrays", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Accordion type="multiple" onValueChange={onValueChange}>
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
					<Accordion.Content>alpha body</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="b">
					<Accordion.Trigger>Beta</Accordion.Trigger>
					<Accordion.Content>beta body</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		const triggers = screen.getAllByTestId("k-accordion-trigger", incl);
		await fireEvent.press(triggers[0]);
		expect(onValueChange).toHaveBeenCalledWith(["a"]);
		await fireEvent.press(triggers[1]);
		expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);
		// removing keeps the remaining open values
		onValueChange.mockClear();
		await fireEvent.press(triggers[0]);
		expect(onValueChange).toHaveBeenCalledWith(["b"]);
		expect(screen.queryByText("alpha body")).toBeNull();
		expect(screen.getByText("beta body")).toBeTruthy();
	});

	it("controlled value wins until the parent updates it", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Accordion type="single" value="a" onValueChange={onValueChange}>
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
					<Accordion.Content>alpha body</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="b">
					<Accordion.Trigger>Beta</Accordion.Trigger>
					<Accordion.Content>beta body</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		expect(screen.getByText("alpha body")).toBeTruthy();
		await fireEvent.press(
			screen.getAllByTestId("k-accordion-trigger", incl)[1],
		);
		expect(onValueChange).toHaveBeenCalledWith("b");
		// controlled lock: state only moves when the parent re-renders
		expect(screen.getByText("alpha body")).toBeTruthy();
		expect(screen.queryByText("beta body")).toBeNull();

		await screen.rerender(
			<Accordion type="single" value="b" onValueChange={onValueChange}>
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
					<Accordion.Content>alpha body</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="b">
					<Accordion.Trigger>Beta</Accordion.Trigger>
					<Accordion.Content>beta body</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		expect(screen.queryByText("alpha body")).toBeNull();
		expect(screen.getByText("beta body")).toBeTruthy();
	});

	it("defaultValue seeds single and multiple state", async () => {
		const screen = await render(
			<Accordion type="single" defaultValue="b">
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
					<Accordion.Content>alpha body</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="b">
					<Accordion.Trigger>Beta</Accordion.Trigger>
					<Accordion.Content>beta body</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		expect(screen.getByText("beta body")).toBeTruthy();

		const multi = await render(
			<Accordion type="multiple" defaultValue={["a", "b"]}>
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
					<Accordion.Content>alpha body</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="b">
					<Accordion.Trigger>Beta</Accordion.Trigger>
					<Accordion.Content>beta body</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		expect(multi.getByText("alpha body")).toBeTruthy();
		expect(multi.getByText("beta body")).toBeTruthy();
	});

	it("a disabled item never fires and dims; a disabled group gates all items", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			twoItems(onValueChange, { firstDisabled: true }),
		);
		const triggers = screen.getAllByTestId("k-accordion-trigger", incl);
		expect(triggers[0].props.accessibilityState?.disabled).toBe(true);
		expect(Number(flatStyle(triggers[0]).opacity)).toBeLessThan(1);
		await fireEvent.press(triggers[0]);
		expect(onValueChange).not.toHaveBeenCalled();

		await screen.rerender(twoItems(onValueChange, { disabled: true }));
		const gated = screen.getAllByTestId("k-accordion-trigger", incl);
		expect(gated[1].props.accessibilityState?.disabled).toBe(true);
		await fireEvent.press(gated[1]);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("trigger announces role=button with expanded state", async () => {
		const screen = await render(
			<Accordion type="single" defaultValue="a">
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
					<Accordion.Content>alpha body</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		const trigger = screen.getByTestId("k-accordion-trigger", incl);
		expect(trigger.props.accessibilityRole).toBe("button");
		expect(trigger.props.accessibilityState?.expanded).toBe(true);
	});

	it("variant arms produce distinct item surfaces and open trigger tints", async () => {
		const itemSigs = new Set<string>();
		const tints = new Set<string>();
		const screen = await render(
			<Accordion type="single" variant="default" defaultValue="a">
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
					<Accordion.Content>alpha body</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		for (const variant of ["default", "bordered", "filled"] as const) {
			await screen.rerender(
				<Accordion type="single" variant={variant} defaultValue="a">
					<Accordion.Item value="a">
						<Accordion.Trigger>Alpha</Accordion.Trigger>
						<Accordion.Content>alpha body</Accordion.Content>
					</Accordion.Item>
				</Accordion>,
			);
			const item = flatStyle(screen.getByTestId("k-accordion-item"));
			const trigger = flatStyle(
				screen.getByTestId("k-accordion-trigger", incl),
			);
			itemSigs.add(
				JSON.stringify([
					item.borderBottomWidth,
					item.borderWidth,
					item.borderRadius,
				]),
			);
			tints.add(String(trigger.backgroundColor));
		}
		// default has no box, bordered/filled add one — and their OPEN tints
		// (none / accent / primary) separate all three arms
		expect(itemSigs.size).toBe(2);
		expect(tints.size).toBe(3);
	});

	it("chevron rotates 180deg when open", async () => {
		const screen = await render(
			<Accordion type="single">
				<Accordion.Item value="a">
					<Accordion.Trigger>Alpha</Accordion.Trigger>
					<Accordion.Content>alpha body</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		const rotation = () =>
			(
				flatStyle(
					screen.getByTestId("k-accordion-chevron", incl),
				) as unknown as {
					transform: Array<{ rotate: string }>;
				}
			).transform;
		expect(rotation()).toEqual([{ rotate: "0deg" }]);
		// no onValueChange: the uncontrolled arm still toggles
		await fireEvent.press(screen.getByTestId("k-accordion-trigger", incl));
		expect(rotation()).toEqual([{ rotate: "180deg" }]);
	});

	it("renders an empty root marker with zero items", async () => {
		const screen = await render(<Accordion type="single" />);
		expect(screen.getByTestId("k-accordion")).toBeTruthy();
		expect(screen.queryAllByTestId("k-accordion-item")).toEqual([]);
	});
});
