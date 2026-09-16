import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Slot-prop seam between the library and the playground app: the public
 * per-part styling prop is `slotStyles` on BOTH sides of the package
 * boundary. Static parse on purpose — importing the entry pulls
 * react-native, which vitest cannot execute (same technique as the
 * components app-seam suite).
 */
const COMPONENTS_DIR = resolve(__dirname, "../components");
const PLAYGROUND_DIR = resolve(
	__dirname,
	"../../../../apps/native-playground/src",
);

function tsFiles(dir: string): string[] {
	const files: string[] = [];
	for (const entry of readdirSync(dir)) {
		const full = resolve(dir, entry);
		if (statSync(full).isDirectory()) {
			files.push(...tsFiles(full));
		} else if (/\.(tsx|ts)$/.test(entry)) {
			files.push(full);
		}
	}
	return files;
}

// Legacy prop shapes: the old `styles` prop and the interim `overrides`
// spelling. Anchored per shape — `styles,` matches only a whole-line
// destructure, so StyleSheet.create locals and prose never trip it.
const LEGACY_SHAPES = [
	/\boverrides=\{\{/g,
	/\boverrides: \{/g,
	/\boverrides\?\./g,
	/^\t+overrides,$/gm,
	/overrides\?: \{/g,
	/\bstyles=\{\{/g,
	/\bstyles: \{/g,
	/\bstyles\?\./g,
	/^\t+styles,$/gm,
	/\bstyles\?: \{/g,
];

function legacyHits(files: string[]): string[] {
	const hits: string[] = [];
	for (const file of files) {
		if (/\.styles\.ts$/.test(file)) continue;
		const source = readFileSync(file, "utf8");
		for (const shape of LEGACY_SHAPES) {
			shape.lastIndex = 0;
			if (shape.test(source)) hits.push(file);
		}
	}
	return [...new Set(hits)];
}

describe("slot prop seam (library ↔ playground)", () => {
	it("playground demo drives slot overrides through the public slotStyles prop", () => {
		const demo = readFileSync(
			resolve(PLAYGROUND_DIR, "demos/components/avatar-demo.tsx"),
			"utf8",
		);
		expect(demo).toMatch(/slotStyles=\{\{/);
		expect(demo).not.toMatch(/\boverrides=\{\{/);
	});

	it("package component sources carry no legacy slot-prop shapes", () => {
		expect(legacyHits(tsFiles(COMPONENTS_DIR))).toEqual([]);
	});

	it("playground sources carry no legacy slot-prop shapes", () => {
		expect(legacyHits(tsFiles(PLAYGROUND_DIR))).toEqual([]);
	});
});
