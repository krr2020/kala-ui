import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Indicator seam between the library and the playground app: the tab-dot
 * overlay must reach the Indicator through its root slot (style props
 * target the dot, so an overlay passed via style would be dropped), and
 * the demo must anchor dots to real targets — avatars, icons, plain
 * muted squares — never to bare text glyphs (a text child hugs its
 * glyphs, landing the corner-anchored dot on the words). Captions for
 * position targets live outside the Indicator, in a figure column, so
 * long labels wrap as captions instead of inside a 48dp box. Static
 * parse on purpose, same technique as the component seam.
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

	it("anchors the avatar and icon rows on real targets, no inner text", () => {
		const avatar = section(demo, 'DemoBlock label="On Avatar"', "</DemoBlock>");
		const avatarCount = (avatar.match(/<Indicator[\s>]/g) ?? []).length;
		expect(avatarCount).toBeGreaterThanOrEqual(3);
		expect(avatar.match(/<Avatar[\s>]/g)?.length).toBe(avatarCount);
		for (const block of indicatorBlocks(avatar)) {
			expect(block).not.toContain("<KText");
		}

		const icons = section(demo, 'DemoBlock label="On Icons"', "</DemoBlock>");
		const iconCount = (icons.match(/<Indicator[\s>]/g) ?? []).length;
		expect(iconCount).toBeGreaterThanOrEqual(3);
		expect(icons.match(/<Icon[\s>]/g)?.length).toBe(iconCount);
		for (const block of indicatorBlocks(icons)) {
			expect(block).not.toContain("<KText");
		}
	});

	it("presence dots sit inside the avatar corner like Avatar's own status dot", () => {
		const avatar = section(demo, 'DemoBlock label="On Avatar"', "</DemoBlock>");
		// presence arms (no label): bottom-right, ringed, offset = size/2 + 2
		// pulls the dot fully inside — the placement Avatar's status prop
		// uses (right/bottom 0 + background ring)
		const presence = indicatorBlocks(avatar).filter(
			(block) => !block.includes("label="),
		);
		expect(presence.length).toBe(3);
		for (const block of presence) {
			expect(block).toContain('position="bottom-right"');
			expect(block).toContain("withBorder");
			expect(block).toContain("size={12}");
			expect(block).toContain("offset={8}");
		}
	});

	it("count badge hugs the inside of the avatar's top-right corner", () => {
		const avatar = section(demo, 'DemoBlock label="On Avatar"', "</DemoBlock>");
		const badge = indicatorBlocks(avatar).find((block) =>
			block.includes("label="),
		);
		expect(badge).toBeDefined();
		// size-16 badge: offset = 16/2 + 2 keeps it inside the corner; the
		// label grows minWidth leftward, never toward the anchor
		expect(badge).toContain('position="top-right"');
		expect(badge).toContain("withBorder");
		expect(badge).toContain("size={16}");
		expect(badge).toContain("offset={10}");
		// multi-digit width growth is exercised on the icon badge
		const icons = section(demo, 'DemoBlock label="On Icons"', "</DemoBlock>");
		expect(icons).toContain('label="99+"');
	});

	it("icon badges keep corner-centered anchors but gain the ring", () => {
		const icons = section(demo, 'DemoBlock label="On Icons"', "</DemoBlock>");
		for (const block of indicatorBlocks(icons)) {
			// the disabled arm renders nothing — ring or not — so only the
			// visible badges must carry the ring
			if (block.includes("disabled")) continue;
			expect(block).toContain("withBorder");
			expect(block).not.toContain('position="bottom-right"');
		}
	});

	it("anchors position targets on the muted square with captions outside", () => {
		const positions = section(
			demo,
			'DemoBlock label="Positions"',
			"</DemoBlock>",
		);
		const blocks = indicatorBlocks(positions);
		// the .map() renders one anchor per POSITIONS entry from a single
		// source occurrence — parse the source literal, not instances
		expect(blocks.length).toBeGreaterThanOrEqual(1);
		expect(positions).toContain("POSITIONS.map");
		expect(demo.match(/"(top|middle|bottom)-/g)?.length).toBeGreaterThanOrEqual(
			4,
		);
		for (const block of blocks) {
			// the anchor is the box; the position label is a figure caption
			// rendered outside the Indicator, never wrapped text inside it
			expect(block).toContain("demoStyles.indicatorTarget");
			expect(block).not.toContain("<KText");
		}
		expect(positions).toContain("demoStyles.indicatorFigure");
		expect(positions).toContain("<KText");
	});

	it("keeps exactly one inline arm over text, anchored mid-right", () => {
		const inline = section(demo, 'DemoBlock label="Inline"', "</DemoBlock>");
		expect((inline.match(/<Indicator[^>]*\binline\b/g) ?? []).length).toBe(1);
		expect(inline).toContain('position="middle-right"');
		expect(inline).toContain("<KText");
	});

	it("bordered ring sits on the muted fill; hidden branch keeps the box", () => {
		const bordered = section(
			demo,
			'DemoBlock label="Bordered And Hidden"',
			"</DemoBlock>",
		);
		expect(bordered).toContain("withBorder");
		expect(bordered).toContain("<Indicator disabled");
		expect(
			(bordered.match(/demoStyles\.indicatorTarget\b/g) ?? []).length,
		).toBe(2);
		for (const block of indicatorBlocks(bordered)) {
			expect(block).not.toContain("<KText");
		}
	});

	it("target box is a borderless muted fill with no dead muted twin", () => {
		const target = styleBlock(stylesheet, "indicatorTarget");
		expect(target).toContain("width: 48");
		expect(target).toContain("height: 48");
		expect(target).toContain("borderRadius: 10");
		expect(target).toContain("backgroundColor: theme.muted");
		// no decorative stroke around anchored content
		expect(target).not.toContain("borderWidth");
		expect(target).not.toContain("borderColor");
		expect(demo).not.toContain("indicatorTargetMuted");
		expect(stylesheet).not.toContain("indicatorTargetMuted");
	});

	it("figure caption column centers under the 48-wide anchor rail", () => {
		const figure = styleBlock(stylesheet, "indicatorFigure");
		expect(figure).toContain('alignItems: "center"');
		expect(figure).toContain("width: 48");
	});
});
