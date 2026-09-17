/**
 * Card compound contract: variants (flat/elevated/outlined), media
 * clipping, themed sub-parts, marker palette with graceful theme-key
 * fallback, skeleton loading, and slotStyles precedence.
 */
import { act, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { themes } from "../../themes";
import { tokens } from "../../tokens";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardImage,
	CardImageOverlay,
	CardMarker,
	CardSubtitle,
	CardTitle,
} from "../card";
import { markerColors, withAlpha } from "../card/card.styles";

type Screen = Awaited<ReturnType<typeof render>>;

const screenOf = async (node: React.ReactElement): Promise<Screen> =>
	await render(node);

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	(StyleSheet.flatten(node.props.style) ?? {}) as Record<
		number | string,
		number | string
	>;

const light = themes.light;
const lower = (value: unknown): string => String(value).toLowerCase();

describe("Card variants", () => {
	it("flat default renders the themed hairline surface with card padding", async () => {
		const screen = await screenOf(<Card>body</Card>);
		const s = flatStyle(screen.getByTestId("k-card"));
		expect(s.backgroundColor).toBe(light.card);
		expect(Number(s.borderRadius)).toBe(tokens.radius.card);
		expect(Number(s.borderWidth)).toBe(1);
		expect(lower(s.borderColor)).toBe(
			lower(withAlpha(light.border, light.cardBorderAlpha)),
		);
		expect(Number(s.padding)).toBe(tokens.space.cardPad);
	});

	it("elevated renders a shadow and no border", async () => {
		const screen = await screenOf(<Card variant="elevated">body</Card>);
		const s = flatStyle(screen.getByTestId("k-card"));
		expect(Number(s.borderWidth)).toBe(0);
		expect(s.shadowColor).toBe(light.shadowColor);
		expect(Number(s.shadowOpacity)).toBeGreaterThan(0);
		expect(Number(s.elevation)).toBeGreaterThan(0);
	});

	it("outlined renders the strong border", async () => {
		const screen = await screenOf(<Card variant="outlined">body</Card>);
		const s = flatStyle(screen.getByTestId("k-card"));
		expect(lower(s.borderColor)).toBe(lower(light.borderStrong));
		expect(Number(s.borderWidth)).toBe(1);
	});

	it("padding none removes root padding so parts own their own", async () => {
		const screen = await screenOf(
			<Card padding="none">
				<CardHeader>
					<CardTitle>t</CardTitle>
				</CardHeader>
			</Card>,
		);
		expect(Number(flatStyle(screen.getByTestId("k-card")).padding)).toBe(0);
		expect(
			Number(flatStyle(screen.getByTestId("k-card-header")).padding),
		).toBe(tokens.space.cardPad);
	});
});

