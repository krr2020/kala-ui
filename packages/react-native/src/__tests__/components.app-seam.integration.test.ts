import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Component seam between the library and the playground app: every
 * component name the app imports from "@kala-ui/react-native" must be a
 * real export of the package entry. Static parse on purpose — importing
 * the entry pulls react-native, which vitest cannot execute; the export
 * LIST is the contract (same technique as the pin in tokens-parity).
 */
const APP_PATH = resolve(
	__dirname,
	"../../../../apps/native-playground/src/App.tsx",
);
const ENTRY_PATH = resolve(__dirname, "../index.ts");

function exportNames(entry: string): Set<string> {
	expect(entry).not.toMatch(/export\s+\*/);
	const names = new Set<string>();
	for (const m of entry.matchAll(
		/export\s+(?:type\s+)?\{([^}]*)\}\s*from\s*"[^"]+";/g,
	)) {
		for (const part of m[1].split(",")) {
			const name = part
				.trim()
				.replace(/^type /, "")
				.split(" as ")
				.pop();
			if (name) names.add(name);
		}
	}
	expect(names.size).toBeGreaterThan(0);
	return names;
}

describe("component app seam", () => {
	function appImports(app: string): Set<string> {
		const imports = new Set<string>();
		for (const m of app.matchAll(
			/import\s+\{([^}]*)\}\s*from\s*"@kala-ui\/react-native"/g,
		)) {
			for (const part of m[1].split(",")) {
				const name = part
					.trim()
					.replace(/^type /, "")
					.split(" as ")[0];
				if (name) imports.add(name);
			}
		}
		return imports;
	}

	it("every component the playground imports is exported by the entry", () => {
		const app = readFileSync(APP_PATH, "utf8");
		const imports = appImports(app);
		expect(imports.size).toBeGreaterThan(0);
		const exported = exportNames(readFileSync(ENTRY_PATH, "utf8"));
		const missing = [...imports].filter((name) => !exported.has(name));
		expect(missing).toEqual([]);
	});

	it("recent wave components are playground-visible and entry-exported", () => {
		const app = readFileSync(APP_PATH, "utf8");
		const imports = appImports(app);
		const exported = exportNames(readFileSync(ENTRY_PATH, "utf8"));
		for (const name of [
			"Tabs",
			"SegmentedControl",
			"EmptyState",
			"Tag",
			"Rating",
			"Pagination",
			"Slider",
		]) {
			expect(imports.has(name), `App.tsx imports ${name}`).toBe(true);
			expect(exported.has(name), `entry exports ${name}`).toBe(true);
		}
	});
});
