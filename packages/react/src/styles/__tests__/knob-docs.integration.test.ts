import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
	readFileSync(new URL(path, import.meta.url), "utf8");

const globalsCss = read("../globals.css");
const tokensCss = read("../tokens.css");
const themingMd = read("../../../../../THEMING.md");
const tokenSpecMd = read("../../../TOKEN_SPEC.md");

/** Canonical shape/density knob registry: globals.css `:root` is the source
 * of truth; THEMING.md and TOKEN_SPEC.md must document every entry so hosts
 * discover the knobs they are told to prefer over per-component overrides. */
const KNOBS = [
	"--kala-radius-control",
	"--kala-radius-card",
	"--kala-radius-sm",
	"--kala-radius-input",
	"--kala-control-h",
	"--kala-control-h-xs",
	"--kala-control-h-sm",
	"--kala-control-h-lg",
	"--kala-control-px",
	"--kala-control-px-xs",
	"--kala-control-px-sm",
	"--kala-control-px-lg",
	"--kala-card-pad",
] as const;

const rootBlock = (() => {
	const start = tokensCss.indexOf(":root");
	const end = tokensCss.indexOf("}", start);
	return tokensCss.slice(start, end);
})();

describe("shape/density knob docs parity", () => {
	it("declares the full knob registry on :root", () => {
		for (const knob of KNOBS)
			expect(rootBlock, knob).toContain(`${knob}:`);
	});

	it("documents every knob in THEMING.md and TOKEN_SPEC.md", () => {
		for (const knob of KNOBS) {
			expect(themingMd, knob).toContain(knob);
			expect(tokenSpecMd, knob).toContain(knob);
		}
	});
});
