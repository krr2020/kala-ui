/**
 * Integration contract between the config tables, the slotStyles helpers,
 * and the package barrel — asserted in code, never against repo-transient
 * artifacts (a previous version read release-notes files that
 * `changeset version` deletes, breaking CI after every release).
 */
import fs from "node:fs";
import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";

import { Button } from "../index";

const srcRoot = ["src", "packages/react/src"]
	.map((p) => `${process.cwd()}/${p}`)
	.find((p) => fs.existsSync(p));
if (!srcRoot) throw new Error("cannot locate packages/react/src from cwd");

const read = (path: string) => fs.readFileSync(`${srcRoot}/${path}`, "utf8");

describe("no test depends on repo-transient artifacts", () => {
	it("no test source references the release-notes directory", () => {
		// Built via join so this assertion does not match itself.
		const needle = [".changes", "et"].join("");
		const offenders: string[] = [];
		const walk = (dir: string) => {
			for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
				const full = `${dir}/${entry.name}`;
				if (entry.isDirectory()) walk(full);
				else if (
					/\.test\.(ts|tsx)$/.test(entry.name) &&
					fs.readFileSync(full, "utf8").includes(needle)
				)
					offenders.push(full);
			}
		};
		walk(srcRoot);
		expect(offenders).toEqual([]);
	});
});

describe("config tables and barrel stay in lockstep", () => {
	it("every src/config table file is re-exported from config/index.ts", () => {
		const configIndex = read("config/index.ts");
		const tables = fs
			.readdirSync(`${srcRoot}/config`)
			.filter((f) => f.endsWith(".ts") && f !== "index.ts");
		expect(tables.length).toBeGreaterThan(0);
		for (const table of tables) {
			expect(configIndex).toContain(`./${table.replace(/\.ts$/, "")}"`);
		}
	});

	it("every component dir is exported from the package barrel", () => {
		const index = read("index.ts");
		// design-system is an in-repo docs helper, deliberately unshipped.
		const dirs = fs
			.readdirSync(`${srcRoot}/components`, { withFileTypes: true })
			.filter((d) => d.isDirectory() && d.name !== "design-system")
			.map((d) => d.name);
		expect(dirs.length).toBeGreaterThan(0);
		for (const dir of dirs) {
			expect(index).toContain(`./components/${dir}"`);
		}
	});
});

describe("public slotStyles API", () => {
	it("root barrel exports the helpers and types, and they work on a real component", () => {
		expect(typeof Button).toBe("function");
		render(
			createElement(
				Button,
				{ className: "w-10", slotStyles: { root: "k-slot-root w-64" } },
				"Go",
			),
		);
		const btn = screen.getByRole("button");
		expect(btn.className).toContain("k-slot-root");
		expect(btn.className).not.toContain("w-10");
	});
});

describe("migrated families expose config tables, not cva doubles", () => {
	it("multiSelectStyles and calendarStyles are re-exported from the config barrel", () => {
		const configIndex = read("config/index.ts");
		expect(configIndex).toContain('multiSelectStyles } from "./multi-select"');
		expect(configIndex).toContain('calendarStyles } from "./calendar"');
		expect(configIndex).toContain('tagStyles } from "./tag"');
		expect(configIndex).toContain('bannerStyles } from "./banner"');
	});

	it("no repo source still references tag/banner/selectTrigger variants", () => {
		const offenders: string[] = [];
		const walk = (dir: string) => {
			for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
				const full = `${dir}/${entry.name}`;
				if (entry.isDirectory()) walk(full);
				else if (/\.(ts|tsx)$/.test(entry.name)) {
					const src = fs.readFileSync(full, "utf8");
					if (/(tag|banner|selectTrigger)Variants/.test(src))
						offenders.push(full);
				}
			}
		};
		walk(srcRoot);
		const reactAppSrc = `${process.cwd()}/../react-app/src`;
		if (fs.existsSync(reactAppSrc)) walk(reactAppSrc);
		expect(offenders).toEqual([]);
	});
});

describe("button prop surface", () => {
	it("button family no longer declares the removed i18n key props", () => {
		const offenders: string[] = [];
		const walk = (dir: string) => {
			for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
				const full = `${dir}/${entry.name}`;
				if (entry.isDirectory()) walk(full);
				else if (/\.(ts|tsx)$/.test(entry.name)) {
					const src = fs.readFileSync(full, "utf8");
					if (/translationKey|loadingTextKey|disabledTextKey/.test(src))
						offenders.push(full);
				}
			}
		};
		walk(`${srcRoot}/components/button`);
		expect(offenders).toEqual([]);
	});
});
