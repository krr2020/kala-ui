/**
 * Cross-file seam for the Text split: shape font token → text.styles →
 * rendered component → entry barrel, plus the Heading-independence pin.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react-native";
import * as entry from "../..";
import { tokens } from "../../tokens";
import type { TextSize } from "../text";
import { Text } from "../text";
import { FONT_SIZE } from "../text/text.styles";

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

describe("text integration", () => {
	it("font ramp is sourced from the shape token, not literals", () => {
		for (const size of [
			"xs",
			"sm",
			"md",
			"lg",
			"xl",
			"2xl",
			"3xl",
		] as TextSize[]) {
			expect(FONT_SIZE[size]).toBe(tokens.size.font[size]);
		}
	});

	it("entry barrel renders Text with token-sourced fontSize", async () => {
		expect((entry as { Text?: unknown }).Text).toBe(Text);
		const screen = await render(<entry.Text size="2xl">x</entry.Text>);
		expect(Number(flatStyle(screen.getByTestId("k-text")).fontSize)).toBe(
			tokens.size.font["2xl"],
		);
	});

	it("Heading keeps its own type tables — no import from text.styles", () => {
		const heading = readFileSync(
			resolve(__dirname, "../heading/heading.tsx"),
			"utf8",
		);
		expect(heading).not.toMatch(/text\/text\.styles/);
		expect(heading).not.toMatch(/from "\.\.\/text/);
	});
});
