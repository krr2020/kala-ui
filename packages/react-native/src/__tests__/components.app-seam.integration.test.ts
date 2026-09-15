import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Component seam between the library and the playground app: every
 * component name the app imports from "@kala-ui/react-native" must be a
 * real export of the package entry. Static parse on purpose — importing
 * the entry pulls react-native, which vitest cannot execute; the export
 * LIST is the contract (same technique as the pin in tokens-parity).
 *
 * The sweep covers every .tsx under apps/native-playground/src (not just
 * App.tsx) because demos live in per-section modules; the seam must hold
 * no matter which file grows next.
 */
const SRC_DIR = resolve(__dirname, "../../../../apps/native-playground/src");
const APP_PATH = resolve(SRC_DIR, "App.tsx");
const ENTRY_PATH = resolve(__dirname, "../index.ts");
const MAX_FILE_LINES = 500;

function srcTsxFiles(dir: string): string[] {
	const files: string[] = [];
	for (const entry of readdirSync(dir)) {
		const full = resolve(dir, entry);
		if (statSync(full).isDirectory()) {
			files.push(...srcTsxFiles(full));
		} else if (entry.endsWith(".tsx")) {
			files.push(full);
		}
	}
	return files;
}

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

/**
 * Render-surface census: every testID / accessibilityLabel literal in
 * the playground tree. Pinned exactly (counts included) so a dropped or
 * duplicated demo row, button, or control fails the seam — E2E (the
 * k-* marker contract) and screen-reader labels cannot silently drift
 * during refactors of the demo modules.
 */
function markerCensus(sources: string[]): Map<string, number> {
	const census = new Map<string, number>();
	for (const source of sources) {
		for (const m of source.matchAll(
			/(?:testID|accessibilityLabel)=(?:"[^"]*"|\{`[^`]*`\})/g,
		)) {
			const key = m[0];
			census.set(key, (census.get(key) ?? 0) + 1);
		}
	}
	return census;
}

