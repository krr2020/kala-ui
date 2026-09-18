import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Cross-file contract: the package's slotStyles rollout (config tables) stays
// in lockstep with the barrel re-export and the release notes that promise the
// API. If a family gains a config table without a barrel export, or the
// changeset stops claiming full-family coverage, this seam breaks.

const pkgRoot = process.cwd();
const configDir = resolve(pkgRoot, "src/config");
const barrel = readFileSync(resolve(configDir, "index.ts"), "utf8");
const changeset = readFileSync(
	resolve(pkgRoot, "../../.changeset/web-slot-styles.md"),
	"utf8",
);

describe("slotStyles config ↔ changeset integration", () => {
	it("re-exports every config style table from the barrel", () => {
		const modules = readdirSync(configDir)
			.filter((f: string) => f.endsWith(".ts") && f !== "index.ts")
			.map((f: string) => `from "./${f.replace(/\.ts$/, "")}"`);
		expect(modules).not.toHaveLength(0);
		for (const specifier of modules) {
			expect(barrel).toContain(specifier);
		}
	});

	it("changeset documents the slotStyles API as full-family", () => {
		expect(changeset).toContain("@kala-ui/react");
		expect(changeset).toMatch(/full-family/i);
		expect(changeset).toMatch(/slotStyles/);
	});
});
