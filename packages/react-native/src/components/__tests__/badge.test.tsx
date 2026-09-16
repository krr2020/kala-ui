/**
 * Badge rendering contract: variant × color token mapping, shape radii,
 * string-arm text metrics, empty/zero/null children policy (never hides),
 * and style/slotStyles precedence on the root.
 */
import { render } from "@testing-library/react-native";
import { Text as RNText } from "react-native";
import { light } from "../../themes/definitions";
import { Badge } from "../badge";
import { RADIUS } from "../badge/badge.styles";

const incl = { includeHiddenElements: true } as const;

type Screen = Awaited<ReturnType<typeof render>>;

type JSONNode = { type?: string; children?: unknown } | string;

/** Host Text nodes in the rendered tree — toJSON children sit at the node
 * top level, not under props. */
const countTextHosts = (node: JSONNode | null | undefined): number => {
	if (!node || typeof node === "string") return 0;
	if (node.type === "Text") return 1;
	const kids = (node.children ?? []) as JSONNode[];
	return (Array.isArray(kids) ? kids : [kids]).reduce(
		(sum, kid) => sum + countTextHosts(kid),
		0,
	);
};

const flatStyle = (node: { props: { style?: unknown } }) =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

const rootOf = (screen: Screen) => screen.getByTestId("k-badge", incl);

async function renderBadge(props: React.ComponentProps<typeof Badge> = {}) {
	const screen = await render(<Badge {...props}>Beta</Badge>);
	return { screen, root: rootOf(screen) };
}

describe("variant × color mapping", () => {
	it("solid primary uses the token pair with no border", async () => {
		const { root } = await renderBadge();
		const s = flatStyle(root);
		expect(s.backgroundColor).toBe(light.primary);
		expect(s.borderColor).toBe("transparent");
		expect(s.borderWidth).toBe(0);
	});

	it("outline sets a visible 1px border in the color tint", async () => {
		const { root, screen } = await renderBadge({
			variant: "outline",
			color: "primary",
		});
		const s = flatStyle(root);
		expect(s.backgroundColor).toBe("transparent");
		expect(s.borderColor).toBe(light.primary);
		expect(s.borderWidth).toBe(1);
		expect(flatStyle(screen.getByText("Beta", incl)).color).toBe(light.primary);
	});

	it("outline muted borrows mutedForeground for fg and border", async () => {
		const { root } = await renderBadge({ variant: "outline", color: "muted" });
		const s = flatStyle(root);
		expect(s.borderColor).toBe(light.mutedForeground);
		expect(s.borderWidth).toBe(1);
	});

	it("subtle tints the token at 10% alpha with the token as fg", async () => {
		const { root, screen } = await renderBadge({
			variant: "subtle",
			color: "primary",
		});
		const s = flatStyle(root);
		expect(s.backgroundColor).toBe(`${light.primary}1A`);
		expect(s.borderColor).toBe("transparent");
		expect(s.borderWidth).toBe(0);
		expect(flatStyle(screen.getByText("Beta", incl)).color).toBe(light.primary);
	});

	it("subtle muted uses muted/mutedForeground instead of an alpha tint", async () => {
		const { root } = await renderBadge({ variant: "subtle", color: "muted" });
		const s = flatStyle(root);
		expect(s.backgroundColor).toBe(light.muted);
		expect(s.borderWidth).toBe(0);
	});

	it("solid muted borrows accent/accentForeground", async () => {
		const { root } = await renderBadge({ variant: "solid", color: "muted" });
		const s = flatStyle(root);
		expect(s.backgroundColor).toBe(light.accent);
	});

	it("renders every color token without crashing", async () => {
		for (const color of [
			"primary",
			"secondary",
			"destructive",
			"success",
			"warning",
			"info",
			"muted",
		] as const) {
			const { root } = await renderBadge({ color });
			const base = color === "muted" ? "accent" : color;
			expect(flatStyle(root).backgroundColor).toBe(
				light[base as keyof typeof light],
			);
		}
	});
});

describe("shape", () => {
	it("defaults to the rounded radius", async () => {
		const { root } = await renderBadge();
		expect(flatStyle(root).borderRadius).toBe(RADIUS.rounded);
	});

	it("pill uses the capsule radius", async () => {
		const { root } = await renderBadge({ shape: "pill" });
		expect(flatStyle(root).borderRadius).toBe(RADIUS.pill);
	});

	it("radius table is 4 / 999", () => {
		expect(RADIUS).toEqual({ rounded: 4, pill: 999 });
	});
});

describe("children", () => {
	it("wraps string children in themed text with normalized metrics", async () => {
		const screen = await render(<Badge>Beta</Badge>);
		const text = screen.getByText("Beta", incl);
		const s = flatStyle(text);
		expect(s.color).toBe(light.primaryForeground);
		expect(s.fontSize).toBe(12);
		expect(s.lineHeight).toBe(16);
		expect(s.includeFontPadding).toBe(false);
	});

	it("passes node children through unwrapped with the same container", async () => {
		const node = await render(
			<Badge>
				<RNText testID="k-inner">x</RNText>
			</Badge>,
		);
		expect(node.getByTestId("k-inner", incl)).toBeTruthy();
		expect(countTextHosts(node.toJSON())).toBe(1);

		const str = await renderBadge();
		const a = flatStyle(node.getByTestId("k-badge", incl));
		const b = flatStyle(str.root);
		for (const key of [
			"paddingHorizontal",
			"paddingVertical",
			"borderRadius",
			"flexDirection",
			"alignItems",
			"alignSelf",
		]) {
			expect(a[key]).toBe(b[key]);
		}
	});

	it("renders count 0 as the glyph 0, never hiding", async () => {
		const screen = await render(<Badge>{0}</Badge>);
		expect(screen.getByText("0", incl)).toBeTruthy();
	});

	it("renders an empty string as an empty pill that still has the text host", async () => {
		const screen = await render(<Badge>{""}</Badge>);
		const root = screen.getByTestId("k-badge", incl);
		expect(root).toBeTruthy();
		expect(countTextHosts(screen.toJSON())).toBe(1);
	});

	it("renders null children as an empty pill with no text host", async () => {
		const screen = await render(<Badge>{null}</Badge>);
		const root = screen.getByTestId("k-badge", incl);
		expect(root).toBeTruthy();
		expect(countTextHosts(screen.toJSON())).toBe(0);
	});
});

describe("styling channels", () => {
	it("style overrides the library surface", async () => {
		const { root } = await renderBadge({ style: { borderRadius: 10 } });
		expect(flatStyle(root).borderRadius).toBe(10);
	});

	it("slotStyles.root wins over both style and the surface", async () => {
		const { root } = await renderBadge({
			style: { borderRadius: 10 },
			slotStyles: { root: { borderRadius: 20 } },
		});
		expect(flatStyle(root).borderRadius).toBe(20);
	});
});

describe("markers", () => {
	it("honors a custom testID", async () => {
		const screen = await render(<Badge testID="k-my-badge">x</Badge>);
		expect(screen.getByTestId("k-my-badge", incl)).toBeTruthy();
	});
});
