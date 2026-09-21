import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { SlotStyles } from "../../lib/slot-styles";
import { Badge } from "../badge";
import { Button } from "../button";
import {
	KalaProvider,
	mergeConfig,
	resolveSlotStyles,
	tokenStyle,
	useKalaConfig,
	useSlotStyles,
} from "./kala-provider";

function badgeRoot(): HTMLElement {
	return screen
		.getByText("Beta")
		.closest("[data-kala-component]") as HTMLElement;
}

describe("KalaProvider", () => {
	it("applies a context default slot class to a child component", () => {
		render(
			<KalaProvider defaultSlotStyles={{ badge: { root: "ctx-class" } }}>
				<Badge>Beta</Badge>
			</KalaProvider>,
		);
		expect(badgeRoot().className).toContain("ctx-class");
	});

	it("renders provider-less components byte-identically (no ctx class)", () => {
		render(<Badge>Beta</Badge>);
		expect(badgeRoot().className).not.toContain("ctx-class");
	});

	it("lets the instance slot win per part while context covers the rest", () => {
		render(
			<KalaProvider
				defaultSlotStyles={{ badge: { root: "ctx-root", icon: "ctx-icon" } }}
			>
				<Badge slotStyles={{ root: "inst-root" }}>Beta</Badge>
			</KalaProvider>,
		);
		const cls = badgeRoot().className;
		expect(cls).toContain("inst-root");
		expect(cls).not.toContain("ctx-root");
	});

	it("resolves object-channel parts with the instance part winning wholesale", () => {
		const resolved = resolveSlotStyles(
			{ badge: { root: { color: "red" } } },
			"badge",
			{ root: { color: "blue" } },
		);
		expect(resolved?.root).toEqual({ color: "blue" });
	});

	it("appends a registered variant class to the root string slot", () => {
		render(
			<KalaProvider variants={{ button: { brand: "bg-brand" } }}>
				<Button variant="brand">Go</Button>
			</KalaProvider>,
		);
		const button = screen.getByRole("button", { name: "Go" });
		expect(button.className).toContain("bg-brand");
	});

	it("ignores unknown variant values", () => {
		render(
			<KalaProvider variants={{ button: { brand: "bg-brand" } }}>
				<Button variant="nope">Go</Button>
			</KalaProvider>,
		);
		expect(screen.getByRole("button", { name: "Go" }).className).not.toContain(
			"bg-brand",
		);
	});

	it("leaves an object-channel root untouched when appending variant classes", () => {
		const resolved = resolveSlotStyles(
			{ variants: { badge: { brand: "bg-brand" } } },
			"badge",
			{ root: { color: "red" } },
			"brand",
		);
		expect(resolved?.root).toEqual({ color: "red" });
	});

	it("converts token keys to custom properties (verbatim/prefix/kebab)", () => {
		const style = tokenStyle({
			"--primary": "red",
			primary: "red",
			kalaRadiusControl: "9999px",
		});
		expect(style).toEqual({
			"--primary": "red",
			"--kala-radius-control": "9999px",
			display: "contents",
		});
	});

	it("emits no token entries without a tokens prop", () => {
		const style = tokenStyle(undefined);
		expect(style).toEqual({ display: "contents" });
	});

	it("keeps outer config alive under a prop-less nested provider", () => {
		render(
			<KalaProvider defaultSlotStyles={{ badge: { root: "ctx-class" } }}>
				<KalaProvider>
					<Badge>Beta</Badge>
				</KalaProvider>
			</KalaProvider>,
		);
		expect(badgeRoot().className).toContain("ctx-class");
	});

	it("merges nested providers: inner wins per key, outer retained", () => {
		const merged = mergeConfig(
			{
				defaultSlotStyles: {
					badge: { root: "outer" },
					tag: { root: "tag-outer" },
				},
				tokens: { primary: "red" },
				variants: { button: { brand: "outer-brand", ghost: "ghost" } },
			},
			{
				defaultSlotStyles: { badge: { root: "inner" } },
				tokens: { primary: "blue" },
				variants: { button: { brand: "inner-brand" } },
			},
		);
		expect(merged.defaultSlotStyles.badge.root).toBe("inner");
		expect(merged.defaultSlotStyles.tag.root).toBe("tag-outer");
		expect(merged.tokens.primary).toBe("blue");
		expect(merged.variants.button).toEqual({
			brand: "inner-brand",
			ghost: "ghost",
		});
	});

	it("useKalaConfig returns an empty config at the root, no throw", () => {
		let seen: unknown = "unset";
		function Probe() {
			seen = useKalaConfig();
			return null;
		}
		render(<Probe />);
		expect(seen).toEqual({});
	});

	it("emits context classes and tokens in server-rendered HTML", () => {
		const html = renderToString(
			<KalaProvider
				defaultSlotStyles={{ badge: { root: "ctx-class" } }}
				tokens={{ "--primary": "red" }}
			>
				<Badge>Beta</Badge>
			</KalaProvider>,
		);
		expect(html).toContain("ctx-class");
		expect(html).toContain("--primary:red");
	});
});

describe("useSlotStyles", () => {
	it("returns the instance verbatim with no context", () => {
		const instance: SlotStyles = { root: "inst" };
		expect(resolveSlotStyles({}, "badge", instance)).toBe(instance);
	});
});
