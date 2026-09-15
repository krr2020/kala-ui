import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import type { StepItem } from "../steps";
import { Steps } from "../steps";

type Screen = Awaited<ReturnType<typeof render>>;

const ITEMS: StepItem[] = [
	{ title: "Account", description: "your email" },
	{ title: "Profile" },
	{ title: "Confirm", description: "review and go" },
];

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

describe("Steps", () => {
	it("renders one k-step row per item with numbers by default", async () => {
		const screen: Screen = await render(<Steps items={ITEMS} value={1} />);
		expect(screen.getByTestId("k-steps")).toBeTruthy();
		expect(screen.getAllByTestId("k-step")).toHaveLength(3);
		expect(screen.getByText("1")).toBeTruthy();
		expect(screen.getByText("2")).toBeTruthy();
		expect(screen.getByText("3")).toBeTruthy();
	});

	it("completed steps announce completed, current announces current, pending keeps its number", async () => {
		const screen: Screen = await render(<Steps items={ITEMS} value={2} />);
		expect(
			screen.getByLabelText("Step 1 of 3: Account (completed)"),
		).toBeTruthy();
		expect(
			screen.getByLabelText("Step 2 of 3: Profile (current step)"),
		).toBeTruthy();
		// step 3 is pending → still shows its number
		expect(screen.getByText("3")).toBeTruthy();
	});

	it("description renders only when provided", async () => {
		const screen: Screen = await render(<Steps items={ITEMS} value={1} />);
		expect(screen.getByText("your email")).toBeTruthy();
		expect(screen.getByText("review and go")).toBeTruthy();
		expect(screen.getByText("Profile")).toBeTruthy(); // title always
		expect(screen.queryByText("undefined")).toBeNull();
	});

	it("custom icon replaces the number on a non-completed step", async () => {
		const screen: Screen = await render(
			<Steps
				items={[
					{
						title: "A",
						icon: <Text testID="k-demo-icon">★</Text>,
					},
					{ title: "B" },
				]}
				value={1}
			/>,
		);
		expect(screen.getByTestId("k-demo-icon")).toBeTruthy();
		// step 1's number was replaced by the icon; step 2 keeps its number
		expect(screen.queryByText("1")).toBeNull();
		expect(screen.getByText("2")).toBeTruthy();
	});

	it("press fires onStepChange with the 1-based number; controlled value wins", async () => {
		const onStepChange = jest.fn();
		const screen: Screen = await render(
			<Steps items={ITEMS} value={1} onStepChange={onStepChange} />,
		);
		await fireEvent.press(screen.getByTestId("k-step-indicator-3"));
		expect(onStepChange).toHaveBeenCalledWith(3);
		// controlled: display state unchanged by the press
		expect(
			screen.queryByLabelText("Step 3 of 3: Confirm (current step)"),
		).toBeNull();
		expect(
			screen.getByLabelText("Step 1 of 3: Account (current step)"),
		).toBeTruthy();
	});

	it("uncontrolled: defaultValue-only advances internal state on press", async () => {
		const onStepChange = jest.fn();
		const screen: Screen = await render(
			<Steps items={ITEMS} defaultValue={1} onStepChange={onStepChange} />,
		);
		expect(
			screen.getByLabelText("Step 1 of 3: Account (current step)"),
		).toBeTruthy();
		await fireEvent.press(screen.getByTestId("k-step-indicator-2"));
		expect(onStepChange).toHaveBeenCalledWith(2);
		expect(
			screen.getByLabelText("Step 2 of 3: Profile (current step)"),
		).toBeTruthy();
		expect(
			screen.getByLabelText("Step 1 of 3: Account (completed)"),
		).toBeTruthy();
	});

	it("no onStepChange → step indicators are disabled", async () => {
		const screen: Screen = await render(<Steps items={ITEMS} value={2} />);
		for (const indicator of screen.getAllByTestId(/k-step-indicator-\d/)) {
			expect(indicator.props.accessibilityState?.disabled).toBe(true);
		}
	});

	it("horizontal maps to row, vertical to column", async () => {
		const horizontal: Screen = await render(<Steps items={ITEMS} value={1} />);
		expect(flatStyle(horizontal.getByTestId("k-steps")).flexDirection).toBe(
			"row",
		);
		const vertical: Screen = await render(
			<Steps items={ITEMS} value={1} orientation="vertical" />,
		);
		expect(flatStyle(vertical.getByTestId("k-steps")).flexDirection).toBe(
			"column",
		);
	});

	it("connecting lines render between steps and vanish with showLine=false", async () => {
		const withLines: Screen = await render(<Steps items={ITEMS} value={1} />);
		expect(withLines.getAllByTestId("k-step-line")).toHaveLength(2);

		const without: Screen = await render(
			<Steps items={ITEMS} value={1} showLine={false} />,
		);
		expect(without.queryByTestId("k-step-line")).toBeNull();
	});

	it("single item renders no line (boundary)", async () => {
		const screen: Screen = await render(
			<Steps items={[{ title: "only" }]} value={1} />,
		);
		expect(screen.queryByTestId("k-step-line")).toBeNull();
	});

	it("accessibility label reads step position with current/completed suffixes", async () => {
		const screen: Screen = await render(
			<Steps items={ITEMS} value={2} onStepChange={() => undefined} />,
		);
		expect(
			screen.getByLabelText("Step 1 of 3: Account (completed)"),
		).toBeTruthy();
		expect(
			screen.getByLabelText("Step 2 of 3: Profile (current step)"),
		).toBeTruthy();
		expect(screen.getByLabelText("Step 3 of 3: Confirm")).toBeTruthy();
	});
});
