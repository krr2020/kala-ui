/**
 * Text unit coverage: marker, size ramp, weights, align, token/raw and
 * web-name color mapping, truncate clamping, and the render-only
 * source pin for the component file.
 */
import { readFileSync } from "node:fs";
import { render } from "@testing-library/react-native";
import { themes } from "../../themes";
import type { TextSize } from "../text";
import { Text } from "../text";
import { FONT_SIZE } from "../text/text.styles";

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

const SIZES = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as TextSize[];

describe("Text", () => {
	it("renders the k-text marker with default props", async () => {
		const screen = await render(<Text>x</Text>);
		expect(screen.getByTestId("k-text")).toBeTruthy();
	});

	it("size ramp maps every tier to its exact px (old-literal equivalence)", async () => {
		expect(FONT_SIZE).toEqual({
			xs: 12,
			sm: 14,
			md: 16,
			lg: 18,
			xl: 20,
			"2xl": 24,
			"3xl": 30,
		});
		const screen = await render(<Text size="xs">x</Text>);
		for (const size of SIZES) {
			await screen.rerender(<Text size={size}>x</Text>);
			expect(Number(flatStyle(screen.getByTestId("k-text")).fontSize)).toBe(
				FONT_SIZE[size],
			);
		}
	});

	it("weights map to distinct numeric fontWeights", async () => {
		const seen = new Set<string>();
		for (const weight of [
			"thin",
			"extralight",
			"light",
			"normal",
			"medium",
			"semibold",
			"bold",
			"extrabold",
			"black",
		] as const) {
			const screen = await render(<Text weight={weight}>x</Text>);
			seen.add(String(flatStyle(screen.getByTestId("k-text")).fontWeight));
		}
		expect(seen.size).toBe(9);
	});

	it("align maps onto the RN textAlign values", async () => {
		const left = await render(<Text align="left">x</Text>);
		const center = await render(<Text align="center">x</Text>);
		const right = await render(<Text align="right">x</Text>);
		expect(flatStyle(left.getByTestId("k-text")).textAlign).toBe("left");
		expect(flatStyle(center.getByTestId("k-text")).textAlign).toBe("center");
		expect(flatStyle(right.getByTestId("k-text")).textAlign).toBe("right");
	});

	it("primary color resolves through the active theme", async () => {
		const screen = await render(<Text color="primary">x</Text>);
		expect(flatStyle(screen.getByTestId("k-text")).color).toBe(
			themes.light.primary,
		);
	});

	it("raw color strings pass through unresolved", async () => {
		const screen = await render(
			<Text color="#ff00ff" testID="k-text-raw">
				x
			</Text>,
		);
		expect(flatStyle(screen.getByTestId("k-text-raw")).color).toBe("#ff00ff");
	});

	it("web color names map to *Foreground tokens", async () => {
		const secondary = await render(<Text color="secondary">x</Text>);
		const muted = await render(<Text color="muted">x</Text>);
		expect(flatStyle(secondary.getByTestId("k-text")).color).toBe(
			themes.light.secondaryForeground,
		);
		expect(flatStyle(muted.getByTestId("k-text")).color).toBe(
			themes.light.mutedForeground,
		);
	});

	it("truncate clamps to one line with a tail ellipsis", async () => {
		const screen = await render(<Text truncate>long line</Text>);
		const node = screen.getByTestId("k-text").props;
		expect(node.numberOfLines).toBe(1);
		expect(node.ellipsizeMode).toBe("tail");
	});

	it("text.tsx stays render-only — no casts, no String(), no px literals", () => {
		const src = readFileSync(`${__dirname}/../text/text.tsx`, "utf8");
		expect(src).not.toMatch(/\bas (?:keyof|typeof)\b/);
		expect(src).not.toMatch(/String\(/);
		expect(src).not.toMatch(/\b\d+,\n/);
	});
});
