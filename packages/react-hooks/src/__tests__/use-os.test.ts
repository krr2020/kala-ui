import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useOs } from "../use-os/use-os";

describe("useOs", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it.each([
		["MacIntel", "", "macos"],
		["iPhone", "", "ios"],
		["Win32", "", "windows"],
		["", "Mozilla/5.0 (Linux; Android 13)", "android"],
		["Linux x86_64", "", "linux"],
	])("detects %s/%s as %s", (platform, userAgent, expected) => {
		vi.spyOn(window.navigator, "platform", "get").mockReturnValue(platform);
		vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(userAgent);

		const { result } = renderHook(() => useOs());
		expect(result.current).toBe(expected);
	});

	it("returns undetermined for an unknown platform", () => {
		vi.spyOn(window.navigator, "platform", "get").mockReturnValue("");
		vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue("");

		const { result } = renderHook(() => useOs());
		expect(result.current).toBe("undetermined");
	});
});
