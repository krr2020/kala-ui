/**
 * Icon unit coverage: marker, size ramp, token/raw color resolution,
 * a11y gating, and the wrapper View props the Android release build
 * depends on (collapsable={false} keeps the testID node alive).
 */
import { readFileSync } from "node:fs";
import type { ReactElement } from "react";
import { Sun } from "lucide-react-native";
import { Text as RNText } from "react-native";
import { render } from "@testing-library/react-native";
import { themes } from "../../themes";
import { Icon } from "../icon";
import { ICON_SIZE_PX } from "../icon/icon.styles";
import type { IconSize } from "../icon";

const inclHidden = { includeHiddenElements: true };

// a non-lucide icon-library component — the prop contract is just
// {size, color}; lucide is the demos' choice, not a consumer constraint
const CustomIcon = ({
	size,
	color,
}: {
	size?: number;
	color?: string;
}): ReactElement => (
	<RNText testID="k-custom-icon">{`${size ?? "?"}|${color ?? "?"}`}</RNText>
);

// toJSON is the stable surface for lucide props: `size` lands on the
// rendered svg as numeric width, `color` as fill
type JsonNode = {
	children?: unknown;
	props?: Record<string, unknown>;
};
const svgProps = (tree: unknown): Record<string, unknown> => {
	const node = tree as JsonNode | null;
	const svg = (
		Array.isArray(node?.children) ? node.children[0] : undefined
	) as JsonNode | undefined;
	return svg?.props ?? {};
};

describe("Icon", () => {
	it("renders the k-icon marker with default props", async () => {
		const screen = await render(<Icon icon={Sun} />);
		expect(screen.getByTestId("k-icon", inclHidden)).toBeTruthy();
	});

	it("size ramp maps every tier to its token px", async () => {
		const screen = await render(<Icon icon={Sun} size="xs" />);
		for (const size of ["xs", "sm", "md", "lg", "xl"] as IconSize[]) {
			await screen.rerender(<Icon icon={Sun} size={size} />);
			expect(Number(svgProps(screen.toJSON()).width)).toBe(
				ICON_SIZE_PX[size],
			);
		}
		expect(ICON_SIZE_PX).toEqual({
			xs: 14,
			sm: 16,
			md: 20,
			lg: 24,
			xl: 32,
		});
	});

	it("theme-token color resolves through the active theme", async () => {
		const screen = await render(<Icon icon={Sun} color="primary" />);
		expect(String(svgProps(screen.toJSON()).stroke)).toBe(
			String(themes.light.primary),
		);
	});

	it("raw color strings pass through unresolved", async () => {
		const screen = await render(<Icon icon={Sun} color="#ff00ff" />);
		expect(String(svgProps(screen.toJSON()).stroke)).toBe("#ff00ff");
	});

	it("label promotes the icon into the a11y tree as an image", async () => {
		const screen = await render(<Icon icon={Sun} label="Sun" />);
		const node = screen.getByTestId("k-icon").props;
		expect(node.accessible).toBe(true);
		expect(node.accessibilityRole).toBe("image");
		expect(node.accessibilityLabel).toBe("Sun");
		expect(node.accessibilityElementsHidden).toBeUndefined();
	});

	it("without a label the icon is hidden from the a11y tree", async () => {
		const screen = await render(<Icon icon={Sun} />);
		const node = screen.getByTestId("k-icon", inclHidden).props;
		expect(node.accessibilityElementsHidden).toBe(true);
		expect(node.accessibilityRole).toBeUndefined();
	});

	it("wrapper View stays non-collapsable so k-icon survives release builds", async () => {
		const screen = await render(<Icon icon={Sun} />);
		expect(screen.getByTestId("k-icon", inclHidden).props.collapsable).toBe(
			false,
		);
	});

	it("styles.root slot overrides the empty base", async () => {
		const screen = await render(
			<Icon icon={Sun} styles={{ root: { margin: 5 } }} />,
		);
		const style = screen.getByTestId("k-icon", inclHidden).props.style;
		expect(JSON.stringify(style)).toContain("5");
	});

	it("any {size,color} icon component renders — lucide not required", async () => {
		const screen = await render(
			<Icon icon={CustomIcon} size="lg" color="primary" />,
		);
		expect(
			screen.getByText(`24|${String(themes.light.primary)}`, inclHidden),
		).toBeTruthy();
	});

	it("icon.tsx stays render-only — no casts, no String(), no px literals", () => {
		const src = readFileSync(`${__dirname}/../icon/icon.tsx`, "utf8");
		expect(src).not.toMatch(/\bas (?:keyof|typeof)\b/);
		expect(src).not.toMatch(/String\(/);
		// px tables live in icon.styles.ts — no standalone numeric
		// literals in the component file
		expect(src).not.toMatch(/\b\d+,\n/);
	});
});
