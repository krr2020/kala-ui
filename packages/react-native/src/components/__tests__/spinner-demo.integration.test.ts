/**
 * Cross-package seam: the playground Spinner demo consumes the library's
 * Spinner API — pins the dedicated screen's marker, size/variant arms,
 * the white-on-primary tile, the custom label arm, and the loading
 * toggle's conditional render (stop = unmount → loop cleanup).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DEMO_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/spinner-demo.tsx",
);
const REGISTRY_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/registry.tsx",
);

describe("spinner demo ↔ library seam", () => {
	const demo = readFileSync(DEMO_PATH, "utf8");

	it("uses the package barrel and the k-demo-spinner root marker", () => {
		expect(demo).toMatch(/from "@kala-ui\/react-native";/);
		expect(demo).not.toMatch(/from "@kala-ui\/react-native\/dist/);
		expect(demo).toMatch(/testID="k-demo-spinner"/);
	});

	it("renders every size arm via the SIZES tuple", () => {
		const tuple = demo.match(/const SIZES = \[([\s\S]*?)\] as const;/);
		expect(tuple).not.toBeNull();
		for (const size of ["sm", "md", "lg", "xl"]) {
			expect(String(tuple)).toMatch(new RegExp(`"${size}"`));
		}
		expect(demo).toMatch(/SIZES\.map/);
	});

	it("renders default, muted, and ghost variants via the VARIANTS tuple", () => {
		const tuple = demo.match(/const VARIANTS = \[([\s\S]*?)\] as const;/);
		expect(tuple).not.toBeNull();
		for (const variant of ["default", "muted", "ghost"]) {
			expect(String(tuple)).toMatch(new RegExp(`"${variant}"`));
		}
		expect(demo).toMatch(/VARIANTS\.map/);
	});

	it("shows the white variant on a themed primary tile", () => {
		// primaryForeground is white-on-light — bare on the page it is
		// unverifiable; the tile must use the theme token, not a color
		expect(demo).toMatch(/variant="white"/);
		expect(demo).toMatch(/backgroundColor: theme\.primary/);
	});

	it("custom screen-reader label arm present", () => {
		expect(demo).toMatch(/label="Uploading assets"/);
	});

	it("loading toggle unmounts the spinner when stopped", () => {
		expect(demo).toMatch(/useState/);
		expect(demo).toMatch(/busy \? \([\n\t ]*<Spinner/);
		expect(demo).toMatch(/Load complete/);
		expect(demo).toMatch(/\{busy \? "Stop" : "Start"\}/);
	});

	it("uses shared demo tokens, not ad-hoc chrome", () => {
		expect(demo).toMatch(/DemoBlock/);
		expect(demo).toMatch(/demoStyles/);
	});

	it("keeps every visible string sentence case", () => {
		expect(demo).not.toMatch(/<(K?Text|Text)[^>]*>[a-z]/);
	});
});

describe("spinner registry seam", () => {
	const registry = readFileSync(REGISTRY_PATH, "utf8");

	it("feedback group wires the spinner entry to the dedicated demo", () => {
		expect(registry).toMatch(
			/import \{ SpinnerDemo \} from "\.\/spinner-demo";/,
		);
		const feedback = registry.match(
			/name: "feedback",[\s\S]*?name: "navigation",/,
		);
		const entry = String(feedback).match(
			/humanizeLabel\("spinner"\),[\s\S]*?SpinnerDemo/,
		);
		expect(entry).not.toBeNull();
	});
});
