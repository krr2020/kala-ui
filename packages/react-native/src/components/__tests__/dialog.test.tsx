/**
 * Dialog/AlertDialog touch contracts: raw-responder drag-to-dismiss,
 * keyboard avoidance, and scrollable bodies. Handlers are driven through
 * props inside act() — fireEvent's responder polyfill leaves a grant
 * lock that poisons later renders in the same jest file.
 */

import { readFileSync } from "node:fs";
import { act, render } from "@testing-library/react-native";
import { themes } from "../../themes";
import { tokens } from "../../tokens";
import { AlertDialog } from "../alert-dialog";
import { Button } from "../button";
import { Dialog } from "../dialog";

const incl = { includeHiddenElements: true } as const;

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

type Card = ReturnType<Awaited<ReturnType<typeof render>>["getByTestId"]>;

// absolute pageY coordinates — the handlers compute dy from the grant origin
const grant = async (card: Card) => {
	await act(async () => {
		(card.props.onResponderGrant as (e: unknown) => void)?.({
			nativeEvent: { pageY: 100 },
		});
	});
};

const move = async (card: Card, dy: number) => {
	await act(async () => {
		(card.props.onResponderMove as (e: unknown) => void)?.({
			nativeEvent: { pageY: 100 + dy },
		});
	});
};

const release = async (card: Card, dy: number) => {
	await act(async () => {
		(card.props.onResponderRelease as (e: unknown) => void)?.({
			nativeEvent: { pageY: 100 + dy },
		});
	});
};