describe("component app seam", () => {
	const files = srcTsxFiles(SRC_DIR);
	const sources = files.map((f) => readFileSync(f, "utf8"));
	const unionImports = new Set<string>();
	for (const source of sources) {
		for (const name of appImports(source)) unionImports.add(name);
	}

	it("every component the playground imports is exported by the entry", () => {
		expect(unionImports.size).toBeGreaterThan(0);
		const exported = exportNames(readFileSync(ENTRY_PATH, "utf8"));
		const missing = [...unionImports].filter((name) => !exported.has(name));
		expect(missing).toEqual([]);
	});

	it("recent wave components are playground-visible and entry-exported", () => {
		const exported = exportNames(readFileSync(ENTRY_PATH, "utf8"));
		for (const name of [
			"Accordion",
			"Collapsible",
			"Banner",
			"Textarea",
			"List",
			"ListItem",
			"Tabs",
			"SegmentedControl",
			"EmptyState",
			"Tag",
			"Rating",
			"Slider",
			"Dialog",
			"AlertDialog",
			"Toggle",
			"ToggleGroup",
			"DropdownMenu",
			"ContextMenu",
			"Timeline",
			"TagInput",
			"MultiSelect",
			"Combobox",
			"CopyButton",
			"NumberInput",
			"Calendar",
			"DatePicker",
			"DateRangePicker",
			"TimePicker",
			"Indicator",
			"Field",
			"Select",
			"AvatarGroup",
			"RingProgress",
			"LoadingOverlay",
			"ErrorBoundary",
		]) {
			expect(unionImports.has(name), `playground imports ${name}`).toBe(true);
			expect(exported.has(name), `entry exports ${name}`).toBe(true);
		}
	});

	it("every playground source file stays under the line limit", () => {
		expect(files.length).toBeGreaterThan(0);
		for (const file of files) {
			const lines = readFileSync(file, "utf8").split("\n").length;
			expect(lines, `${file} is ${lines} lines`).toBeLessThan(MAX_FILE_LINES);
		}
	});

	it("demo state lives in the demo modules, none in App.tsx", () => {
		const appSource = readFileSync(APP_PATH, "utf8");
		expect(appSource.match(/useState[(<]/g) ?? []).toHaveLength(0);
		let demoHooks = 0;
		for (const file of files) {
			if (file === APP_PATH) continue;
			demoHooks += (readFileSync(file, "utf8").match(/useState[(<]/g) ?? [])
				.length;
		}
		// interactive demos: sheet/dialog/confirm/faq/advanced +
		// toast/banner + agree/sync/plan + range/tab/rating/volume +
		// bold/align/formats + select + loading toggle + crash toggle +
		// otp code entry + menu auto-sync/last-action + number-input +
		// tag recipients + toppings + city + stay date + reminder time +
		// app chrome tab.
		expect(demoHooks).toBe(30);
	});

	it("render-surface census matches the pinned marker/label inventory", () => {
		expect(markerCensus(sources)).toEqual(
			new Map(
				Object.entries({
					'accessibilityLabel="agree to terms"': 1,
					'accessibilityLabel="auto sync"': 1,
					'accessibilityLabel="bold"': 1,
					'accessibilityLabel="email field"': 1,
					'accessibilityLabel="error field"': 1,
					'accessibilityLabel="open confirm dialog"': 1,
					'accessibilityLabel="open demo dialog"': 1,
					'accessibilityLabel="open demo sheet"': 1,
					'accessibilityLabel="plan"': 1,
					'accessibilityLabel="quantity"': 1,
					'accessibilityLabel="range"': 1,
					'accessibilityLabel="show toast"': 1,
					'accessibilityLabel="sun"': 1,
					'accessibilityLabel="sync"': 1,
					'accessibilityLabel="volume"': 1,
					"accessibilityLabel={`activate ${name} theme`}": 1,
					'testID="k-demo-accordion"': 1,
					'testID="k-demo-avatars"': 1,
					'testID="k-demo-badges"': 1,
					'testID="k-demo-banner"': 1,
					'testID="k-demo-buttons"': 1,
					'testID="k-demo-card"': 1,
					'testID="k-demo-charts"': 1,
					'testID="k-demo-collapsible"': 1,
					'testID="k-demo-controls"': 1,
					'testID="k-demo-dialog"': 1,
					'testID="k-demo-icons"': 1,
					'testID="k-demo-list"': 1,
					'testID="k-demo-indicator"': 1,
					'testID="k-demo-input"': 1,
					'testID="k-demo-labels"': 1,
					'testID="k-demo-number-input"': 1,
					'testID="k-demo-progress"': 1,
					'testID="k-demo-radios"': 1,
					'testID="k-demo-rating"': 1,
					'testID="k-demo-avatar-group"': 1,
					'testID="k-demo-ring-progress"': 1,
					'testID="k-demo-loading-overlay"': 1,
					'testID="k-demo-error-boundary"': 1,
					'testID="k-demo-input-otp"': 1,
					'testID="k-demo-password-strength"': 1,
					'testID="k-demo-steps"': 1,
					'testID="k-demo-select"': 1,
					'testID="k-demo-dropdown-menu"': 1,
					'testID="k-demo-context-menu"': 1,
					'testID="k-demo-timeline"': 1,
					'testID="k-demo-tag-input"': 1,
					'testID="k-demo-multi-select"': 1,
					'testID="k-demo-combobox"': 1,
					'testID="k-demo-copy-button"': 1,
					'testID="k-demo-app-shell"': 1,
					'testID="k-demo-calendar"': 1,
					'testID="k-demo-date-picker"': 1,
					'testID="k-demo-data-table"': 1,
					'testID="k-demo-time-picker"': 1,
					'testID="k-demo-segmented"': 1,
					'testID="k-demo-skeletons"': 1,
					'testID="k-demo-slider"': 1,
					'testID="k-demo-spinners"': 1,
					'testID="k-demo-tabs"': 1,
					'testID="k-demo-tags"': 1,
					'testID="k-demo-text"': 1,
					'testID="k-demo-textarea"': 1,
					'testID="k-demo-toggles"': 1,
					"testID={`k-swatch-${token}`}": 1,
					"testID={`k-theme-${name}`}": 1,
				}),
			),
		);
	});
});
