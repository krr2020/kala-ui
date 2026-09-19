/**
 * SegmentedControl behavior contract: sizes must render their token heights
 * (the 44dp touch floor is hitSlop's job, not a visual clamp), the sliding
 * indicator lives inside the checked segment only, and the controlled value
 * never silently falls back to the first item.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { SegmentedControl } from "../segmented-control";
import type {
	SegmentedControlSize,
} from "../segmented-control/segmented-control.types";

const DATA = ["a", "b", "c"];

const flat = (node: { props: { style?: unknown } }) =>
	StyleSheet.flatten(node.props.style) as Record<string, number>;

const segmentHeights = async (size: SegmentedControlSize) => {
	const screen = await render(
		<SegmentedControl data={DATA} size={size} testID="k-segmented" />,
	);
	return screen.getAllByTestId("k-segment").map((s) => flat(s).height);
};

describe("SegmentedControl", () => {
	it("default: first item selected, indicator inside its segment only", async () => {
		const screen = await render(<SegmentedControl data={DATA} />);
		const radios = screen.getAllByRole("radio");
		expect(radios.map((r) => r.props.accessibilityState.checked)).toEqual([
			true,
			false,
			false,
		]);
		const indicators = screen.getAllByTestId("k-segment-indicator");
		expect(indicators).toHaveLength(1);
	});

	it("controlled: value wins over presses; onValueChange still reports", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<SegmentedControl data={DATA} value="a" onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getAllByTestId("k-segment")[1]);
		expect(onValueChange).toHaveBeenCalledWith("b");
		expect(
			screen.getAllByRole("radio")[0].props.accessibilityState.checked,
		).toBe(true);
	});

	it("controlled mismatch: value matching no item activates nothing", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<SegmentedControl data={DATA} value="z" onValueChange={onValueChange} />,
		);
		expect(
			screen
				.getAllByRole("radio")
				.some((r) => r.props.accessibilityState.checked),
		).toBe(false);
		expect(screen.queryAllByTestId("k-segment-indicator")).toHaveLength(0);
		await fireEvent.press(screen.getAllByTestId("k-segment")[2]);
		expect(onValueChange).toHaveBeenCalledWith("c");
		expect(screen.queryAllByTestId("k-segment-indicator")).toHaveLength(0);
	});

	it("uncontrolled: press switches the active segment", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<SegmentedControl data={DATA} onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getAllByTestId("k-segment")[2]);
		expect(onValueChange).toHaveBeenCalledWith("c");
		expect(
			screen.getAllByRole("radio")[2].props.accessibilityState.checked,
		).toBe(true);
	});

	it("sizes: token heights render exactly; sub-44 sizes stay below the touch floor", async () => {
		const expected: Record<SegmentedControlSize, number> = {
			xs: 32,
			sm: 36,
			md: 40,
			lg: 48,
			xl: 56,
		};
		for (const size of Object.keys(expected) as SegmentedControlSize[]) {
			const heights = await segmentHeights(size);
			expect(heights).toEqual(
				Array.from({ length: DATA.length }, () => expected[size]),
			);
			if (expected[size] < 44) {
				expect(heights[0]).toBeLessThan(44);
			}
		}
	});

	it("sizes: hitSlop tops up sub-44 segments vertically only", async () => {
		const hitSlopFor = async (size: SegmentedControlSize) => {
			const screen = await render(<SegmentedControl data={DATA} size={size} />);
			return screen.getAllByTestId("k-segment")[0].props.hitSlop;
		};
		expect(await hitSlopFor("xs")).toEqual({
			top: 6,
			bottom: 6,
			left: 0,
			right: 0,
		});
		expect(await hitSlopFor("sm")).toEqual({
			top: 4,
			bottom: 4,
			left: 0,
			right: 0,
		});
		expect(await hitSlopFor("md")).toEqual({
			top: 2,
			bottom: 2,
			left: 0,
			right: 0,
		});
		expect(await hitSlopFor("lg")).toEqual({
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		});
		expect(await hitSlopFor("xl")).toEqual({
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		});
	});

	it("radius: track/segment use the token; indicator insets by track padding", async () => {
		const screen = await render(
			<SegmentedControl data={DATA} radius="md" />,
		);
		expect(flat(screen.getByTestId("k-segmented")).borderRadius).toBe(8);
		expect(flat(screen.getAllByTestId("k-segment")[0]).borderRadius).toBe(8);
		expect(
			flat(screen.getByTestId("k-segment-indicator")).borderRadius,
		).toBe(4);
		const pill = await render(
			<SegmentedControl data={DATA} radius="full" />,
		);
		expect(flat(pill.getByTestId("k-segment-indicator")).borderRadius).toBe(
			999,
		);
	});

	it("fullWidth: segments flex 1; otherwise flex is unset", async () => {
		const wide = await render(
			<SegmentedControl data={DATA} fullWidth />,
		);
		expect(flat(wide.getAllByTestId("k-segment")[0]).flex).toBe(1);
		const snug = await render(<SegmentedControl data={DATA} />);
		expect(flat(snug.getAllByTestId("k-segment")[0]).flex).toBeUndefined();
	});

	it("disabled: whole control dims and disables every segment", async () => {
		const screen = await render(<SegmentedControl data={DATA} disabled />);
		expect(flat(screen.getByTestId("k-segmented")).opacity).toBe(0.6);
		expect(
			screen
				.getAllByRole("radio")
				.every((r) => r.props.accessibilityState.disabled),
		).toBe(true);
	});

	it("item.disabled blocks only that segment's press", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<SegmentedControl
				data={[
					{ value: "on", label: "On" },
					{ value: "hold", label: "Hold", disabled: true },
					{ value: "off", label: "Off" },
				]}
				onValueChange={onValueChange}
			/>,
		);
		const radios = screen.getAllByRole("radio");
		expect(radios.map((r) => r.props.accessibilityState.disabled)).toEqual([
			false,
			true,
			false,
		]);
		await fireEvent.press(screen.getAllByTestId("k-segment")[1]);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("empty data renders an empty track without crashing", async () => {
		const screen = await render(<SegmentedControl data={[]} />);
		expect(screen.queryAllByTestId("k-segment")).toHaveLength(0);
		expect(screen.getByTestId("k-segmented")).toBeTruthy();
	});

	it("string data resolves to value+label; single item renders", async () => {
		const screen = await render(<SegmentedControl data={["solo"]} />);
		expect(screen.getByRole("radio", { name: "solo" })).toBeTruthy();
		expect(screen.getAllByTestId("k-segment")).toHaveLength(1);
	});

	it("slotStyles override root, segment and indicator surfaces", async () => {
		const screen = await render(
			<SegmentedControl
				data={DATA}
				slotStyles={{
					root: { backgroundColor: "#123456" },
					segment: { minWidth: 120 },
					indicator: { backgroundColor: "#654321" },
				}}
			/>,
		);
		expect(flat(screen.getByTestId("k-segmented")).backgroundColor).toBe(
			"#123456",
		);
		expect(flat(screen.getAllByTestId("k-segment")[0]).minWidth).toBe(120);
		expect(
			flat(screen.getByTestId("k-segment-indicator")).backgroundColor,
		).toBe("#654321");
	});
});
