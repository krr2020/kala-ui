import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
// Package-name import (not a relative path) — exercises the library's
// package.json exports map exactly the way the playground app consumes it.
import { themes } from "@kala-ui/react-native/themes";
import { describe, expect, it } from "vitest";

/**
 * Integration seam: packages/react-native ↔ apps/native-playground.
 *
 * The playground registers the library's themes straight into
 * StyleSheet.configure, so the contract that must never break is:
 * every exported theme is a flat map of primitive values (colors as hex
 * strings, alphas as numbers) that Unistyles can consume, and the app's
 * registration file actually passes this exact object through. The
 * component layer has the same shape of contract: the playground consumes
 * Button/Icon/Sheet through the library's root entry.
 */

const PLAYGROUND_DIR = resolve(__dirname, "../../../../apps/native-playground");

const registration = readFileSync(
	resolve(PLAYGROUND_DIR, "src/unistyles.ts"),
	"utf-8",
);

const playgroundPkg = JSON.parse(
	readFileSync(resolve(PLAYGROUND_DIR, "package.json"), "utf-8"),
) as {
	dependencies: Record<string, string>;
};

describe("library → app registration seam", () => {
	it("playground depends on the library via the workspace protocol", () => {
		expect(playgroundPkg.dependencies["@kala-ui/react-native"]).toBe(
			"workspace:*",
		);
	});

	it("playground consumes every cataloged native dep via catalog:", () => {
		const cataloged = [
			"@expo/metro-runtime",
			"@react-native/normalize-colors",
			"expo",
			"react-native",
			"react-native-edge-to-edge",
			"react-native-gesture-handler",
			"react-native-nitro-modules",
			"react-native-reanimated",
			"react-native-safe-area-context",
			"react-native-screens",
			"react-native-svg",
			"react-native-unistyles",
			"react-native-web",
		];
		for (const name of cataloged) {
			expect(playgroundPkg.dependencies[name], name).toBe("catalog:");
		}
	});

	it("playground pins react AND react-dom inline at the SDK-57 version (never catalog:)", () => {
		// The catalog carries react 19.3.0 for web; Expo SDK 57 tests 19.2.3.
		// A split react/react-dom pair inside one app breaks the bundle.
		expect(playgroundPkg.dependencies.react).toBe("19.2.3");
		expect(playgroundPkg.dependencies["react-dom"]).toBe("19.2.3");
	});

	it("playground registration passes the library themes to StyleSheet.configure", () => {
		expect(registration).toContain("StyleSheet.configure");
		expect(registration).toMatch(/themes[,\n}]/);
		expect(registration).toContain('from "@kala-ui/react-native/themes"');
	});

	it("every theme is a flat map of string|number primitives (Unistyles-consumable)", () => {
		for (const [name, theme] of Object.entries(themes)) {
			for (const [key, value] of Object.entries(theme)) {
				expect(
					typeof value === "string" || typeof value === "number",
					`${name}.${key} is ${typeof value}`,
				).toBe(true);
				expect(value, `${name}.${key}`).not.toBeUndefined();
				expect(Number.isNaN(value as number), `${name}.${key}`).toBe(false);
			}
		}
	});

	it("theme names match the names the app's theme picker renders", () => {
		const shellSource = readFileSync(
			resolve(PLAYGROUND_DIR, "src/route-shell.tsx"),
			"utf-8",
		);
		expect(shellSource).toContain("UnistylesRuntime.setTheme");
		expect(shellSource).toContain('from "@kala-ui/react-native/themes"');
	});

	it("app components section consumes the library's component exports", () => {
		// The playground is the living-docs consumer: if it stops importing the
		// components through the root entry, the exports map regressed.
		const demosDir = resolve(PLAYGROUND_DIR, "src/demos");
		const demosSource = readdirSync(demosDir, { recursive: true })
			.map(String)
			.filter(
				(file) =>
					file.endsWith(".tsx") && !file.startsWith("components/registry"),
			)
			.map((file) => readFileSync(resolve(demosDir, file), "utf-8"))
			.join("\n");
		expect(demosSource).toContain('from "@kala-ui/react-native"');
		for (const component of ["Button", "Icon", "Sheet"]) {
			expect(demosSource).toContain(`<${component}`);
		}
		expect(demosSource).toContain("k-demo-button");
	});

	it("playground pins lucide-react-native via the catalog", () => {
		expect(playgroundPkg.dependencies["lucide-react-native"]).toBe("catalog:");
	});
});
