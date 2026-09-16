/**
 * Tag rendering contract: variant × color mapping, size metrics, remove
 * affordance, children arms, and the style/slotStyles precedence chain.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";
import { Text as RNText } from "react-native";
import { light } from "../../themes/definitions";
import { ICON_SIZE_PX } from "../icon/icon.styles";
import { Tag } from "../tag";
import { FONT, PAD_H, PAD_V } from "../tag/tag.styles";

const incl = { includeHiddenElements: true } as const;

type JSONNode = { type?: string; children?: unknown } | string;

const flatStyle = (node: { props: { style?: unknown } }) =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

const countTextHosts = (node: JSONNode | null | undefined): number => {
	if (!node || typeof node === "string") return 0;
	if (node.type === "Text") return 1;
	const kids = (node.children ?? []) as JSONNode[];
	return (Array.isArray(kids) ? kids : [kids]).reduce(
		(sum, kid) => sum + countTextHosts(kid),
		0,
	);
};

async function renderTag(props: React.ComponentProps<typeof Tag> = {}) {
	const screen = await render(<Tag {...props}>Beta</Tag>);
	return { screen, root: screen.getByTestId("k-tag", incl) };
}

describe("variant × color mapping", () => {
	it("default subtle muted: muted surface + mutedForeground text", async () => {
		const { root, screen } = await renderTag();
		const s = flatStyle(root);
		expect(s.backgroundColor).toBe(light.muted);
		expect(s.borderWidth).toBe(0);
		expect(flatStyle(screen.getByText("Beta", incl)).color).toBe(
			light.mutedForeground,
		);
	});

	it("subtle primary tints the token at 10% alpha with token fg", async () => {
		const { root, screen } = await renderTag({
			variant: "subtle",
			color: "primary",
		});
		expect(flatStyle(root).backgroundColor).toBe(`${light.primary}1A`);
		expect(flatStyle(screen.getByText("Beta", incl)).color).toBe(light.primary);
	});

	it("outline primary draws a 1px border in the tint", async () => {
		const { root } = await renderTag({ variant: "outline", color: "primary" });
		const s = flatStyle(root);
		expect(s.backgroundColor).toBe("transparent");
		expect(s.borderColor).toBe(light.primary);
		expect(s.borderWidth).toBe(1);
	});

	it("outline muted borrows mutedForeground for fg and border", async () => {
		const { root } = await renderTag({ variant: "outline", color: "muted" });
		const s = flatStyle(root);
		expect(s.borderColor).toBe(light.mutedForeground);
		expect(s.borderWidth).toBe(1);
	});

	it("solid muted borrows accent/accentForeground", async () => {
		const { root } = await renderTag({ variant: "solid", color: "muted" });
		const s = flatStyle(root);
		expect(s.backgroundColor).toBe(light.accent);
		expect(s.borderWidth).toBe(0);
	});

	it("renders every color across all variants without crashing", async () => {
		const colors = [
			"primary",
			"secondary",
			"destructive",
			"success",
			"warning",
			"info",
			"muted",
		] as const;
		for (const variant of ["solid", "outline", "subtle"] as const) {
			for (const color of colors) {
				const { root } = await renderTag({ variant, color });
				expect(root).toBeTruthy();
			}
		}
	});
});

describe("size metrics", () => {
	it("drives font size, padding, and normalized line height per size", async () => {
		for (const size of ["sm", "md", "lg"] as const) {
			const { screen, root } = await renderTag({ size });
			const text = flatStyle(screen.getByText("Beta", incl));
			const box = flatStyle(root);
			expect(text.fontSize).toBe(FONT[size]);
			expect(text.lineHeight).toBe(FONT[size] + 4);
			expect(text.includeFontPadding).toBe(false);
			expect(box.paddingHorizontal).toBe(PAD_H[size]);
			expect(box.paddingVertical).toBe(PAD_V[size]);
			expect(box.borderRadius).toBe(999);
		}
	});
});

describe("remove affordance", () => {
	it("renders a 44dp pressable that fires onRemove once per press", async () => {
		const onRemove = jest.fn();
		const { screen } = await renderTag({ onRemove });
		const btn = screen.getByTestId("k-tag-remove", incl);
		const s = flatStyle(btn);
		expect(s.minWidth).toBe(44);
		expect(s.minHeight).toBe(44);
		fireEvent.press(btn);
		expect(onRemove).toHaveBeenCalledTimes(1);
	});

	it("no remove affordance without onRemove", async () => {
		const { screen } = await renderTag();
		expect(screen.queryByTestId("k-tag-remove", incl)).toBeNull();
	});

	it("slotStyles.remove wins over the library margins", async () => {
		const { screen } = await renderTag({
			onRemove: () => undefined,
			slotStyles: { remove: { marginHorizontal: 0 } },
		});
		expect(
			flatStyle(screen.getByTestId("k-tag-remove", incl)).marginHorizontal,
		).toBe(0);
	});
});

describe("children arms", () => {
	it("null children render an icon/remove-only pill with no RNText", async () => {
		const screen = await render(<Tag onRemove={() => undefined}>{null}</Tag>);
		expect(screen.getByTestId("k-tag", incl)).toBeTruthy();
		expect(countTextHosts(screen.toJSON())).toBe(0);
	});

	it("empty string keeps the RNText host", async () => {
		const screen = await render(<Tag>{""}</Tag>);
		expect(countTextHosts(screen.toJSON())).toBe(1);
	});

	it("renders count 0 as the glyph 0", async () => {
		const screen = await render(<Tag>{0}</Tag>);
		expect(screen.getByText("0", incl)).toBeTruthy();
	});

	it("node children pass through unwrapped", async () => {
		const screen = await render(
			<Tag>
				<RNText testID="k-inner">x</RNText>
			</Tag>,
		);
		expect(screen.getByTestId("k-inner", incl)).toBeTruthy();
	});
});

describe("icon theming", () => {
	it("renders the icon through the themed Icon at the tag's fg by default", async () => {
		const screen = await render(<Tag icon={Sun}>Beta</Tag>);
		const glyph = screen.getByTestId("k-icon", incl).props.children as {
			props: { color?: string; size?: number };
		};
		expect(glyph.props.color).toBe(light.mutedForeground);
	});

	it("icon color follows the variant tint: subtle primary uses primary", async () => {
		const screen = await render(
			<Tag icon={Sun} variant="subtle" color="primary">
				Beta
			</Tag>,
		);
		const glyph = screen.getByTestId("k-icon", incl).props.children as {
			props: { color?: string };
		};
		expect(glyph.props.color).toBe(light.primary);
	});

	it("icon color on outline primary uses the tint", async () => {
		const screen = await render(
			<Tag icon={Sun} variant="outline" color="primary">
				Beta
			</Tag>,
		);
		const glyph = screen.getByTestId("k-icon", incl).props.children as {
			props: { color?: string };
		};
		expect(glyph.props.color).toBe(light.primary);
	});

	it("icon color on solid muted borrows accentForeground", async () => {
		const screen = await render(
			<Tag icon={Sun} variant="solid" color="muted">
				Beta
			</Tag>,
		);
		const glyph = screen.getByTestId("k-icon", incl).props.children as {
			props: { color?: string };
		};
		expect(glyph.props.color).toBe(light.accentForeground);
	});

	it("icon color on solid primary uses primaryForeground", async () => {
		const screen = await render(
			<Tag icon={Sun} variant="solid" color="primary">
				Beta
			</Tag>,
		);
		const glyph = screen.getByTestId("k-icon", incl).props.children as {
			props: { color?: string };
		};
		expect(glyph.props.color).toBe(light.primaryForeground);
	});

	it("iconColor raw string passes through unresolved and beats the variant tint", async () => {
		const screen = await render(
			<Tag icon={Sun} variant="subtle" color="primary" iconColor="#ff00ff">
				Beta
			</Tag>,
		);
		const glyph = screen.getByTestId("k-icon", incl).props.children as {
			props: { color?: string };
		};
		expect(glyph.props.color).toBe("#ff00ff");
	});

	it("iconColor token key resolves through the theme and beats the variant default", async () => {
		const screen = await render(
			<Tag icon={Sun} iconColor="destructive">
				Beta
			</Tag>,
		);
		const glyph = screen.getByTestId("k-icon", incl).props.children as {
			props: { color?: string };
		};
		expect(glyph.props.color).toBe(light.destructive);
		expect(glyph.props.color).not.toBe(light.mutedForeground);
	});

	it("icon px tracks the tag size: sm/md 14, lg 16", async () => {
		for (const size of ["sm", "md", "lg"] as const) {
			const screen = await render(
				<Tag icon={Sun} size={size}>
					Beta
				</Tag>,
			);
			const glyph = screen.getByTestId("k-icon", incl).props.children as {
				props: { size?: number };
			};
			expect(glyph.props.size).toBe(
				size === "lg" ? ICON_SIZE_PX.sm : ICON_SIZE_PX.xs,
			);
		}
	});

	it("icon-only pill: no text host, remove affordance still renders", async () => {
		const onRemove = jest.fn();
		const screen = await render(
			<Tag icon={Sun} onRemove={onRemove}>
				{null}
			</Tag>,
		);
		expect(screen.getAllByTestId("k-icon", incl).length).toBe(2); // Sun + remove ✕
		expect(screen.getByTestId("k-tag-remove", incl)).toBeTruthy();
		expect(countTextHosts(screen.toJSON())).toBe(0);
	});

	it("renders the icon in every variant without crashing", async () => {
		for (const variant of ["solid", "outline", "subtle"] as const) {
			const screen = await render(
				<Tag icon={Sun} variant={variant}>
					{null}
				</Tag>,
			);
			expect(screen.getByTestId("k-icon", incl)).toBeTruthy();
		}
	});
});

describe("styling channels", () => {
	it("style overrides the library surface", async () => {
		const { root } = await renderTag({ style: { borderRadius: 10 } });
		expect(flatStyle(root).borderRadius).toBe(10);
	});

	it("slotStyles.root wins over both style and the surface", async () => {
		const { root } = await renderTag({
			style: { borderRadius: 10 },
			slotStyles: { root: { borderRadius: 20 } },
		});
		expect(flatStyle(root).borderRadius).toBe(20);
	});
});

describe("markers", () => {
	it("honors a custom testID", async () => {
		const screen = await render(<Tag testID="k-my-tag">x</Tag>);
		expect(screen.getByTestId("k-my-tag", incl)).toBeTruthy();
	});
});