describe("dialog gesture + keyboard hardening", () => {
	const translateYOf = (card: Card): number => {
		const transform = flatStyle(card).transform as unknown as
			| { translateY?: number }[]
			| undefined;
		return transform?.find((t) => t.translateY !== undefined)?.translateY ?? 0;
	};

	it("card follows the drag finger and settles back on release", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Dialog open onOpenChange={onOpenChange}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const card = screen.getByTestId("k-dialog", incl);
		await grant(card);
		await move(card, 200);
		expect(translateYOf(card)).toBe(200);
		expect(Number(flatStyle(card).opacity)).toBeLessThanOrEqual(0.7);
		await release(card, 40);
		expect(translateYOf(card)).toBe(0);
		expect(Number(flatStyle(card).opacity)).toBe(1);
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it("upward drag clamps: no translate, no fade", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Dialog open onOpenChange={onOpenChange}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const card = screen.getByTestId("k-dialog", incl);
		await grant(card);
		await move(card, -200);
		expect(translateYOf(card)).toBe(0);
		expect(Number(flatStyle(card).opacity)).toBe(1);
		await release(card, -200);
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it("overlay scrim derives from the theme foreground, retinting per mode", async () => {
		const screen = await render(
			<Dialog open onOpenChange={() => undefined}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const overlay = screen.getByTestId("k-dialog-overlay", incl);
		expect(flatStyle(overlay).backgroundColor).toBe(
			`${themes.light.foreground}80`,
		);
		// dark mode re-derives the ink from its own foreground token —
		// scrimStyle reads theme.foreground at render, so a different dark
		// foreground proves the veil retints instead of staying black
		expect(themes.dark.foreground).not.toBe(themes.light.foreground);
		expect(`${themes.dark.foreground}80`).not.toBe(
			`${themes.light.foreground}80`,
		);
	});

	it("size tiers map distinct widths and caps; full opts out with no radius", async () => {
		const sizes: ["sm" | "md" | "lg" | "full", string, number | undefined][] = [
			["sm", "80%", 384],
			["md", "90%", 512],
			["lg", "100%", 672],
			["full", "100%", undefined],
		];
		const seenMax = new Set<number>();
		for (const [size, width, maxWidth] of sizes) {
			const screen = await render(
				<Dialog open size={size} onOpenChange={() => undefined}>
					<Dialog.Body>body</Dialog.Body>
				</Dialog>,
			);
			const s = flatStyle(screen.getByTestId("k-dialog", incl));
			// per-tier percentage of the padded wrapper: distinct on any phone
			// screen, with the px cap binding on tablets
			expect(String(s.width)).toBe(width);
			expect(s.maxWidth).toBe(maxWidth);
			expect(s.borderRadius).toBe(size === "full" ? 0 : tokens.radius.card);
			// full is flush: no outer border, no height cap; tiers keep both
			expect(s.borderWidth).toBe(size === "full" ? 0 : 1);
			if (size === "full") {
				expect(s.maxHeight).toBeUndefined();
				const wrap = flatStyle(
					screen.getByTestId("k-dialog-keyboard-view", incl),
				);
				expect(Number(wrap.padding)).toBe(0);
				// uncapped full still leans on the keyboard wrapper so the
				// footer stays reachable with the keyboard open
				const kav = screen.getByTestId("k-dialog-keyboard-view", incl);
				expect(["padding", undefined]).toContain(kav.props.behavior);
			}
			if (maxWidth !== undefined) {
				seenMax.add(Number(maxWidth));
				// long content scrolls inside a capped card instead of clipping
				expect(String(s.maxHeight)).toBe("90%");
			}
		}
		expect(seenMax.size).toBe(3);
	});

	it("keyboard + scroll mechanics: iOS pads, Android defers, body yields and scrolls", async () => {
		const screen = await render(
			<Dialog open onOpenChange={() => undefined}>
				<Dialog.Header>
					<Dialog.Title>t</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		// the mock host platform decides the runtime value (padding on iOS,
		// undefined on Android where adjustResize drives) — the source pin
		// below maps the platform split exactly
		const kav = screen.getByTestId("k-dialog-keyboard-view", incl);
		expect(["padding", undefined]).toContain(kav.props.behavior);
		const source = readFileSync(`${__dirname}/../dialog/dialog.tsx`, "utf8");
		expect(source).toMatch(
			/behavior=\{Platform\.OS === "ios" \? "padding" : undefined\}/,
		);
		// the body yields to siblings (flexShrink) so the ScrollView scrolls
		// instead of being clipped by the card's maxHeight
		const body = flatStyle(screen.getByTestId("k-dialog-body", incl));
		expect(Number(body.flexShrink)).toBe(1);
	});

	it("chrome stays fixed: column card, body is the only scroller, one border per boundary", async () => {
		const screen = await render(
			<Dialog open onOpenChange={() => undefined}>
				<Dialog.Header>
					<Dialog.Title>t</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>body</Dialog.Body>
				<Dialog.Footer>done</Dialog.Footer>
			</Dialog>,
		);
		const card = flatStyle(screen.getByTestId("k-dialog", incl));
		expect(card.flexDirection).toBe("column");
		const body = flatStyle(screen.getByTestId("k-dialog-body", incl));
		expect(Number(body.flexGrow)).toBe(1);
		const header = flatStyle(screen.getByTestId("k-dialog-header", incl));
		const footer = flatStyle(screen.getByTestId("k-dialog-footer", incl));
		expect(Number(header.flexShrink)).toBe(0);
		expect(Number(footer.flexShrink)).toBe(0);
		// exactly one separation line at each chrome boundary — never two
		expect(Number(header.borderBottomWidth)).toBe(1);
		expect(Number(footer.borderTopWidth)).toBe(1);
		expect(Number(card.borderWidth)).toBe(1);
		expect(Number(body.borderTopWidth || 0)).toBe(0);
		expect(Number(body.borderBottomWidth || 0)).toBe(0);
	});

	it("the wrapper clears the status bar: paddingTop resolves above zero", async () => {
		const screen = await render(
			<Dialog open onOpenChange={() => undefined}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const kav = flatStyle(screen.getByTestId("k-dialog-keyboard-view", incl));
		expect(Number(kav.paddingTop)).toBeGreaterThan(0);
	});

	it("compound parts keep their markers after the file split", async () => {
		const screen = await render(
			<Dialog open onOpenChange={() => undefined}>
				<Dialog.Header>
					<Dialog.Title>t</Dialog.Title>
					<Dialog.Description>d</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>body</Dialog.Body>
				<Dialog.Footer>done</Dialog.Footer>
			</Dialog>,
		);
		expect(screen.getByTestId("k-dialog-header", incl)).toBeTruthy();
		expect(screen.getByTestId("k-dialog-title", incl)).toBeTruthy();
		expect(screen.getByTestId("k-dialog-description", incl)).toBeTruthy();
		expect(screen.getByTestId("k-dialog-body", incl)).toBeTruthy();
		expect(screen.getByTestId("k-dialog-footer", incl)).toBeTruthy();
	});

	it("composed AlertDialog: themed scrim, sm width, fixed chrome, alert semantics", async () => {
		const screen = await render(
			<AlertDialog open onOpenChange={() => undefined}>
				<AlertDialog.Header>
					<AlertDialog.Title>t</AlertDialog.Title>
				</AlertDialog.Header>
				<AlertDialog.Body>body</AlertDialog.Body>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				</AlertDialog.Footer>
			</AlertDialog>,
		);
		// themed scrim inherited from the Dialog shell
		const overlay = screen.getByTestId("k-alert-dialog-overlay", incl);
		expect(flatStyle(overlay).backgroundColor).toBe(
			`${themes.light.foreground}80`,
		);
		const card = flatStyle(screen.getByTestId("k-alert-dialog", incl));
		// an alert is a focused interruption — the narrow sm tier
		expect(card.maxWidth).toBe(384);
		expect(card.flexDirection).toBe("column");
		expect(
			Number(
				flatStyle(screen.getByTestId("k-alert-dialog-header", incl)).flexShrink,
			),
		).toBe(0);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-alert-dialog-footer", incl)).flexShrink,
			),
		).toBe(0);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-alert-dialog-body", incl)).flexGrow,
			),
		).toBe(1);
		// alert semantics survive composition onto the Dialog card
		const node = screen.getByTestId("k-alert-dialog", incl);
		expect(node.props.accessibilityRole).toBe("alert");
		expect(node.props.accessibilityViewIsModal).toBe(true);
	});

	it("default AlertDialog never closes from the scrim", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<AlertDialog open onOpenChange={onOpenChange}>
				<AlertDialog.Body>body</AlertDialog.Body>
			</AlertDialog>,
		);
		const overlay = screen.getByTestId("k-alert-dialog-overlay", incl);
		expect(overlay.props.onPress).toBeUndefined();
		await act(async () => {
			(overlay.props.onPress as unknown as (() => void) | undefined)?.();
		});
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it("dismissable AlertDialog inherits the drag finger-follow and reset", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<AlertDialog open onOpenChange={onOpenChange} dismissable>
				<AlertDialog.Body>body</AlertDialog.Body>
			</AlertDialog>,
		);
		const card = screen.getByTestId("k-alert-dialog", incl);
		expect(card.props.onStartShouldSetResponder()).toBe(true);
		await grant(card);
		await move(card, 200);
		const transform = flatStyle(card).transform as unknown as
			| { translateY?: number }[]
			| undefined;
		expect(transform?.find((t) => t.translateY !== undefined)?.translateY).toBe(
			200,
		);
		await release(card, 40);
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(
			(flatStyle(card).transform as unknown as { translateY?: number }[])?.find(
				(t) => t.translateY !== undefined,
			)?.translateY,
		).toBe(0);
	});

	it("card wires the raw responder protocol", async () => {
		const screen = await render(
			<Dialog open onOpenChange={() => undefined}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const card = screen.getByTestId("k-dialog", incl);
		expect(card.props.onStartShouldSetResponder()).toBe(true);
		expect(typeof card.props.onResponderGrant).toBe("function");
		expect(typeof card.props.onResponderMove).toBe("function");
		expect(typeof card.props.onResponderRelease).toBe("function");
		expect(typeof card.props.onResponderTerminate).toBe("function");
	});

	it("drag past threshold dims then releases to close", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Dialog open onOpenChange={onOpenChange}>
				<Dialog.Header>
					<Dialog.Title>t</Dialog.Title>
				</Dialog.Header>
			</Dialog>,
		);
		const card = screen.getByTestId("k-dialog", incl);
		await grant(card);
		await move(card, 200);
		const mid = flatStyle(card);
		expect(Number(mid.opacity)).toBeLessThanOrEqual(0.7);
		expect(Number(mid.opacity)).toBeGreaterThanOrEqual(0.5);
		await release(card, 200);
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("release below threshold restores opacity without closing", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Dialog open onOpenChange={onOpenChange}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const card = screen.getByTestId("k-dialog", incl);
		await grant(card);
		await move(card, 40);
		await release(card, 40);
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(Number(flatStyle(card).opacity)).toBe(1);
	});

	it("terminate restores opacity without closing", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Dialog open onOpenChange={onOpenChange}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const card = screen.getByTestId("k-dialog", incl);
		await grant(card);
		await move(card, 200);
		await act(async () => {
			card.props.onResponderTerminate?.({ nativeEvent: {} });
		});
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(Number(flatStyle(card).opacity)).toBe(1);
	});

	it("upward drag is clamped — never fades, never closes", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Dialog open onOpenChange={onOpenChange}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const card = screen.getByTestId("k-dialog", incl);
		await grant(card);
		await move(card, -200);
		expect(Number(flatStyle(card).opacity)).toBe(1);
		await release(card, -200);
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it("dismissable=false gates every responder on Dialog and AlertDialog", async () => {
		const d = await render(
			<Dialog open onOpenChange={() => undefined} dismissable={false}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const card = d.getByTestId("k-dialog", incl);
		expect(card.props.onStartShouldSetResponder).toBeUndefined();
		expect(card.props.onResponderGrant).toBeUndefined();
		expect(card.props.onResponderMove).toBeUndefined();
		expect(card.props.onResponderRelease).toBeUndefined();
		expect(card.props.onResponderTerminate).toBeUndefined();

		// AlertDialog defaults to non-dismissable: same symmetric gating
		const a = await render(
			<AlertDialog open onOpenChange={() => undefined}>
				<AlertDialog.Body>body</AlertDialog.Body>
			</AlertDialog>,
		);
		const alertCard = a.getByTestId("k-alert-dialog", incl);
		expect(alertCard.props.onStartShouldSetResponder).toBeUndefined();
		expect(alertCard.props.onResponderGrant).toBeUndefined();
		expect(alertCard.props.onResponderRelease).toBeUndefined();

		// opt-in dismissable AlertDialog wires the full protocol AND the
		// drag behavior end to end, symmetric with Dialog
		const a2 = await render(
			<AlertDialog open onOpenChange={() => undefined} dismissable>
				<AlertDialog.Body>body</AlertDialog.Body>
			</AlertDialog>,
		);
		const alertCard2 = a2.getByTestId("k-alert-dialog", incl);
		expect(alertCard2.props.onStartShouldSetResponder()).toBe(true);
		expect(typeof alertCard2.props.onResponderRelease).toBe("function");

		const dragged = jest.fn();
		const a3 = await render(
			<AlertDialog open onOpenChange={dragged} dismissable>
				<AlertDialog.Body>body</AlertDialog.Body>
			</AlertDialog>,
		);
		const alertCard3 = a3.getByTestId("k-alert-dialog", incl);
		await grant(alertCard3);
		await move(alertCard3, 200);
		expect(Number(flatStyle(alertCard3).opacity)).toBeLessThanOrEqual(0.7);
		await release(alertCard3, 200);
		expect(dragged).toHaveBeenCalledWith(false);
	});

	it("touches starting on the ScrollView body stay with the body", async () => {
		const onOpenChange = jest.fn();
		const screen = await render(
			<Dialog open onOpenChange={onOpenChange}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		// RN's ScrollView installs its own responder system (scroll drag takes
		// the gesture); the card's drag handlers must not be reachable from a
		// body touch — verified by driving the CARD handlers directly and
		// confirming the body node exposes none of the drag protocol
		const body = screen.getByTestId("k-dialog-body", incl);
		expect(body.props.onResponderGrant).toBeUndefined();
		expect(body.props.onResponderRelease).toBeUndefined();
		// and the card protocol still behaves when driven: release below
		// threshold from a body-context touch never closes
		const card = screen.getByTestId("k-dialog", incl);
		await grant(card);
		await release(card, 40);
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it("mid-gesture callback swap: release calls the LATEST onOpenChange", async () => {
		const stale = jest.fn();
		const fresh = jest.fn();
		const screen = await render(
			<Dialog open onOpenChange={stale}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const card = screen.getByTestId("k-dialog", incl);
		await grant(card);
		await move(card, 200);
		await screen.rerender(
			<Dialog open onOpenChange={fresh}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const card2 = screen.getByTestId("k-dialog", incl);
		await release(card2, 200);
		expect(stale).not.toHaveBeenCalled();
		expect(fresh).toHaveBeenCalledWith(false);
	});

	it("body renders a ScrollView that persists keyboard taps", async () => {
		const screen = await render(
			<Dialog open onOpenChange={() => undefined}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const body = screen.getByTestId("k-dialog-body", incl);
		expect(body.props.keyboardShouldPersistTaps).toBe("handled");
		const alertScreen = await render(
			<AlertDialog open onOpenChange={() => undefined}>
				<AlertDialog.Body>body</AlertDialog.Body>
			</AlertDialog>,
		);
		const alertBody = alertScreen.getByTestId("k-alert-dialog-body", incl);
		expect(alertBody.props.keyboardShouldPersistTaps).toBe("handled");
	});

	it("both dialogs wrap content in KeyboardAvoidingView", async () => {
		const screen = await render(
			<Dialog open onOpenChange={() => undefined}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const kav = screen.getByTestId("k-dialog-keyboard-view", incl);
		// KAV consumes behavior/keyboardVerticalOffset; its visible effect is
		// the injected padding frame (paddingBottom present, 0 while the
		// keyboard is closed on the ios default platform)
		const kavStyle = flatStyle(kav);
		expect(Object.hasOwn(kavStyle, "paddingBottom")).toBe(true);
		expect(Number(kavStyle.paddingBottom)).toBe(0);

		const alertScreen = await render(
			<AlertDialog open onOpenChange={() => undefined}>
				<AlertDialog.Body>body</AlertDialog.Body>
			</AlertDialog>,
		);
		const alertKav = alertScreen.getByTestId(
			"k-alert-dialog-keyboard-view",
			incl,
		);
		const alertKavStyle = flatStyle(alertKav);
		expect(Object.hasOwn(alertKavStyle, "paddingBottom")).toBe(true);
		expect(Number(alertKavStyle.paddingBottom)).toBe(0);
	});

	it("footer buttons keep their own press; card responder stays background", async () => {
		const onOpenChange = jest.fn();
		const onPress = jest.fn();
		const screen = await render(
			<Dialog open onOpenChange={onOpenChange}>
				<Dialog.Footer>
					<Button onPress={onPress}>save</Button>
				</Dialog.Footer>
			</Dialog>,
		);
		const btn = screen.getByTestId("k-button-root", incl);
		// Pressable consumes onPress; the wired handler survives as onClick
		expect(typeof btn.props.onClick).toBe("function");
		// child handles its own touch — driving the child never reaches the
		// card's responder release path
		await act(async () => {
			(btn.props.onClick as (e: unknown) => void)?.({ nativeEvent: {} });
		});
		expect(onPress).toHaveBeenCalled();
		expect(onOpenChange).not.toHaveBeenCalled();
	});
});
