import { fireEvent, render } from "@testing-library/react-native";
import { Slider } from "../slider";
import { themes } from "../../themes";
import { THUMB_R } from "../slider/slider.styles";

const inclHidden = { includeHiddenElements: true } as const;

type Screen = Awaited<ReturnType<typeof render>>;

function flatStyle(node: {
	props: { style?: unknown };
}): Record<string, unknown> {
	return require("react-native").StyleSheet.flatten(node.props.style) ?? {};
}

const thumbAt = (screen: Screen, i: number) =>
	screen.getAllByTestId("k-slider-thumb", inclHidden)[i];

describe("Slider geometry", () => {
	it("single thumb: range spans track start to the thumb", async () => {
		const screen = await render(<Slider value={[40]} accessibilityLabel="v" />);
		const range = flatStyle(screen.getByTestId("k-slider-range", inclHidden));
		// single thumb: fill starts at the line's very start (−R in rail coords)
		expect(String(range.left)).toBe(String(-THUMB_R));
		expect(String(range.right)).toBe("60%");
		expect(thumbAt(screen, 0).props.accessibilityValue.now).toBe(40);
	});

	it("multi thumb: range spans first thumb to last thumb", async () => {
		const screen = await render(
			<Slider value={[20, 80]} accessibilityLabel="v" />,
		);
		const range = flatStyle(screen.getByTestId("k-slider-range", inclHidden));
		expect(String(range.left)).toBe("20%");
		expect(String(range.right)).toBe("20%");
		expect(range.width).toBeUndefined();
	});

	it("rail insets the thumb so value 0 and 100 stay inside the track edges", async () => {
		const rail = async (v: number[]) => {
			const s = await render(<Slider value={v} accessibilityLabel="v" />);
			return flatStyle(s.getByTestId("k-slider-rail", inclHidden));
		};
		expect((await rail([0])).left).toBe(THUMB_R);
		expect((await rail([100])).right).toBe(THUMB_R);
		const atMin = await render(<Slider value={[0]} accessibilityLabel="v" />);
		const minThumb = flatStyle(thumbAt(atMin, 0));
		expect(String(minThumb.left)).toBe("0%");
		// rail points are thumb centers — the box is pulled back half a thumb
		expect(minThumb.marginLeft).toBe(-THUMB_R);
		const atMax = await render(<Slider value={[100]} accessibilityLabel="v" />);
		expect(String(flatStyle(thumbAt(atMax, 0)).left)).toBe("100%");
	});

	it("equal thumbs stack deterministically: both render at the same spot, later on top", async () => {
		const screen = await render(
			<Slider value={[40, 40]} accessibilityLabel="v" />,
		);
		const thumbs = screen.getAllByTestId("k-slider-thumb", inclHidden);
		expect(thumbs).toHaveLength(2);
		expect(String(flatStyle(thumbs[0]).left)).toBe("40%");
		expect(String(flatStyle(thumbs[1]).left)).toBe("40%");
		expect(flatStyle(thumbs[1]).zIndex).toBe(1);
	});
});

describe("Slider disabled", () => {
	it("track fill uses the input token — visible on the light background", async () => {
		const screen = await render(<Slider value={[0]} accessibilityLabel="v" />);
		const track = flatStyle(screen.getByTestId("k-slider-track", inclHidden));
		expect(track.backgroundColor).toBe(themes.light.input);
	});

	it("disabled styles parts explicitly — no opacity fade, thumb never transparent", async () => {
		const screen = await render(
			<Slider value={[50]} accessibilityLabel="v" disabled />,
		);
		const root = flatStyle(screen.getByTestId("k-slider", inclHidden));
		expect(root.opacity).toBeUndefined();
		const range = flatStyle(screen.getByTestId("k-slider-range", inclHidden));
		expect(range.backgroundColor).toBe(themes.light.mutedForeground);
		const thumb = flatStyle(thumbAt(screen, 0));
		expect(thumb.backgroundColor).toBe(themes.light.background);
		expect(thumb.borderColor).toBe(themes.light.mutedForeground);
	});

	it("disabled ignores gestures and a11y adjustments", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Slider
				value={[50]}
				accessibilityLabel="v"
				disabled
				onValueChange={onValueChange}
			/>,
		);
		const track = screen.getByTestId("k-slider-track", inclHidden);
		expect(track.props.onStartShouldSetResponder()).toBe(false);
		track.props.onResponderGrant?.({
			nativeEvent: { locationX: 900 },
		});
		expect(onValueChange).not.toHaveBeenCalled();
	});
});

describe("Slider gestures", () => {
	it("grant maps x over the inset rail: start → min, end → max, mid → stepped mid", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Slider
				defaultValue={[50]}
				min={0}
				max={100}
				step={10}
				accessibilityLabel="v"
				onValueChange={onValueChange}
			/>,
		);
		const track = screen.getByTestId("k-slider-track", inclHidden);
		// layout the track: onLayout feeds the width ref the gesture math uses
		track.props.onLayout({ nativeEvent: { layout: { width: 400 } } });
		const grant = (x: number) =>
			track.props.onResponderGrant({ nativeEvent: { locationX: x } });
		grant(THUMB_R);
		expect(onValueChange).toHaveBeenLastCalledWith([0]);
		grant(400 - THUMB_R);
		expect(onValueChange).toHaveBeenLastCalledWith([100]);
		grant(THUMB_R + 180);
		expect(onValueChange).toHaveBeenLastCalledWith([50]);
	});

	it("move clamps to the neighbor thumb value", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Slider
				defaultValue={[20, 80]}
				accessibilityLabel="v"
				onValueChange={onValueChange}
			/>,
		);
		const track = screen.getByTestId("k-slider-track", inclHidden);
		track.props.onLayout({ nativeEvent: { layout: { width: 400 } } });
		// grant near thumb 0 (x=80 → 20), then drag far past thumb 1
		track.props.onResponderGrant({ nativeEvent: { locationX: 80 } });
		track.props.onResponderMove({ nativeEvent: { locationX: 395 } });
		const last = onValueChange.mock.calls.at(-1)?.[0] as number[];
		expect(last[0]).toBe(80);
	});
});
