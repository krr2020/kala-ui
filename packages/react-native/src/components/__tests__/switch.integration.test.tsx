/**
 * Cross-package seam: the native-playground SwitchDemo consumes the
 * component's label/row contract. This census pins the arms the demo
 * must carry so the living docs exercise the same contract tests pin.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const DEMOS = join(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components",
);

const read = (): string =>
	readFileSync(join(DEMOS, "switch-demo.tsx"), "utf8");

describe("SwitchDemo census", () => {
	it("pins a long field copy arm", () => {
		expect(read()).toContain("Long Field Copy");
	});

	it("demos labeled switches in a Labels block (label prop, not bare circles)", () => {
		const source = read();
		expect(source).toContain('"Labels"');
		expect(source).toContain('label="');
	});

	it("keeps switch importable from the package surface", () => {
		expect(read()).toContain("<Switch");
	});
});
