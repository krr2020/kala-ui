import { useEffect, useLayoutEffect } from "react";
import { describe, expect, it } from "vitest";
import { useIsomorphicEffect } from "../use-isomorphic-effect/use-isomorphic-effect";

describe("useIsomorphicEffect", () => {
	it("uses useLayoutEffect in the browser", () => {
		// jsdom defines window, so the hook must resolve to useLayoutEffect.
		expect(useIsomorphicEffect).toBe(useLayoutEffect);
		expect(useIsomorphicEffect).not.toBe(useEffect);
	});
});
