import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as portable from "../portable";

const srcRoot = path.resolve(__dirname, "..");

describe("portable barrel", () => {
	it("exports exactly the DOM-free hook set", () => {
		expect(Object.keys(portable).sort()).toEqual(
			[
				"DOTS",
				"assignRef",
				"mergeRefs",
				"useCallbackRef",
				"useCounter",
				"useDebounce",
				"useDisclosure",
				"useListState",
				"useMergedRef",
				"useMounted",
				"usePagination",
				"usePrevious",
				"useToggle",
				"useUncontrolled",
			].sort(),
		);
	});

	it("every source file behind the barrel is DOM-free (no window/document/navigator, no react-dom)", () => {
		const files = [
			"portable.ts",
			"use-counter/use-counter.ts",
			"use-debounce/use-debounce.ts",
			"use-disclosure/use-disclosure.ts",
			"use-list-state/use-list-state.ts",
			"use-merged-ref/use-merged-ref.ts",
			"use-mounted/use-mounted.ts",
			"use-pagination/use-pagination.ts",
			"use-previous/use-previous.ts",
			"use-toggle/use-toggle.ts",
			"use-uncontrolled/use-uncontrolled.ts",
			"utils/index.ts",
			...fs
				.readdirSync(path.join(srcRoot, "utils"))
				.filter((f) => f.endsWith(".ts"))
				.map((f) => `utils/${f}`),
		];
		const unique = [...new Set(files)];
		expect(unique.length).toBeGreaterThan(0);

		for (const rel of unique) {
			const full = path.join(srcRoot, rel);
			if (!fs.existsSync(full)) continue;
			const raw = fs.readFileSync(full, "utf8");
			// comments can legitimately mention DOM words — scan code only
			const code = raw
				.replace(/\/\*[\s\S]*?\*\//g, "")
				.replace(/^\s*\/\/.*$/gm, "");
			expect(
				/\b(window|document|navigator)\b/.test(code),
				`${rel} references a DOM global`,
			).toBe(false);
			expect(
				/["']react-dom["']/.test(raw),
				`${rel} imports react-dom`,
			).toBe(false);
		}
	});

	it("package contract: ./portable subpath + optional react-dom peer", () => {
		const pkg = JSON.parse(
			fs.readFileSync(path.join(srcRoot, "..", "package.json"), "utf8"),
		);
		const entry = pkg.exports?.["./portable"];
		expect(entry).toBeDefined();
		expect(entry?.import?.default).toContain("portable.mjs");
		expect(entry?.import?.types).toBeTruthy();
		expect(entry?.require?.default).toContain("portable.cjs");
		expect(entry?.require?.types).toBeTruthy();
		expect(pkg.peerDependenciesMeta?.["react-dom"]?.optional).toBe(true);
	});
});
