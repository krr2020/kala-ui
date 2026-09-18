import { describe, expect, it } from "vitest";
import type {
	ScreenStackEntry,
	ScreenStackPresentation,
} from "../screen-stack/screen-stack.types";
import {
	assertUniqueKeys,
	diffStack,
	enterOffsetFor,
} from "../screen-stack/screen-stack.utils";

function entry(
	key: string,
	presentation?: ScreenStackPresentation,
): ScreenStackEntry {
	return { key, presentation, children: null };
}

describe("enterOffsetFor", () => {
	it("maps every presentation to its entry edge: axis and sign", () => {
		const d = 390;
		expect(enterOffsetFor("push", d)).toEqual({ axis: "x", start: d });
		expect(enterOffsetFor("left", d)).toEqual({ axis: "x", start: -d });
		expect(enterOffsetFor("modal", d)).toEqual({ axis: "y", start: d });
		expect(enterOffsetFor("top", d)).toEqual({ axis: "y", start: -d });
		expect(enterOffsetFor("center", d)).toEqual({ axis: "scale" });
		expect(enterOffsetFor("none", d)).toBeNull();
	});

	it("zero distance still yields a signed direction for the slide edges", () => {
		expect(enterOffsetFor("push", 0)).toEqual({ axis: "x", start: 0 });
		expect(enterOffsetFor("top", 0)).toEqual({ axis: "y", start: -0 });
	});
});

describe("assertUniqueKeys", () => {
	it("passes when every key is unique", () => {
		expect(() =>
			assertUniqueKeys([entry("a"), entry("b"), entry("c")]),
		).not.toThrow();
	});

	it("throws an invariant error naming the duplicated key", () => {
		expect(() =>
			assertUniqueKeys([entry("a"), entry("b"), entry("a")]),
		).toThrow(/duplicate.*"a"/i);
	});
});

describe("diffStack", () => {
	it("first render is init — no transition to animate", () => {
		expect(diffStack([], [entry("a")])).toEqual({ type: "init" });
		expect(diffStack([], [])).toEqual({ type: "init" });
	});

	it("appending one entry on top of a matching prefix is a push", () => {
		const next = [entry("a"), entry("b"), entry("c")];
		expect(diffStack([entry("a"), entry("b")], next)).toEqual({
			type: "push",
			key: "c",
		});
	});

	it("removing the top entry is a pop carrying the removed entry", () => {
		const top = entry("c", "modal");
		expect(
			diffStack([entry("a"), entry("b"), top], [entry("a"), entry("b")]),
		).toEqual({
			type: "pop",
			entry: top,
		});
	});

	it("popping the only entry above an empty stack still pops", () => {
		const root = entry("root");
		expect(diffStack([root], [])).toEqual({ type: "pop", entry: root });
	});

	it("same length with only the top changed is a replace", () => {
		const from = entry("b");
		const to = entry("c", "push");
		expect(diffStack([entry("a"), from], [entry("a"), to])).toEqual({
			type: "replace",
			from,
			to,
		});
	});

	it("changing the root is a reset", () => {
		expect(
			diffStack([entry("a"), entry("b")], [entry("c"), entry("b")]),
		).toEqual({
			type: "reset",
		});
	});

	it("reordering entries is a reset", () => {
		expect(
			diffStack([entry("a"), entry("b")], [entry("b"), entry("a")]),
		).toEqual({
			type: "reset",
		});
	});

	it("removing more than one entry at once is a reset, not a pop", () => {
		expect(
			diffStack([entry("a"), entry("b"), entry("c")], [entry("a")]),
		).toEqual({ type: "reset" });
	});

	it("an unchanged stack reports no transition", () => {
		expect(
			diffStack([entry("a"), entry("b")], [entry("a"), entry("b")]),
		).toEqual({
			type: "none",
		});
	});
});
