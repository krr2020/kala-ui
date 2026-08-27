import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMove } from "../use-move/use-move";

describe("useMove", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	function setup() {
		vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
			left: 0,
			top: 0,
			width: 200,
			height: 100,
		} as DOMRect);

		const onChange = vi.fn();
		const onScrubStart = vi.fn();
		const onScrubStop = vi.fn();
		const { result, rerender } = renderHook(
			({ change, handlers }) =>
				useMove<HTMLDivElement>(
					change,
					// New handler identities each render — the hook must still work.
					handlers,
				),
			{
				initialProps: {
					change: onChange,
					handlers: { onScrubStart, onScrubStop },
				},
			},
		);

		const node = document.createElement("div");
		act(() => {
			result.current.ref.current = node;
			// Ref attached after mount: rerender so the effect binds listeners.
			rerender({
				change: onChange,
				handlers: { onScrubStart, onScrubStop },
			});
		});

		return { result, node, onChange, onScrubStart, onScrubStop };
	}

	it("reports normalized clamped coordinates during a scrub", () => {
		const { node, onChange, onScrubStart } = setup();

		act(() => {
			node.dispatchEvent(
				new MouseEvent("mousedown", { clientX: 100, clientY: 50 }),
			);
		});

		expect(onScrubStart).toHaveBeenCalledTimes(1);

		act(() => {
			window.dispatchEvent(
				new MouseEvent("mousemove", { clientX: 300, clientY: -20 }),
			);
		});

		expect(onChange).toHaveBeenLastCalledWith({ x: 1, y: 0 });

		act(() => {
			window.dispatchEvent(new MouseEvent("mouseup"));
		});

		expect(onChange).toHaveBeenNthCalledWith(1, { x: 0.5, y: 0.5 });
		expect(onChange).toHaveBeenLastCalledWith({ x: 1, y: 0 });
	});

	it("activates on mousedown and deactivates on mouseup", () => {
		const { result, node, onScrubStop } = setup();

		expect(result.current.active).toBe(false);

		act(() => {
			node.dispatchEvent(
				new MouseEvent("mousedown", { clientX: 10, clientY: 10 }),
			);
		});
		expect(result.current.active).toBe(true);

		act(() => {
			window.dispatchEvent(new MouseEvent("mouseup"));
		});
		expect(result.current.active).toBe(false);
		expect(onScrubStop).toHaveBeenCalledTimes(1);
	});

	it("removes window listeners after mouseup", () => {
		const { node, onChange } = setup();

		act(() => {
			node.dispatchEvent(
				new MouseEvent("mousedown", { clientX: 10, clientY: 10 }),
			);
		});
		act(() => {
			window.dispatchEvent(new MouseEvent("mouseup"));
		});

		const calls = onChange.mock.calls.length;
		window.dispatchEvent(
			new MouseEvent("mousemove", { clientX: 10, clientY: 10 }),
		);
		expect(onChange.mock.calls.length).toBe(calls);
	});
});
