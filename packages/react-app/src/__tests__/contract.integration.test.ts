import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "../components");
const CONFIG = join(__dirname, "../../src/config");

function walk(dir: string): string[] {
	const out: string[] = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) out.push(...walk(full));
		else out.push(full);
	}
	return out;
}

function familyOf(file: string): string {
	return file.slice(ROOT.length + 1).split("/")[0];
}

function isTestOrStory(file: string): boolean {
	return /\.(test|stories)\.(tsx|ts)$/.test(file);
}

/**
 * Tailwind base utilities, matched per whitespace-split token of a string
 * literal. Anchored end-to-end so config values that merely contain class-like
 * substrings ("var(--border)", "55%") never match.
 *
 * Variant-prefixed utilities (hover:*, md:*) are intentionally out of scope:
 * base styling carries no variant prefix, and the queue families own nearly
 * all of those today.
 */
const TAILWIND_TOKEN =
	/^(?:flex|grid|hidden|block|inline-flex|items-center|justify-between|justify-center|gap-\d+(?:\.\d+)?|rounded(?:-[\w.]+)*|border(?:-[\w/.]+)*|bg-[\w/.-]+|text-[\w/.-]+|p[xytrbl]?-\d+(?:\.\d+)?|m[xytrbl]?-\d+(?:\.\d+)?|space-[xy]-\d+(?:\.\d+)?|w-full|h-full|font-\w+|shadow(?:-\w+)?|truncate|whitespace-nowrap|transition(?:-\w+)?|animate-\w+|sticky|relative|absolute|fixed|overflow-\w+|min-h-\d+|mx-auto|list-none)$/;

/**
 * String literals on a line, with template interpolations unwrapped:
 * `${expr}` becomes ` expr ` so quoted strings inside interpolations are
 * extracted as literals too. Interpolations with nested braces stay inline
 * and end up inside the template-literal match — their raw text is still
 * token-scanned, so the failure direction is over-flagging, never silence.
 */
function stringLiterals(line: string): string[] {
	const unwrapped = line.replace(/\$\{([^{}]*)\}/g, " $1 ");
	const out: string[] = [];
	for (const m of unwrapped.matchAll(
		/"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g,
	)) {
		out.push(m[1] ?? m[2] ?? m[3] ?? "");
	}
	return out;
}

function lineViolates(line: string): boolean {
	return stringLiterals(line).some((literal) =>
		literal
			.split(/\s+/)
			.some((token) => token.length > 0 && TAILWIND_TOKEN.test(token)),
	);
}

/**
 * Families ported onto the contract (item 14). The inline-Tailwind and
 * 400-line guards scan every family NOT in PORT_QUEUE — new families are
 * covered by default (fail-closed) and the family-set test below pins
 * components/ to exactly PORTED ∪ PORT_QUEUE.
 */
const PORTED = new Set([
	"social-login-button",
	"footer",
	"metric-card",
	"session-card",
	"user-menu-dropdown",
	"app-shell",
	"charts",
]);
// The charts family's types file is chart.types.ts (predates the port and
// is the shared BaseChartProps surface), so the guard resolves it by alias.
const TYPES_ALIAS: Record<string, string> = {
	charts: "chart.types.ts",
};
const PORT_QUEUE = [
	"dnd",
	"data-table",
	"header",
	"nav-link",
	"navigation",
	"sidebar",
	"sparkline-chart",
];
const QUEUE = new Set(PORT_QUEUE);

describe("inline-Tailwind detection primitives", () => {
	it.each([
		['<div className="flex items-start gap-4">', true],
		['<div className="flex \\"gap\\" items-center">', true],
		['const cls = cn(base, "w-full");', true],
		["className={`flex ${cond ? 'p-2' : ''}`}", true],
		['<Loader2 className={cn(icon, "animate-spin")} />', true],
		['<span className="mb-1 h-4 w-32">', true],
		['color: "var(--border)",', false],
		['columnWidth: "55%",', false],
		['strokeDashArray: 3,', false],
		["data-testid='session-card-skeleton'", false],
	])("line %s → %s", (line, expected) => {
		expect(lineViolates(line)).toBe(expected);
	});
});

describe("react-app config-table contract", () => {
	it("non-queue component files carry no inline Tailwind base strings", () => {
		const violators: string[] = [];
		for (const file of walk(ROOT)) {
			if (!/\.(tsx|ts)$/.test(file) || isTestOrStory(file)) continue;
			if (QUEUE.has(familyOf(file))) continue;
			const source = readFileSync(file, "utf8");
			source.split("\n").forEach((line, i) => {
				const trimmed = line.trim();
				if (
					trimmed.startsWith("*") ||
					trimmed.startsWith("/*") ||
					trimmed.startsWith("//")
				)
					return;
				if (lineViolates(line)) {
					violators.push(`${file}:${i + 1}: ${trimmed.slice(0, 70)}`);
				}
			});
		}
		expect(violators).toEqual([]);
	});

	it("the port queue only ever shrinks — ported families never re-queue", () => {
		const overlap = PORT_QUEUE.filter((family) => PORTED.has(family));
		expect(overlap).toEqual([]);
	});

	it("components/ holds exactly the ported and queued families", () => {
		const dirs = readdirSync(ROOT).filter((entry) =>
			statSync(join(ROOT, entry)).isDirectory(),
		);
		expect([...dirs].sort()).toEqual([...PORTED, ...PORT_QUEUE].sort());
	});

	it("no non-queue source file exceeds 400 lines", () => {
		const offenders: string[] = [];
		let configFilesCapped = 0;
		for (const dir of [ROOT, CONFIG]) {
			for (const file of walk(dir)) {
				if (!/\.(tsx|ts)$/.test(file) || isTestOrStory(file)) continue;
				if (file.startsWith(ROOT) && QUEUE.has(familyOf(file))) continue;
				if (file.startsWith(CONFIG)) configFilesCapped += 1;
				const lines = readFileSync(file, "utf8").split("\n").length;
				if (lines > 400) offenders.push(`${file}: ${lines}`);
			}
		}
		expect(offenders).toEqual([]);
		// The config dir is inside the cap's scope by construction; pin it so
		// the scope cannot silently shrink back to components/ only.
		expect(configFilesCapped).toBeGreaterThan(0);
	});

	it("every ported family has a config table re-exported from config/index.ts", () => {
		let index = "";
		try {
			index = readFileSync(join(CONFIG, "index.ts"), "utf8");
		} catch {
			throw new Error("src/config/index.ts missing");
		}
		const missing = [...PORTED].filter(
			(family) => !index.includes(`./${family}`),
		);
		expect(missing).toEqual([]);
	});

	it("every ported family ships a <name>.types.ts re-exported from its barrel", () => {
		const missing: string[] = [];
		for (const family of PORTED) {
			const dir = join(ROOT, family);
			const typesFile = join(dir, TYPES_ALIAS[family] ?? `${family}.types.ts`);
			try {
				statSync(typesFile);
			} catch {
				missing.push(typesFile);
				continue;
			}
			const barrel = readFileSync(join(dir, "index.ts"), "utf8");
			const typesModule = TYPES_ALIAS[family] ?? `${family}.types.ts`;
			if (!barrel.includes(typesModule.replace(/\.ts$/, "")))
				missing.push(`${dir}/index.ts`);
		}
		expect(missing).toEqual([]);
	});
});
