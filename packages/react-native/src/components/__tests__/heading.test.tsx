import { render } from "@testing-library/react-native";

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

import { Heading } from "../heading";

describe("Heading", () => {
	it("renders the k-heading marker with accessibilityRole header", async () => {
		const screen = await render(<Heading>screen heading</Heading>);
		expect(screen.getByTestId("k-heading").props.accessibilityRole).toBe(
			"header",
		);
	});

	it.each([
		["h1", 36],
		["h2", 30],
		["h3", 24],
		["h4", 20],
		["h5", 18],
		["h6", 16],
	] as const)("size %s resolves to fontSize %d", async (size, fontSize) => {
		const screen = await render(<Heading size={size}>{size}</Heading>);
		expect(flatStyle(screen.getByTestId("k-heading")).fontSize).toBe(fontSize);
	});

	it.each([
		["default", 700],
		["medium", 500],
		["semibold", 600],
		["extrabold", 800],
	] as const)("weight %s maps to %d", async (weight, fontWeight) => {
		const screen = await render(<Heading weight={weight}>{weight}</Heading>);
		expect(flatStyle(screen.getByTestId("k-heading")).fontWeight).toBe(
			fontWeight,
		);
	});

	it.each([
		["left", "left"],
		["center", "center"],
		["right", "right"],
	] as const)("align %s maps to textAlign", async (align, textAlign) => {
		const screen = await render(<Heading align={align}>{align}</Heading>);
		expect(flatStyle(screen.getByTestId("k-heading")).textAlign).toBe(
			textAlign,
		);
	});

	it("applies tracking-tight letterSpacing", async () => {
		const screen = await render(<Heading>tracking</Heading>);
		expect(flatStyle(screen.getByTestId("k-heading")).letterSpacing).toBe(-0.5);
	});

	it("honors custom testID", async () => {
		const screen = await render(
			<Heading testID="k-demo-heading-item">custom</Heading>,
		);
		expect(screen.getByTestId("k-demo-heading-item")).toBeTruthy();
	});

	it("slot styles.root wins over style", async () => {
		const screen = await render(
			<Heading
				style={{ fontSize: 12 }}
				styles={{ root: { fontSize: 10 } }}
				testID="k-heading-slot"
			>
				slot
			</Heading>,
		);
		expect(flatStyle(screen.getByTestId("k-heading-slot")).fontSize).toBe(10);
	});
});
