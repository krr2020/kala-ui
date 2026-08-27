import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type HotkeyItem, useHotkeys } from "../use-hotkeys/use-hotkeys";

function fireKey(
	key: string,
	modifiers: {
		ctrl?: boolean;
		meta?: boolean;
		alt?: boolean;
		shift?: boolean;
	} = {},
	target: Element | Document = document.documentElement,
) {
	fireEvent(
		target,
		new KeyboardEvent("keydown", {
			key,
			bubbles: true,
			ctrlKey: modifiers.ctrl ?? false,
			metaKey: modifiers.meta ?? false,
			altKey: modifiers.alt ?? false,
			shiftKey: modifiers.shift ?? false,
		}),
	);
}

function HotkeyProbe({ hotkeys }: { hotkeys: HotkeyItem[] }) {
	useHotkeys(hotkeys);
	return null;
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("useHotkeys", () => {
	it("matches plain keys without modifiers", () => {
		const handler = vi.fn();
		render(<HotkeyProbe hotkeys={[["k", handler]]} />);

		fireKey("k");
		expect(handler).toHaveBeenCalledTimes(1);

		fireKey("k", { ctrl: true });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("does not fire when a required modifier is missing or extra", () => {
		const handler = vi.fn();
		render(<HotkeyProbe hotkeys={[["shift+k", handler]]} />);

		fireKey("k");
		fireKey("k", { ctrl: true });
		fireKey("k", { shift: true, ctrl: true });
		expect(handler).not.toHaveBeenCalled();
	});

	it("matches ctrl+key exactly (meta does not satisfy ctrl)", () => {
		vi.stubGlobal("navigator", { platform: "MacIntel", userAgent: "" });
		const handler = vi.fn();
		render(<HotkeyProbe hotkeys={[["ctrl+k", handler]]} />);

		fireKey("k", { ctrl: true });
		expect(handler).toHaveBeenCalledTimes(1);

		fireKey("k", { meta: true });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("maps mod to meta on Apple platforms", () => {
		vi.stubGlobal("navigator", { platform: "MacIntel", userAgent: "" });
		const handler = vi.fn();
		render(<HotkeyProbe hotkeys={[["mod+k", handler]]} />);

		fireKey("k", { meta: true });
		expect(handler).toHaveBeenCalledTimes(1);

		fireKey("k", { ctrl: true });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("maps mod to ctrl on non-Apple platforms", () => {
		vi.stubGlobal("navigator", { platform: "Win32", userAgent: "" });
		const handler = vi.fn();
		render(<HotkeyProbe hotkeys={[["mod+k", handler]]} />);

		fireKey("k", { ctrl: true });
		expect(handler).toHaveBeenCalledTimes(1);

		fireKey("k", { meta: true });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("supports multi-modifier hotkeys", () => {
		vi.stubGlobal("navigator", { platform: "Win32", userAgent: "" });
		const handler = vi.fn();
		render(<HotkeyProbe hotkeys={[["mod+shift+k", handler]]} />);

		fireKey("k", { ctrl: true, shift: true });
		expect(handler).toHaveBeenCalledTimes(1);

		fireKey("k", { shift: true });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("ignores hotkeys originating from editable targets", () => {
		const handler = vi.fn();
		render(
			<>
				<input aria-label="editable" />
				<HotkeyProbe hotkeys={[["k", handler]]} />
			</>,
		);

		fireKey("k", {}, screen.getByLabelText("editable"));
		expect(handler).not.toHaveBeenCalled();
	});

	it("prevents default when the option is set", () => {
		const handler = vi.fn();
		render(
			<HotkeyProbe hotkeys={[["k", handler, { preventDefault: true }]]} />,
		);

		const event = new KeyboardEvent("keydown", {
			key: "k",
			bubbles: true,
			cancelable: true,
		});
		const preventDefaultSpy = vi.spyOn(event, "preventDefault");
		act(() => {
			document.documentElement.dispatchEvent(event);
		});

		expect(handler).toHaveBeenCalledTimes(1);
		expect(preventDefaultSpy).toHaveBeenCalled();
	});
});
