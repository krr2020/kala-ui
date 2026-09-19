import { act, fireEvent, render } from "@testing-library/react-native";
import { Dimensions, Keyboard, Platform, Text } from "react-native";
import * as Reanimated from "react-native-reanimated";
import { themes } from "../../themes/definitions";
import { motion, tokens } from "../../tokens";
import { Sheet } from "../sheet";
import {
	composeOffset,
	keyboardLift,
	keyboardShrink,
	KEYBOARD_BOTTOM_GAP,
	OFFSCREEN_Y,
	sheetOverlay,
	SHEET_EASE,
} from "../sheet/sheet.styles";

// the jest.setup mock records every withTiming/withSpring call config
const timingCalls = (
	Reanimated.withTiming as unknown as {
		mockConfigs: {
			to: unknown;
			config?: { duration?: number; easing?: unknown };
		}[];
	}
).mockConfigs;
const springCalls = (
	Reanimated.withSpring as unknown as { mockConfigs: unknown[] }
).mockConfigs;

type Screen = Awaited<ReturnType<typeof render>>;

const inclHidden = { includeHiddenElements: true } as const;

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

describe("composeOffset", () => {
	it("adds the drag offset to the entry/exit offset (never max/override)", () => {
		expect(composeOffset(0, 0)).toBe(0);
		expect(composeOffset(320, 0)).toBe(320);
		expect(composeOffset(320, 40)).toBe(360);
		expect(composeOffset(0, -12)).toBe(-12);
	});
});

describe("keyboardLift + keyboardShrink", () => {
	const H = 2400;
	it("lift is always the full keyboard height — the footer rides the keyboard top", () => {
		expect(
			keyboardLift({ kbHeight: 883, windowHeight: H, topInset: 132, sheetHeight: 2268 }),
		).toBe(883);
		expect(
			keyboardLift({ kbHeight: 0, windowHeight: H, topInset: 132, sheetHeight: 2268 }),
		).toBe(0);
	});
	it("tall sheet sheds exactly the height that would poke above the top inset once lifted", () => {
		// 2268 - (2400 - 132 - 883) = 2268 - 1385 = 883
		expect(
			keyboardShrink({ kbHeight: 883, windowHeight: H, topInset: 132, sheetHeight: 2268 }),
		).toBe(883);
	});
	it("small sheets keep their height; zero kb never shrinks", () => {
		expect(
			keyboardShrink({ kbHeight: 883, windowHeight: H, topInset: 132, sheetHeight: 120 }),
		).toBe(0);
		expect(
			keyboardShrink({ kbHeight: 0, windowHeight: H, topInset: 132, sheetHeight: 2268 }),
		).toBe(0);
	});
});

describe("sheetOverlay", () => {
	it("composes the overlay color from the theme's overlay/overlayAlpha tokens", () => {
		expect(sheetOverlay(themes.light)).toBe("rgba(0, 0, 0, 0.5)");
		expect(sheetOverlay(themes.dark)).toBe("rgba(0, 0, 0, 0.6)");
	});

	it("boundary alphas: 0 fades fully out, >=1 goes opaque, fractions round to 2 decimals", () => {
		expect(sheetOverlay({ overlay: "#000000", overlayAlpha: 0 })).toBe(
			"rgba(0, 0, 0, 0)",
		);
		expect(sheetOverlay({ overlay: "#102030", overlayAlpha: 1 })).toBe(
			"rgba(16, 32, 48, 1)",
		);
		expect(sheetOverlay({ overlay: "#102030", overlayAlpha: 1.4 })).toBe(
			"rgba(16, 32, 48, 1)",
		);
		expect(sheetOverlay({ overlay: "#000000", overlayAlpha: 0.456 })).toBe(
			"rgba(0, 0, 0, 0.46)",
		);
	});
});