describe("Card media clipping", () => {
	it("image cards clip via the inner wrapper, never the elevated root", async () => {
		const screen = await screenOf(
			<Card variant="elevated" padding="none">
				<CardImage source={{ uri: "https://x.test/a.jpg" }} alt="a" />
				<CardContent>
					<CardDescription>d</CardDescription>
				</CardContent>
			</Card>,
		);
		const root = flatStyle(screen.getByTestId("k-card"));
		const clip = flatStyle(screen.getByTestId("k-card-clip"));
		expect(Number(root.elevation)).toBeGreaterThan(0);
		expect(root.overflow).not.toBe("hidden");
		expect(clip.overflow).toBe("hidden");
		// content follows the image: only the TOP corners round so the
		// media meets the anatomy flush
		expect(Number(clip.borderTopLeftRadius)).toBe(tokens.radius.card);
		expect(Number(clip.borderTopRightRadius)).toBe(tokens.radius.card);
		expect(Number(clip.borderRadius ?? 0)).toBe(0);
	});

	it("the clip wrapper wraps only the media, never the anatomy", async () => {
		const screen = await screenOf(
			<Card variant="elevated" padding="none">
				<CardImage source={{ uri: "https://x.test/a.jpg" }} alt="a" />
				<CardHeader>
					<CardTitle>t</CardTitle>
				</CardHeader>
				<CardFooter>f</CardFooter>
			</Card>,
		);
		const clips = screen.getAllByTestId("k-card-clip");
		expect(clips.length).toBe(1);
		const clip = clips[0];
		// Only the image lives inside the clip wrapper; header/footer stay
		// siblings so the elevation shadow region is never overflow-clipped.
		expect(clip.children.length).toBe(1);
		expect((clip.children[0] as { props: { testID?: string } }).props.testID).toBe(
			"k-card-image",
			);
		expect(screen.getByTestId("k-card-header")).toBeTruthy();
		expect(screen.getByTestId("k-card-footer")).toBeTruthy();
		const footer = flatStyle(screen.getByTestId("k-card-footer"));
		expect(Number(footer.borderTopWidth)).toBe(1);
	});

	it("consecutive media share ONE clip wrapper — the overlay covers the image", async () => {
		const screen = await screenOf(
			<Card variant="elevated" padding="none">
				<CardImage source={{ uri: "https://x.test/a.jpg" }} alt="a" />
				<CardImageOverlay>
					<CardTitle>trail closed</CardTitle>
				</CardImageOverlay>
			</Card>,
		);
		const clips = screen.getAllByTestId("k-card-clip");
		expect(clips.length).toBe(1);
		expect(clips[0].children.length).toBe(2);
		expect(
				(clips[0].children[0] as { props: { testID?: string } }).props.testID,
			).toBe("k-card-image");
		expect(
				(clips[0].children[1] as { props: { testID?: string } }).props.testID,
			).toBe("k-card-overlay");
		const overlay = flatStyle(screen.getByTestId("k-card-overlay"));
		expect(overlay.position).toBe("absolute");
		// elevated + media + overlay: the root never hides overflow (shadow
		// survives) while the single clip wrapper owns the corner radius.
		const root = flatStyle(screen.getByTestId("k-card"));
		expect(root.overflow).not.toBe("hidden");
		expect(Number(root.elevation)).toBeGreaterThan(0);
		expect(Number(flatStyle(clips[0]).borderRadius)).toBe(tokens.radius.card);
	});

	it("separate media runs: the image gets a clip, an overlay-only run attaches to the card root", async () => {
		const screen = await screenOf(
			<Card padding="none">
				<CardImage source={{ uri: "https://x.test/a.jpg" }} alt="a" />
				<CardHeader>
					<CardTitle>t</CardTitle>
				</CardHeader>
				<CardImageOverlay>o</CardImageOverlay>
			</Card>,
		);
		// image run is clipped; header renders between; the overlay-only
		// run is NOT wrapped — a zero-height clip would render nothing, so
		// its absolute inset resolves against the card root instead.
		const clips = screen.getAllByTestId("k-card-clip");
		expect(clips.length).toBe(1);
		expect(
				(clips[0].children[0] as { props: { testID?: string } }).props.testID,
			).toBe("k-card-image");
		expect(screen.getByTestId("k-card-header")).toBeTruthy();
		const overlay = screen.getByTestId("k-card-overlay");
		const root = screen.getByTestId("k-card");
		expect(
				root.children.some(
					(c) =>
						typeof c === "object" &&
						"props" in c &&
						(c as { props?: { testID?: string } }).props?.testID ===
							"k-card-overlay",
				),
			).toBe(true);
		expect(overlay).toBeTruthy();
	});

	it("plain cards render no clip wrapper", async () => {
		const screen = await screenOf(<Card>body</Card>);
		expect(screen.queryByTestId("k-card-clip")).toBeNull();
	});
});

