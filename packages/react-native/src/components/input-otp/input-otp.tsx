import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import {
	Pressable,
	Text as RNText,
	TextInput as RNTextInput,
	StyleSheet,
	View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { InputOtpProps, InputOtpSlotProps } from "./input-otp.types";

interface OtpContextValue {
	chars: string[];
	activeIndex: number;
}

const OtpContext = createContext<OtpContextValue>({
	chars: [],
	activeIndex: 0,
});

const DIGITS = /^\d+$/;

/**
 * InputOtp: one off-screen TextInput owns entry (a real first responder
 * is required for the keyboard/IME — per-slot inputs would steal focus on
 * iOS); slots are presentational views reading context, mirroring the
 * web input-otp's OTPInputContext shape.
 */
export function InputOtp({
	value,
	defaultValue = "",
	onChange,
	maxLength,
	disabled = false,
	children,
	style,
	styles,
	testID = "k-input-otp",
}: InputOtpProps): ReactElement {
	const { theme } = useUnistyles();
	const [internal, setInternal] = useState(defaultValue);

	const isControlled = value !== undefined;
	const current = isControlled ? value : internal;

	const sanitize = (next: string): string =>
		DIGITS.test(next) ? next : (next.match(/\d/g) ?? []).join("");

	const handleChange = (next: string): void => {
		const clean = sanitize(next).slice(0, maxLength);
		if (!isControlled) setInternal(clean);
		onChange?.(clean);
	};

	const chars = useMemo(
		() => Array.from({ length: maxLength }, (_, i) => current[i] ?? ""),
		[current, maxLength],
	);
	const activeIndex = Math.min(current.length, maxLength - 1);

	return (
		<Pressable
			testID={testID}
			style={[
				otpStyles.row,
				{ opacity: disabled ? 0.5 : 1 },
				applySlot(applySlot({}, style), styles?.root),
			]}
		>
			<OtpContext.Provider value={{ chars, activeIndex }}>
				{children}
			</OtpContext.Provider>
			<RNTextInput
				testID="k-input-otp-field"
				value={current}
				onChangeText={handleChange}
				editable={!disabled}
				keyboardType="number-pad"
				maxLength={maxLength}
				caretHidden
				accessibilityLabel="One-time code"
				accessibilityState={{ disabled }}
				style={[
					otpStyles.field,
					{ color: theme.foreground },
					applySlot({}, styles?.field),
				]}
			/>
		</Pressable>
	);
}

export function InputOtpSlot({
	index,
	style,
	styles,
	testID = "k-input-otp-slot",
}: InputOtpSlotProps): ReactElement {
	const { theme } = useUnistyles();
	const { chars, activeIndex } = useContext(OtpContext);
	const char = chars[index] ?? "";
	const isActive = index === activeIndex && !char;

	return (
		<View
			testID={testID}
			style={[
				otpStyles.slot,
				{
					borderColor: isActive ? theme.primary : theme.border,
					backgroundColor: theme.input,
				},
				applySlot(applySlot({}, style), styles?.root),
			]}
		>
			{char ? (
				<RNText style={{ fontSize: 16, color: theme.foreground }}>
					{char}
				</RNText>
			) : null}
		</View>
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
		<View testID={testID} style={otpStyles.separator}>
			{typeof children === "string" ? (
				<RNText style={{ fontSize: 16, color: theme.mutedForeground }}>
					{children}
				</RNText>
			) : (
				children
			)}
		</View>
	);
}

const otpStyles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	// zero-size off-stage field: keeps keyboard focus ownership without
	// participating in layout
	field: {
		width: 1,
		height: 1,
		opacity: 0,
	},
	slot: {
		width: 40,
		height: 40,
		borderWidth: 1,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	separator: {
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 4,
	},
});
