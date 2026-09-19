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
			"Tabs",
			"SegmentedControl",
			"Tag",
			"Rating",
			"Slider",
			"Dialog",
			"AlertDialog",
			"Toggle",
			"ToggleGroup",
			"DropdownMenu",
			"ContextMenu",
			"MultiSelect",
			"Combobox",
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
		// toast/banner + agree/sync + range/tab/rating/volume +
		// bold/align/formats + loading toggle + crash toggle +
		// menu auto-sync/last-action + app chrome tab + route selection
		// (group + component) + button press counter + card skeleton
		// toggle + card press counter + 18 dedicated forms demos
		// (text/textarea/number/select/combobox/multi-select/checkbox×2/
		// radio/switch/toggle/slider×2/rating/field×2/otp/calendar/date/
		// time) + forms overview (email/plan/tier/terms) + the three-screen
		// shell stack (screen + source + group + component indexes) +
		// dedicated alert demo (dismiss counter + re-show visibility) +
		// dedicated banner demo (close counter + re-show visibility) +
		// dedicated toast demo (basic/position/auto/manual/long arms) +
		// dedicated progress demo (upload stepper) + dedicated
		// ring-progress demo (sync stepper) + dedicated spinner demo
		// (loading toggle) + dedicated skeleton demo (fetch toggle) +
		// the per-component screens: loading-overlay + error-boundary
		// (crash) + empty-state (skeleton) + password (live text) +
		// tabs + steps + segmented + toggle-group (align/formats) +
		// accordion + collapsible + dropdown (checkbox) + context
		// (last action) + dialog (open/size/pinned + form/long/terms/
		// role/notify arms) + alert-dialog + sheet + metric-card
		// (skeleton) + bar-chart (skeleton) — feedback nav overlays
		// overviews shrank to composed stories. The sheet's form/share/filter
		// + long-form stress variations add ten more (open flags + field
		// arrays + typed values). The navigation group rebuild swaps the old
		// overview arms (tag/rating/volume/bold) for tab/range/align and adds
		// the segmented density arm, dropdown sort+action counters and the
		// context menu's second target — net +2. The sheet footer keyboard-fix
		// unit then gave the sheet demo its pinned-footer + keyboard-awareness
		// arms (open flag, footer press, keyboard toggles) — net +4 to 113.
		expect(demoHooks).toBe(113);
	});

	it("landing offers exactly two package routes", () => {
		const shell = readFileSync(
			`${APP_PATH.replace("App.tsx", "route-shell.tsx")}`,
			"utf8",
		);
		expect(shell).toMatch(/testID="k-landing-root"/);
		expect(shell).toMatch(/testID="k-landing-library"/);
		expect(shell).toMatch(/testID="k-landing-app"/);
		expect(shell).toMatch(/accessibilityLabel="open native components"/);
		expect(shell).toMatch(/accessibilityLabel="open native app components"/);
		// opening a route remembers which source the list screen shows
		expect(shell).toMatch(/setRouteSource\("library"\)/);
		expect(shell).toMatch(/setRouteSource\("app"\)/);
	});

	it("route screens list only the tapped source's groups", () => {
		const shell = readFileSync(
			`${APP_PATH.replace("App.tsx", "route-shell.tsx")}`,
			"utf8",
		);
		expect(shell).toMatch(/testID="k-group-list-root"/);
		expect(shell).toMatch(/k-group-row-\$\{entry\.name\}/);
		expect(shell).toMatch(/source === routeSource/);
		// rows preview their size: component count per group
		expect(shell).toMatch(/\{entry\.components\.length\}/);
	});

	it("group screen pins theme row above the group's own component chips", () => {
		const shell = readFileSync(
			`${APP_PATH.replace("App.tsx", "route-shell.tsx")}`,
			"utf8",
		);
		expect(shell).toMatch(/testID="k-group-root"/);
		// every group open resets to the first component — a componentIndex
		// carried over from a previously visited group would render an
		// out-of-group preview under the new heading
		expect(shell).toMatch(
			/setGroupIndex\(index\);[\s\S]*?setComponentIndex\(0\);/,
		);
		expect(shell).toMatch(/\{group\.title\} · \{component\.label\}/);
	});

	it("back navigation pops one level from buttons and hardware back", () => {
		const shell = readFileSync(
			`${APP_PATH.replace("App.tsx", "route-shell.tsx")}`,
			"utf8",
		);
		expect(shell).toMatch(/"k-back-home"/);
		expect(shell).toMatch(/"back to home"/);
		expect(shell).toMatch(/"k-back-groups"/);
		expect(shell).toMatch(/"back to groups"/);
		// navigation runs through ScreenStack: pushes/pops animate, and the
		// component owns the Android hardware-back subscription (consumed
		// above the root, falls through to the OS at the root)
		expect(shell).toMatch(/<ScreenStack/);
		expect(shell).toMatch(/onRequestPop=\{goBack\}/);
		expect(shell).toMatch(/screen === "group" \? "list" : "landing"/);
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
			["avatar-group", "AvatarGroupDemo"],
			["list", "ListDemo"],
		] as const) {
			expect(registry).toMatch(
				new RegExp(`name: "${name}",[\\s\\S]*?render: \\(\\) => <${demo}`),
			);
		}
	});

	it("demo modules never import from the registry (no require cycles)", () => {
		for (const file of files) {
			if (file.endsWith("registry.tsx")) continue;
			expect(
				readFileSync(file, "utf8"),
				`${file} imports from ./registry`,
			).not.toMatch(/from "\.\/registry"/);
		}
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
		// source is required on every group: one declaration per title.
		// Entry-level source overrides (composite widgets that live in the
		// app package) sit next to `render:` — anchor the count on the group
		// header shape (`overview:` follower) so they stay out of it.
		const groupSources =
			registry.match(/source: "(?:library|app)",\s*\n\s*overview:/g) ?? [];
		expect(groupSources).toHaveLength(
			(registry.match(/title: "/g) ?? []).length,
		);
		// exactly the react-native-app-backed groups are app-sourced.
		for (const name of ["data", "app components", "charts", "app chrome"]) {
			expect(registry).toMatch(
				new RegExp(`name: "${name}",[\\s\\S]*?source: "app"`),
			);
		}
		expect(
			registry.match(/source: "app",\s*\n\s*overview:/g) ?? [],
		).toHaveLength(4);
		// landing segregates by package: two entry cards filter groups by
		// their source — the app card carries the app tint, both captions
		// reuse the uppercase section header style
		expect(stylesheet).toMatch(/sectionHeader:/);
		expect(stylesheet).toMatch(/appChip:/);
		expect(stylesheet).toMatch(/appChipText:/);
		expect(shell).toMatch(/k-landing-library/);
		expect(shell).toMatch(/k-landing-app/);
		expect(shell).toMatch(/source === routeSource/);
		expect(shell).toMatch(/demoStyles\.sectionHeader/);
		expect(shell).toMatch(/demoStyles\.appChip/);
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
		// header text formatting: humanized component label; the redundant
		// branding line was removed from the shell — the section title alone
		// heads each preview.
		expect(shell).toMatch(/\{group\.title\} · \{component\.label\}/);
		expect(shell).not.toMatch(/Kala UI · Native/);
		// the back button and the switcher strip are the ONLY pinned tiers:
		// on the group screen both stay before the content ScrollView, while
		// the component chip row leads the scrolling content. The landing/
		// list screens render before the group screen and never carry the
		// pinned tiers.
		const themeRowStart = shell.indexOf("demoStyles.themeRow");
		expect(themeRowStart).toBeGreaterThan(-1);
		expect(
			shell.slice(0, themeRowStart),
			"no pinned tier before the group screen",
		).not.toMatch(/demoStyles\.(themeRow|chipRows)/);
		const groupScreen = shell.slice(themeRowStart);
		// the back tier is pinned ABOVE the theme row and outside the scroll
		const backAt = shell.indexOf('renderBackButton("k-back-groups")');
		expect(backAt).toBeGreaterThan(-1);
		expect(backAt).toBeLessThan(themeRowStart);
		const scrollAt = groupScreen.indexOf('testID="k-group-root"');
		expect(scrollAt).toBeGreaterThan(-1);
		const chipRowsAt = groupScreen.indexOf("demoStyles.chipRows");
		expect(
			groupScreen.slice(scrollAt, chipRowsAt),
			"back button stays out of the scrolling content",
		).not.toMatch(/renderBackButton/);
		const contentScrollAt = groupScreen.indexOf("demoStyles.previewContent");
		expect(contentScrollAt).toBeGreaterThan(-1);
		expect(groupScreen.indexOf("demoStyles.chipRows")).toBeGreaterThan(
			contentScrollAt,
		);
		expect(
			groupScreen.indexOf("{preview()}"),
			"preview renders after chipRows",
		).toBeGreaterThan(groupScreen.indexOf("demoStyles.chipRows"));
		// the strip is one non-wrapping scroll row (horizontal ScrollView)
		// and its chips carry humanized title-case labels like the other rows.
		const stripEnd = groupScreen.indexOf("demoStyles.chipRows");
		const themeRowBlock = groupScreen.slice(0, stripEnd);
		expect(themeRowBlock).toMatch(/horizontal/);
		expect(themeRowBlock).not.toMatch(/flexWrap/);
		expect(themeRowBlock).toMatch(/\{humanizeLabel\(name\)\}/);
		// breathing room: the pinned back tier above the theme strip and the
		// themeRow's own bottom pad keep the header on one rhythm, and a
		// standalone themed hairline separates it from the chip rows
		// (themeRow → rowDivider → chipRows in source AND render order).
		const themeRowStyle = stylesheet.slice(
			stylesheet.indexOf("themeRow:"),
			stylesheet.indexOf("rowDivider:"),
		);
		expect(themeRowStyle).toMatch(/paddingTop: 8/);
		expect(themeRowStyle).not.toMatch(/borderBottom/);
		const dividerAt = groupScreen.indexOf("demoStyles.rowDivider");
		expect(dividerAt).toBeGreaterThan(0);
		expect(dividerAt).toBeLessThan(stripEnd);
		// exactly one divider in that window (no double hairline).
		expect(
			groupScreen.slice(0, stripEnd).match(/demoStyles\.rowDivider/g) ?? [],
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
		// the chips lead the scroll content flush under the pinned header —
		// no vertical padding and no attached hairline; the space above and
		// below the tier comes from previewContent's single gap so the tier
		// stays symmetric
		expect(chipRows).not.toMatch(/paddingTop/);
		expect(chipRows).not.toMatch(/paddingBottom/);
		expect(chipRows).not.toMatch(/borderBottomWidth/);
		// full-width break-out of the screen's 16px gutter so the horizontal
		// chip rows span the screen (their own chipRowContent re-insets 16).
		expect(chipRows).not.toMatch(/backgroundColor/);
		expect(chipRows).toMatch(/marginHorizontal: -16/);
		// vertical rhythm: theme strip bottom pad + 1px divider + the
		// previewContent gap above the chips lands in a comfortable 16–40dp
		// band, and the SAME gap repeats below the chip tier — one gap key
		// owns both sides so the tier reads symmetric.
		const themeRow = block("themeRow");
		const previewContent = block("previewContent");
		const pad = (src: string, key: string): number =>
			Number(src.match(new RegExp(`${key}: (\\d+)`))?.[1] ?? 0);
		const gap = pad(themeRow, "paddingBottom") + 1 + pad(previewContent, "gap");
		expect(gap).toBeGreaterThanOrEqual(16);
		expect(gap).toBeLessThanOrEqual(40);
		expect(pad(previewContent, "gap")).toBeGreaterThanOrEqual(8);
		// uniform rhythm across ALL three rows: the group↔component seam
		// (chipRows gap on both sides of the inner divider) must equal the
		// theme↔group seam.
		const innerSeam = 2 * pad(chipRows, "gap") + 1;
		expect(innerSeam).toBe(21);
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

	it("header chip rows stay single-line and scroll horizontally", () => {
		const shell = readFileSync(
			`${APP_PATH.replace("App.tsx", "route-shell.tsx")}`,
			"utf8",
		);
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
		// the shared chip-row container never wraps — a wrapped row breaks the
		// scrolling contract, so overflow must scroll instead.
		expect(block("picker")).not.toMatch(/flexWrap/);
		// the theme strip is one non-wrapping line: label + scroll view inline,
		// and the scroll frame flexes to the remaining width so overflow scrolls
		// instead of clipping or pushing the row to two lines.
		expect(block("themeRow")).not.toMatch(/flexWrap/);
		expect(block("routeBar")).toMatch(/flexGrow: 0/);
		const pickerUsages = shell.match(/demoStyles\.picker/g) ?? [];
		expect(pickerUsages).toHaveLength(2);
		// every picker-backed ScrollView opens horizontal with the indicator
		// hidden — the opening-tag head of each chunk carries both props
		const rowChunks = shell
			.split("<ScrollView")
			.slice(1)
			.filter((chunk) => chunk.slice(0, 400).includes("demoStyles.picker"));
		expect(rowChunks).toHaveLength(2);
		for (const chunk of rowChunks) {
			const head = chunk.slice(0, 400);
			expect(head).toMatch(/horizontal/);
			expect(head).toMatch(/showsHorizontalScrollIndicator=\{false\}/);
		}
		// the two route entry cards stack full-width on the landing screen —
		// package segregation lives on the cards, not an inline row rule
		expect(block("landingCard")).not.toMatch(/flexDirection/);
		expect(shell.indexOf("k-landing-library")).toBeLessThan(
			shell.indexOf("k-landing-app"),
		);
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
					'accessibilityLabel="Accept terms"': 1,
					'accessibilityLabel="Account"': 1,
					'accessibilityLabel="Advance ring"': 1,
					'accessibilityLabel="Advance step"': 1,
					'accessibilityLabel="Advance upload"': 1,
					'accessibilityLabel="Advanced Filters"': 1,
					'accessibilityLabel="Apply search"': 1,
					'accessibilityLabel="Archiving project"': 1,
					'accessibilityLabel="Billing"': 1,
					'accessibilityLabel="City"': 1,
					'accessibilityLabel="Disabled quantity"': 1,
					'accessibilityLabel="Disabled textarea"': 1,
					'accessibilityLabel="Discard event"': 1,
					'accessibilityLabel="Discard form"': 1,
					'accessibilityLabel="Email"': 1,
					'accessibilityLabel="Error combobox"': 1,
					'accessibilityLabel="Error multi select"': 1,
					'accessibilityLabel="Error quantity"': 1,
					'accessibilityLabel="Error select"': 1,
					'accessibilityLabel="Error textarea"': 1,
					'accessibilityLabel="FAQ"': 1,
					'accessibilityLabel="Feedback"': 1,
					'accessibilityLabel="Fetching orders"': 1,
					'accessibilityLabel="Fruit"': 1,
					'accessibilityLabel="Full name"': 1,
					'accessibilityLabel="Grouped fruit"': 1,
					'accessibilityLabel="Grouped toppings"': 1,
					'accessibilityLabel="Home city"': 1,
					'accessibilityLabel="Invite Code"': 1,
					'accessibilityLabel="Invite teammates"': 1,
					'accessibilityLabel="Legacy settings"': 1,
					'accessibilityLabel="Loading profile"': 1,
					'accessibilityLabel="Locked outline"': 1,
					'accessibilityLabel="Locked section"': 1,
					'accessibilityLabel="Locked select"': 1,
					'accessibilityLabel="Long list city"': 1,
					'accessibilityLabel="Long list toppings"': 1,
					'accessibilityLabel="Long textarea value"': 1,
					'accessibilityLabel="Movie"': 1,
					'accessibilityLabel="Notifications"': 1,
					'accessibilityLabel="Offset with decimals"': 1,
					'accessibilityLabel="Open destructive alert"': 1,
					'accessibilityLabel="Open dialog without close button"': 1,
					'accessibilityLabel="Open dismissable alert"': 1,
					'accessibilityLabel="Open filter sheet"': 1,
					'accessibilityLabel="Open form dialog"': 1,
					'accessibilityLabel="Open form sheet"': 1,
					'accessibilityLabel="Open informational alert"': 1,
					'accessibilityLabel="Open long content alert"': 1,
					'accessibilityLabel="Open long content dialog"': 1,
					'accessibilityLabel="Open long content sheet"': 1,
					'accessibilityLabel="Open long form stress sheet"': 1,
					'accessibilityLabel="Open non-dismissable dialog"': 1,
					'accessibilityLabel="Open non-dismissable sheet"': 1,
					'accessibilityLabel="Open search sheet"': 1,
					'accessibilityLabel="Open share sheet"': 1,
					'accessibilityLabel="Open the notifications card"': 1,
					'accessibilityLabel="Order notes"': 1,
					'accessibilityLabel="Orphan city"': 1,
					'accessibilityLabel="Orphan toppings"': 1,
					'accessibilityLabel="Privacy"': 1,
					'accessibilityLabel="Quantity"': 1,
					'accessibilityLabel="Recent orders"': 1,
					'accessibilityLabel="Referral"': 1,
					'accessibilityLabel="Reset ring"': 1,
					'accessibilityLabel="Reset upload"': 1,
					'accessibilityLabel="Returns"': 1,
					'accessibilityLabel="Role"': 1,
					'accessibilityLabel="Save event"': 1,
					'accessibilityLabel="Save task"': 1,
					'accessibilityLabel="Saving changes"': 1,
					'accessibilityLabel="Search products"': 1,
					'accessibilityLabel="Security"': 1,
					'accessibilityLabel="Session details"': 1,
					'accessibilityLabel="Shipping"': 1,
					'accessibilityLabel="Show Auto Toast"': 1,
					'accessibilityLabel="Show Toast"': 1,
					'accessibilityLabel="Show loading overlay"': 1,
					'accessibilityLabel="Show more"': 1,
					'accessibilityLabel="Silent sync"': 1,
					'accessibilityLabel="Task notes"': 1,
					'accessibilityLabel="Task title"': 1,
					'accessibilityLabel="Tickets"': 1,
					'accessibilityLabel="Timezone"': 1,
					'accessibilityLabel="Toggle loading"': 1,
					'accessibilityLabel="Toppings"': 1,
					'accessibilityLabel="Valid quantity"': 1,
					'accessibilityLabel="Valid select"': 1,
					'accessibilityLabel="Valid textarea"': 1,
					'accessibilityLabel="account password"': 1,
					'accessibilityLabel="agree to terms"': 1,
					'accessibilityLabel="anonymous checkbox"': 1,
					'accessibilityLabel="anonymous radio"': 1,
					'accessibilityLabel="appointment"': 1,
					'accessibilityLabel="auto sync"': 1,
					'accessibilityLabel="background sync"': 1,
					'accessibilityLabel="basic progress"': 1,
					'accessibilityLabel="basic ring"': 1,
					'accessibilityLabel="bounded date"': 1,
					'accessibilityLabel="butt cap ring"': 1,
					'accessibilityLabel="check-in"': 1,
					'accessibilityLabel="clamped at max"': 1,
					'accessibilityLabel="clamped at min"': 1,
					'accessibilityLabel="collapsed range"': 1,
					'accessibilityLabel="custom range progress"': 1,
					'accessibilityLabel="default toggle"': 1,
					'accessibilityLabel="density"': 1,
					'accessibilityLabel="dinner"': 1,
					'accessibilityLabel="disabled input"': 1,
					'accessibilityLabel="email field"': 1,
					'accessibilityLabel="email with icon"': 1,
					'accessibilityLabel="email"': 1,
					'accessibilityLabel="empty progress"': 1,
					'accessibilityLabel="empty ring"': 1,
					'accessibilityLabel="end of day"': 1,
					'accessibilityLabel="error date"': 1,
					'accessibilityLabel="error field"': 1,
					'accessibilityLabel="error input"': 1,
					'accessibilityLabel="full progress"': 1,
					'accessibilityLabel="full ring"': 1,
					'accessibilityLabel="large progress"': 1,
					'accessibilityLabel="large ring"': 1,
					'accessibilityLabel="loading calendar"': 1,
					'accessibilityLabel="loading list"': 1,
					'accessibilityLabel="locked date"': 1,
					'accessibilityLabel="locked on"': 2,
					'accessibilityLabel="locked rating"': 1,
					'accessibilityLabel="locked slider"': 1,
					'accessibilityLabel="locked sync"': 1,
					'accessibilityLabel="locked time"': 1,
					'accessibilityLabel="locked toggle"': 1,
					'accessibilityLabel="long dessert"': 1,
					'accessibilityLabel="long destination"': 1,
					'accessibilityLabel="long placeholder"': 1,
					'accessibilityLabel="long region"': 1,
					'accessibilityLabel="long toggle"': 1,
					'accessibilityLabel="long value"': 1,
					'accessibilityLabel="max rating"': 1,
					'accessibilityLabel="medium date"': 1,
					'accessibilityLabel="medium progress"': 1,
					'accessibilityLabel="medium ring"': 1,
					'accessibilityLabel="midnight"': 1,
					'accessibilityLabel="month jumper"': 1,
					'accessibilityLabel="more"': 1,
					'accessibilityLabel="next week only"': 1,
					'accessibilityLabel="next"': 1,
					'accessibilityLabel="on-primary spinner"': 1,
					'accessibilityLabel="open native app components"': 1,
					'accessibilityLabel="open native components"': 1,
					'accessibilityLabel="orphan select"': 1,
					'accessibilityLabel="outline toggle"': 1,
					'accessibilityLabel="over-clamped progress"': 1,
					'accessibilityLabel="over-clamped ring"': 1,
					'accessibilityLabel="pin"': 1,
					'accessibilityLabel="plan"': 1,
					'accessibilityLabel="prefilled date"': 1,
					'accessibilityLabel="preselected stay"': 1,
					'accessibilityLabel="press me"': 1,
					'accessibilityLabel="price range"': 1,
					'accessibilityLabel="range"': 2,
					'accessibilityLabel="reminder time"': 1,
					'accessibilityLabel="report window"': 1,
					'accessibilityLabel="save"': 1,
					'accessibilityLabel="search"': 1,
					'accessibilityLabel="seat reconciliation"': 1,
					'accessibilityLabel="secondary track ring"': 1,
					'accessibilityLabel="section break"': 1,
					'accessibilityLabel="service"': 1,
					'accessibilityLabel="share"': 1,
					'accessibilityLabel="slider at max"': 1,
					'accessibilityLabel="slider at min"': 1,
					'accessibilityLabel="small date"': 1,
					'accessibilityLabel="small progress"': 1,
					'accessibilityLabel="small ring"': 1,
					'accessibilityLabel="stacked sections ring"': 1,
					'accessibilityLabel="state all"': 1,
					'accessibilityLabel="stay dates"': 1,
					'accessibilityLabel="stepped slider"': 1,
					'accessibilityLabel="sun button"': 1,
					'accessibilityLabel="sync on"': 1,
					'accessibilityLabel="sync ring"': 1,
					'accessibilityLabel="sync"': 2,
					'accessibilityLabel="tap me row"': 1,
					'accessibilityLabel="timer"': 1,
					'accessibilityLabel="trip window"': 1,
					'accessibilityLabel="under-clamped progress"': 1,
					'accessibilityLabel="unit"': 1,
					'accessibilityLabel="upload"': 1,
					'accessibilityLabel="valid input"': 1,
					'accessibilityLabel="volume"': 1,
					'accessibilityLabel="zero rating"': 1,
					"accessibilityLabel={`${color} progress`}": 1,
					"accessibilityLabel={`${size} spinner`}": 1,
					"accessibilityLabel={`${size} toggle`}": 1,
					"accessibilityLabel={`${tone} ring`}": 1,
					"accessibilityLabel={`${variant} skeleton`}": 2,
					"accessibilityLabel={`${variant} spinner`}": 1,
					"accessibilityLabel={`Event field ${index + 1}`}": 1,
					"accessibilityLabel={`Open ${s} sheet`}": 1,
					"accessibilityLabel={`activate ${name} theme`}": 1,
					"accessibilityLabel={`open ${entry.name} group`}": 1,
					"accessibilityLabel={`show ${name} preview`}": 1,
					"accessibilityLabel={`size ${size}`}": 1,
					'testID="k-demo-accordion"': 1,
					'testID="k-demo-alert"': 1,
					'testID="k-demo-alert-dialog"': 1,
					'testID="k-demo-app-components"': 1,
					'testID="k-demo-app-shell"': 1,
					'testID="k-demo-avatar-group"': 1,
					'testID="k-demo-avatar-group-inline"': 1,
					'testID="k-demo-avatars"': 1,
					'testID="k-demo-badges"': 1,
					'testID="k-demo-banner"': 1,
					'testID="k-demo-bar-chart"': 1,
					'testID="k-demo-button"': 1,
					'testID="k-demo-calendar"': 2,
					'testID="k-demo-card"': 1,
					'testID="k-demo-charts"': 1,
					'testID="k-demo-checkbox"': 1,
					'testID="k-demo-collapsible"': 1,
					'testID="k-demo-combobox"': 1,
					'testID="k-demo-context-menu"': 1,
					'testID="k-demo-controls"': 1,
					'testID="k-demo-copy-button"': 1,
					'testID="k-demo-data-table"': 1,
					'testID="k-demo-date-picker"': 2,
					'testID="k-demo-dialog"': 1,
					'testID="k-demo-donut-chart"': 1,
					'testID="k-demo-dropdown-menu"': 1,
					'testID="k-demo-empty-state"': 1,
					'testID="k-demo-error-boundary"': 1,
					'testID="k-demo-feedback"': 1,
					'testID="k-demo-field"': 1,
					'testID="k-demo-forms"': 1,
					'testID="k-demo-heading"': 1,
					'testID="k-demo-icons"': 1,
					'testID="k-demo-indicator"': 1,
					'testID="k-demo-input"': 1,
					'testID="k-demo-input-otp"': 1,
					'testID="k-demo-label"': 1,
					'testID="k-demo-labels"': 1,
					'testID="k-demo-list"': 1,
					'testID="k-demo-loading-overlay"': 1,
					'testID="k-demo-metric-card"': 1,
					'testID="k-demo-multi-select"': 1,
					'testID="k-demo-number-input"': 1,
					'testID="k-demo-password-strength"': 1,
					'testID="k-demo-progress"': 2,
					'testID="k-demo-radio-group"': 1,
					'testID="k-demo-radios"': 1,
					'testID="k-demo-rating"': 1,
					'testID="k-demo-ring-progress"': 2,
					'testID="k-demo-segmented-control"': 1,
					'testID="k-demo-select"': 1,
					'testID="k-demo-separator"': 1,
					'testID="k-demo-sheet"': 1,
					'testID="k-demo-skeleton"': 1,
					'testID="k-demo-skeletons"': 1,
					'testID="k-demo-slider"': 1,
					'testID="k-demo-sparkline"': 1,
					'testID="k-demo-spinner"': 1,
					'testID="k-demo-spinners"': 1,
					'testID="k-demo-steps"': 1,
					'testID="k-demo-switch"': 1,
					'testID="k-demo-tabs"': 1,
					'testID="k-demo-tag"': 1,
					'testID="k-demo-text"': 1,
					'testID="k-demo-text-input"': 1,
					'testID="k-demo-textarea"': 1,
					'testID="k-demo-theming"': 1,
					'testID="k-demo-time-picker"': 2,
					'testID="k-demo-timeline"': 1,
					'testID="k-demo-toast"': 1,
					'testID="k-demo-toggle"': 1,
					'testID="k-demo-toggle-group"': 1,
					'testID="k-group-list-root"': 1,
					'testID="k-group-root"': 1,
					'testID="k-landing-app"': 1,
					'testID="k-landing-library"': 1,
					'testID="k-landing-root"': 1,
					"testID={`k-group-row-${entry.name}`}": 1,
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
		const themeNames = [...themesFile.matchAll(/export const (\w+) = \{/g)]
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

	it("list demo renders glyphs through the library Icon + lucide, not raw characters", () => {
		const demo = readFileSync(
			`${APP_PATH.replace("App.tsx", "demos/components/list-demo.tsx")}`,
			"utf8",
		);
		expect(demo).toMatch(
			/import \{ Flag, Inbox \} from "lucide-react-native";/,
		);
		expect(demo).toMatch(/<Icon icon=\{Inbox\}/);
		expect(demo).toMatch(/<Icon icon=\{Flag\}/);
		expect(demo).not.toMatch(/✉|⚑/);
	});
});
