import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Indicator seam between the library and the playground app: the tab-dot
 * overlay must reach the Indicator through its root slot (style props
 * target the dot, so an overlay passed via style would be dropped), and
 * the anchor demos must wrap fixed-size themed target boxes — a bare
 * text child hugs its glyphs, landing the corner-anchored dot on the
 * text. Static parse on purpose, same technique as the component seam.
 */
const DEMO_PATH = resolve(
	__dirname,
	"../../../../apps/native-playground/src/demos/components/indicator-demo.tsx",
);
const STYLESHEET_PATH = resolve(
	__dirname,
	"../../../../apps/native-playground/src/demos/stylesheet.ts",
);
const TABS_PATH = resolve(__dirname, "../components/tabs/tabs.tsx");

function section(source: string, open: string, close: string): string {
	const start = source.indexOf(open);
	expect(start).toBeGreaterThanOrEqual(0);
	const end = source.indexOf(close, start);
	expect(end).toBeGreaterThanOrEqual(0);
	return source.slice(start, end);
}

function styleBlock(source: string, name: string): string {
	return section(source, `${name}: {`, "},");
}

describe("indicator app seam", () => {
	const demo = readFileSync(DEMO_PATH, "utf8");
	const stylesheet = readFileSync(STYLESHEET_PATH, "utf8");
	const tabs = readFileSync(TABS_PATH, "utf8");

	it("routes the tab-dot overlay through the Indicator root slot", () => {
		// style lands on the dot, not the wrapper — an absolute overlay
		// must ride slotStyles.root or it never reaches the layout
		expect(tabs).toContain("slotStyles={{ root: overlayStyle }}");
		const overlay = section(tabs, "const overlayStyle: ViewStyle = {", "};");
		expect(overlay).toContain('position: "absolute"');
		// exactly one declaration + one consumer: a second routing (or a
		// stray style={overlayStyle}) fails the count instead of silently
		// double-merging the overlay
		expect(tabs.match(/overlayStyle/g)?.length).toBe(2);
	});

	it("anchors every Positions/Offset/Inline demo dot to a themed target box", () => {
		const positions = section(
			demo,
			'DemoBlock label="Positions, Offset, Inline"',
			"</DemoBlock>",
		);
		const indicatorCount = (positions.match(/<Indicator[\s>]/g) ?? []).length;
		// 3 occurrences render 4 anchors (the map yields three) + inline +
		// stretched — one target box per occurrence keeps every dot off glyphs
		expect(indicatorCount).toBeGreaterThanOrEqual(3);
		// one target box per Indicator: dots sit on the box corners,
		// never on bare text children
		expect(positions.match(/demoStyles\.indicatorTarget/g)?.length).toBe(
			indicatorCount,
		);
	});

	it("anchors every demo dot file-wide to a themed target box", () => {
		// whole-file sweep, not just the Positions block: any Indicator
		// left wrapping bare text/icon glyphs puts its dot on the words
		const indicatorCount = (demo.match(/<Indicator[\s>]/g) ?? []).length;
		expect(indicatorCount).toBeGreaterThanOrEqual(7);
		const targetCount =
			(demo.match(/demoStyles\.indicatorTarget\b/g) ?? []).length +
			(demo.match(/demoStyles\.indicatorTargetMuted/g) ?? []).length;
		expect(targetCount).toBe(indicatorCount);
	});

	it("hidden-dot and bordered rows keep boxes; bordered uses the muted fill", () => {
		const hidden = section(
			demo,
			'DemoBlock label="Hidden And Bordered"',
			"</DemoBlock>",
		);
		// disabled branch: no dot renders, but the target box must — so
		// sibling layout stays put when the dot disappears
		expect(hidden).toContain("<Indicator disabled");
		expect(hidden).toMatch(/demoStyles\.indicatorTarget\b/);
		// the border ring paints in theme.background — visible only over
		// the muted fill twin
		expect(hidden).toContain("demoStyles.indicatorTargetMuted");
		expect(hidden).toContain("withBorder");
	});

	it("defines the target boxes with identical geometry, theme-token fills", () => {
		const target = styleBlock(stylesheet, "indicatorTarget");
		for (const block of [target, styleBlock(stylesheet, "indicatorTargetMuted")]) {
			expect(block).toContain("width: 48");
			expect(block).toContain("height: 48");
			expect(block).toContain("borderRadius: 10");
			expect(block).toContain("borderColor: theme.border");
		}
		expect(target).toContain("backgroundColor: theme.card");
		// identical geometry except the fill — pixel sampling gets stable
		// corner coordinates in either variant
		expect(styleBlock(stylesheet, "indicatorTargetMuted")).toContain(
			"backgroundColor: theme.muted",
		);
	});

	it("keeps the inline-vs-stretched contrast in a stretching column", () => {
		const column = styleBlock(stylesheet, "inlineColumn");
		expect(column).toContain('alignSelf: "stretch"');
		expect(column).not.toContain("alignItems");
	});
});
