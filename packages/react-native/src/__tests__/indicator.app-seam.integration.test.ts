import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Indicator seam between the library and the playground app: the tab-dot
 * overlay must reach the Indicator through its root slot (style props
 * target the badge, so an overlay passed via style would be dropped), and
 * the demo must exercise the badge API on real targets — avatars with
 * circular overlap, icon touch targets, corner grid with outside
 * captions — never to bare text glyphs. Static parse on purpose, same
 * technique as the component seam.
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

function indicatorBlocks(source: string): string[] {
	return [...source.matchAll(/<Indicator[\s\S]*?<\/Indicator>/g)].map(
		(m) => m[0],
	);
}

describe("indicator app seam", () => {
	const demo = readFileSync(DEMO_PATH, "utf8");
	const stylesheet = readFileSync(STYLESHEET_PATH, "utf8");
	const tabs = readFileSync(TABS_PATH, "utf8");

	it("routes the tab-dot overlay through the Indicator root slot", () => {
		// style lands on the badge, not the wrapper — an absolute overlay
		// must ride slotStyles.root or it never reaches the layout
		expect(tabs).toContain("slotStyles={{ root: overlayStyle }}");
		const overlay = section(tabs, "const overlayStyle: ViewStyle = {", "};");
		expect(overlay).toContain('position: "absolute"');
		// exactly one declaration + one consumer: a second routing (or a
		// stray style={overlayStyle}) fails the count instead of silently
		// double-merging the overlay
		expect(tabs.match(/overlayStyle/g)?.length).toBe(2);
		// the tab dot is a contentless dot hidden per-item, never disabled
		expect(tabs).toMatch(/<Indicator[\s\S]*?\bdot\b[\s\S]*?\binvisible=/);
		const tabDot = section(tabs, "<Indicator", "/>");
		expect(tabDot).not.toContain("disabled");
	});

	it("anchors the avatar row on real targets with circular overlap", () => {
		const avatar = section(demo, 'DemoBlock label="On Avatar"', "</DemoBlock>");
		const avatarCount = (avatar.match(/<Indicator[\s>]/g) ?? []).length;
		expect(avatarCount).toBeGreaterThanOrEqual(3);
		expect(avatar.match(/<Avatar[\s>]/g)?.length).toBe(avatarCount);
		for (const block of indicatorBlocks(avatar)) {
			expect(block).not.toContain("<KText");
		}
		// presence dots: circular overlap, bottom-right, ringed — no
		// hand-tuned offsets; the component owns the inset math
		const presence = indicatorBlocks(avatar).filter(
			(block) =>
				!block.includes("badgeContent") && !block.includes("invisible"),
		);
		expect(presence.length).toBe(2);
		for (const block of presence) {
			expect(block).toContain('overlap="circular"');
			expect(block).toContain(
				'anchorOrigin={{ vertical: "bottom", horizontal: "right" }}',
			);
			expect(block).toContain("withBorder");
			expect(block).not.toContain("offset=");
		}
		// the count badge rides the top-right corner, also circular
		const badge = indicatorBlocks(avatar).find((block) =>
			block.includes("badgeContent"),
		);
		expect(badge).toContain('overlap="circular"');
		expect(badge).toContain(
			'anchorOrigin={{ vertical: "top", horizontal: "right" }}',
		);
		expect(badge).not.toContain("offset=");
		// one arm keeps the target with the badge hidden
		expect(avatar).toContain("<Indicator dot invisible>");
	});

	it("badges icon touch targets with capped counts", () => {
		const icons = section(demo, 'DemoBlock label="On Icons"', "</DemoBlock>");
		const iconCount = (icons.match(/<Indicator[\s>]/g) ?? []).length;
		expect(iconCount).toBeGreaterThanOrEqual(4);
		for (const block of indicatorBlocks(icons)) {
			// badges ride the 48dp touch target, never the glyph box
			expect(block).toContain("demoStyles.iconTarget");
			expect(block).toMatch(/<Icon[\s>]/);
			expect(block).not.toContain("<KText");
		}
		// 120 caps to "99+" through the default max; 0 hides without
		// showZero — a cleared inbox renders no badge at all
		expect(icons).toContain("badgeContent={120}");
		expect(icons).toContain("badgeContent={0}");
		const zeroArm = indicatorBlocks(icons).find((block) =>
			block.includes("badgeContent={0}"),
		);
		expect(zeroArm).not.toContain("showZero");
		expect(icons).not.toContain('badgeContent="99+"');
		expect(icons).not.toContain("offset=");
	});

	it("anchor-corner grid uses anchorOrigin with captions outside", () => {
		const corners = section(
			demo,
			'DemoBlock label="Anchor Corners"',
			"</DemoBlock>",
		);
		// the .map() renders one anchor per CORNERS entry from a single
		// source occurrence — parse the source literal, not instances
		expect(corners).toContain("CORNERS.map");
		expect(
			demo.match(/"(top|bottom)-(left|right)"/g)?.length,
		).toBeGreaterThanOrEqual(4);
		for (const block of indicatorBlocks(corners)) {
			expect(block).toContain("anchorOrigin={anchorOrigin}");
			expect(block).toContain("demoStyles.indicatorTarget");
			expect(block).not.toContain("<KText");
			expect(block).not.toContain("offset=");
		}
		// the caption renders outside the Indicator, in the figure column
		expect(corners).toContain("demoStyles.indicatorFigure");
		expect(corners).toContain("<KText");
	});

	it("counts-and-pulse block pins showZero, string content, invisible", () => {
		const counts = section(
			demo,
			'DemoBlock label="Counts And Pulse"',
			"</DemoBlock>",
		);
		expect(counts).toContain("processing");
		expect(counts).toContain("showZero");
		expect(counts).toContain('badgeContent="!"');
		expect(counts).toContain("<Indicator dot invisible");
		expect((counts.match(/demoStyles\.indicatorTarget\b/g) ?? []).length).toBe(
			4,
		);
	});

	it("keeps exactly one inline arm over text, no hand-tuned offset", () => {
		const inline = section(demo, 'DemoBlock label="Inline"', "</DemoBlock>");
		expect((inline.match(/<Indicator[^>]*\binline\b/g) ?? []).length).toBe(1);
		expect(inline).toContain("<KText");
		expect(inline).not.toContain("offset=");
	});

	it("target styles: borderless muted tile, transparent icon target, 72dp figure", () => {
		const target = styleBlock(stylesheet, "indicatorTarget");
		expect(target).toContain("width: 48");
		expect(target).toContain("height: 48");
		expect(target).toContain("backgroundColor: theme.muted");
		expect(target).not.toContain("borderWidth");

		const iconTarget = styleBlock(stylesheet, "iconTarget");
		expect(iconTarget).toContain("width: 48");
		expect(iconTarget).toContain("height: 48");
		expect(iconTarget).toContain('alignItems: "center"');
		expect(iconTarget).toContain('justifyContent: "center"');
		expect(iconTarget).not.toContain("backgroundColor");

		// 72 fits the longest xs caption ("bottom-right") on one line
		const figure = styleBlock(stylesheet, "indicatorFigure");
		expect(figure).toContain("width: 72");
		expect(figure).toContain('alignItems: "center"');
	});
});
