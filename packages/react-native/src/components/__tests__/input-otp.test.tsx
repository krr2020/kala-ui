import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { themes } from "../../themes";
import { InputOtp, InputOtpSeparator, InputOtpSlot } from "../input-otp";
import { slot as slotStyle, slotSurface } from "../input-otp/input-otp.styles";

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

// a filled slot wraps its character in RNText; an empty one has no child.
// Pressable children arrive as a 2-array, so walk entries for a string.
function charAt(slot: { props: { children?: unknown } }): unknown {
	const kids = slot.props.children;
	const arr = Array.isArray(kids) ? kids : [kids];
	for (const kid of arr) {
		if (kid && typeof kid === "object" && "props" in kid) {
			const text = (kid as { props?: { children?: unknown } }).props
				?.children;
			if (typeof text === "string") return text;
		}
	}
	return null;
}

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

describe("InputOtp", () => {
	it("slots sit on the standard input surface: card fill + border ring at rest, ring when active, input fill + dim when disabled", async () => {
		const resting: Screen = await render(
			<InputOtp maxLength={2}>
				<InputOtpSlot index={0} />
				<InputOtpSlot index={1} />
			</InputOtp>,
		);
		const restSlot = flatStyle(resting.getAllByTestId("k-input-otp-slot")[1]);
		expect(restSlot.backgroundColor).toBe(themes.light.card);
		expect(restSlot.borderColor).toBe(themes.light.border);
		// active slot (empty + at focus index) shows the focus ring token
		const activeSlot = flatStyle(resting.getAllByTestId("k-input-otp-slot")[0]);
		expect(activeSlot.borderColor).toBe(themes.light.ring);
		const locked: Screen = await render(
			<InputOtp maxLength={2} disabled>
				<InputOtpSlot index={0} />
				<InputOtpSlot index={1} />
			</InputOtp>,
		);
		const disSlot = flatStyle(locked.getAllByTestId("k-input-otp-slot")[0]);
		expect(disSlot.backgroundColor).toBe(themes.light.input);
		// no focus ring in the disabled arm, even at the active index
		expect(disSlot.borderColor).toBe(themes.light.border);
		expect(disSlot.opacity).toBe(0.5);
		// 44dp touch floor preserved on every arm
		expect(slotStyle.minHeight).toBe(44);
		expect(slotStyle.minWidth).toBe(44);
	});

	it("slotSurface pure fn maps both themes: card/border at rest, ring active, input disabled", () => {
		expect(slotSurface(themes.light, {})).toEqual({
			backgroundColor: themes.light.card,
			borderColor: themes.light.border,
			opacity: 1,
		});
		expect(slotSurface(themes.dark, { active: true }).borderColor).toBe(
			themes.dark.ring,
		);
		expect(
			slotSurface(themes.dark, { active: true, disabled: true }).borderColor,
		).toBe(themes.dark.border);
		expect(slotSurface(themes.dark, { disabled: true })).toEqual({
			backgroundColor: themes.dark.input,
			borderColor: themes.dark.border,
			opacity: 0.5,
		});
	});
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