describe("Card children", () => {
	it("wraps bare string children in themed body text", async () => {
		const screen = await screenOf(<Card>plain body copy</Card>);
		expect(screen.getByText("plain body copy")).toBeTruthy();
		const card = screen.getByTestId("k-card");
		const child = card.children[0] as { props: { style?: unknown } };
		const s = StyleSheet.flatten(child.props.style) as Record<string, unknown>;
		expect(String(s.color).startsWith("#")).toBe(true);
	});

	it("wraps bare number children the same way", async () => {
		const screen = await screenOf(<Card>{42}</Card>);
		expect(screen.getByText("42")).toBeTruthy();
	});

	it("leaves element children untouched", async () => {
		const screen = await screenOf(
			<Card>
				<CardTitle testID="k-card-title">t</CardTitle>
			</Card>,
		);
		const card = screen.getByTestId("k-card");
		expect(card.children[0]).toBe(screen.getByTestId("k-card-title"));
	});

	it("renders empty children without crashing", async () => {
		const screen = await screenOf(<Card />);
		expect(screen.getByTestId("k-card")).toBeTruthy();
	});
});

describe("Card loading", () => {
	it("isLoading swaps content for the internal skeleton", async () => {
		const screen = await screenOf(<Card isLoading>hidden body</Card>);
		expect(screen.queryByText("hidden body")).toBeNull();
		expect(screen.getByTestId("k-card-skeleton")).toBeTruthy();
	});

	it("a custom skeleton node wins over the generated one", async () => {
		const screen = await screenOf(
			<Card isLoading skeleton={<CardTitle testID="custom-skel">s</CardTitle>}>
				body
			</Card>,
		);
		expect(screen.getByTestId("custom-skel")).toBeTruthy();
		expect(screen.queryByTestId("k-card-skeleton")).toBeNull();
	});
});

describe("Card compound parts", () => {
	it("renders every part marker", async () => {
		const screen = await screenOf(
			<Card padding="none">
				<CardHeader>
					<CardTitle>title</CardTitle>
					<CardSubtitle>subtitle</CardSubtitle>
					<CardDescription>description</CardDescription>
					<CardAction>act</CardAction>
				</CardHeader>
				<CardContent>content</CardContent>
				<CardFooter>footer</CardFooter>
			</Card>,
		);
		expect(screen.getByTestId("k-card-header")).toBeTruthy();
		expect(screen.getByTestId("k-card-title")).toBeTruthy();
		expect(screen.getByTestId("k-card-subtitle")).toBeTruthy();
		expect(screen.getByTestId("k-card-description")).toBeTruthy();
		expect(screen.getByTestId("k-card-action")).toBeTruthy();
		expect(screen.getByTestId("k-card-content")).toBeTruthy();
		expect(screen.getByTestId("k-card-footer")).toBeTruthy();
	});

	it("title/subtitle/description use their themed typography", async () => {
		const screen = await screenOf(
			<Card>
				<CardTitle>t</CardTitle>
				<CardSubtitle>s</CardSubtitle>
				<CardDescription>d</CardDescription>
			</Card>,
		);
		const title = flatStyle(screen.getByTestId("k-card-title"));
		expect(lower(title.color)).toBe(lower(light.cardForeground));
		const subtitle = flatStyle(screen.getByTestId("k-card-subtitle"));
		const description = flatStyle(screen.getByTestId("k-card-description"));
		expect(lower(subtitle.color)).toBe(lower(light.mutedForeground));
		expect(lower(description.color)).toBe(lower(light.mutedForeground));
	});

	it("action pushes to the row end and content drops its top padding", async () => {
		const screen = await screenOf(
			<Card padding="none">
				<CardHeader>
					<CardTitle>t</CardTitle>
					<CardAction>a</CardAction>
				</CardHeader>
				<CardContent>c</CardContent>
			</Card>,
		);
		expect(flatStyle(screen.getByTestId("k-card-action")).marginLeft).toBe(
			"auto",
		);
		const content = flatStyle(screen.getByTestId("k-card-content"));
		expect(Number(content.paddingTop)).toBe(0);
		expect(Number(content.padding)).toBe(tokens.space.cardPad);
	});

	it("footer separates with a themed hairline", async () => {
		const screen = await screenOf(
			<Card padding="none">
				<CardFooter>f</CardFooter>
			</Card>,
		);
		const s = flatStyle(screen.getByTestId("k-card-footer"));
		expect(Number(s.borderTopWidth)).toBe(1);
		expect(lower(s.borderTopColor)).toBe(lower(light.separator));
		expect(Number(s.paddingVertical)).toBeGreaterThan(0);
	});
});

