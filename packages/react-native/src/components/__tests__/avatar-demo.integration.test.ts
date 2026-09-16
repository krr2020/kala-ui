/**
 * Cross-package seam: the playground Avatar demo consumes the library's
 * Avatar API — this pins that the demo drives every size/shape/status arm
 * with raw prop values and that the status dot is exercised across the
 * whole size ladder (the ring weight and dot scale with size).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DEMO_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/avatar-demo.tsx",
);

describe("avatar demo ↔ library seam", () => {
	const demo = readFileSync(DEMO_PATH, "utf8");

	it("sweeps every size, shape, and status arm with raw API values", () => {
		expect(demo).toMatch(
			/SIZES = \["xs", "sm", "md", "lg", "xl"\] as const/,
		);
		expect(demo).toMatch(
			/SHAPES = \["circle", "rounded", "square"\] as const/,
		);
		expect(demo).toMatch(
			/STATUSES = \["none", "online", "offline"\] as const/,
		);
		expect(demo).toMatch(/size=\{size\}/);
		expect(demo).toMatch(/shape=\{shape\}/);
		expect(demo).toMatch(/status=\{status\}/);
	});

	it("exercises the status dot across the full size ladder", () => {
		expect(demo).toMatch(/status across sizes \(online\)/);
		expect(demo).toMatch(/size=\{size\} status="online"/);
	});

	it("demonstrates the image onError fallback path", () => {
		expect(demo).toMatch(/source=\{\{ uri: "https:\/\/invalid\.example/);
	});
});
