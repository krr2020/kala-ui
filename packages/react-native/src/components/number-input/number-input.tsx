import { Minus, Plus } from "lucide-react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import { Platform, Pressable, TextInput as RNTextInput, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { tokens } from "../../tokens";
import { sanitizeNumberText } from "../../lib/number-input.utils";
import { Icon } from "../icon";
import { applySlot } from "../slot-styles";
import * as numberStyle from "./number-input.styles";
import type { NumberInputProps } from "./number-input.types";

/**
 * NumberInput: a numeric field flanked by − / + steppers, composed like
 * TagInput from a raw RNTextInput inside a tokened border row. Values
 * are clamped to [min, max] only on stepper presses and blur/submit
 * commit — a controlled `value` renders verbatim because the parent
 * owns its own state. Text is sanitized to digits/minus/dot; an empty
 * (or non-numeric) field emits null, never NaN.
 */
export function NumberInput({
	value,
	defaultValue = null,
	onValueChange,
	min,
	max,
	step = 1,
	disabled = false,
	hasError = false,
	hasSuccess = false,
	placeholder,
	keyboardType,
	accessibilityLabel,
	incrementLabel = "Increase",
	decrementLabel = "Decrease",
	style,
	slotStyles,
	testID = "k-number-input",
}: NumberInputProps): ReactElement {
	const { theme } = useUnistyles();
	const controlled = value !== undefined;
	const [inner, setInner] = useState<number | null>(defaultValue);
	const [draft, setDraft] = useState<string | null>(null);

	const clamp = (n: number): number => {
		let out = n;
		if (min != null && out < min) out = min;
		if (max != null && out > max) out = max;
		return out;
	};

	const parse = (text: string | null): number | null => {
		if (text == null || text === "") return null;
		const n = Number(text);
		return Number.isFinite(n) ? n : null;
	};

	const current = controlled ? value : inner;
	const display =
		draft !== null ? draft : current == null ? "" : String(current);

	const emit = (next: number | null) => {
		if (!controlled) setInner(next);
		onValueChange?.(next);
	};

	const commitDraft = () => {
		if (draft === null) return;
		const next = clamp(parse(draft) ?? NaN);
		setDraft(null);
		emit(Number.isFinite(next) ? next : null);
	};

	const stepBy = (direction: 1 | -1) => {
		if (disabled) return;
		const base = parse(draft) ?? current ?? min ?? 0;
		emit(clamp(base + direction * step));
	};

	// numeric keyboard by platform: Android's numeric pad is the only
	// reliably-supported digit layout (decimal/decimal-pad fall back to
	// QWERTY on many OEM keyboards); iOS numbers-and-punctuation adds the
	// minus key neither number-pad style has.
	const defaultKeyboard =
		Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric";

	const stepperButton = (
		label: string,
		icon: typeof Minus,
		id: string,
	) => (
		<Pressable
			testID={`${testID}-${id}`}
			accessibilityRole="button"
			accessibilityLabel={label}
			accessibilityState={disabled ? { disabled: true } : undefined}
			disabled={disabled}
			onPress={() => stepBy(id === "decrement" ? -1 : 1)}
			style={({ pressed }) => [
				numberStyle.stepperRow(disabled, pressed),
				applySlot({}, slotStyles?.stepper),
			]}
		>
			<Icon icon={icon} size="sm" color="foreground" />
		</Pressable>
	);

	return (
		<View
			testID={testID}
			style={[
				numberStyle.rootRow(theme, { hasError, hasSuccess, disabled }),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{stepperButton(decrementLabel, Minus, "decrement")}
			<View testID={`${testID}-divider`} style={numberStyle.divider(theme)} />
			<RNTextInput
				testID={`${testID}-input`}
				value={display}
				keyboardType={keyboardType ?? defaultKeyboard}
				editable={disabled ? false : undefined}
				accessibilityState={disabled ? { disabled: true } : undefined}
				accessibilityLabel={accessibilityLabel}
				placeholder={placeholder}
				placeholderTextColor={theme.mutedForeground}
				onChangeText={(text) => {
					const sanitized = sanitizeNumberText(text);
					setDraft(sanitized);
					onValueChange?.(parse(sanitized));
				}}
				onBlur={commitDraft}
				onSubmitEditing={commitDraft}
				style={[
					{
						flex: 1,
						minHeight: 44,
						fontSize: 14,
						color: theme.foreground,
						paddingHorizontal: tokens.space.controlPx,
						textAlign: "center",
					},
					applySlot({}, slotStyles?.input),
				]}
			/>
			<View testID={`${testID}-divider`} style={numberStyle.divider(theme)} />
			{stepperButton(incrementLabel, Plus, "increment")}
		</View>
	);
}
