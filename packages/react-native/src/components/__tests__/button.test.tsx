/**
 * Button composed-children contract: icon+label children must render
 * inline in a row (icon beside label, size-scaled gap) — not stacked.
 */
import { render } from "@testing-library/react-native";
import { Text, View } from "react-native";
import { motion } from "../../tokens";
import { BUTTON_SPRING as BARREL_SPRING, Button } from "../button";
import { BUTTON_SPRING } from "../button/button.styles";

function Glyph() {
	return <View testID="glyph" />;
}

function Label() {
	return <Text>Save</Text>;
}

type JSONNode = {
	type?: string;
	props?: Record<string, unknown>;
	children?: (JSONNode | string)[];
};

type JSONRoot = JSONNode | null;

function walk(
	node: JSONNode | string | null | undefined,
	fn: (n: JSONNode) => void,
) {
	if (!node || typeof node === "string") return;
	fn(node);
	for (const child of node.children ?? []) walk(child, fn);
}

async function renderButton(children: React.ReactNode, props = {}) {
	return render(<Button {...props}>{children}</Button>);
}

function rowWrapperOf(json: JSONRoot) {
	const rows: JSONNode[] = [];
	walk(json, (n) => {
		const style = n.props?.style as { flexDirection?: string } | undefined;
		if (n.type === "View" && style?.flexDirection === "row") rows.push(n);
	});
	return rows[0];
}

describe("Button module split", () => {
	it("re-exports BUTTON_SPRING from the barrel and button.styles keeps the spring", () => {
		expect(BARREL_SPRING).toEqual(motion.spring.snappy);
		expect(BUTTON_SPRING).toEqual(motion.spring.snappy);
	});
});

describe("Button composed children layout", () => {
	it("renders leading-icon composition in a row container with center alignment", async () => {
		const screen = await renderButton(
			<>
				<Glyph />
				<Label />
			</>,
			{ accessibilityLabel: "save" },
		);
		const wrapper = rowWrapperOf(screen.toJSON() as JSONRoot);
		expect(wrapper).toBeTruthy();
		const style = wrapper?.props?.style as Record<string, unknown>;
		expect(style.flexDirection).toBe("row");
		expect(style.alignItems).toBe("center");
		expect(style.justifyContent).toBe("center");
		expect(style.gap).toBe(8);
	});

	it("renders trailing-icon composition in the same row container preserving order", async () => {
		const screen = await renderButton(
			<>
				<Label />
				<Glyph />
			</>,
			{ variant: "subtle", accessibilityLabel: "next" },
		);
		const wrapper = rowWrapperOf(screen.toJSON() as JSONRoot);
		expect(wrapper).toBeTruthy();
		const last = (wrapper?.children ?? []).at(-1);
		expect((last as JSONNode | undefined)?.props?.testID ?? undefined).toBe(
			"glyph",
		);
	});

	it.each([
		["xs", 6],
		["sm", 6],
		["md", 8],
		["lg", 10],
	] as const)("size %s scales the row gap to %d", async (size, gap) => {
		const screen = await renderButton(
			<>
				<Glyph />
				<Label />
			</>,
			{ size, accessibilityLabel: `row-${size}` },
		);
		const style = rowWrapperOf(screen.toJSON() as JSONRoot)?.props
			?.style as Record<string, unknown>;
		expect(style.gap).toBe(gap);
	});

	it("keeps the string-children path as a single styled Text with no row wrapper", async () => {
		const screen = await renderButton("Press", {
			accessibilityLabel: "plain",
		});
		const texts: JSONNode[] = [];
		const rows: JSONNode[] = [];
		walk(screen.toJSON() as JSONRoot, (n) => {
			if (n.type === "Text") texts.push(n);
			const style = n.props?.style as { flexDirection?: string } | undefined;
			if (n.type === "View" && style?.flexDirection === "row") rows.push(n);
		});
		expect(texts).toHaveLength(1);
		const style = texts[0]?.props?.style as Record<string, unknown>;
		expect(style.color).toBeTruthy();
		expect(style.fontWeight).toBe("500");
		expect(rows).toHaveLength(0);
	});

	it("shows the loading indicator instead of composed children", async () => {
		const screen = await renderButton(
			<>
				<Glyph />
				<Label />
			</>,
			{ isLoading: true, accessibilityLabel: "loading" },
		);
		let glyph = false;
		let spinner = false;
		walk(screen.toJSON() as JSONRoot, (n) => {
			if (n.type === "ActivityIndicator") spinner = true;
			if (n.props?.testID === "glyph") glyph = true;
		});
		expect(spinner).toBe(true);
		expect(glyph).toBe(false);
	});

	it("renders an icon-only child at size=icon centered without crash", async () => {
		const screen = await renderButton(<Glyph />, {
			size: "icon",
			accessibilityLabel: "icon-only",
		});
		let glyph = false;
		walk(screen.toJSON() as JSONRoot, (n) => {
			if (n.props?.testID === "glyph") glyph = true;
		});
		expect(glyph).toBe(true);
	});

	it("renders disabled with composed children", async () => {
		const screen = await renderButton(
			<>
				<Glyph />
				<Label />
			</>,
			{ disabled: true, accessibilityLabel: "disabled" },
		);
		let glyph = false;
		walk(screen.toJSON() as JSONRoot, (n) => {
			if (n.props?.testID === "glyph") glyph = true;
		});
		expect(glyph).toBe(true);
		const root = screen.toJSON() as JSONNode;
		expect(root.props?.accessibilityState).toMatchObject({ disabled: true });
	});
});
