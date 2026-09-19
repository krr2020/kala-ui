/**
 * Textarea: the multiline arm of the web input surface — themed
 * bg/border/radius, rows→minHeight mapping, hasError/disabled arms, and
 * the isLoading Skeleton swap that keeps the k-textarea marker.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Textarea } from "../textarea";

// the skeleton surface is a11y-hidden by design — queries must opt in
const inclHidden = { includeHiddenElements: true } as const;

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

const theme = () => require("../../themes").themes.light;

describe("Textarea", () => {
	it("renders the k-textarea marker as a multiline input", async () => {
		const screen = await render(<Textarea accessibilityLabel="notes" />);
		const input = screen.getByTestId("k-textarea");
		expect(input.props.multiline).toBe(true);
		expect(input.props.accessibilityLabel).toBe("notes");
	});

	it("BASELINE: default arm pins minHeight 80 and the border token", async () => {
		const screen = await render(<Textarea />);
		const s = flatStyle(screen.getByTestId("k-textarea"));
		expect(s.minHeight).toBe(80);
		expect(s.borderColor).toBe(theme().border);
		expect(s.backgroundColor).toBe(theme().card);
	});

	it("rows maps to a larger minHeight (web parity: rows * line height)", async () => {
		const screen = await render(<Textarea rows={6} />);
		const s = flatStyle(screen.getByTestId("k-textarea"));
		expect(Number(s.minHeight)).toBeGreaterThan(80);
	});

	it("textAlignVertical defaults to top (multiline parity with web)", async () => {
		const screen = await render(<Textarea />);
		expect(screen.getByTestId("k-textarea").props.textAlignVertical).toBe(
			"top",
		);
	});

	it("hasError arm swaps borderColor to the destructive token", async () => {
		const screen = await render(<Textarea hasError />);
		const s = flatStyle(screen.getByTestId("k-textarea"));
		expect(s.borderColor).toBe(theme().destructive);
		expect(s.borderColor).not.toBe(theme().border);
	});

	it("hasSuccess arm pins the success border; hasError wins when both are set", async () => {
		const valid = await render(<Textarea hasSuccess />);
		expect(flatStyle(valid.getByTestId("k-textarea")).borderColor).toBe(
			theme().success,
		);
		const both = await render(<Textarea hasError hasSuccess />);
		expect(flatStyle(both.getByTestId("k-textarea")).borderColor).toBe(
			theme().destructive,
		);
	});

	it("disabled arm blocks editing and announces disabled state", async () => {
		const screen = await render(<Textarea disabled />);
		const input = screen.getByTestId("k-textarea");
		expect(input.props.editable).toBe(false);
		expect(input.props.accessibilityState?.disabled).toBe(true);
		expect(flatStyle(input).opacity).toBe(0.5);
	});

	it("placeholderTextColor comes from the mutedForeground token", async () => {
		const screen = await render(<Textarea placeholder="jot something" />);
		expect(screen.getByTestId("k-textarea").props.placeholderTextColor).toBe(
			theme().mutedForeground,
		);
	});

	it("passes value/onChangeText through (fire changeText)", async () => {
		const onChange = jest.fn();
		const screen = await render(
			<Textarea value="abc" onChangeText={onChange} />,
		);
		const input = screen.getByTestId("k-textarea");
		expect(input.props.value).toBe("abc");
		await fireEvent.changeText(input, "abcd");
		expect(onChange).toHaveBeenCalledWith("abcd");
	});

	it("isLoading swaps to the Skeleton surface while keeping the marker", async () => {
		const screen = await render(<Textarea isLoading accessibilityLabel="b" />);
		// marker survives for E2E; the skeleton block is the visible body
		expect(screen.getByTestId("k-textarea", inclHidden)).toBeTruthy();
		expect(screen.getAllByTestId("k-skeleton", inclHidden).length).toBeGreaterThan(
			0,
		);
		const s = flatStyle(screen.getByTestId("k-textarea", inclHidden));
		expect(Number(s.minHeight)).toBeGreaterThanOrEqual(80);
	});

	it("isLoading honors rows for the skeleton height", async () => {
		const screen = await render(<Textarea isLoading rows={5} />);
		const idle = await render(<Textarea isLoading />);
		expect(
			Number(flatStyle(screen.getByTestId("k-textarea", inclHidden)).minHeight),
		).toBeGreaterThan(
			Number(flatStyle(idle.getByTestId("k-textarea", inclHidden)).minHeight),
		);
	});

	it("slotStyles.root wins over both library defaults and the style prop", async () => {
		const screen = await render(
			<Textarea
				style={{ minHeight: 120 }}
				slotStyles={{ root: { minHeight: 200, borderWidth: 7 } }}
			/>,
		);
		const s = flatStyle(screen.getByTestId("k-textarea"));
		expect(s.minHeight).toBe(200);
		expect(s.borderWidth).toBe(7);
	});
});
