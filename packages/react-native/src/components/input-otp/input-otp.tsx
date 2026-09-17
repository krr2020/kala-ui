import type { ReactElement, ReactNode } from "react";
import {
	createContext,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	Pressable,
	Text as RNText,
	TextInput as RNTextInput,
	View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import * as otpStyle from "./input-otp.styles";
import type { InputOtpProps, InputOtpSlotProps } from "./input-otp.types";

interface OtpContextValue {
	chars: string[];
	activeIndex: number;
	disabled: boolean;
	pressSlot: (index: number) => void;
}

const OtpContext = createContext<OtpContextValue>({
	chars: [],
	activeIndex: 0,
	disabled: false,
	pressSlot: () => {},
});

const DIGITS = /^\d+$/;

/**
 * InputOtp: one off-screen TextInput owns entry (a real first responder
 * is required for the keyboard/IME — per-slot inputs would steal focus on
 * iOS); slots are presentational views reading context. Tapping any slot
 * focuses the field at that position; backspace on an empty position
 * steps back; pasting a full code fills every slot at once.
 */
export function InputOtp({
	value,
	defaultValue = "",
	onChange,
	maxLength,
	disabled = false,
	children,
	style,
	slotStyles,
	testID = "k-input-otp",
}: InputOtpProps): ReactElement {
	const { theme } = useUnistyles();
	const [internal, setInternal] = useState(defaultValue);
	const fieldRef = useRef<RNTextInput>(null);

	const isControlled = value !== undefined;
	const current = isControlled ? value : internal;

	const sanitize = (next: string): string =>
		DIGITS.test(next) ? next : (next.match(/\d/g) ?? []).join("");

	// paste and typed edits both land here: RN gives the FULL new text, so a
	// multi-char payload distributes across slots from the focused position
	const handleChange = (next: string): void => {
		const clean = sanitize(next).slice(0, maxLength);
		if (!isControlled) setInternal(clean);
		onChange?.(clean);
	};

	// RN cannot delete backwards past the field's own text — when the focused
	// position is empty, an incoming shorter-or-equal text means the user
	// pressed backspace on an empty slot: step the focus back one position
	const handleBackspace = (): void => {
		if (current.length === 0) return;
		const shorter = current.slice(0, Math.max(0, current.length - 1));
		if (!isControlled) setInternal(shorter);
		onChange?.(shorter);
	};

	const chars = useMemo(
		() => Array.from({ length: maxLength }, (_, i) => current[i] ?? ""),
		[current, maxLength],
	);
	const activeIndex = Math.min(current.length, maxLength - 1);

	const pressSlot = (index: number): void => {
		if (disabled) return;
		fieldRef.current?.focus();
		// caret moves to the pressed slot: pad/trim so the next keystroke
		// lands at that position
		if (current.length > index) {
			const trimmed = current.slice(0, index);
			if (!isControlled) setInternal(trimmed);
			onChange?.(trimmed);
		}
	};

	return (
		<Pressable
			testID={testID}
			onPress={() => pressSlot(activeIndex)}
			style={[
				otpStyle.row,
				{ opacity: disabled ? 0.5 : 1 },
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			<OtpContext.Provider
				value={{ chars, activeIndex, disabled, pressSlot }}
			>
				{children}
			</OtpContext.Provider>
			<RNTextInput
				testID="k-input-otp-field"
				ref={fieldRef}
				value={current}
				onChangeText={(next) => {
					if (next.length <= current.length) handleBackspace();
					else handleChange(next);
				}}
				editable={!disabled}
				keyboardType="number-pad"
				maxLength={maxLength}
				caretHidden
				accessibilityLabel="One-time code"
				accessibilityState={{ disabled }}
				style={[
					otpStyle.field,
					{ color: theme.foreground },
					applySlot({}, slotStyles?.field),
				]}
			/>
		</Pressable>
	);
}

export function InputOtpSlot({
	index,
	style,
	slotStyles,
	testID = "k-input-otp-slot",
}: InputOtpSlotProps): ReactElement {
	const { theme } = useUnistyles();
	const { chars, activeIndex, disabled, pressSlot } = useContext(OtpContext);
	const char = chars[index] ?? "";
	const isActive = index === activeIndex && !char;

	return (
		<Pressable
			testID={testID}
			disabled={disabled}
			onPress={() => {
				if (!disabled) pressSlot(index);
			}}
			style={[
				otpStyle.slot,
				otpStyle.slotSurface(theme, { active: isActive, disabled }),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{char ? (
				<RNText style={otpStyle.slotText(theme)}>{char}</RNText>
			) : null}
		</Pressable>
	);
}

export function InputOtpSeparator({
	children = "–",
	testID = "k-input-otp-separator",
}: {
	children?: ReactNode;
	testID?: string;
}): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View testID={testID} style={otpStyle.separator}>
			{typeof children === "string" ? (
				<RNText style={otpStyle.separatorText(theme)}>{children}</RNText>
			) : (
				children
			)}
		</View>
	);
}
