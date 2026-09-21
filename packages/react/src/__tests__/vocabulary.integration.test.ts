import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
	readFileSync(new URL(path, import.meta.url), "utf8");

const readDir = (dir: string): string[] =>
	readdirSync(new URL(dir, import.meta.url), { withFileTypes: true }).flatMap(
		(entry) =>
			entry.isDirectory()
				? readDir(`${dir}/${entry.name}`)
				: [entry.name].map((n) => `${dir}/${entry.name}`),
	);

const PALETTE = [
	"primary",
	"secondary",
	"destructive",
	"success",
	"warning",
	"info",
	"muted",
] as const;

describe("semantic vocabulary (item 8)", () => {
	it("banner carries the variant axis and the full color palette like Alert", () => {
		const bannerConfig = read("../config/banner.ts");
		expect(bannerConfig).toContain("variant: {");
		expect(bannerConfig).toMatch(/solid:\s*""/);
		for (const color of PALETTE)
			expect(bannerConfig, color).toMatch(
				new RegExp(`variant: "solid",\\s*color: "${color}"`),
			);
	});

	it("no component or config misspells dismissible", () => {
		const files = [...readDir("../components"), ...readDir("../config")];
		for (const file of files)
			expect(read(file), file).not.toContain("dismissable");
	});

	it("tag exposes the shape axis instead of hardcoding rounded-full", () => {
		const tagConfig = read("../config/tag.ts");
		expect(tagConfig).toMatch(/shape:\s*\{/);
		expect(tagConfig).toMatch(/rounded:\s*"rounded-\[var\(--kala-radius-control\)\]"/);
		expect(tagConfig).toMatch(/pill:\s*"rounded-full"/);
		expect(tagConfig).not.toMatch(
			/base:\s*"[^"]*rounded-full/,
		);
	});

	it("badge exposes the size axis", () => {
		const badgeConfig = read("../config/badge.ts");
		expect(badgeConfig).toMatch(/size:\s*\{/);
		expect(badgeConfig).toMatch(/sm:\s*"/);
		expect(badgeConfig).toMatch(/lg:\s*"/);
	});

	it("radio-group and native-select use hasError, never bare error props", () => {
		const radioTypes = read(
			"../components/radio-group/radio-group.types.ts",
		);
		const radioComponent = read(
			"../components/radio-group/radio-group.tsx",
		);
		const radioConfig = read("../config/radio-group.ts");
		const nativeSelect = read("../components/select/native-select.tsx");
		for (const src of [radioTypes, radioComponent, radioConfig, nativeSelect]) {
			expect(src).toContain("hasError");
			expect(src).not.toMatch(/\berror[?:]/);
		}
		expect(nativeSelect).toContain("hasSuccess");
	});

	it("semantic payload callbacks are onValueChange, DOM onChange stays DOM-typed", () => {
		const numberTypes = read(
			"../components/number-input/number-input.types.ts",
		);
		expect(numberTypes).toContain(
			"onValueChange?: (value: number | undefined) => void",
		);
		expect(numberTypes).not.toMatch(
			/onChange\?:\s*\(value:\s*number/,
		);
		const tagTypes = read("../components/tag-input/tag-input.types.ts");
		expect(tagTypes).toContain("onValueChange?: (tags: string[]) => void");
		expect(tagTypes).not.toMatch(/onChange\?:\s*\(tags:\s*string\[\]\)/);
	});

	it("single-element semantic roots accept asChild", () => {
		for (const file of [
			"../components/alert/alert.tsx",
			"../components/banner/banner.tsx",
			"../components/tag/tag.tsx",
		]) {
			const src = read(file);
			expect(src, file).toContain("asChild");
			expect(src, file).toContain("Slot");
		}
	});

	it("number-input and tag-input gain hasSuccess validation arms", () => {
		expect(read("../components/number-input/number-input.tsx")).toContain(
			"hasSuccess",
		);
		expect(read("../components/tag-input/tag-input.tsx")).toContain(
			"hasSuccess",
		);
	});
});