describe("CardImage", () => {
	it("defaults to full-width 16/9 cover with an image a11y role", async () => {
		const screen = await screenOf(
			<CardImage source={{ uri: "https://x.test/a.jpg" }} alt="a cabin" />,
		);
		const image = screen.getByTestId("k-card-image");
		const s = flatStyle(image);
		expect(s.width).toBe("100%");
		expect(Number(s.aspectRatio)).toBeCloseTo(16 / 9);
		expect(image.props.resizeMode).toBe("cover");
		expect(image.props.accessibilityRole).toBe("image");
		expect(image.props.accessibilityLabel).toBe("a cabin");
	});

	it("style overrides sizing", async () => {
		const screen = await screenOf(
			<CardImage
				source={{ uri: "https://x.test/a.jpg" }}
				alt="x"
				style={{ width: 120, aspectRatio: 1 }}
			/>,
		);
		const s = flatStyle(screen.getByTestId("k-card-image"));
		expect(Number(s.width)).toBe(120);
		expect(Number(s.aspectRatio)).toBe(1);
	});

	it("slotStyles.root beats style beats the 16/9 default", async () => {
		const screen = await screenOf(
			<CardImage
				source={{ uri: "https://x.test/a.jpg" }}
				alt="x"
				style={{ width: 120 }}
				slotStyles={{ root: { width: 200 } }}
			/>,
		);
		const s = flatStyle(screen.getByTestId("k-card-image"));
		expect(Number(s.width)).toBe(200);
		expect(Number(s.aspectRatio)).toBeCloseTo(16 / 9);
	});

	it("a failed source swaps the image for a muted fallback with the same box", async () => {
		const screen = await screenOf(
			<CardImage
				source={{ uri: "https://x.test/dead.jpg" }}
				alt="dead"
				style={{ width: 150 }}
			/>,
		);
		const image = screen.getByTestId("k-card-image");
		await act(async () => {
			(
				image.props as {
					onError?: (e: { nativeEvent: { error: string } }) => void;
				}
			).onError?.({ nativeEvent: { error: "dead" } });
		});
		expect(screen.queryByTestId("k-card-image")).toBeNull();
		const fallback = flatStyle(screen.getByTestId("k-card-image-fallback"));
		expect(lower(fallback.backgroundColor)).toBe(lower(light.muted));
		expect(Number(fallback.width)).toBe(150);
		expect(Number(fallback.aspectRatio)).toBeCloseTo(16 / 9);
		await act(async () => {
			screen.unmount();
		});
	});
});

describe("CardImageOverlay", () => {
	it("absolutely covers the card", async () => {
		const screen = await screenOf(
			<CardImageOverlay testID="k-card-overlay">
				<CardTitle>t</CardTitle>
			</CardImageOverlay>,
		);
		const s = flatStyle(screen.getByTestId("k-card-overlay"));
		expect(s.position).toBe("absolute");
		expect(Number(s.top)).toBe(0);
		expect(Number(s.bottom)).toBe(0);
		expect(Number(s.left)).toBe(0);
		expect(Number(s.right)).toBe(0);
	});
});

