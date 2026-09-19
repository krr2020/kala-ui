/**
 * Overlay focus management: opening an overlay moves screen-reader focus
 * into it (AccessibilityInfo.setAccessibilityFocus), closing returns focus
 * to the trigger when one is registered, and Toasts announce their text.
 * These are the contracts TalkBack/VoiceOver users experience as "the
 * overlay took focus" and "I land back where I started".
 */
import { readFileSync } from "node:fs";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Pressable, View } from "react-native";

const { AccessibilityInfo } = require("react-native");

import { Dialog } from "../dialog";
import { Select } from "../select";
import { Sheet } from "../sheet";
import { Toast } from "../toast";

const setFocusSpy = jest.spyOn(AccessibilityInfo, "setAccessibilityFocus");
const announceSpy = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
// react-test-renderer host instances carry no native tags, so pin
// findNodeHandle to a sentinel: the contract under test is WHICH node
// was passed, not the tag arithmetic
jest
	.spyOn(require("react-native"), "findNodeHandle")
	.mockImplementation((node: unknown) =>
		node == null ? null : (42 as number),
	);
const anyHandle = 42;

beforeEach(() => {
	setFocusSpy.mockClear();
	announceSpy.mockClear();
});

// the trigger lives OUTSIDE the overlay, as in a real app screen
function ExternalTrigger({ triggerRef }: { triggerRef: { current: unknown } }) {
	return (
		<Pressable
			testID="ext-trigger"
			accessibilityRole="button"
			accessibilityLabel="Open"
			onPress={() => undefined}
		>
			<View
				ref={(node) => {
					triggerRef.current = node;
				}}
			/>
		</Pressable>
	);
}

const settle = () =>
	act(async () => {
		await new Promise((r) => setTimeout(r, 50));
	});

describe("Sheet focus management", () => {
	it("moves focus into the sheet content on open", async () => {
		const screen = await render(
			<Sheet open onClose={() => undefined}>
				<Sheet.Body>content</Sheet.Body>
			</Sheet>,
		);
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalledTimes(1));
		expect(setFocusSpy).toHaveBeenCalledWith(anyHandle);
		expect(screen.getByTestId("k-sheet-content")).toBeTruthy();
	});

	it("closes without a triggerRef and never restores focus", async () => {
		const screen = await render(
			<Sheet open onClose={() => undefined}>
				<Sheet.Body>content</Sheet.Body>
			</Sheet>,
		);
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalled());
		setFocusSpy.mockClear();
		await act(async () => {
			await screen.rerender(
				<Sheet open={false} onClose={() => undefined}>
					<Sheet.Body>content</Sheet.Body>
				</Sheet>,
			);
		});
		await settle();
		expect(setFocusSpy).not.toHaveBeenCalled();
		expect(screen.queryByTestId("k-sheet-content")).toBeNull();
	});

	it("restores focus to the triggerRef only after the exit completes", async () => {
		const trigger = { current: null as unknown };
		const screen = await render(
			<>
				<ExternalTrigger triggerRef={trigger} />
				<Sheet open onClose={() => undefined} triggerRef={trigger}>
					<Sheet.Body>content</Sheet.Body>
				</Sheet>
			</>,
		);
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalledTimes(1));
		setFocusSpy.mockClear();
		await act(async () => {
			await screen.rerender(
				<>
					<ExternalTrigger triggerRef={trigger} />
					<Sheet open={false} onClose={() => undefined} triggerRef={trigger}>
						<Sheet.Body>content</Sheet.Body>
					</Sheet>
				</>,
			);
		});
		// reanimated's mock completes timing callbacks synchronously, so the
		// gate is pinned at the source level instead: restore keys on
		// !mounted (exit done), never on open alone
		const source = readFileSync(`${__dirname}/../sheet/sheet.tsx`, "utf8");
		expect(source).toMatch(
			/useOverlayFocus\(contentRef, open, !mounted, triggerRef\)/,
		);
		await waitFor(
			() => expect(screen.queryByTestId("k-sheet-content")).toBeNull(),
			{ timeout: 3000 },
		);
		// after the exit tore the window down, exactly one restore fired
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalledTimes(1));
		expect(setFocusSpy).toHaveBeenCalledWith(anyHandle);
	});

	it("restores on unmount-while-open via the cleanup path", async () => {
		const trigger = { current: null as unknown };
		const screen = await render(
			<>
				<ExternalTrigger triggerRef={trigger} />
				<Sheet open onClose={() => undefined} triggerRef={trigger}>
					<Sheet.Body>content</Sheet.Body>
				</Sheet>
			</>,
		);
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalledTimes(1));
		setFocusSpy.mockClear();
		// parent removes the sheet while still open — trigger stays mounted
		await act(async () => {
			await screen.rerender(<ExternalTrigger triggerRef={trigger} />);
		});
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalledTimes(1));
	});

	it("rapid open→close→open: no stale restore, the reopened sheet gets focus", async () => {
		const trigger = { current: null as unknown };
		const sheet = (open: boolean) => (
			<>
				<ExternalTrigger triggerRef={trigger} />
				<Sheet open={open} onClose={() => undefined} triggerRef={trigger}>
					<Sheet.Body>content</Sheet.Body>
				</Sheet>
			</>
		);
		const screen = await render(sheet(true));
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalledTimes(1));
		setFocusSpy.mockClear();
		await act(async () => {
			await screen.rerender(sheet(false));
		});
		await act(async () => {
			await screen.rerender(sheet(true));
		});
		// the mock exit completes synchronously, so the sequence is
		// deterministic: one restore for the finished close, one focus-in
		// for the reopened sheet — never a crash or a missed focus
		await settle();
		expect(setFocusSpy).toHaveBeenCalledTimes(2);
		expect(screen.getByTestId("k-sheet-content")).toBeTruthy();
	});
});

