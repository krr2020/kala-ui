import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMouse } from "../use-mouse/use-mouse";

function fireMouseMove(clientX: number, clientY: number) {
	window.dispatchEvent(new MouseEvent("mousemove", { clientX, clientY }));
}

describe("useMouse", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("tracks page coordinates without an attached element", () => {
		const { result } = renderHook(() => useMouse());

		act(() => {
			fireMouseMove(120, 80);
		});

		expect(result.current.x).toBe(120);
		expect(result.current.y).toBe(80);
	});

	it("reports coordinates relative to the attached element", () => {
		const { result } = renderHook(() => useMouse<HTMLDivElement>());

		vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
			left: 100,
			top: 50,
		} as DOMRect);

		const node = document.createElement("div");
		act(() => {
			result.current.ref.current = node;
		});

		act(() => {
			fireMouseMove(150, 90);
		});

		expect(result.current.x).toBe(50);
		expect(result.current.y).toBe(40);
	});
});
