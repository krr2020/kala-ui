/**
 * Cross-package seam for the forms group: every forms component in the
 * registry is backed by a dedicated demo screen (root marker, humanized
 * copy) and the feedback overview no longer doubles as the forms demo.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DEMOS_DIR = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components",
);
const FORMS = [
	"text-input",
	"textarea",
	"number-input",
	"select",
	"combobox",
	"multi-select",
	"checkbox",
	"radio-group",
	"switch",
	"toggle",
	"slider",
	"rating",
	"field",
	"label",
	"input-otp",
	"calendar",
	"date-picker",
	"time-picker",
] as const;

const demoSource = (name: string): string =>
	readFileSync(resolve(DEMOS_DIR, `${name}-demo.tsx`), "utf8");

describe("forms demos ↔ library seam", () => {
	it("every forms component has a dedicated demo with a root marker", () => {
		for (const name of FORMS) {
			const src = demoSource(name);
			expect(src, `${name}-demo.tsx`).toMatch(
				new RegExp(`testID="k-demo-${name}"`),
			);
		}
	});

	it("demos consume the library barrel, not deep module paths", () => {
		for (const name of FORMS) {
			expect(demoSource(name)).toMatch(/from "@kala-ui\/react-native"/);
		}
	});

	it("demo copy stays humanized — no lowercase DemoBlock labels", () => {
		for (const name of FORMS) {
			expect(demoSource(name)).not.toMatch(/label="[a-z]/);
		}
		const overview = readFileSync(
			resolve(DEMOS_DIR, "..", "forms-demo.tsx"),
			"utf8",
		);
		expect(overview).not.toMatch(/label="[a-z]/);
	});

	it("the group overview is a composed form, not the feedback grab-bag", () => {
		const overview = readFileSync(
			resolve(DEMOS_DIR, "..", "forms-demo.tsx"),
			"utf8",
		);
		expect(overview).toMatch(/testID="k-demo-forms"/);
		expect(overview).toMatch(/<Field/);
	});

	it("registry wires every forms component to its dedicated demo", () => {
		const registry = readFileSync(resolve(DEMOS_DIR, "registry.tsx"), "utf8");
		for (const name of FORMS) {
			const demo = name
				.split("-")
				.map((part) => part[0].toUpperCase() + part.slice(1))
				.join("");
			expect(registry, `${name} → ${demo}`).toMatch(
				new RegExp(
					`name: "${name}",[\\s\\S]*?render: \\(\\) => <${demo}Demo`,
				),
			);
		}
	});

	it("feedback overview no longer renders forms components", () => {
		const feedback = readFileSync(
			resolve(DEMOS_DIR, "..", "feedback-demo.tsx"),
			"utf8",
		);
		for (const gone of [
			"Combobox",
			"MultiSelect",
			"NumberInput",
			"Select",
			"Textarea",
			"InputOtp",
		]) {
			expect(feedback).not.toMatch(new RegExp(`<${gone}[\\s/>]`));
		}
	});

	it("text-input demo exercises every input state arm with humanized copy", () => {
		const src = demoSource("text-input");
		// error copy rides on Field, not the bare input
		expect(src).toMatch(/<Field[^>]*error=/);
		expect(src).toMatch(/hasError/);
		expect(src).toMatch(/hasSuccess/);
		expect(src).toMatch(/disabled/);
		// sections demo both arms: icon node + raw string
		expect(src).toMatch(/leftSection=/);
		expect(src).toMatch(/rightSection=/);
		// sentence-case placeholders (raw emails stay lowercase by convention)
		expect(src).not.toMatch(/placeholder="[a-z][a-z ]+"/);
	});
});
