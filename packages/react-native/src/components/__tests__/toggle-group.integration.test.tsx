/**
 * Integration seam: pins the ToggleGroup API surface exactly as the native
 * playground demo consumes it (packages/react-native ↔ apps/native-playground).
 * If a rename or behavior change breaks the demo-facing contract — joined
 * strip look, single/multiple blocks, sizes, icons, disabled arms — this
 * fails before the playground does.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Bold, Italic, Underline } from "lucide-react-native";
import { themes } from "../../themes";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";

const flat = (node: { props: { style?: unknown } }) =>
	require("react-native").StyleSheet.flatten(node.props.style) as Record<
		string,
		number | string
	>;

const items = (screen: Awaited<ReturnType<typeof render>>) =>
	screen.getAllByTestId("k-toggle-group-item", {
		includeHiddenElements: true,
	} as const);

// Mirrors apps/native-playground/src/demos/components/toggle-group-demo.tsx.
describe("ToggleGroup ↔ playground demo contract", () => {
	it("single outline block: joined bordered strip, selection swaps", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<ToggleGroup
				type="single"
				variant="outline"
				value="left"
				onValueChange={onValueChange}
			>
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="center">Center</ToggleGroupItem>
				<ToggleGroupItem value="right">Right</ToggleGroupItem>
			</ToggleGroup>,
		);
		const track = flat(screen.getByTestId("k-toggle-group"));
		expect(Number(track.borderWidth)).toBe(1);
		expect(track.borderColor).toBe(themes.light.border);
		await fireEvent.press(items(screen)[1]);
		expect(onValueChange).toHaveBeenCalledWith("center");
	});

	it("multiple default block: muted track with accent fills and a disabled item", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<ToggleGroup
				type="multiple"
				defaultValue={["italic"]}
				onValueChange={onValueChange}
			>
				<ToggleGroupItem value="bold">bold</ToggleGroupItem>
				<ToggleGroupItem value="italic">italic</ToggleGroupItem>
				<ToggleGroupItem value="code" disabled>
					code
				</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(flat(screen.getByTestId("k-toggle-group")).backgroundColor).toBe(
			themes.light.muted,
		);
		expect(flat(items(screen)[1]).backgroundColor).toBe(themes.light.accent);
		await fireEvent.press(items(screen)[2]);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("sizes block: group-level sm/md/lg flow to item heights 36/40/44", async () => {
		const heights: number[] = [];
		for (const size of ["sm", "md", "lg"] as const) {
			const screen = await render(
				<ToggleGroup type="single" size={size}>
					<ToggleGroupItem value="a">A</ToggleGroupItem>
				</ToggleGroup>,
			);
			heights.push(Number(flat(items(screen)[0]).minHeight));
		}
		expect(heights).toEqual([36, 40, 44]);
	});

	it("icons block: lucide icon children render inside joined items", async () => {
		const screen = await render(
			<ToggleGroup type="multiple" variant="outline" defaultValue={["bold"]}>
				<ToggleGroupItem value="bold" accessibilityLabel="bold">
					<Bold size={16} color="#000" />
				</ToggleGroupItem>
				<ToggleGroupItem value="italic" accessibilityLabel="italic">
					<Italic size={16} color="#000" />
				</ToggleGroupItem>
				<ToggleGroupItem value="underline" accessibilityLabel="underline">
					<Underline size={16} color="#000" />
				</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(items(screen).length).toBe(3);
		expect(items(screen)[0].props.accessibilityState.checked).toBe(true);
	});

	it("disabled block: whole-group disabled gates every item", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<ToggleGroup type="single" defaultValue="a" disabled onValueChange={onValueChange}>
				<ToggleGroupItem value="a">A</ToggleGroupItem>
				<ToggleGroupItem value="b">B</ToggleGroupItem>
			</ToggleGroup>,
		);
		await fireEvent.press(items(screen)[1]);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(items(screen)[1].props.accessibilityState.disabled).toBe(true);
	});
});
