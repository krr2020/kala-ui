import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useDocumentTitle } from "../use-document-title/use-document-title";

describe("useDocumentTitle", () => {
	const originalTitle = document.title;

	afterEach(() => {
		document.title = originalTitle;
	});

	it("sets document.title", () => {
		renderHook(() => useDocumentTitle("My awesome page"));
		expect(document.title).toBe("My awesome page");
	});

	it("trims surrounding whitespace", () => {
		renderHook(() => useDocumentTitle("  Padded  "));
		expect(document.title).toBe("Padded");
	});

	it("ignores empty and whitespace-only titles", () => {
		document.title = "Keep me";
		renderHook(() => useDocumentTitle("   "));
		expect(document.title).toBe("Keep me");
	});

	it("updates the title when it changes between renders", () => {
		const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
			initialProps: { title: "Page A" },
		});
		expect(document.title).toBe("Page A");

		rerender({ title: "Page B" });
		expect(document.title).toBe("Page B");
	});
});
