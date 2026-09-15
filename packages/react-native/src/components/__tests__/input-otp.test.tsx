import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { InputOtp, InputOtpSeparator, InputOtpSlot } from "../input-otp";

type Screen = Awaited<ReturnType<typeof render>>;

function sixSlots() {
	return (
		<>
			<InputOtpSlot index={0} />
			<InputOtpSlot index={1} />
			<InputOtpSlot index={2} />
			<InputOtpSlot index={3} />
			<InputOtpSlot index={4} />
			<InputOtpSlot index={5} />
		</>
	);
}

// a filled slot wraps its character in RNText; an empty one has no child
function charAt(slot: { props: { children?: unknown } }): unknown {
	const child = slot.props.children as {
		props?: { children?: unknown };
	} | null;
	return child?.props?.children ?? null;
}

describe("InputOtp", () => {
	it("renders the root marker with one slot per InputOtpSlot child", async () => {
		const screen: Screen = await render(
			<InputOtp maxLength={6}>{sixSlots()}</InputOtp>,
		);
		expect(screen.getByTestId("k-input-otp")).toBeTruthy();
		expect(screen.getAllByTestId("k-input-otp-slot")).toHaveLength(6);
		// empty state: no slot carries a character
		for (const slot of screen.getAllByTestId("k-input-otp-slot")) {
			expect(charAt(slot)).toBeNull();
		}
	});

	it("owns text entry in a single hidden field; digits fill the next empty slot", async () => {
		const screen: Screen = await render(
			<InputOtp maxLength={6}>{sixSlots()}</InputOtp>,
		);
		const field = screen.getByTestId("k-input-otp-field");
		await fireEvent.changeText(field, "12");
		const slots = screen.getAllByTestId("k-input-otp-slot");
		expect(charAt(slots[0])).toBe("1");
		expect(charAt(slots[1])).toBe("2");
		expect(charAt(slots[2])).toBeNull();
	});

	it("fires onChange once with the full string on paste", async () => {
		const onChange = jest.fn();
		const screen: Screen = await render(
			<InputOtp maxLength={6} onChange={onChange}>
				{sixSlots()}
			</InputOtp>,
		);
		await fireEvent.changeText(
			screen.getByTestId("k-input-otp-field"),
			"123456",
		);
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith("123456");
	});

	it("strips non-digits and clamps to maxLength", async () => {
		const onChange = jest.fn();
		const screen: Screen = await render(
			<InputOtp maxLength={3} onChange={onChange}>
				<InputOtpSlot index={0} />
				<InputOtpSlot index={1} />
				<InputOtpSlot index={2} />
			</InputOtp>,
		);
		await fireEvent.changeText(
			screen.getByTestId("k-input-otp-field"),
			"1a2b3c4",
		);
		expect(onChange).toHaveBeenLastCalledWith("123");
		const slots = screen.getAllByTestId("k-input-otp-slot");
		expect(charAt(slots[0])).toBe("1");
		expect(charAt(slots[1])).toBe("2");
		expect(charAt(slots[2])).toBe("3");
	});

	it("disabled blocks editing", async () => {
		const onChange = jest.fn();
		const screen: Screen = await render(
			<InputOtp maxLength={3} disabled onChange={onChange}>
				<InputOtpSlot index={0} />
				<InputOtpSlot index={1} />
				<InputOtpSlot index={2} />
			</InputOtp>,
		);
		const field = screen.getByTestId("k-input-otp-field");
		expect(field.props.editable).toBe(false);
		expect(field.props.accessibilityState?.disabled).toBe(true);
	});

	it("renders a separator node only when provided", async () => {
		const without: Screen = await render(
			<InputOtp maxLength={2}>
				<InputOtpSlot index={0} />
				<InputOtpSlot index={1} />
			</InputOtp>,
		);
		expect(without.queryByTestId("k-demo-sep")).toBeNull();

		const withSep: Screen = await render(
			<InputOtp maxLength={2}>
				<InputOtpSlot index={0} />
				<InputOtpSeparator>
					<Text testID="k-demo-sep">-</Text>
				</InputOtpSeparator>
				<InputOtpSlot index={1} />
			</InputOtp>,
		);
		expect(withSep.getByTestId("k-demo-sep")).toBeTruthy();
	});

	it("controlled value sync: external set/clear re-renders slots without onChange", async () => {
		const onChange = jest.fn();
		const screen: Screen = await render(
			<InputOtp maxLength={3} value="12" onChange={onChange}>
				<InputOtpSlot index={0} />
				<InputOtpSlot index={1} />
				<InputOtpSlot index={2} />
			</InputOtp>,
		);
		let slots = screen.getAllByTestId("k-input-otp-slot");
		expect(charAt(slots[0])).toBe("1");
		expect(charAt(slots[1])).toBe("2");

		await screen.rerender(
			<InputOtp maxLength={3} value="" onChange={onChange}>
				<InputOtpSlot index={0} />
				<InputOtpSlot index={1} />
				<InputOtpSlot index={2} />
			</InputOtp>,
		);
		slots = screen.getAllByTestId("k-input-otp-slot");
		expect(charAt(slots[0])).toBeNull();
		expect(onChange).not.toHaveBeenCalled();
	});

	it("same-value reentry does not duplicate or loop", async () => {
		const onChange = jest.fn();
		const screen: Screen = await render(
			<InputOtp maxLength={3} value="12" onChange={onChange}>
				<InputOtpSlot index={0} />
				<InputOtpSlot index={1} />
				<InputOtpSlot index={2} />
			</InputOtp>,
		);
		await fireEvent.changeText(screen.getByTestId("k-input-otp-field"), "123");
		expect(onChange).toHaveBeenCalledTimes(1);
		const slots = screen.getAllByTestId("k-input-otp-slot");
		expect(charAt(slots[2])).toBeNull();
	});
});