// relative luminance for the visibility sweep — good enough approximation
// of perceived lightness to separate "reads as the card" from "reads as a mark"
function luminance(hex: string): number {
	const n = Number.parseInt(hex.slice(1), 16);
	const channel = (shift: number): number => ((n >> shift) & 0xff) / 255;
	return 0.2126 * channel(16) + 0.7152 * channel(8) + 0.0722 * channel(0);
}

describe("grabber visibility across themes", () => {
	it("mutedForeground clears the card on every generated theme while muted does not", () => {
		for (const theme of Object.values(themes)) {
			expect(Math.abs(luminance(theme.mutedForeground) - luminance(theme.card))).toBeGreaterThan(0.15);
			// documents the pre-fix bug: the old muted fill sat within noise of the card
			expect(Math.abs(luminance(theme.muted) - luminance(theme.card))).toBeLessThan(0.15);
		}
	});
});

describe("Sheet", () => {
	it("initial frame is flash-free before layout: entry offset offscreen, overlay transparent", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		const content = flatStyle(
			screen.getByTestId("k-sheet-content", inclHidden),
		);
		expect(content.transform).toEqual([{ translateY: OFFSCREEN_Y }]);
		const overlay = flatStyle(
			screen.getByTestId("k-sheet-overlay", inclHidden),
		);
		expect(overlay.opacity).toBe(0);
	});

	it("open=false after open exits, then unmounts the modal", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		await screen.rerender(
			<Sheet open={false} onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.queryByTestId("k-sheet-modal", inclHidden)).toBeNull();
		expect(screen.queryByTestId("k-sheet-content", inclHidden)).toBeNull();
	});

	it("title renders a header with k-sheet-title and a working close icon", async () => {
		const onClose = jest.fn();
		const screen: Screen = await render(
			<Sheet open onClose={onClose} title="Options">
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.getByTestId("k-sheet-title", inclHidden).props.children).toBe(
			"Options",
		);
		await fireEvent.press(screen.getByTestId("k-sheet-close", inclHidden));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("header breathes vertically and bleeds its divider to the sheet edges", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}} title="Options">
				<Text>content</Text>
			</Sheet>,
		);
		const header = flatStyle(screen.getByTestId("k-sheet-header", inclHidden));
		expect(header.paddingTop).toBe(2);
		expect(header.paddingBottom).toBe(8);
		expect(header.borderBottomWidth).toBe(1);
		// negative margin cancels the content gutter so the hairline spans
		// edge to edge while the inner padding restores the text rail
		expect(header.marginHorizontal).toBe(-tokens.space.gutter);
		expect(header.paddingHorizontal).toBe(tokens.space.gutter);
	});

	it("close affordance is a rounded outlined bubble inside the 44px hit target", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}} title="Options">
				<Text>content</Text>
			</Sheet>,
		);
		const hit = flatStyle(screen.getByTestId("k-sheet-close", inclHidden));
		expect(hit.width).toBe(44);
		expect(hit.height).toBe(44);
		const bubble = flatStyle(
			screen.getByTestId("k-sheet-close-bubble", inclHidden),
		);
		expect(bubble.width).toBe(32);
		expect(bubble.height).toBe(32);
		expect(bubble.borderRadius).toBe(999);
		expect(bubble.borderWidth).toBe(1);
		expect(bubble.borderColor).toBe(themes.light.border);
	});

	it("footer divider bleeds to the sheet edges symmetrically with the header", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}} title="Options" footer={<Text>done</Text>}>
				<Text>content</Text>
			</Sheet>,
		);
		const footer = flatStyle(screen.getByTestId("k-sheet-footer", inclHidden));
		expect(footer.marginHorizontal).toBe(-tokens.space.gutter);
		expect(footer.paddingHorizontal).toBe(tokens.space.gutter);
		expect(footer.paddingTop).toBeGreaterThan(0);
		expect(footer.borderTopWidth).toBe(1);
	});

	it("slotStyles.header overrides win over the bleed/spacing defaults", async () => {
		const screen: Screen = await render(
			<Sheet
				open
				onClose={() => {}}
				title="Options"
				slotStyles={{ header: { paddingTop: 20, marginHorizontal: -8 } }}
			>
				<Text>content</Text>
			</Sheet>,
		);
		const header = flatStyle(screen.getByTestId("k-sheet-header", inclHidden));
		expect(header.paddingTop).toBe(20);
		expect(header.marginHorizontal).toBe(-8);
	});

	it("long wrapping title keeps the close target unsquashed at 44px", async () => {
		const screen: Screen = await render(
			<Sheet
				open
				onClose={() => {}}
				title="A very long sheet title that wraps onto several lines and would squeeze a flexible trailing control out of its hit target"
			>
				<Text>content</Text>
			</Sheet>,
		);
		const hit = flatStyle(screen.getByTestId("k-sheet-close", inclHidden));
		expect(hit.width).toBe(44);
		expect(hit.flexShrink).toBe(0);
		expect(
				screen.getByTestId("k-sheet-close-bubble", inclHidden),
		).toBeTruthy();
	});

	it("avoidKeyboard on Android registers show/hide listeners and releases them", async () => {
		const original = Platform.OS;
		Object.defineProperty(Platform, "OS", {
			value: "android",
			configurable: true,
		});
		const spy = jest.spyOn(Keyboard, "addListener");
		try {
			const screen: Screen = await render(
				<Sheet open onClose={() => {}} snap="auto" avoidKeyboard>
					<Text>content</Text>
				</Sheet>,
			);
			const events = spy.mock.calls.map((call) => call[0]);
			expect(events).toContain("keyboardDidShow");
			expect(events).toContain("keyboardDidHide");
			// the registered show callback must accept the RN event shape
			const show = spy.mock.calls.find((c) => c[0] === "keyboardDidShow")?.[1];
			expect(() =>
				show?.({ endCoordinates: { height: 264 } } as never),
			).not.toThrow();
			screen.unmount();
		} finally {
			spy.mockRestore();
			Object.defineProperty(Platform, "OS", {
				value: original,
				configurable: true,
			});
		}
	});

	it("sheet is bottom-anchored — fixed snaps can never place content above the window top", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}} snap="full" title="Options">
				<Text>content</Text>
			</Sheet>,
		);
		const content = flatStyle(
			screen.getByTestId("k-sheet-content", inclHidden),
		);
		const { height } = Dimensions.get("window");
		expect(content.position).toBe("absolute");
		expect(content.bottom).toBe(0);
		expect(content.height).toBe(Math.round(height * 0.9));
	});

	it("showClose=false keeps the title but drops the close icon", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}} title="Options" showClose={false}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.getByTestId("k-sheet-title", inclHidden)).toBeTruthy();
		expect(screen.queryByTestId("k-sheet-close", inclHidden)).toBeNull();
	});

	it("no title renders no header at all", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.queryByTestId("k-sheet-title", inclHidden)).toBeNull();
		expect(screen.queryByTestId("k-sheet-close", inclHidden)).toBeNull();
	});

	it("dismissable=false hides the close icon — a locked sheet exposes no close affordance", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}} title="Options" dismissable={false}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.getByTestId("k-sheet-title", inclHidden)).toBeTruthy();
		expect(screen.queryByTestId("k-sheet-close", inclHidden)).toBeNull();
	});

	it("closed (open=false) renders nothing — no Modal, no markers", async () => {
		const screen: Screen = await render(
			<Sheet open={false} onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.queryByTestId("k-sheet-modal", inclHidden)).toBeNull();
		expect(screen.queryByTestId("k-sheet-root", inclHidden)).toBeNull();
		expect(screen.queryByTestId("k-sheet-overlay", inclHidden)).toBeNull();
	});

	it("open renders through a transparent Modal with a flex:1 root fill", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		const modal = screen.getByTestId("k-sheet-modal", inclHidden);
		// RN forwards onRequestClose to the modal host; visible is proven
		// by the markers themselves (the modal window only mounts its
		// children while open)
		expect(typeof modal.props.onRequestClose).toBe("function");
		const root = flatStyle(screen.getByTestId("k-sheet-root", inclHidden));
		expect(root.flex).toBe(1);
		expect(root.position).toBeUndefined();
		expect("inset" in root).toBe(false);
	});

	it("Android hardware back: onRequestClose fires onClose when dismissable", async () => {
		const onClose = jest.fn();
		const screen: Screen = await render(
			<Sheet open onClose={onClose}>
				<Text>content</Text>
			</Sheet>,
		);
		const modal = screen.getByTestId("k-sheet-modal", inclHidden);
		(modal.props.onRequestClose as () => void)();
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("Android hardware back with dismissable=false keeps the sheet open", async () => {
		const onClose = jest.fn();
		const screen: Screen = await render(
			<Sheet open onClose={onClose} dismissable={false}>
				<Text>content</Text>
			</Sheet>,
		);
		const modal = screen.getByTestId("k-sheet-modal", inclHidden);
		const back = modal.props.onRequestClose as () => void;
		expect(() => back()).not.toThrow();
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId("k-sheet-content", inclHidden)).toBeTruthy();
	});

	it("overlay press fires onClose only when dismissable", async () => {
		const dismissable = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		await fireEvent.press(
			dismissable.getByTestId("k-sheet-overlay", inclHidden),
		);

		const onClose = jest.fn();
		const locked = await render(
			<Sheet open onClose={onClose} dismissable={false}>
				<Text>content</Text>
			</Sheet>,
		);
		await fireEvent.press(locked.getByTestId("k-sheet-overlay", inclHidden));
		expect(onClose).not.toHaveBeenCalled();
	});

	it("entry/exit slide with an eased timing animation — springs stay off that path", async () => {
		timingCalls.length = 0;
		springCalls.length = 0;
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		await fireEvent(
			screen.getByTestId("k-sheet-content", inclHidden),
			"layout",
			{
				nativeEvent: { layout: { height: 320, width: 1080, x: 0, y: 0 } },
			},
		);
		const enter = timingCalls.find((call) => call.to === 0);
		expect(enter).toBeTruthy();
		expect(enter?.config?.duration).toBe(motion.duration.slow);
		expect(enter?.config?.easing).toBe(SHEET_EASE);
		const fadeIn = timingCalls.find((call) => call.to === 1);
		expect(fadeIn?.config?.duration).toBe(motion.duration.slow);

		timingCalls.length = 0;
		await screen.rerender(
			<Sheet open={false} onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		// symmetric close: slide-down and overlay fade-out both take the same
		// slow duration as the entrance — no cut-short fade after the sheet leaves
		const fadeOut = timingCalls.find((call) => call.to === 0);
		expect(fadeOut?.config?.duration).toBe(motion.duration.slow);
		expect(fadeOut?.config?.easing).toBe(SHEET_EASE);
		const exitSlide = timingCalls.find(
			(call) => typeof call.to === "number" && call.to >= 10000,
		);
		expect(exitSlide?.config?.duration).toBe(motion.duration.slow);
		expect(springCalls).toHaveLength(0);
	});

	it("grabber handle fills with mutedForeground so it reads against the card", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		const grabber = flatStyle(
			screen.getByTestId("k-sheet-grabber", inclHidden),
		);
		expect(grabber.backgroundColor).toBe(themes.light.mutedForeground);
	});

	it("overlay background composes from the theme overlay tokens, not a hardcode", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		const overlay = flatStyle(
			screen.getByTestId("k-sheet-overlay", inclHidden),
		);
		expect(overlay.backgroundColor).toBe(sheetOverlay(themes.light));
		// the static color rides a plain View style; only opacity animates
		expect(overlay.opacity).toBe(0);
	});

	it("snap=auto hugs content height under an 85% window maxHeight; explicit maxHeight wins", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}} snap="auto">
				<Text>content</Text>
			</Sheet>,
		);
		const auto = flatStyle(screen.getByTestId("k-sheet-content", inclHidden));
		expect(auto.height).toBeUndefined();
		const { height } = Dimensions.get("window");
		expect(auto.maxHeight).toBe(Math.round(height * 0.85));

		const clamped: Screen = await render(
			<Sheet open onClose={() => {}} snap="auto" maxHeight={500}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(
			flatStyle(clamped.getByTestId("k-sheet-content", inclHidden)).maxHeight,
		).toBe(500);
	});

	it("snap=auto resolves naturally with a header and empty-ish content", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}} snap="auto" title="Options">
				<Text>tiny</Text>
			</Sheet>,
		);
		expect(screen.getByTestId("k-sheet-title", inclHidden)).toBeTruthy();
		const style = flatStyle(screen.getByTestId("k-sheet-content", inclHidden));
		expect(style.height).toBeUndefined();
		expect(style.maxHeight).toBeGreaterThan(0);
	});

	it("snap peek/half/full map to 120 / 50% / 90% heights", async () => {
		const { height } = Dimensions.get("window");
		for (const [snap, height0] of [
			["peek", 120],
			["half", Math.round(height * 0.5)],
			// zero-inset mock keeps the status-bar clamp from binding
			["full", Math.round(height * 0.9)],
		] as const) {
			const screen: Screen = await render(
				<Sheet open onClose={() => {}} snap={snap}>
					<Text>content</Text>
				</Sheet>,
			);
			expect(
				flatStyle(screen.getByTestId("k-sheet-content", inclHidden)).height,
			).toBe(height0);
		}
	});

	it("drag-to-dismiss stays wired: gesture root hosts the sheet content inside the Modal", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.getByTestId("k-sheet-gesture-root", inclHidden)).toBeTruthy();
		expect(screen.getByTestId("k-sheet-content", inclHidden)).toBeTruthy();
		expect(screen.getByTestId("k-sheet-grabber", inclHidden)).toBeTruthy();
	});

	it("scrollable wraps children in the k-sheet-scroll ScrollView; default renders raw", async () => {
		const scrollable: Screen = await render(
			<Sheet open onClose={() => {}} scrollable>
				<Text>content</Text>
			</Sheet>,
		);
		expect(scrollable.getByTestId("k-sheet-scroll", inclHidden)).toBeTruthy();
		expect(scrollable.getByText("content", inclHidden)).toBeTruthy();

		const plain: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(plain.queryByTestId("k-sheet-scroll", inclHidden)).toBeNull();
	});

	describe("safe area + keyboard awareness", () => {
		const safeArea = require("react-native-safe-area-context");
		const setInsets = (top: number, bottom: number): void =>
			safeArea.__setSafeAreaInsets({ top, bottom, left: 0, right: 0 });

		it("Modal draws under both system bars", async () => {
			const screen: Screen = await render(
				<Sheet open onClose={() => {}}>
					<Text>content</Text>
				</Sheet>,
			);
			const modal = screen.getByTestId("k-sheet-modal", inclHidden);
			expect(modal.props.statusBarTranslucent).toBe(true);
			expect(modal.props.navigationBarTranslucent).toBe(true);
		});

		it("bottom padding clears the gesture nav bar via the bottom inset", async () => {
			setInsets(0, 48);
			try {
				const screen: Screen = await render(
					<Sheet open onClose={() => {}}>
						<Text>content</Text>
					</Sheet>,
				);
				const content = flatStyle(
					screen.getByTestId("k-sheet-content", inclHidden),
				);
				expect(content.paddingBottom).toBe(tokens.space.cardPad + 48);
			} finally {
				setInsets(0, 0);
			}
		});

		it("keyboard open swaps bottom padding to the small gap; hide restores it", async () => {
		setInsets(0, 48);
		const original = Platform.OS;
		Object.defineProperty(Platform, "OS", {
			value: "android",
			configurable: true,
		});
		const spy = jest.spyOn(Keyboard, "addListener");
		try {
			const screen: Screen = await render(
				<Sheet open onClose={() => {}} snap="full" avoidKeyboard>
				<Text>content</Text>
				</Sheet>,
			);
			const events = spy.mock.calls.map((call) => call[0]);
			expect(events).toContain("keyboardDidShow");
			expect(events).toContain("keyboardDidHide");

			const show = spy.mock.calls.find((c) => c[0] === "keyboardDidShow")?.[1];
			const hide = spy.mock.calls.find((c) => c[0] === "keyboardDidHide")?.[1];
			await act(async () => {
				show?.({ endCoordinates: { height: 264 } } as never);
			});
			let content = flatStyle(
				screen.getByTestId("k-sheet-content", inclHidden),
			);
			expect(content.paddingBottom).toBe(KEYBOARD_BOTTOM_GAP);
			// full snap (1201 of the 1334 mock window) sheds the height that
			// would poke above the inset-free window once lifted by kb+inset
			// (Android: 264 kb + 48 nav inset on top of the RN-reported height)
			expect(content.height).toBe(1022);

			await act(async () => {
				hide?.(undefined as never);
			});
				content = flatStyle(screen.getByTestId("k-sheet-content", inclHidden));
				expect(content.paddingBottom).toBe(tokens.space.cardPad + 48);
				// snap height restored with the keyboard gone
				expect(content.height).toBe(1201);
			} finally {
				spy.mockRestore();
				Object.defineProperty(Platform, "OS", {
					value: original,
					configurable: true,
				});
				setInsets(0, 0);
			}
		});

		// RN's Android keyboard height excludes the translucent gesture-nav
		// inset, so the sheet must clear the inset on top of the reported
		// height or the footer rides under the real keyboard top
		describe("Android keyboard height includes the bottom nav inset", () => {
			const asAndroid = (): (() => void) => {
				const original = Platform.OS;
				Object.defineProperty(Platform, "OS", {
					value: "android",
					configurable: true,
				});
				return () => {
					Object.defineProperty(Platform, "OS", {
						value: original,
						configurable: true,
					});
				};
			};
			const fire = async (
				spy: jest.SpyInstance,
				event: string,
				height: number,
			): Promise<void> => {
				// last registration wins — earlier sheets in the same test may
				// still have captured callbacks in the spy log
				const listener = [...spy.mock.calls]
					.reverse()
					.find((c) => c[0] === event)?.[1];
				await act(async () => {
					listener?.({ endCoordinates: { height } } as never);
				});
			};

			it("shrinking full sheet sheds kb + inset so the footer clears the real keyboard top", async () => {
				setInsets(0, 68);
				const restore = asAndroid();
				const spy = jest.spyOn(Keyboard, "addListener");
				try {
					const screen: Screen = await render(
						<Sheet open onClose={() => {}} snap="full" avoidKeyboard>
							<Text>content</Text>
						</Sheet>,
					);
					await fire(spy, "keyboardDidShow", 264);
					const content = flatStyle(
						screen.getByTestId("k-sheet-content", inclHidden),
					);
					// 1334 window − (264 kb + 68 inset) leaves the sheet bottom at
					// the real keyboard top
					expect(content.height).toBe(1334 - 264 - 68);
					expect(content.paddingBottom).toBe(KEYBOARD_BOTTOM_GAP);
				} finally {
					spy.mockRestore();
					restore();
					setInsets(0, 0);
				}
			});

			it("lifting peek sheet rises by kb + inset so its bottom rides the keyboard top", async () => {
				setInsets(0, 68);
				const restore = asAndroid();
				const spy = jest.spyOn(Keyboard, "addListener");
				try {
					const screen: Screen = await render(
						<Sheet open onClose={() => {}} snap="peek" avoidKeyboard>
							<Text>content</Text>
						</Sheet>,
					);
					await fireEvent(
						screen.getByTestId("k-sheet-content", inclHidden),
						"layout",
						{
							nativeEvent: { layout: { height: 320, width: 1080, x: 0, y: 0 } },
						},
					);
					await fire(spy, "keyboardDidShow", 264);
					// peek lifts without changing any state (shrink stays 0), so the
					// mock animated style needs a render pass to reflect kb.value
					await screen.rerender(
						<Sheet open onClose={() => {}} snap="peek" avoidKeyboard>
							<Text>content</Text>
						</Sheet>,
					);
					const content = flatStyle(
						screen.getByTestId("k-sheet-content", inclHidden),
					);
					expect(content.height).toBe(120);
					expect(content.transform).toEqual([{ translateY: -(264 + 68) }]);
				} finally {
					spy.mockRestore();
					restore();
					setInsets(0, 0);
				}
			});

			it("iOS never adds the inset — RN there reports the full keyboard height", async () => {
				setInsets(0, 68);
				const original = Platform.OS;
				Object.defineProperty(Platform, "OS", {
					value: "ios",
					configurable: true,
				});
				const spy = jest.spyOn(Keyboard, "addListener");
				try {
					const lift: Screen = await render(
						<Sheet open onClose={() => {}} snap="peek" avoidKeyboard>
							<Text>content</Text>
						</Sheet>,
					);
					await fireEvent(
						lift.getByTestId("k-sheet-content", inclHidden),
						"layout",
						{
							nativeEvent: { layout: { height: 320, width: 1080, x: 0, y: 0 } },
						},
					);
					await fire(spy, "keyboardWillShow", 264);
					await lift.rerender(
						<Sheet open onClose={() => {}} snap="peek" avoidKeyboard>
							<Text>content</Text>
						</Sheet>,
					);
					expect(
						flatStyle(lift.getByTestId("k-sheet-content", inclHidden))
							.transform,
				).toEqual([{ translateY: -264 }]);
				// the peek lift proves iOS adds no inset; the full-snap shrink
				// math stays covered by the pure keyboardShrink suite above
				} finally {
					spy.mockRestore();
					Object.defineProperty(Platform, "OS", {
						value: original,
						configurable: true,
						});
					setInsets(0, 0);
					}
			});

			it("zero bottom inset on Android keeps today's height (boundary)", async () => {
				setInsets(0, 0);
				const restore = asAndroid();
				const spy = jest.spyOn(Keyboard, "addListener");
				try {
					const screen: Screen = await render(
						<Sheet open onClose={() => {}} snap="full" avoidKeyboard>
							<Text>content</Text>
						</Sheet>,
					);
					await fire(spy, "keyboardDidShow", 264);
					expect(
						flatStyle(screen.getByTestId("k-sheet-content", inclHidden)).height,
					).toBe(1070);
					await fire(spy, "keyboardDidHide", 0);
					expect(
						flatStyle(screen.getByTestId("k-sheet-content", inclHidden)).height,
					).toBe(1201);
				} finally {
					spy.mockRestore();
					restore();
				}
			});

			it("mounting with the keyboard already open applies the inset-extended height", async () => {
				setInsets(0, 68);
				const restore = asAndroid();
				const metrics = jest
					.spyOn(Keyboard, "metrics")
					.mockReturnValue({ height: 300 } as never);
				try {
					const screen: Screen = await render(
						<Sheet open onClose={() => {}} snap="full" avoidKeyboard>
							<Text>content</Text>
						</Sheet>,
					);
					const content = flatStyle(
						screen.getByTestId("k-sheet-content", inclHidden),
					);
					expect(content.height).toBe(1334 - 300 - 68);
					expect(content.paddingBottom).toBe(KEYBOARD_BOTTOM_GAP);
				} finally {
					metrics.mockRestore();
					restore();
					setInsets(0, 0);
					}
				});
		});

		it("avoidKeyboard=false registers no listeners and never changes layout", async () => {
			const spy = jest.spyOn(Keyboard, "addListener");
			try {
				await render(
					<Sheet open onClose={() => {}} snap="full">
					<Text>content</Text>
				</Sheet>,
				);
			expect(spy).not.toHaveBeenCalled();
			} finally {
				spy.mockRestore();
			}
		});

		it("iOS registers keyboardWillShow/Hide, not the Did pair", async () => {
			const original = Platform.OS;
			Object.defineProperty(Platform, "OS", {
				value: "ios",
				configurable: true,
			});
			const spy = jest.spyOn(Keyboard, "addListener");
			try {
				const screen: Screen = await render(
					<Sheet open onClose={() => {}} avoidKeyboard>
						<Text>content</Text>
					</Sheet>,
				);
				const events = spy.mock.calls.map((call) => call[0]);
				expect(events).toContain("keyboardWillShow");
				expect(events).toContain("keyboardWillHide");
				expect(events).not.toContain("keyboardDidShow");
				screen.unmount();
			} finally {
				spy.mockRestore();
				Object.defineProperty(Platform, "OS", {
					value: original,
					configurable: true,
				});
			}
		});

		it("full snap clamps its height when the top inset would collide", async () => {
			const { height } = Dimensions.get("window");
			// force the clamp to bind: an inset larger than the 10% slack
			setInsets(Math.round(height * 0.2), 0);
			try {
				const screen: Screen = await render(
					<Sheet open onClose={() => {}} snap="full">
						<Text>content</Text>
					</Sheet>,
				);
				const content = flatStyle(
					screen.getByTestId("k-sheet-content", inclHidden),
				);
				expect(content.height).toBe(
					Math.min(Math.round(height * 0.9), height - Math.round(height * 0.2)),
				);
			} finally {
				setInsets(0, 0);
			}
		});

		it("mounting with the keyboard already open initializes keyboard padding", async () => {
			const metrics = jest.spyOn(Keyboard, "metrics").mockReturnValue({
				height: 300,
			} as never);
			try {
				const screen: Screen = await render(
					<Sheet open onClose={() => {}} snap="full" avoidKeyboard>
						<Text>content</Text>
					</Sheet>,
				);
				const content = flatStyle(
					screen.getByTestId("k-sheet-content", inclHidden),
				);
				expect(content.paddingBottom).toBe(KEYBOARD_BOTTOM_GAP);
			} finally {
				metrics.mockRestore();
			}
		});
	});

	it("drag pan activates only on downward movement — upward drags reach the body scroll", () => {
		const gesture = require("react-native-gesture-handler").__lastPan as {
			activeOffsetY?: number;
			failOffsetY?: number;
		};
		expect(gesture.activeOffsetY).toBe(12);
		expect(gesture.failOffsetY).toBe(-12);
	});

	it("slotStyles overlay/content/grabber overrides still apply inside the Modal", async () => {
		const screen: Screen = await render(
			<Sheet
				open
				onClose={() => {}}
				slotStyles={{
					overlay: { borderWidth: 3 },
					content: { borderWidth: 5 },
					grabber: { width: 21 },
				}}
			>
				<Text>content</Text>
			</Sheet>,
		);
		expect(
			flatStyle(screen.getByTestId("k-sheet-overlay", inclHidden)).borderWidth,
		).toBe(3);
		expect(
			flatStyle(screen.getByTestId("k-sheet-content", inclHidden)).borderWidth,
		).toBe(5);
		expect(
			flatStyle(screen.getByTestId("k-sheet-grabber", inclHidden)).width,
		).toBe(21);
	});
});