describe("CardImageOverlay scrim", () => {
	it("renders a translucent dark scrim and light bare text on any image", async () => {
		const screen = await screenOf(
			<CardImageOverlay>trail closed</CardImageOverlay>,
		);
		const scrim = flatStyle(screen.getByTestId("k-card-overlay-scrim"));
		expect(scrim.position).toBe("absolute");
		const bg = String(scrim.backgroundColor);
		expect(bg).toMatch(/^#000000[0-9a-f]{2}$/i);
		expect(bg.endsWith("00")).toBe(false);
		const overlay = screen.getByTestId("k-card-overlay");
		const text = overlay.children.find(
				(c) =>
					typeof c === "object" &&
					"props" in c &&
					(c as { props?: { children?: unknown } }).props?.children ===
						"trail closed",
			) as { props: { style?: unknown } };
		const ts = StyleSheet.flatten(text.props.style) as Record<
			string,
			unknown
		>;
		expect(lower(ts.color)).toBe("#ffffff");
	});

	it("still absolute-fills its box", async () => {
		const screen = await screenOf(
			<CardImageOverlay>
				<CardTitle>t</CardTitle>
			</CardImageOverlay>,
		);
		const s = flatStyle(screen.getByTestId("k-card-overlay"));
		expect(s.position).toBe("absolute");
		expect(Number(s.top)).toBe(0);
		expect(Number(s.bottom)).toBe(0);
		expect(Number(s.left)).toBe(0);
		expect(Number(s.right)).toBe(0);
	});
});

describe("CardMarker", () => {
	it("renders a positioned themed chip with readable text", async () => {
		const screen = await screenOf(
			<Card>
				<CardMarker color="primary" position="top-right">
					new
				</CardMarker>
			</Card>,
		);
		const marker = screen.getByTestId("k-card-marker");
		const s = flatStyle(marker);
		expect(s.position).toBe("absolute");
		expect(Number(s.top)).toBeGreaterThan(0);
		expect(Number(s.right)).toBeGreaterThan(0);
		expect(lower(s.backgroundColor)).toBe(lower(light.primary));
		const text = marker.children[0] as { props: { style?: unknown } };
		const ts = StyleSheet.flatten(text.props.style) as Record<string, unknown>;
		expect(lower(ts.color)).toBe(lower(light.primaryForeground));
	});

	it("icon variant is a 44dp circle", async () => {
		const screen = await screenOf(
			<CardMarker variant="icon" color="info">
				★
			</CardMarker>,
		);
		const s = flatStyle(screen.getByTestId("k-card-marker"));
		expect(Number(s.width)).toBe(44);
		expect(Number(s.height)).toBe(44);
		expect(Number(s.borderRadius)).toBeGreaterThanOrEqual(999 / 2);
	});

	it("falls back to the muted pair when the theme lacks a color key", () => {
		const partial = {
			cardForeground: "#111",
			card: "#fff",
		} as never as typeof light;
		const pair = markerColors(partial, "success");
		expect(pair).toEqual({ background: "#111", foreground: "#fff" });
	});
});

describe("Card slotStyles precedence", () => {
	it("root slot beats style beats library defaults", async () => {
		const screen = await screenOf(
			<Card style={{ borderWidth: 3 }} slotStyles={{ root: { borderWidth: 7 } }}>
				card
			</Card>,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-card")).borderWidth),
		).toBe(7);
	});

	it("sub-parts honor style and slotStyles too", async () => {
		const screen = await screenOf(
			<Card>
				<CardTitle style={{ fontSize: 20 }} testID="t1">
					a
				</CardTitle>
				<CardTitle slotStyles={{ root: { fontSize: 24 } }} testID="t2">
					b
				</CardTitle>
				<CardContent style={{ paddingTop: 9 }} testID="c1">
					x
				</CardContent>
			</Card>,
		);
		expect(Number(flatStyle(screen.getByTestId("t1")).fontSize)).toBe(20);
		expect(Number(flatStyle(screen.getByTestId("t2")).fontSize)).toBe(24);
		expect(Number(flatStyle(screen.getByTestId("c1")).paddingTop)).toBe(9);
	});
});

describe("withAlpha", () => {
	it("appends the alpha channel to hex and passes through non-hex colors", () => {
		expect(withAlpha("#c1cedc", 0.16)).toBe("#c1cedc29");
		expect(withAlpha("#ffffff", 1)).toBe("#ffffffff");
		expect(withAlpha("red", 0.5)).toBe("red");
	});
});

describe("Card a11y surface", () => {
	it("the root is a plain surface, not an accessible element itself", async () => {
		const screen = await screenOf(
			<Card>
				<CardTitle>readable</CardTitle>
			</Card>,
		);
		const card = screen.getByTestId("k-card");
		expect(card.props.accessible).not.toBe(true);
		expect(screen.getByText("readable")).toBeTruthy();
	});
});
