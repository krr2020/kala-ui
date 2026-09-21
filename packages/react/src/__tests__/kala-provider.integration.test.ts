import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const COMPONENTS_ROOT = join(__dirname, "../components");

/**
 * Reads of the slotStyles prop that must route through useSlotStyles.
 * JSX pass-through writes (slotStyles={{…}} / slotStyles={slotStyles}) are
 * forwards to children, not styling decisions — exempt.
 */
const READ_SYNTAXES: Array<{ name: string; pattern: RegExp }> = [
	{ name: "optional member", pattern: /slotStyles\?\.\w+/ },
	{ name: "member", pattern: /\bslotStyles\.\w+/ },
	{ name: "computed", pattern: /slotStyles\?\.\[/ },
	{ name: "destructure", pattern: /[{,]\s*slotStyles\s*[,\n}]/ },
	{ name: "destructure default", pattern: /[{,]\s*slotStyles\s*=/ },
	{ name: "props member", pattern: /props\.slotStyles\b/ },
];

const WRITE_PATTERNS = /slotStyles=\{\{|\bslotStyles=\{slotStyles\}/;

function componentFiles(dir: string): string[] {
	const out: string[] = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			if (entry === "kala-provider") continue;
			out.push(...componentFiles(full));
		} else if (
			entry.endsWith(".tsx") &&
			!entry.includes(".test.") &&
			!entry.includes(".stories.")
		) {
			out.push(full);
		}
	}
	return out;
}

describe("kala-provider wiring guard", () => {
	it("flags every slotStyles read syntax", () => {
		const samples = [
			"const root = applySlot(cn(x), slotStyles?.root);",
			"applySlot(base, slotStyles.root);",
			"applySlot(base, slotStyles?.[part]);",
			"function C({ className, slotStyles, style }: P) {",
			"function C({ slotStyles = {} }: P) {",
			"const s = props.slotStyles;",
		];
		for (const sample of samples) {
			expect(
				READ_SYNTAXES.some(({ pattern }) => pattern.test(sample)),
				`no syntax matched: ${sample}`,
			).toBe(true);
		}
		const writes = [
			'<Child slotStyles={{ root: "x" }} />',
			"<Child slotStyles={slotStyles} />",
		];
		for (const sample of writes) {
			expect(
				READ_SYNTAXES.some(({ pattern }) =>
					pattern.test(sample.replace(WRITE_PATTERNS, "")),
				),
				`write matched as read: ${sample}`,
			).toBe(false);
		}
	});

	it("fails closed naming any component reading slotStyles without useSlotStyles", () => {
		const violators: string[] = [];
		for (const file of componentFiles(COMPONENTS_ROOT)) {
			const source = readFileSync(file, "utf8");
			const reads = source
				.split("\n")
				.filter(
					(line) =>
						!WRITE_PATTERNS.test(line) &&
						READ_SYNTAXES.some(({ pattern }) => pattern.test(line)),
				);
			if (reads.length > 0 && !source.includes("useSlotStyles(")) {
				violators.push(file);
			}
		}
		expect(violators).toEqual([]);
	});
});
