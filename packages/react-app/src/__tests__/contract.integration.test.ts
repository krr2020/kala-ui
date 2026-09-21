import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "../components");
const CONFIG = join(__dirname, "../../src/config");

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) out.push(...walk(full, out.slice()));
		else out.push(full);
	}
	return out;
}

/**
 * Tailwind utility literals that constitute component base styling. When one
 * appears in component .tsx code the base belongs in a src/config table.
 * Class-strings used purely for conditional logic (sorting icons, state
 * hints) are narrow exceptions listed per-file below.
 */
const TAILWIND_BASE =
	/(?:^|["'`>\s])(?:flex|grid|hidden|block|inline-flex|items-center|justify-between|justify-center|gap-\d|rounded(?:-(?:sm|md|lg|xl|full))?\b|border\b|bg-\w[\w/-]*|text-\w[\w/-]*|p[xytrbl]?-\d|space-[xy]-\d|w-full|h-full|font-\w+|shadow(?:-\w+)?|truncate|whitespace-nowrap|transition(?:-\w+)?|animate-\w+|sticky|relative|absolute|overflow-\w+|min-h-\d|mx-auto|list-none)/;

const EXEMPT = new Set<string>([]);

/**
 * Families ported onto the contract (item 14a). The guard scope grows as
 * PORT_QUEUE shrinks — 14b ports the queue to zero and deletes it.
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
const PORT_QUEUE = [
	"dnd",
	"data-table",
	"header",
	"nav-link",
	"navigation",
	"sidebar",
	"sparkline-chart",
];

describe("react-app config-table contract", () => {
	it("ported component .tsx files carry no inline Tailwind base strings", () => {
		const violators: string[] = [];
		for (const file of walk(ROOT)) {
			if (!file.endsWith(".tsx")) continue;
			if (file.endsWith(".test.tsx") || file.endsWith(".stories.tsx")) continue;
			if (!file.includes(`/components/${[...PORTED].join("/")}`) &&
				![...PORTED].some((f) => file.includes(`/components/${f}/`))) continue;
			const source = readFileSync(file, "utf8");
			for (const line of source.split("\n")) {
				const trimmed = line.trim();
				if (trimmed.startsWith("*") || trimmed.startsWith("//")) continue;
				if (TAILWIND_BASE.test(line)) {
					violators.push(`${file}: ${trimmed.slice(0, 70)}`);
					break;
				}
			}
		}
		expect(violators).toEqual([]);
	});

	it("the port queue only ever shrinks — ported families never re-queue", () => {
		const overlap = PORT_QUEUE.filter((family) => PORTED.has(family));
		expect(overlap).toEqual([]);
	});

	it("no source file exceeds 400 lines", () => {
		const offenders: string[] = [];
		for (const dir of [ROOT, join(__dirname, "../config")]) {
			try {
				for (const file of walk(dir)) {
					if (!/\.(tsx|ts)$/.test(file)) continue;
					if (file.endsWith(".test.") || file.endsWith(".stories.")) continue;
					const lines = readFileSync(file, "utf8").split("\n").length;
					if (lines > 400) offenders.push(`${file}: ${lines}`);
				}
			} catch {
				// config dir may not exist yet — the next test fails on that
			}
		}
		expect(offenders).toEqual([]);
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
				const typesFile = join(dir, `${family}.types.ts`);
				try {
					statSync(typesFile);
			} catch {
					missing.push(typesFile);
					continue;
				}
				const barrel = readFileSync(join(dir, "index.ts"), "utf8");
				if (!barrel.includes(family)) missing.push(`${dir}/index.ts`);
			}
			expect(missing).toEqual([]);
		});
	});
