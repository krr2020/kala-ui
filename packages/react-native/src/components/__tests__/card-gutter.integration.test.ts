/**
 * Cross-package seam: the playground scroll shell must keep the
 * horizontal gutter on the scroll CONTENT, not the ScrollView frame —
 * frame padding clips child drawing (elevated card shadows) on Android.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const STYLESHEET_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/stylesheet.ts",
);
const SHELL_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/route-shell.tsx",
);

describe("playground scroll gutter ↔ library card shadow seam", () => {
	const stylesheet = readFileSync(STYLESHEET_PATH, "utf8");
	const shell = readFileSync(SHELL_PATH, "utf8");

	it("the ScrollView frame carries no horizontal padding", () => {
		const screenBlock = stylesheet.match(
			/\tscreen: \{[\s\S]*?\},/,
		);
		expect(screenBlock?.[0]).toBeTruthy();
		expect(screenBlock?.[0]).not.toMatch(/paddingHorizontal/);
	});

	it("the scroll content owns the horizontal gutter", () => {
		const routeBlock = stylesheet.match(/\trouteContent: \{[\s\S]*?\},/);
		expect(routeBlock?.[0]).toBeTruthy();
		expect(routeBlock?.[0]).toMatch(/paddingHorizontal: 16/);
	});

	it("the shell wires screen (frame) and routeContent (content) as before", () => {
		expect(shell).toMatch(/style=\{demoStyles\.screen\}/);
		expect(shell).toMatch(/contentContainerStyle=\{demoStyles\.routeContent\}/);
	});

	it("chipRows breaks out of the content gutter: -16 cancels routeContent's +16", () => {
		const chipRows = stylesheet.match(/\tchipRows: \{[\s\S]*?\},/);
		expect(chipRows?.[0]).toBeTruthy();
		expect(chipRows?.[0]).toMatch(/marginHorizontal: -16/);
		// the breakout is defined against the content gutter — both must
		// stay in lockstep or the chip rows drift off the screen rail
		expect(stylesheet).toMatch(/routeContent: \{[\s\S]*?paddingHorizontal: 16/);
	});
});
