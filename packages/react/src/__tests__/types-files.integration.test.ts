import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// URL bridge identical to the vocabulary guard: the path must flow through a
// parameter — a string literal as the first new URL() argument is rewritten
// by vite's asset plugin into a dev-server URL, which node:fs rejects.
const read = (path: string) =>
	readFileSync(new URL(path, import.meta.url), "utf8");

const exists = (path: string) => existsSync(new URL(path, import.meta.url));

const listDirs = (dir: string) =>
	readdirSync(new URL(dir, import.meta.url), { withFileTypes: true });

const familyDirs = listDirs("../components")
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name)
	.filter((name) => exists(`../components/${name}/index.ts`));

// A types file counts only if it exports at least one Props type. A family
// without one fails closed — there is no skip list.
const exportsPropsType = (source: string) =>
	/export\s+(?:interface|type)\s+\w*Props\b/.test(source) ||
	/export\s+type\s*\{[^}]*Props[^}]*\}/.test(source);

const hasPropsExport = (dir: string): string[] => {
	const path = `../components/${dir}/${dir}.types.ts`;
	if (!exists(path)) return [`${dir}/${dir}.types.ts is missing`];
	const source = read(path);
	if (!exportsPropsType(source))
		return [`${dir}/${dir}.types.ts exports no Props type`];
	return [];
};

describe("types-files convention (item 10)", () => {
	it("every family dir ships a <name>.types.ts with at least one exported Props type", () => {
		expect(familyDirs.length).toBeGreaterThan(0);
		const violations = familyDirs.flatMap(hasPropsExport);
		expect(violations, violations.join("\n")).toEqual([]);
	});
});
