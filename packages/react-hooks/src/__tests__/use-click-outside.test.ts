import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useClickOutside } from "../use-click-outside/use-click-outside";

describe("useClickOutside", () => {
	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("calls the handler when a mousedown lands outside the element", () => {
		const handler = vi.fn();
		const { result } = renderHook(() =>
			useClickOutside<HTMLDivElement>(handler),
		);

		const inside = document.createElement("div");
		const outside = document.createElement("div");
		document.body.append(inside, outside);

		act(() => {
			result.current.current = inside;
		});

		const event = new MouseEvent("mousedown", { bubbles: true });
		Object.defineProperty(event, "target", { value: outside });
		act(() => {
			document.dispatchEvent(event);
		});

		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("does not call the handler when the event is inside the element", () => {
		const handler = vi.fn();
		const { result } = renderHook(() =>
			useClickOutside<HTMLDivElement>(handler),
		);

		const inside = document.createElement("div");
		document.body.append(inside);

		act(() => {
			result.current.current = inside;
		});

		const event = new MouseEvent("mousedown", { bubbles: true });
		Object.defineProperty(event, "target", { value: inside });
		act(() => {
			document.dispatchEvent(event);
		});

		expect(handler).not.toHaveBeenCalled();
	});

	it("skips events inside an ignored node", () => {
		const handler = vi.fn();
		const ignored = document.createElement("div");
		const { result } = renderHook(() =>
			useClickOutside<HTMLDivElement>(handler, { ignore: [ignored] }),
		);

		const inside = document.createElement("div");
		document.body.append(inside);

		act(() => {
			result.current.current = inside;
		});

		const event = new MouseEvent("mousedown", { bubbles: true });
		Object.defineProperty(event, "target", { value: ignored });
		act(() => {
			document.dispatchEvent(event);
		});

		expect(handler).not.toHaveBeenCalled();
	});

	it("listens to custom events from the options object", () => {
		const handler = vi.fn();
		const { result } = renderHook(() =>
			useClickOutside<HTMLDivElement>(handler, { events: ["focusin"] }),
		);

		const inside = document.createElement("div");
		const outside = document.createElement("div");
		document.body.append(inside, outside);

		act(() => {
			result.current.current = inside;
		});

		const mousedown = new MouseEvent("mousedown", { bubbles: true });
		Object.defineProperty(mousedown, "target", { value: outside });
		const focusin = new FocusEvent("focusin", { bubbles: true });
		Object.defineProperty(focusin, "target", { value: outside });

		act(() => {
			document.dispatchEvent(mousedown);
		});
		expect(handler).not.toHaveBeenCalled();

		act(() => {
			document.dispatchEvent(focusin);
		});
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("removes the listeners on unmount", () => {
		const handler = vi.fn();
		const { result, unmount } = renderHook(() =>
			useClickOutside<HTMLDivElement>(handler),
		);

		const inside = document.createElement("div");
		document.body.append(inside);
		act(() => {
			result.current.current = inside;
		});

		unmount();

		const event = new MouseEvent("mousedown", { bubbles: true });
		Object.defineProperty(event, "target", { value: document.body });
		document.dispatchEvent(event);

		expect(handler).not.toHaveBeenCalled();
	});

	it("uses the latest handler after rerender without rebinding", () => {
		const first = vi.fn();
		const second = vi.fn();
		const { result, rerender } = renderHook(
			({ handler }) => useClickOutside<HTMLDivElement>(handler),
			{ initialProps: { handler: first } },
		);

		const inside = document.createElement("div");
		document.body.append(inside);
		act(() => {
			result.current.current = inside;
		});

		rerender({ handler: second });

		const event = new MouseEvent("mousedown", { bubbles: true });
		Object.defineProperty(event, "target", { value: document.body });
		act(() => {
			document.dispatchEvent(event);
		});

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledTimes(1);
	});
});
