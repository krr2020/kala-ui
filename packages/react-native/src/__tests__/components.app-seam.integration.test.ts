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
		// toppings + city + stay date + reminder time +
		// app chrome tab + route selection (group + component) +
		// button press counter.
		expect(demoHooks).toBe(31);
	});

	it("registry maps groups to components with dedicated demos and fallbacks", () => {
		const registry = readFileSync(
			`${APP_PATH.replace("App.tsx", "demos/components/registry.tsx")}`,
			"utf8",
		);
		const shell = readFileSync(
			`${APP_PATH.replace("App.tsx", "route-shell.tsx")}`,
			"utf8",
		);
		expect(shell).toMatch(/componentGroups/);
		// dedicated demos wired; undedicated components fall back to the
		// group overview (entry without render) until their demo lands.
		for (const [name, demo] of [
			["button", "ButtonDemo"],
			["text", "TextDemo"],
			["heading", "HeadingDemo"],
			["icon", "IconDemo"],
			["badge", "BadgeDemo"],
			["tag", "TagDemo"],
			["separator", "SeparatorDemo"],
			["card", "CardDemo"],
			["avatar", "AvatarDemo"],
		] as const) {
			expect(registry).toMatch(
				new RegExp(`name: "${name}",[\\s\\S]*?render: \\(\\) => <${demo}`),
			);
		}
		expect(registry).toMatch(/name: "list"\s*\},?/);
		expect(registry).toMatch(/name: "avatar-group"\s*\},?/);
	});

	it("registry declares a package source on every group — app groups segregated", () => {
		const registry = readFileSync(
			`${APP_PATH.replace("App.tsx", "demos/components/registry.tsx")}`,
			"utf8",
		);
		const stylesheet = readFileSync(
			`${APP_PATH.replace("App.tsx", "demos/stylesheet.ts")}`,
			"utf8",
		);
		const shell = readFileSync(
			`${APP_PATH.replace("App.tsx", "route-shell.tsx")}`,
			"utf8",
		);
		// source is required on every group: one declaration per title
		// (trailing comma keeps the interface's union type out of the count).
		expect(registry.match(/source: "(?:library|app)",/g) ?? []).toHaveLength(
			(registry.match(/title: "/g) ?? []).length,
		);
		// exactly the react-native-app-backed groups are app-sourced.
		for (const name of ["data", "charts", "app chrome"]) {
			expect(registry).toMatch(
				new RegExp(`name: "${name}",[\\s\\S]*?source: "app"`),
			);
		}
		expect(registry.match(/source: "app"/g) ?? []).toHaveLength(3);
		// distinct chip + header styles exist and the shell applies them.
		expect(stylesheet).toMatch(/sectionHeader:/);
		expect(stylesheet).toMatch(/appChip:/);
		expect(stylesheet).toMatch(/appChipText:/);
		expect(shell).toMatch(/source === "app"/);
		expect(shell).toMatch(/demoStyles\.sectionHeader/);
		expect(shell).toMatch(/demoStyles\.appChip/);
		// a section header renders only when its segment is non-empty.
		expect(shell).toMatch(/\.length > 0/);
	});

	it("theme switcher is hoisted into the shell header for every preview", () => {
		const shell = readFileSync(
			`${APP_PATH.replace("App.tsx", "route-shell.tsx")}`,
			"utf8",
		);
		const tokens = readFileSync(
			`${APP_PATH.replace("App.tsx", "demos/tokens-demo.tsx")}`,
			"utf8",
		);
		const stylesheet = readFileSync(
			`${APP_PATH.replace("App.tsx", "demos/stylesheet.ts")}`,
			"utf8",
		);
		// the shell owns the theme chips; the tokens demo no longer duplicates them.
		expect(shell).toMatch(/themeNames/);
		expect(shell).toMatch(/k-theme-/);
		expect(shell).toMatch(/UnistylesRuntime\.setTheme/);
		expect(tokens).not.toMatch(/k-theme-/);
		// compact themeRow style is defined and applied in the shell.
		expect(stylesheet).toMatch(/themeRow:/);
		expect(shell).toMatch(/demoStyles\.themeRow/);
		// header text formatting: humanized component label + re-cased line.
		expect(shell).toMatch(/\{group\.title\} · \{component\.label\}/);
		expect(shell).toMatch(/Kala UI · Native/);
		expect(shell).not.toMatch(/kala-ui · native/);
		// the switcher strip is the ONLY pinned tier: it stays inside the
		// SafeAreaView before the content ScrollView opens, while the group/
		// component chip rows live INSIDE the scrolling routeContent.
		expect(shell.indexOf("demoStyles.themeRow")).toBeLessThan(
			shell.indexOf("demoStyles.chipRows"),
		);
		const contentScrollAt = shell.indexOf("demoStyles.routeContent");
		expect(contentScrollAt).toBeGreaterThan(-1);
		expect(shell.indexOf("demoStyles.themeRow")).toBeLessThan(contentScrollAt);
		expect(shell.indexOf("demoStyles.chipRows")).toBeGreaterThan(
			contentScrollAt,
		);
		expect(
			shell.indexOf("{preview()}"),
			"preview renders after chipRows",
		).toBeGreaterThan(shell.indexOf("demoStyles.chipRows"));
		// chipRows is the first scrolling child — no stray chipRows View
		// remains between the fixed divider and the content ScrollView.
		expect(shell.slice(0, contentScrollAt)).not.toMatch(/demoStyles\.chipRows/);
		// the strip is one non-wrapping scroll row (horizontal ScrollView)
		// and its chips carry humanized title-case labels like the other rows.
		const themeRowStart = shell.indexOf("demoStyles.themeRow");
		const themeRowEnd = shell.indexOf("demoStyles.chipRows");
		const themeRowBlock = shell.slice(themeRowStart, themeRowEnd);
		expect(themeRowStart).toBeGreaterThan(-1);
		expect(themeRowBlock).toMatch(/horizontal/);
		expect(themeRowBlock).not.toMatch(/flexWrap/);
		expect(themeRowBlock).toMatch(/\{humanizeLabel\(name\)\}/);
		// breathing room: the theme strip pads down from the top inset, and
		// a standalone themed hairline separates it from the chip rows
		// (themeRow → rowDivider → chipRows in source AND render order).
		const themeRowStyle = stylesheet.slice(
			stylesheet.indexOf("themeRow:"),
			stylesheet.indexOf("rowDivider:"),
		);
		expect(themeRowStyle).toMatch(/paddingTop: 8/);
		expect(themeRowStyle).not.toMatch(/borderBottom/);
		const dividerAt = shell.indexOf("demoStyles.rowDivider", themeRowStart);
		expect(dividerAt).toBeGreaterThan(themeRowStart);
		expect(dividerAt).toBeLessThan(themeRowEnd);
		// exactly one divider in that window (no double hairline).
		expect(
			shell
				.slice(themeRowStart, themeRowEnd)
				.match(/demoStyles\.rowDivider/g) ?? [],
		).toHaveLength(1);
	});

	it("header rows share one chip design and a pinned vertical rhythm", () => {
		const stylesheet = readFileSync(
			`${APP_PATH.replace("App.tsx", "demos/stylesheet.ts")}`,
			"utf8",
		);
		const block = (name: string): string => {
			const start = stylesheet.indexOf(`\t${name}: {`);
			expect(start, `${name} block exists`).toBeGreaterThan(-1);
			const end = stylesheet.indexOf("\t},", start);
			return stylesheet.slice(start, end);
		};
		const chipRows = block("chipRows");
		expect(chipRows).toMatch(/paddingTop: (?:8|1[0-9]|2[0-9]|3[0-9])/);
		// scrolling tier keeps its hairline seam but drops the opaque fill —
		// the content ScrollView's own background covers overscroll now —
		// and breaks out of the screen's 16px gutter so the horizontal chip
		// rows span the full width (their own chipRowContent re-insets 16).
		expect(chipRows).toMatch(/borderBottomWidth: 1/);
		expect(chipRows).not.toMatch(/backgroundColor/);
		expect(chipRows).toMatch(/marginHorizontal: -16/);
		// vertical rhythm: theme strip bottom pad + 1px divider + group-row
		// top pad lands in a comfortable 16–40dp band.
		const themeRow = block("themeRow");
		const pad = (src: string, key: string): number =>
			Number(src.match(new RegExp(`${key}: (\\d+)`))?.[1] ?? 0);
		const gap =
			pad(themeRow, "paddingBottom") + 1 + pad(chipRows, "paddingTop");
		expect(gap).toBeGreaterThanOrEqual(16);
		expect(gap).toBeLessThanOrEqual(40);
		// uniform rhythm across ALL three rows: the group↔component seam
		// (chipRows gap on both sides of the inner divider) must equal the
		// theme↔group seam.
		const innerSeam = 2 * pad(chipRows, "gap") + 1;
		expect(innerSeam).toBe(gap);
		// theme chips wear the same pill as group/filter chips — no tag look.
		const shell = readFileSync(
			`${APP_PATH.replace("App.tsx", "route-shell.tsx")}`,
			"utf8",
		);
		// biome-ignore lint/suspicious/noTemplateCurlyInString: searching the shell source for this literal template text
		const themeChipStart = shell.indexOf("k-theme-" + "${name}");
		expect(themeChipStart, "theme chip marker exists").toBeGreaterThan(-1);
		const themeChipEnd = shell.indexOf("</Pressable>", themeChipStart);
		expect(themeChipEnd, "theme chip Pressable closes").toBeGreaterThan(
			themeChipStart,
		);
		const themePressable = shell.slice(themeChipStart, themeChipEnd);
		// pill first, then the active override last so a selected chip keeps
		// the pill shape and only swaps colors — never reverts to the tag look.
		const chipAt = themePressable.indexOf("demoStyles.chip,");
		const pillAt = themePressable.indexOf("demoStyles.filterChip,");
		const activeAt = themePressable.indexOf("demoStyles.chipActive");
		expect(chipAt).toBeGreaterThan(-1);
		expect(pillAt).toBeGreaterThan(chipAt);
		expect(activeAt).toBeGreaterThan(pillAt);
		const chipActive = block("chipActive");
		expect(chipActive).not.toMatch(/borderRadius/);
		// group chips and filter chips are the same shape: identical style
		// bodies modulo the key name; tier signal lives in text weight only.
		const groupChip = block("groupChip");
		const filterChip = block("filterChip");
		expect(groupChip).not.toMatch(/borderColor: theme\.foreground/);
		expect(groupChip.replace("groupChip", "")).toBe(
			filterChip.replace("filterChip", ""),
		);
		expect(groupChip).not.toMatch(/padding/);
		expect(filterChip).not.toMatch(/padding/);
	});

	it("end-of-scroll padding extends the scroll content, not the frame", () => {
		const stylesheet = readFileSync(
			`${APP_PATH.replace("App.tsx", "demos/stylesheet.ts")}`,
			"utf8",
		);
		const block = (name: string): string => {
			const start = stylesheet.indexOf(`\t${name}: {`);
			expect(start, `${name} block exists`).toBeGreaterThan(-1);
			const end = stylesheet.indexOf("\t},", start);
			return stylesheet.slice(start, end);
		};
		// padding on the ScrollView frame clips the viewport without adding
		// scrollable space — the breathing room must live in routeContent
		// (applied as contentContainerStyle)
		expect(block("routeContent")).toMatch(/paddingBottom: 72/);
		expect(block("screen")).not.toMatch(/paddingBottom/);
	});

	it("humanizeLabel formats chip display text from raw names", async () => {
		const { humanizeLabel } = (await import(
			`${APP_PATH.replace("App.tsx", "demos/components/label.ts")}`
		)) as { humanizeLabel: (name: string) => string };
		expect(humanizeLabel("text-input")).toBe("Text Input");
		expect(humanizeLabel("app chrome")).toBe("App Chrome");
		expect(humanizeLabel("input-otp")).toBe("Input OTP");
		expect(humanizeLabel("button")).toBe("Button");
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
					'accessibilityLabel="press me"': 1,
					'accessibilityLabel="sun button"': 1,
					'accessibilityLabel="save"': 1,
					'accessibilityLabel="share"': 1,
					'accessibilityLabel="next"': 1,
					'accessibilityLabel="more"': 1,
					'accessibilityLabel="open confirm dialog"': 1,
					'accessibilityLabel="open demo dialog"': 1,
					'accessibilityLabel="open demo sheet"': 1,
					'accessibilityLabel="plan"': 1,
					'accessibilityLabel="quantity"': 1,
					'accessibilityLabel="range"': 1,
					'accessibilityLabel="section break"': 1,
					'accessibilityLabel="show toast"': 1,
					'accessibilityLabel="sync"': 1,
					'accessibilityLabel="volume"': 1,
					'accessibilityLabel="app components section"': 1,
					'accessibilityLabel="library components section"': 1,
					"accessibilityLabel={`activate ${name} theme`}": 1,
					"accessibilityLabel={`select ${name} group`}": 1,
					"accessibilityLabel={`show ${name} preview`}": 1,
					'testID="k-demo-accordion"': 1,
					'testID="k-demo-avatars"': 1,
					'testID="k-demo-badges"': 1,
					'testID="k-demo-banner"': 1,
					'testID="k-demo-button"': 1,
					'testID="k-demo-card"': 1,
					'testID="k-demo-charts"': 1,
					'testID="k-demo-collapsible"': 1,
					'testID="k-demo-controls"': 1,
					'testID="k-demo-dialog"': 1,
					'testID="k-demo-heading"': 1,
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
					'testID="k-demo-separator"': 1,
					'testID="k-demo-dropdown-menu"': 1,
					'testID="k-demo-context-menu"': 1,
					'testID="k-demo-timeline"': 1,
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
					'testID="k-demo-tag"': 1,
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

	it("text demo color pills have a filled ramp + foreground arm in every theme", () => {
		const themesFile = readFileSync(
			resolve(__dirname, "../themes/definitions.ts"),
			"utf8",
		);
		const demo = readFileSync(
			`${APP_PATH.replace("App.tsx", "demos/components/text-demo.tsx")}`,
			"utf8",
		);
		const colorsBlock = demo.split("const COLORS = [")[1]?.split("]")[0] ?? "";
		const colors = [...colorsBlock.matchAll(/"([a-z]+)"/g)].map((m) => m[1]);
		// every exported theme object gets its own `export const <name> = {`
		// block — enumerate from source so a new theme cannot skip the guard
		const themeNames = [
			...themesFile.matchAll(/export const (\w+) = \{/g),
		]
			.map((m) => m[1])
			.filter((name) => name !== "themes");
		for (const themeName of themeNames) {
			const block = themesFile
				.split(`export const ${themeName} = {`)[1]
				?.split("\n};")[0];
			expect(block, `${themeName} block exists`).toBeTruthy();
			for (const color of colors) {
				const value = (key: string) =>
					block
						?.split("\n")
						.find((l) => l.trimStart().startsWith(`${key}: "`))
						?.match(/"([^"]+)"/)?.[1];
				expect(value(color), `${themeName}.${color}`).toBeTruthy();
				expect(
					value(`${color}Foreground`),
					`${themeName}.${color}Foreground`,
				).toBeTruthy();
			}
		}
	});
});
