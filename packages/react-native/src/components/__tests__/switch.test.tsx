import { fireEvent, render } from "@testing-library/react-native";
import { Switch } from "../switch";
import { themes } from "../../themes";

const inclHidden = { includeHiddenElements: true } as const;

type Screen = Awaited<ReturnType<typeof render>>;

function flatStyle(node: {
	props: { style?: unknown };
}): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	const walk = (entry: unknown): void => {
		if (Array.isArray(entry)) {
			for (const e of entry) walk(e);
		} else if (entry) {
			Object.assign(out, entry);
		}
	};
	walk(node.props.style ?? []);
	return out;
}

describe("Switch", () => {
	it("renders markers; label text only when the label prop is set", async () => {
		const bare: Screen = await render(<Switch accessibilityLabel="s" />);
		expect(bare.getByTestId("k-switch")).toBeTruthy();
		expect(bare.getByTestId("k-switch-track")).toBeTruthy();
		expect(bare.queryByText("Sync")).toBeNull();

		const labeled: Screen = await render(<Switch label="Sync" />);
		expect(labeled.getByText("Sync")).toBeTruthy();
	});

	it("explicit accessibilityLabel wins over the label fallback", async () => {
		const screen: Screen = await render(
			<Switch label="Sync" accessibilityLabel="custom sync" />,
		);
		expect(screen.getByTestId("k-switch").props.accessibilityLabel).toBe(
			"custom sync",
		);
		const fallback: Screen = await render(<Switch label="Sync only" />);
		expect(fallback.getByTestId("k-switch").props.accessibilityLabel).toBe(
			"Sync only",
		);
	});

	it("role stays switch and accessibilityState follows value", async () => {
		const off: Screen = await render(<Switch accessibilityLabel="s" />);
		const root = off.getByTestId("k-switch");
		expect(root.props.accessibilityRole).toBe("switch");
		expect(root.props.accessibilityState.checked).toBe(false);
		const on: Screen = await render(<Switch value accessibilityLabel="s" />);
		expect(on.getByTestId("k-switch").props.accessibilityState.checked).toBe(
			true,
		);
	});

	it("pressing the label toggles the row-wide press target", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Switch label="Sync" onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getByText("Sync"));
		expect(onValueChange).toHaveBeenCalledWith(true);
		await fireEvent.press(screen.getByTestId("k-switch-track"));
		expect(onValueChange).toHaveBeenCalledTimes(2);
	});

	it("disabled press is a no-op", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Switch label="Sync" disabled onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getByText("Sync"));
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("unchecked pair maps thumb→mutedForeground, track→input; mutedForeground contrasts input in every theme", async () => {
		// harness renders the light palette; the token mapping is the contract
		const off = await render(<Switch accessibilityLabel="s" />);
		const offThumb = flatStyle(off.getByTestId("k-switch-thumb"));
		const offTrack = flatStyle(off.getByTestId("k-switch-track"));
		expect(offThumb.backgroundColor).toBe(themes.light.mutedForeground);
		expect(offTrack.backgroundColor).toBe(themes.light.input);
		const on = await render(<Switch value accessibilityLabel="s" />);
		expect(flatStyle(on.getByTestId("k-switch-thumb")).backgroundColor).toBe(
			themes.light.card,
		);
		expect(flatStyle(on.getByTestId("k-switch-track")).backgroundColor).toBe(
			themes.light.primary,
		);
		// dark-visibility invariant: the off circle stays visible wherever the
		// switch renders — mutedForeground must differ from the input track
		for (const [name, theme] of Object.entries(themes)) {
			expect(theme.mutedForeground).not.toBe(theme.input);
			expect(theme.mutedForeground).not.toBe(theme.background);
		}
	});

	it("long label wraps while the track keeps its size inside the 44dp row", async () => {
		const screen: Screen = await render(
			<Switch
				label="Enable automatic seat reconciliation across every workspace"
			/>,
		);
		const row = flatStyle(screen.getByTestId("k-switch"));
		const track = flatStyle(screen.getByTestId("k-switch-track"));
		expect(row.flexDirection).toBe("row");
		expect(row.minHeight).toBe(44);
		expect(track.width).toBe(40);
		expect(track.height).toBe(24);
		const label = flatStyle(screen.getByText(/reconciliation/));
		expect(label.flex).toBe(1);
	});

	it("thumb pins to the track start: column layout keeps alignItems on the cross axis, offset purely from translateX", async () => {
		const screen: Screen = await render(<Switch accessibilityLabel="s" />);
		const track = flatStyle(screen.getByTestId("k-switch-track"));
		// flexDirection row would move alignItems onto the vertical axis and let
		// justifyContent center the thumb mid-track; column keeps flex-start on
		// the horizontal axis so translateX owns the full travel
		expect(track.flexDirection).toBeUndefined();
		expect(track.alignItems).toBe("flex-start");
		const thumb = flatStyle(screen.getByTestId("k-switch-thumb"));
		expect(thumb.transform).toEqual([{ translateX: 0 }]);
		const on = await render(<Switch value accessibilityLabel="s" />);
		expect(flatStyle(on.getByTestId("k-switch-thumb")).transform).toEqual([
			{ translateX: 16 },
		]);
	});
});
