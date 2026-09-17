import { fireEvent, render } from "@testing-library/react-native";
import { Toggle } from "../toggle";
import { themes } from "../../themes";

const inclHidden = { includeHiddenElements: true } as const;

type Screen = Awaited<ReturnType<typeof render>>;
type ToggleSizeArg = "sm" | "md" | "lg";

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

describe("Toggle", () => {
	it("size tiers map to distinct visual heights with hitSlop restoring the 44dp touch floor", async () => {
		const cases: [ToggleSizeArg, number, number][] = [
			["sm", 36, 4],
			["md", 40, 2],
			["lg", 44, 0],
		];
		for (const [size, height, hit] of cases) {
			const screen: Screen = await render(
				<Toggle accessibilityLabel={`${size} toggle`} size={size}>
					Pin
				</Toggle>,
			);
			const style = flatStyle(screen.getByTestId("k-toggle"));
			expect(style.minHeight).toBe(height);
			expect(style.height).toBeUndefined();
			const hitSlop = style.hitSlop as { top?: number } | undefined;
			expect(hitSlop ? hitSlop.top : 0).toBe(hit);
		}
	});

	it("press toggles the uncontrolled arm; controlled pressed wins", async () => {
		const onP1 = jest.fn();
		const free: Screen = await render(
			<Toggle accessibilityLabel="free" onPressedChange={onP1}>
				Pin
			</Toggle>,
		);
		await fireEvent.press(free.getByTestId("k-toggle"));
		expect(onP1).toHaveBeenLastCalledWith(true);

		const onP2 = jest.fn();
		const locked: Screen = await render(
			<Toggle
				accessibilityLabel="controlled"
				pressed={false}
				onPressedChange={onP2}
			>
				Pin
			</Toggle>,
		);
		await fireEvent.press(locked.getByTestId("k-toggle"));
		expect(onP2).toHaveBeenLastCalledWith(true);
		expect(
			locked.getByTestId("k-toggle").props.accessibilityState.checked,
		).toBe(false);
	});

	it("disabled press is inert and the surface stays visible at 50% opacity", async () => {
		const onP = jest.fn();
		const screen: Screen = await render(
			<Toggle accessibilityLabel="locked" disabled onPressedChange={onP}>
				Locked
			</Toggle>,
		);
		const root = screen.getByTestId("k-toggle");
		await fireEvent.press(root);
		expect(onP).not.toHaveBeenCalled();
		const style = flatStyle(root);
		expect(style.opacity).toBe(0.5);
	});

	it("locked+unchecked shows the Lock glyph — a check would read as pressed", async () => {
		const screen: Screen = await render(
			<Toggle accessibilityLabel="locked" disabled>
				Locked
			</Toggle>,
		);
		expect(
			screen.getByTestId("k-toggle-glyph-lock", inclHidden),
		).toBeTruthy();
		expect(screen.queryByTestId("k-toggle-glyph-check")).toBeNull();
		const state = screen.getByTestId("k-toggle").props.accessibilityState;
		expect(state.disabled).toBe(true);
		expect(state.checked).toBe(false);
	});

	it("locked+checked shows the disabled Check glyph", async () => {
		const screen: Screen = await render(
			<Toggle accessibilityLabel="locked on" disabled pressed>
				Locked
			</Toggle>,
		);
		expect(
			screen.getByTestId("k-toggle-glyph-check", inclHidden),
		).toBeTruthy();
		expect(screen.queryByTestId("k-toggle-glyph-lock")).toBeNull();
		expect(
			screen.getByTestId("k-toggle").props.accessibilityState.checked,
		).toBe(true);
	});

	it("active look: accent fill + accentForeground text; outline adds a border", async () => {
		const on: Screen = await render(
			<Toggle accessibilityLabel="on" pressed onPressedChange={() => undefined}>
				Pin
			</Toggle>,
		);
		const onStyle = flatStyle(on.getByTestId("k-toggle"));
		expect(onStyle.backgroundColor).toBe(themes.light.accent);
		const outline: Screen = await render(
			<Toggle
				accessibilityLabel="outline"
				variant="outline"
				onPressedChange={() => undefined}
			>
				Outline
			</Toggle>,
		);
		const outlineStyle = flatStyle(outline.getByTestId("k-toggle"));
		expect(outlineStyle.borderWidth).toBe(1);
		expect(outlineStyle.backgroundColor).toBe("transparent");
	});
});
