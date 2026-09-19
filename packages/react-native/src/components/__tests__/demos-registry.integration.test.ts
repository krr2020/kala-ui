/**
 * Registry ↔ demo-file seam: every component the native playground
 * registers resolves to a dedicated demo module that carries the
 * component's k-demo root marker and imports from its group's package
 * barrel. Static parse on purpose — importing demo modules pulls
 * react-native, which vitest cannot execute; the source text is the
 * contract (same technique as components.app-seam).
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DEMOS_DIR = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos",
);
const COMPONENTS_DIR = resolve(DEMOS_DIR, "components");
const registryFile = readFileSync(resolve(COMPONENTS_DIR, "registry.tsx"), "utf8");
const registry = registryFile;

interface GroupBlock {
	name: string;
	source: "library" | "app";
	overview: string;
	start: number;
	end: number;
}

interface RegisteredComponent {
	name: string;
	group: string;
	source: "library" | "app";
	demo: string;
}

const kebab = (pascal: string): string =>
	pascal
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
		.toLowerCase();

// group headers carry name/label/title/source/overview in declaration
// order; each group's component list lives inside its block
function parseGroups(source: string): GroupBlock[] {
	const heads = [
		...source.matchAll(
			/name: "([\w -]+)",\s*\n\s*label: humanizeLabel\("[^"]+"\),\s*\n\s*title: "[^"]+",\s*\n\s*source: "(library|app)",\s*\n\s*overview: \(\) => <(\w+) \/>/g,
		),
	];
	expect(heads.length, "group headers parse").toBeGreaterThan(0);
	return heads.map((m, i) => ({
		name: m[1],
		source: m[2] as "library" | "app",
		overview: m[3],
		start: m.index ?? 0,
		end: heads[i + 1]?.index ?? source.length,
	}));
}

function parseComponents(source: string, groups: GroupBlock[]): RegisteredComponent[] {
	const out: RegisteredComponent[] = [];
	for (const group of groups) {
		const block = source.slice(group.start, group.end);
		const entries = [
			...block.matchAll(
				/name: "([\w-]+)",(?:\s*\n\s*source: "(library|app)",)?\s*render: \(\) => <(\w+) \/>,/g,
			),
		];
		expect(
			entries.length,
			`${group.name} lists its dedicated demos`,
		).toBeGreaterThan(0);
		for (const m of entries) {
			// per-entry source overrides the group default for composite
			// widgets that live in @kala-ui/react-native-app
			out.push({
				name: m[1],
				group: group.name,
				source: (m[2] as "library" | "app") ?? group.source,
				demo: m[3],
			});
		}
		// no fallback entries: a bare `name: "x" },` component entry (no
		// render) would silently fall back to the group overview
		const fallbacks = block.match(/name: "([\w-]+)",\s*\n\s*\},/g) ?? [];
		expect(
			fallbacks,
			`${group.name} has render-less fallback entries: ${fallbacks.join(", ")}`,
		).toEqual([]);
		// single-line fallback shape
		const inlineFallbacks = block.match(
			/\{ label: humanizeLabel\("[^"]+"\), name: "[^"]+" \},/g,
		) ?? [];
		expect(inlineFallbacks, `${group.name} has inline fallback entries`).toEqual(
			[],
		);
	}
	return out;
}

const groups = parseGroups(registry);
const components = parseComponents(registry, groups);

const demoPath = (demo: string): string => {
	const file = `${kebab(demo)}.tsx`;
	// tokens/data-table/app-chrome overviews live in the parent demos dir
	const path = existsSync(resolve(COMPONENTS_DIR, file))
		? resolve(COMPONENTS_DIR, file)
		: resolve(DEMOS_DIR, file);
	expect(existsSync(path), `${file} exists`).toBe(true);
	return path;
};

const demoSource = (demo: string): string => readFileSync(demoPath(demo), "utf8");

// dedicated screens live under components/; parent-dir files are group
// overviews whose surface rules (barrel imports, humanized copy) are
// owned by the older seams
const isDedicated = (demo: string): boolean =>
	demoPath(demo).startsWith(COMPONENTS_DIR);

describe("playground registry ↔ dedicated demo seam", () => {
	it("every group's overview demo file exists", () => {
		for (const group of groups) {
			expect(
				existsSync(demoPath(group.overview)),
				`${group.overview} overview file`,
			).toBe(true);
		}
	});

	it("the migration covers every group — dedicated demos exist for all registered components", () => {
		// 10 groups × their full component lists; the count is the full
		// registry, so a new fallback entry fails the count OR the
		// fallback assertions above
		expect(groups).toHaveLength(10);
		expect(components.length).toBe(61);
	});

	it("app-backed composites live in the app components group, not library groups", () => {
		const appGroup = groups.find((g) => g.name === "app components");
		expect(appGroup, "app components group exists").toBeDefined();
		expect(appGroup?.source).toBe("app");
		const moved = [
			"list",
			"loading-overlay",
			"error-boundary",
			"empty-state",
			"copy-button",
			"password-strength",
			"steps",
			"timeline",
		];
		const inAppGroup = components
			.filter((c) => c.group === "app components")
			.map((c) => c.name);
		for (const name of moved) {
			expect(inAppGroup, `${name} lives in app components`).toContain(name);
		}
		expect(inAppGroup).toHaveLength(moved.length);
		// library groups carry zero app-backed entries after the move;
		// whole-app groups (data/charts/app chrome) keep their app source
		const libraryGroups = groups
			.filter((g) => g.source === "library")
			.map((g) => g.name);
		for (const c of components) {
			if (libraryGroups.includes(c.group)) {
				expect(c.source, `${c.name} pollutes library group ${c.group}`).toBe(
					"library",
				);
			}
		}
		// ordering: app components clusters with the app-backed groups —
		// directly after data, directly before charts
		const names = groups.map((g) => g.name);
		expect(names.indexOf("app components") - names.indexOf("data")).toBe(1);
		expect(names.indexOf("charts") - names.indexOf("app components")).toBe(1);
	});

	it("every registered component's demo carries its k-demo root marker", () => {
		// markers that predate the kebab-exact convention keep their
		// historical plural/short spellings
		const markerAliases: Record<string, string> = {
			icon: "k-demo-icons",
			avatar: "k-demo-avatars",
			badge: "k-demo-badges",
			tag: "k-demo-tag",
			theming: "k-demo-theming",
		};
		for (const { name, demo } of components) {
			const src = demoSource(demo);
			const marker = markerAliases[name] ?? `k-demo-${name}`;
			expect(
				src,
				`${kebab(demo)}.tsx carries ${marker}`,
			).toMatch(new RegExp(`testID="${marker}"`));
		}
	});

	it("demos import from their group's package barrel, never deep module paths", () => {
		for (const { source, demo } of components) {
			if (!isDedicated(demo)) continue;
			const src = demoSource(demo);
			const barrel =
				source === "app"
					? "@kala-ui/react-native-app"
					: "@kala-ui/react-native";
			expect(src, `${kebab(demo)}.tsx imports ${barrel}`).toMatch(
				new RegExp(`from "${barrel}"`),
			);
			expect(src).not.toMatch(/from "@kala-ui\/react-native[-a-z]*\//);
		}
	});

	it("dedicated demo copy stays humanized — no lowercase DemoBlock labels", () => {
		for (const { demo } of components) {
			if (!isDedicated(demo)) continue;
			expect(demoSource(demo), `${kebab(demo)}.tsx`).not.toMatch(
				/DemoBlock label="[a-z]/,
			);
		}
	});
});
