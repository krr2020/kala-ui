import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Cross-package LoadingOverlay contract: the web component
 * (packages/react) and the native composite (packages/react-native-app)
 * must keep the same loader vocabulary and loading-state a11y semantics.
 * Static parse on purpose — importing either component pulls a DOM or
 * react-native environment this vitest runner cannot execute; the source
 * text is the contract (same technique as components.app-seam).
 */
const WEB_SOURCE = readFileSync(
	resolve(
		__dirname,
		"../../../react/src/components/loading-overlay/loading-overlay.tsx",
	),
	"utf8",
);
const NATIVE_SOURCE = readFileSync(
	resolve(__dirname, "../components/loading-overlay/loading-overlay.tsx"),
	"utf8",
);
const NATIVE_TYPES = readFileSync(
	resolve(__dirname, "../components/loading-overlay/loading-overlay.types.ts"),
	"utf8",
);

describe("LoadingOverlay web ↔ native parity", () => {
	it("both surfaces speak the same loader vocabulary", () => {
		for (const prop of ["visible", "zIndex", "loaderProps"]) {
			expect(WEB_SOURCE).toMatch(new RegExp(`\\b${prop}\\b`));
			expect(NATIVE_SOURCE).toMatch(new RegExp(`\\b${prop}\\b`));
			expect(NATIVE_TYPES).toMatch(new RegExp(`\\b${prop}\\b`));
		}
	});

	it("loaderProps replaces the default spinner symmetrically", () => {
		expect(WEB_SOURCE).toMatch(/loaderChildren \?/);
		expect(WEB_SOURCE).toMatch(/<Spinner size="lg" \{/);
		expect(NATIVE_SOURCE).toMatch(/\{children \?\? \(/);
		expect(NATIVE_SOURCE).toMatch(
			/<Spinner size="lg" label=\{accessibilityLabel\}/,
		);
	});

	it("loading state is announced and busy on both platforms", () => {
		expect(WEB_SOURCE).toMatch(/aria-busy="true"/);
		expect(WEB_SOURCE).toMatch(/aria-hidden=\{!visible \|\| undefined\}/);
		expect(NATIVE_SOURCE).toMatch(/accessibilityLiveRegion="polite"/);
	});

	it("the native scrim blocks touches under it", () => {
		expect(
			readFileSync(
				resolve(
					__dirname,
					"../components/loading-overlay/loading-overlay.styles.ts",
				),
				"utf8",
			),
		).toMatch(/pointerEvents: "auto"/);
	});

	it("native loaderProps only exposes spinner knobs that exist", () => {
		expect(NATIVE_TYPES).toMatch(
			/loaderProps\?: Partial<Pick<SpinnerProps, "label" \| "size" \| "variant">>/,
		);
	});
});
