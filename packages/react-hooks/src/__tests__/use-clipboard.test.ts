import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useClipboard } from "../use-clipboard/use-clipboard";

async function flushMicrotasks() {
	await act(async () => {
		await Promise.resolve();
	});
}

describe("useClipboard", () => {
	let writeText: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.useFakeTimers();
		writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText },
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("copies text and sets copied, then resets after the timeout", async () => {
		const { result } = renderHook(() => useClipboard({ timeout: 1000 }));

		act(() => {
			result.current.copy("hello");
		});
		await flushMicrotasks();

		expect(writeText).toHaveBeenCalledWith("hello");
		expect(result.current.copied).toBe(true);
		expect(result.current.error).toBeNull();

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.copied).toBe(false);
	});

	it("exposes clipboard failures as error", async () => {
		writeText.mockRejectedValue(new Error("denied"));
		const { result } = renderHook(() => useClipboard());

		act(() => {
			result.current.copy("nope");
		});
		await flushMicrotasks();

		expect(result.current.copied).toBe(false);
		expect(result.current.error).toBeInstanceOf(Error);
		expect(result.current.error?.message).toBe("denied");
	});

	it("reports an error when the Clipboard API is unavailable", () => {
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: undefined,
		});
		const { result } = renderHook(() => useClipboard());

		act(() => {
			result.current.copy("anything");
		});

		expect(result.current.error?.message).toBe("Clipboard API not available");
		expect(result.current.copied).toBe(false);
	});

	it("reset clears copied state and cancels the pending reset timer", async () => {
		const { result } = renderHook(() => useClipboard({ timeout: 1000 }));

		act(() => {
			result.current.copy("hello");
		});
		await flushMicrotasks();
		expect(result.current.copied).toBe(true);

		act(() => {
			result.current.reset();
			vi.advanceTimersByTime(5000);
		});
		expect(result.current.copied).toBe(false);
		expect(result.current.error).toBeNull();
	});
});