describe("Dialog focus management", () => {
	it("moves focus into the card on open and restores to triggerRef on close", async () => {
		const trigger = { current: null as unknown };
		const dialog = (open: boolean) => (
			<>
				<ExternalTrigger triggerRef={trigger} />
				<Dialog open={open} onOpenChange={() => undefined} triggerRef={trigger}>
					<Dialog.Body>body</Dialog.Body>
				</Dialog>
			</>
		);
		const screen = await render(dialog(true));
		expect(screen.getByTestId("k-dialog")).toBeTruthy();
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalledTimes(1));
		setFocusSpy.mockClear();
		await act(async () => {
			await screen.rerender(dialog(false));
		});
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalledTimes(1));
		expect(setFocusSpy).toHaveBeenCalledWith(anyHandle);
	});

	it("closes without a triggerRef and never restores focus", async () => {
		const screen = await render(
			<Dialog open onOpenChange={() => undefined}>
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalled());
		setFocusSpy.mockClear();
		await act(async () => {
			await screen.rerender(
				<Dialog open={false} onOpenChange={() => undefined}>
					<Dialog.Body>body</Dialog.Body>
				</Dialog>,
			);
		});
		await settle();
		expect(setFocusSpy).not.toHaveBeenCalled();
	});

	it("restores on unmount-while-open", async () => {
		const trigger = { current: null as unknown };
		const screen = await render(
			<>
				<ExternalTrigger triggerRef={trigger} />
				<Dialog open onOpenChange={() => undefined} triggerRef={trigger}>
					<Dialog.Body>body</Dialog.Body>
				</Dialog>
			</>,
		);
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalledTimes(1));
		setFocusSpy.mockClear();
		await act(async () => {
			await screen.rerender(<ExternalTrigger triggerRef={trigger} />);
		});
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalledTimes(1));
	});
});

describe("Toast announcement", () => {
	it("announces the accessibilityLabel when provided", async () => {
		await render(
			<Toast open onOpenChange={() => undefined} accessibilityLabel="Saved" />,
		);
		await waitFor(() => expect(announceSpy).toHaveBeenCalledWith("Saved"));
	});

	it("derives text from Title and Description children", async () => {
		await render(
			<Toast open onOpenChange={() => undefined}>
				<Toast.Title>Saved</Toast.Title>
				<Toast.Description>Your file is on disk</Toast.Description>
			</Toast>,
		);
		await waitFor(() =>
			expect(announceSpy).toHaveBeenCalledWith("Saved, Your file is on disk"),
		);
	});

	it("never announces when there is no label and no extractable text", async () => {
		await render(
			<Toast open onOpenChange={() => undefined}>
				<Toast.Title> </Toast.Title>
			</Toast>,
		);
		await settle();
		expect(announceSpy).not.toHaveBeenCalled();
	});

	it("does not announce while closed", async () => {
		await render(
			<Toast
				open={false}
				onOpenChange={() => undefined}
				accessibilityLabel="Saved"
			/>,
		);
		await settle();
		expect(announceSpy).not.toHaveBeenCalled();
	});
});

describe("Dialog container semantics", () => {
	it("card is always an accessible container, label wired through", async () => {
		const screen = await render(
			<Dialog open onOpenChange={() => undefined} accessibilityLabel="Confirm">
				<Dialog.Body>body</Dialog.Body>
			</Dialog>,
		);
		const card = screen.getByTestId("k-dialog");
		expect(card.props.accessible).toBe(true);
		expect(card.props.accessibilityLabel).toBe("Confirm");
		expect(card.props.accessibilityViewIsModal).toBe(true);
	});
});

describe("Select trigger restore", () => {
	it("focus returns to the trigger after picking an option", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Select
				options={[{ value: "a", label: "Alpha" }]}
				onValueChange={onValueChange}
			/>,
		);
		await act(async () => {
			await fireEvent.press(screen.getByTestId("k-select"));
		});
		// picker opened: focus moved into the sheet content
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalledTimes(1));
		setFocusSpy.mockClear();
		await act(async () => {
			await fireEvent.press(screen.getByTestId("k-select-option"));
		});
		expect(onValueChange).toHaveBeenCalledWith("a");
		// sheet exit runs; once done, focus lands back on the trigger
		await waitFor(() => expect(setFocusSpy).toHaveBeenCalledTimes(1), {
			timeout: 3000,
		});
	});
});
