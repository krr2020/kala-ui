import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { themes } from "../../themes";
import { Field } from "../field";
import { TextInput } from "../text-input";

type Screen = Awaited<ReturnType<typeof render>>;

function flatStyle(node: {
	props: { style?: unknown };
}): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	const walk = (entry: unknown): void => {
		if (Array.isArray(entry)) {
			for (const e of entry) walk(e);
		} else if (entry) {
			Object.assign(out, entry);
		}
	};
	walk(node.props.style ?? []);
	return out;
}

describe("Field", () => {
	it("renders markers for label, control, description and error", async () => {
		const screen: Screen = await render(
			<Field
				label="Email"
				description="We never share it"
				error="Invalid address"
				required
			>
				<TextInput accessibilityLabel="Email" />
			</Field>,
		);
		expect(screen.getByTestId("k-field")).toBeTruthy();
		expect(screen.getByTestId("k-field-label")).toBeTruthy();
		expect(screen.getByTestId("k-field-control")).toBeTruthy();
		expect(screen.getByTestId("k-field-description")).toBeTruthy();
		expect(screen.getByTestId("k-field-error")).toBeTruthy();
	});

	it("required appends the destructive asterisk to the label", async () => {
		const screen: Screen = await render(
			<Field label="Name" required>
				<TextInput accessibilityLabel="Name" />
			</Field>,
		);
		const label = screen.getByTestId("k-field-label");
		expect(label.props.children).toContain("Name");
		const flat = flatStyle(
			screen.getAllByText("*")[0] as unknown as {
				props: { style?: unknown };
			},
		);
		// color asserted distinct from label foreground via destructive token
		expect(typeof flat.color).toBe("string");
		expect(flat.color).not.toBe(flatStyle(label).color);
	});

	it("omits description/error nodes when not provided", async () => {
		const screen: Screen = await render(
			<Field label="Only label">
				<TextInput accessibilityLabel="Only label" />
			</Field>,
		);
		expect(screen.queryByTestId("k-field-description")).toBeNull();
		expect(screen.queryByTestId("k-field-error")).toBeNull();
	});

	it("merges label + error into the control's accessibilityLabel when the control has none", async () => {
		const screen: Screen = await render(
			<Field label="Email" error="Invalid address">
				<TextInput />
			</Field>,
		);
		const input = screen.getByTestId("k-text-input");
		expect(input.props.accessibilityLabel).toBe("Email, Invalid address");
	});

	it("never overrides a control-provided accessibilityLabel", async () => {
		const screen: Screen = await render(
			<Field label="Email" error="Invalid address">
				<TextInput accessibilityLabel="Custom label" />
			</Field>,
		);
		const input = screen.getByTestId("k-text-input");
		expect(input.props.accessibilityLabel).toBe("Custom label");
	});

	it("error text uses the destructive tone, description the muted one", async () => {
		const screen: Screen = await render(
			<Field label="Email" description="helper" error="broken">
				<TextInput />
			</Field>,
		);
		const description = flatStyle(screen.getByTestId("k-field-description"));
		const error = flatStyle(screen.getByTestId("k-field-error"));
		expect(description.color).not.toBe(error.color);
		expect(error.color).toBeTruthy();
	});

	it("label merge drops empty parts — no stray separators", async () => {
		const onlyLabel = await render(
			<Field label="Solo">
				<TextInput />
			</Field>,
		);
		expect(onlyLabel.getByTestId("k-text-input").props.accessibilityLabel).toBe(
			"Solo",
		);
		const descOnly = await render(
			<Field description="just helper copy">
				<TextInput />
			</Field>,
		);
		expect(descOnly.getByTestId("k-text-input").props.accessibilityLabel).toBe(
			"just helper copy",
		);
		const bare = await render(
			<Field>
				<TextInput />
			</Field>,
		);
		// all parts empty → join is "" → treated as no label at all
		const bareLabel = bare.getByTestId("k-text-input").props
			.accessibilityLabel as string | undefined;
		expect(bareLabel ? bareLabel.length : 0).toBe(0);
	});

	it("hasError arm without error copy still announces nothing but tints nothing structural", async () => {
		const screen: Screen = await render(
			<Field label="Email" hasError>
				<TextInput />
			</Field>,
		);
		expect(screen.queryByTestId("k-field-error")).toBeNull();
		const input = screen.getByTestId("k-text-input");
		expect(input.props.accessibilityLabel).toBe("Email");
	});

	it("renders a string error array with unique entries joined", async () => {
		const screen: Screen = await render(
			<Field label="Email" error={["a", "a", "b"]}>
				<TextInput />
			</Field>,
		);
		const error = screen.getByTestId("k-field-error");
		expect(error.props.children).toBe("a, b");
	});

	it("dedupe preserves first-occurrence order", async () => {
		const screen: Screen = await render(
			<Field label="Email" error={["b", "a", "b", "a"]}>
				<TextInput />
			</Field>,
		);
		expect(screen.getByTestId("k-field-error").props.children).toBe("b, a");
	});

	it("invalid tint propagates: control ring turns destructive, own hasError wins", async () => {
		const tinted = await render(
			<Field label="API key" hasError>
				<TextInput />
			</Field>,
		);
		const tintedRing = flatStyle(tinted.getByTestId("k-text-input"));
		expect(tintedRing.borderColor).toBe(themes.light.destructive);
		const withCopy = await render(
			<Field label="Email" error="broken">
				<TextInput />
			</Field>,
		);
		expect(flatStyle(withCopy.getByTestId("k-text-input")).borderColor).toBe(
			themes.light.destructive,
		);
		const own = await render(
			<Field label="Email" hasError>
				<TextInput hasError={false} />
			</Field>,
		);
		expect(
			flatStyle(own.getByTestId("k-text-input")).borderColor,
		).not.toBe(themes.light.destructive);
	});

	it("slotStyles.root slot overrides the surface", async () => {
		const screen: Screen = await render(
			<Field label="Email" slotStyles={{ root: { gap: 20 } }}>
				<TextInput />
			</Field>,
		);
		expect(flatStyle(screen.getByTestId("k-field")).gap).toBe(20);
	});

	it("accepts arbitrary text children as the control", async () => {
		const screen: Screen = await render(
			<Field label="Plain">
				<Text>plain control</Text>
			</Field>,
		);
		expect(screen.getByTestId("k-field-control")).toBeTruthy();
	});
});
