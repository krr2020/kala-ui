import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The entry's export LIST is the contract (importing the entry pulls
 * react-native, which vitest cannot execute). Same technique as
 * packages/react-native's tokens-parity pin: no `export *` escapes, and
 * the pinned names are exactly what the package ships.
 */
const entry = readFileSync(resolve(__dirname, "../index.ts"), "utf8");

function exportNames(): Set<string> {
	expect(entry).not.toMatch(/export\s+\*/);
	const names = new Set<string>();
	for (const m of entry.matchAll(
		/export\s+(?:type\s+)?\{([^}]*)\}\s*from\s*"[^"]+";/g,
	)) {
		for (const part of m[1].split(",")) {
			const name = part
				.trim()
				.replace(/^type /, "")
				.split(" as ")
				.pop();
			if (name) names.add(name);
		}
	}
	expect(names.size).toBeGreaterThan(0);
	return names;
}

describe("entry exports pin", () => {
	it("exports exactly the Wave-A1 app-chrome surface", () => {
		expect(exportNames()).toEqual(
			new Set([
				"AppShell",
				"AppShellProps",
				"Header",
				"HeaderAction",
				"HeaderProps",
				"HeaderSkeleton",
				"HeaderSkeletonProps",
				"TabBar",
				"TabBarItemData",
				"TabBarProps",
				"TabBarSkeleton",
				"TabBarSkeletonProps",
				"isActivePath",
			]),
		);
	});
});
