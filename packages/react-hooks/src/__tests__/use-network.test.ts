import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useNetwork } from "../use-network/use-network";

function setOnline(online: boolean) {
	Object.defineProperty(navigator, "onLine", {
		configurable: true,
		value: online,
	});
}

describe("useNetwork", () => {
	afterEach(() => {
		setOnline(true);
	});

	it("reports the initial online status", () => {
		setOnline(true);
		const { result } = renderHook(() => useNetwork());
		expect(result.current.online).toBe(true);
	});

	it("reacts to going offline and back online", () => {
		setOnline(true);
		const { result } = renderHook(() => useNetwork());

		setOnline(false);
		act(() => {
			window.dispatchEvent(new Event("offline"));
		});
		expect(result.current.online).toBe(false);

		setOnline(true);
		act(() => {
			window.dispatchEvent(new Event("online"));
		});
		expect(result.current.online).toBe(true);
	});
});
