/**
 * Integration seam: pins the SegmentedControl API surface exactly as the
 * native playground demo consumes it (packages/react-native ↔
 * apps/native-playground). If a rename or behavior change breaks the
 * demo-facing contract — size progression, controlled lock, disabled arms —
 * this fails before the playground does.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { SegmentedControl } from "../segmented-control";
import type { SegmentedControlSize } from "../segmented-control/segmented-control.types";

const flat = (node: { props: { style?: unknown } }) =>
	StyleSheet.flatten(node.props.style) as Record<string, number>;

// Mirrors apps/native-playground/src/demos/components/segmented-control-demo.tsx.
describe("SegmentedControl ↔ playground demo contract", () => {
	it("size rows: xs..xl heights grow monotonically and stay unclamped", async () => {
		const heights: number[] = [];
		for (const size of ["xs", "sm", "md", "lg", "xl"] as SegmentedControlSize[]) {
			const screen = await render(
				<SegmentedControl
					data={["day", "week", "month"]}
					size={size}
					value="day"
					onValueChange={() => undefined}
					accessibilityLabel={`size ${size}`}
				/>,
			);
			heights.push(flat(screen.getAllByTestId("k-segment")[0]).height);
		}
		expect(heights).toEqual([32, 36, 40, 48, 56]);
	});

	it("range block: controlled value + onValueChange report", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<SegmentedControl
				data={["day", "week", "month"]}
				value="week"
				onValueChange={onValueChange}
				accessibilityLabel="range"
			/>,
		);
		await fireEvent.press(screen.getAllByTestId("k-segment")[2]);
		expect(onValueChange).toHaveBeenCalledWith("month");
		expect(
			screen.getAllByRole("radio")[1].props.accessibilityState.checked,
		).toBe(true);
	});

	it("pill block: full radius + fullWidth segments share the track", async () => {
		const screen = await render(
			<SegmentedControl
				data={["compact", "cozy", "roomy"]}
				radius="full"
				fullWidth
				value="compact"
				onValueChange={() => undefined}
				accessibilityLabel="density"
			/>,
		);
		expect(flat(screen.getByTestId("k-segmented")).borderRadius).toBe(999);
		expect(
			screen.getAllByTestId("k-segment").every((s) => flat(s).flex === 1),
		).toBe(true);
	});

	it("disabled block: whole-control disabled + item-level disabled coexist", async () => {
		const onValueChange = jest.fn();
		const all = await render(
			<SegmentedControl
				data={["on", "hold", "off"]}
				value="hold"
				disabled
				accessibilityLabel="state all"
			/>,
		);
		expect(flat(all.getByTestId("k-segmented")).opacity).toBe(0.6);
		const unit = await render(
			<SegmentedControl
				data={[
					{ value: "metric", label: "Metric" },
					{ value: "imperial", label: "Imperial", disabled: true },
				]}
				value="metric"
				onValueChange={onValueChange}
				accessibilityLabel="unit"
			/>,
		);
		await fireEvent.press(unit.getAllByTestId("k-segment")[1]);
		expect(onValueChange).not.toHaveBeenCalled();
	});
});
