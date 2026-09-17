import { fireEvent, render } from "@testing-library/react-native";
import { useState } from "react";
import { Platform } from "react-native";

import { NumberInput } from "../number-input";

type Screen = Awaited<ReturnType<typeof render>>;

const input = (screen: Screen) => screen.getByTestId("k-number-input-input");
const increment = (screen: Screen) =>
	screen.getByTestId("k-number-input-increment");
const decrement = (screen: Screen) =>
	screen.getByTestId("k-number-input-decrement");

describe("NumberInput", () => {
	it("renders the initial value with root, input and stepper markers", async () => {
		const screen = await render(<NumberInput value={5} />);
		expect(screen.getByTestId("k-number-input")).toBeTruthy();
		expect(input(screen).props.value).toBe("5");
		expect(increment(screen)).toBeTruthy();
		expect(decrement(screen)).toBeTruthy();
	});

	it("steps by step and clamps at min/max", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<NumberInput
				defaultValue={8}
				min={0}
				max={10}
				step={2}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(increment(screen));
		expect(onValueChange).toHaveBeenLastCalledWith(10);
		await fireEvent.press(increment(screen));
		expect(onValueChange).toHaveBeenLastCalledWith(10);
		await fireEvent.press(decrement(screen));
		expect(onValueChange).toHaveBeenLastCalledWith(8);
	});

	it("leaves missing bounds unclamped and never yields NaN or Infinity", async () => {
		const onValueChange = jest.fn();
		let screen: Screen = await render(
			<NumberInput value={0} onValueChange={onValueChange} />,
		);
		await fireEvent.press(decrement(screen));
		expect(onValueChange).toHaveBeenLastCalledWith(-1);

		screen = await render(
			<NumberInput value={10} max={10} onValueChange={onValueChange} />,
		);
		await fireEvent.press(increment(screen));
		expect(onValueChange).toHaveBeenLastCalledWith(10);
		await fireEvent.press(decrement(screen));
		expect(onValueChange).toHaveBeenLastCalledWith(9);

		screen = await render(
			<NumberInput value={0} min={0} onValueChange={onValueChange} />,
		);
		await fireEvent.press(decrement(screen));
		expect(onValueChange).toHaveBeenLastCalledWith(0);
		for (const call of onValueChange.mock.calls) {
			expect(Number.isFinite(call[0] as number)).toBe(true);
		}
	});

	it("clamps an out-of-range typed value on commit", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<NumberInput min={0} max={10} onValueChange={onValueChange} />,
		);
		await fireEvent.changeText(input(screen), "99");
		await fireEvent(input(screen), "blur");
		expect(onValueChange).toHaveBeenLastCalledWith(10);
	});

	it("emits null for an empty input and never NaN for non-numeric text", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<NumberInput value={4} onValueChange={onValueChange} />,
		);
		await fireEvent.changeText(input(screen), "");
		expect(onValueChange).toHaveBeenLastCalledWith(null);
		await fireEvent.changeText(input(screen), "1a2b");
		expect(onValueChange).toHaveBeenLastCalledWith(12);
		for (const call of onValueChange.mock.calls) {
			expect(call[0]).not.toBeNaN();
		}
	});

	it("controlled parent rerenders: stepper continues from the new value", async () => {
		const onValueChange = jest.fn();
		function Parent() {
			const [v, setV] = useState<number | null>(8);
			return (
				<NumberInput
					value={v}
					min={0}
					max={10}
					onValueChange={(next) => {
						onValueChange(next);
						setV(next);
					}}
				/>
			);
		}
		const screen = await render(<Parent />);
		await fireEvent.press(increment(screen));
		expect(onValueChange).toHaveBeenLastCalledWith(9);
		expect(input(screen).props.value).toBe("9");
		await fireEvent.press(increment(screen));
		expect(onValueChange).toHaveBeenLastCalledWith(10);
		expect(input(screen).props.value).toBe("10");
	});

	it("controlled values render verbatim even outside min/max; uncontrolled works", async () => {
		const onValueChange = jest.fn();
		let screen: Screen = await render(
			<NumberInput value={99} max={10} onValueChange={onValueChange} />,
		);
		expect(input(screen).props.value).toBe("99");

		screen = await render(<NumberInput defaultValue={3} />);
		expect(input(screen).props.value).toBe("3");
		await fireEvent.press(increment(screen));
		expect(input(screen).props.value).toBe("4");
	});

	it("ignores stepper presses while disabled", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<NumberInput value={5} disabled onValueChange={onValueChange} />,
		);
		await fireEvent.press(increment(screen));
		await fireEvent.press(decrement(screen));
		expect(onValueChange).not.toHaveBeenCalled();
		expect(input(screen).props.editable).toBe(false);
	});

	it("exposes labelled stepper buttons and passes the input label through", async () => {
		const screen = await render(
			<NumberInput value={1} accessibilityLabel="quantity" />,
		);
		expect(increment(screen).props.accessibilityRole).toBe("button");
		expect(increment(screen).props.accessibilityLabel).toBe("Increase");
		expect(decrement(screen).props.accessibilityLabel).toBe("Decrease");
		expect(input(screen).props.accessibilityLabel).toBe("quantity");
	});

	it("opens a numeric keyboard: numeric on Android, numbers-and-punctuation on iOS", async () => {
		const realOS = Platform.OS;
		try {
			(Platform as { OS: string }).OS = "android";
			let screen = await render(<NumberInput value={1} />);
			expect(input(screen).props.keyboardType).toBe("numeric");
			(Platform as { OS: string }).OS = "ios";
			screen = await render(<NumberInput value={1} />);
			expect(input(screen).props.keyboardType).toBe("numbers-and-punctuation");
		} finally {
			(Platform as { OS: string }).OS = realOS;
		}
	});

	it("a consumer keyboardType overrides the platform default", async () => {
		const screen = await render(
			<NumberInput value={1} keyboardType="numeric" />,
		);
		expect(input(screen).props.keyboardType).toBe("numeric");
	});

	it("negative entry survives the sanitizer and commits a negative value", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<NumberInput min={-10} onValueChange={onValueChange} />,
		);
		await fireEvent.changeText(input(screen), "-");
		await fireEvent.changeText(input(screen), "-3");
		await fireEvent(input(screen), "blur");
		expect(onValueChange).toHaveBeenLastCalledWith(-3);
		expect(input(screen).props.value).toBe("-3");
	});

	it("renders symmetric 1px separator dividers flanking the input", async () => {
		const screen = await render(<NumberInput value={1} />);
		const flat = (node: { props: { style?: unknown } }) =>
			require("react-native").StyleSheet.flatten(node.props.style) ?? {};
		const dividers = screen.getAllByTestId("k-number-input-divider");
		expect(dividers.length).toBe(2);
		for (const d of dividers) {
			const s = flat(d);
			expect(s.width).toBe(1);
			expect(s.backgroundColor).toBe(
				require("../../themes").themes.light.separator,
			);
		}
		// border parity with the other input surfaces
		expect(flat(screen.getByTestId("k-number-input")).borderRadius).toBe(
			require("../../tokens").tokens.radius.input,
		);
	});

	it("surface parity: hasError destructive, hasSuccess success, disabled input fill", async () => {
		const light = require("../../themes").themes.light;
		const flat = (node: { props: { style?: unknown } }) =>
			require("react-native").StyleSheet.flatten(node.props.style) ?? {};
		const err = await render(<NumberInput value={1} hasError />);
		expect(flat(err.getByTestId("k-number-input")).borderColor).toBe(
			light.destructive,
		);
		const ok = await render(<NumberInput value={1} hasSuccess />);
		expect(flat(ok.getByTestId("k-number-input")).borderColor).toBe(
			light.success,
		);
		const locked = await render(<NumberInput value={1} disabled />);
		expect(flat(locked.getByTestId("k-number-input")).backgroundColor).toBe(
			light.input,
		);
	});
});
