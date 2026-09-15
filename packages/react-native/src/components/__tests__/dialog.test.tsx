/**
 * Wave 9 mobile hardening: raw-responder drag-to-dismiss, keyboard
 * avoidance, and scrollable dialog bodies. Handlers are driven through
 * props inside act() — fireEvent's responder polyfill leaves a grant
 * lock that poisons later renders in the same jest file (wave-8 lesson).
 */
import { act, render } from "@testing-library/react-native";
import { Dialog } from "../dialog";
import { AlertDialog } from "../alert-dialog";
import { Button } from "../button";

const incl = { includeHiddenElements: true } as const;

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

type Card = ReturnType<Awaited<ReturnType<typeof render>>["getByTestId"]>;

const grant = async (card: Card) => {
	await act(async () => {
		(card.props.onResponderGrant as (e: unknown) => void)?.({ nativeEvent: {} });
	});
};

const move = async (card: Card, dy: number) => {
	await act(async () => {
		(card.props.onResponderMove as (e: unknown) => void)?.({
			nativeEvent: { pageY: dy },
		});
	});
};

const release = async (card: Card, dy: number) => {
	await act(async () => {
		(card.props.onResponderRelease as (e: unknown) => void)?.({
			nativeEvent: { pageY: dy },
		});
	});
};

describe("dialog gesture + keyboard hardening", () => {
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

		// opt-in dismissable AlertDialog wires the full protocol
		const a2 = await render(
			<AlertDialog open onOpenChange={() => undefined} dismissable>
				<AlertDialog.Body>body</AlertDialog.Body>
			</AlertDialog>,
		);
		const alertCard2 = a2.getByTestId("k-alert-dialog", incl);
		expect(alertCard2.props.onStartShouldSetResponder()).toBe(true);
		expect(typeof alertCard2.props.onResponderRelease).toBe("function");
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
		const tree = JSON.stringify(screen.toJSON());
		expect(tree).toContain("KeyboardAvoidingView");

		const alertScreen = await render(
			<AlertDialog open onOpenChange={() => undefined}>
				<AlertDialog.Body>body</AlertDialog.Body>
			</AlertDialog>,
		);
		expect(JSON.stringify(alertScreen.toJSON())).toContain(
			"KeyboardAvoidingView",
		);
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
		expect(typeof btn.props.onPress).toBe("function");
		// child handles its own touch — driving the child never reaches the
		// card's responder release path
		await act(async () => {
			btn.props.onClick?.({ nativeEvent: {} });
		});
		expect(onPress).toHaveBeenCalled();
		expect(onOpenChange).not.toHaveBeenCalled();
	});
});
