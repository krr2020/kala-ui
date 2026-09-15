import { describe, expect, it } from "vitest";

import { isActivePath } from "../active-path";

describe("isActivePath (web-parity port)", () => {
	it("matches an exact path", () => {
		expect(isActivePath("/users", "/users")).toBe(true);
	});
	it("prefix-matches nested routes: /users matches /users/123", () => {
		expect(isActivePath("/users/123", "/users")).toBe(true);
	});
	it("does not false-positive on shared prefixes: /admin != /admin-panel", () => {
		expect(isActivePath("/admin-panel", "/admin")).toBe(false);
	});
	it("root href only matches the root path", () => {
		expect(isActivePath("/", "/")).toBe(true);
		expect(isActivePath("/users", "/")).toBe(false);
	});
	it("normalizes trailing slashes on both arguments", () => {
		expect(isActivePath("/users/", "/users")).toBe(true);
		expect(isActivePath("/users", "/users/")).toBe(true);
	});
	it("empty pathname resolves to root", () => {
		expect(isActivePath("", "/")).toBe(true);
	});
});
