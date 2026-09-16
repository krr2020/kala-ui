/**
 * Cross-file seam for the Icon split: shape token ramp → icon.styles →
 * rendered component → public entry barrel. Guards against the size
 * ramp drifting out of tokens or the color helper diverging from theme
 * values in any registered theme.
 */

import { render } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";
import type { ReactElement } from "react";
import { Text as RNText } from "react-native";
import * as entry from "../..";
import { themes } from "../../themes";
import { tokens } from "../../tokens";
import type { IconComponent, IconSize } from "../icon";
import { Icon } from "../icon";
import { ICON_SIZE_PX, iconColor } from "../icon/icon.styles";

// structural: lucide satisfies the generic {size,color} contract without
// a cast — ComponentType contravariance accepts the richer LucideProps
const lucideAsGeneric: IconComponent = Sun;

// a non-lucide icon-library component — the contract is just {size,color}
const CustomIcon = ({
	size,
	color,
}: {
	size?: number;
	color?: string;
}): ReactElement => (
	<RNText testID="k-custom-icon">{`${size ?? "?"}|${color ?? "?"}`}</RNText>
);

const inclHidden = { includeHiddenElements: true };

describe("icon integration", () => {
	it("size ramp is sourced from the shape token, not literals", () => {
		for (const size of ["xs", "sm", "md", "lg", "xl"] as IconSize[]) {
			expect(ICON_SIZE_PX[size]).toBe(tokens.size.icon[size]);
		}
	});

	it("iconColor resolves every color-capable theme key per theme", () => {
		for (const theme of Object.values(themes)) {
			expect(iconColor(theme, "primary")).toBe(String(theme.primary));
			expect(iconColor(theme, "foreground")).toBe(String(theme.foreground));
		}
	});

	it("raw strings and unknown keys fall back to the input", () => {
		const theme = themes.light;
		expect(iconColor(theme, "#ff00ff")).toBe("#ff00ff");
		// keys absent from the theme resolve to their own name
		expect(iconColor(theme, "not-a-token")).toBe("not-a-token");
	});

	it("entry barrel renders Icon with token-sourced size", async () => {
		expect((entry as { Icon?: unknown }).Icon).toBe(Icon);
		const screen = await render(<entry.Icon icon={Sun} size="lg" />);
		const node = screen.getByTestId("k-icon", inclHidden);
		const svg = (
			Array.isArray(screen.toJSON()?.children)
				? screen.toJSON()?.children?.[0]
				: undefined
		) as { props?: { width?: number } } | undefined;
		expect(node).toBeTruthy();
		expect(svg?.props?.width).toBe(tokens.size.icon.lg);
	});

	it("lucide components satisfy IconComponent without a cast", async () => {
		const screen = await render(<Icon icon={lucideAsGeneric} size="md" />);
		expect(screen.getByTestId("k-icon", inclHidden)).toBeTruthy();
	});

	it("non-lucide icon libraries render through the entry barrel", async () => {
		const screen = await render(
			<entry.Icon icon={CustomIcon} size="sm" color="primary" />,
		);
		expect(
			screen.getByText(`16|${String(themes.light.primary)}`, {
				includeHiddenElements: true,
			}),
		).toBeTruthy();
	});
});
