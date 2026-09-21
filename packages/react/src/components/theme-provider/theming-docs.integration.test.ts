import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DOC = resolve(__dirname, "../../../../../THEMING.md");

describe("THEMING.md theme lists (M4)", () => {
	it("does not advertise themes the provider rejects", () => {
		const doc = readFileSync(DOC, "utf8");
		expect(doc).not.toMatch(/`neutral` · `accent`/);
		expect(doc).not.toMatch(/`neutral`, `accent`, `dark`/);
	});

	it("documents theme registration and the SSR no-FOUC script", () => {
		const doc = readFileSync(DOC, "utf8");
		expect(doc).toContain("themes={[");
		expect(doc).toContain("createThemeScript");
		expect(doc).toContain("dangerouslySetInnerHTML");
	});
});
