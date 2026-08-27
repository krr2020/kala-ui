import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	useLocalStorage,
	useSessionStorage,
} from "../use-local-storage/use-local-storage";

describe("useLocalStorage", () => {
	afterEach(() => {
		window.localStorage.clear();
		vi.restoreAllMocks();
	});

	it("returns the default when storage is empty", () => {
		const { result } = renderHook(() =>
			useLocalStorage<string>({ key: "theme", defaultValue: "light" }),
		);

		expect(result.current[0]).toBe("light");
	});

	it("reads an existing value from storage", () => {
		window.localStorage.setItem("theme", JSON.stringify("dark"));

		const { result } = renderHook(() =>
			useLocalStorage<string>({ key: "theme", defaultValue: "light" }),
		);

		expect(result.current[0]).toBe("dark");
	});

	it("writes values to storage and state", () => {
		const { result } = renderHook(() =>
			useLocalStorage<string>({ key: "theme", defaultValue: "light" }),
		);

		act(() => {
			result.current[1]("dark");
		});

		expect(result.current[0]).toBe("dark");
		expect(window.localStorage.getItem("theme")).toBe('"dark"');
	});

	it("supports functional updates", () => {
		const { result } = renderHook(() =>
			useLocalStorage<number>({ key: "count", defaultValue: 1 }),
		);

		act(() => {
			result.current[1]((current) => current + 41);
		});

		expect(result.current[0]).toBe(42);
		expect(window.localStorage.getItem("count")).toBe("42");
	});

	it("removeValue deletes the key and restores the default", () => {
		const { result } = renderHook(() =>
			useLocalStorage<string>({ key: "theme", defaultValue: "light" }),
		);

		act(() => {
			result.current[1]("dark");
		});
		act(() => {
			result.current[2]();
		});

		expect(window.localStorage.getItem("theme")).toBeNull();
		expect(result.current[0]).toBe("light");
	});

	it("syncs when another tab changes the key", () => {
		const { result } = renderHook(() =>
			useLocalStorage<string>({ key: "theme", defaultValue: "light" }),
		);

		act(() => {
			window.dispatchEvent(
				new StorageEvent("storage", {
					key: "theme",
					newValue: '"dark"',
				}),
			);
		});

		expect(result.current[0]).toBe("dark");
	});

	it("ignores storage events for other keys and own writes", () => {
		const { result } = renderHook(() =>
			useLocalStorage<string>({ key: "theme", defaultValue: "light" }),
		);

		act(() => {
			window.dispatchEvent(
				new StorageEvent("storage", {
					key: "other",
					newValue: '"value"',
				}),
			);
		});
		// Own writes carry no newValue and must not loop back into state.
		act(() => {
			result.current[1]("dark");
			window.dispatchEvent(new StorageEvent("storage", { key: "theme" }));
		});

		expect(result.current[0]).toBe("dark");
	});

	it("supports custom serializers", () => {
		const { result } = renderHook(() =>
			useLocalStorage<Date>({
				key: "at",
				defaultValue: new Date(2026, 0, 1),
				serialize: (value) => value.toISOString(),
				deserialize: (value) => new Date(value),
			}),
		);

		const when = new Date(2026, 7, 27);
		act(() => {
			result.current[1](when);
		});

		expect(window.localStorage.getItem("at")).toBe(when.toISOString());
		expect(result.current[0].getTime()).toBe(when.getTime());
	});

	it("falls back to the default when stored JSON is corrupt", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		window.localStorage.setItem("bad", "{not json");

		const { result } = renderHook(() =>
			useLocalStorage<string>({ key: "bad", defaultValue: "fallback" }),
		);

		expect(result.current[0]).toBe("fallback");
		expect(warn).toHaveBeenCalled();
	});
});

describe("useSessionStorage", () => {
	afterEach(() => {
		window.sessionStorage.clear();
	});

	it("writes to sessionStorage instead of localStorage", () => {
		const { result } = renderHook(() =>
			useSessionStorage<string>({ key: "tab", defaultValue: "a" }),
		);

		act(() => {
			result.current[1]("b");
		});

		expect(window.sessionStorage.getItem("tab")).toBe('"b"');
		expect(window.localStorage.getItem("tab")).toBeNull();
	});
});
