import { Minus, Plus } from "lucide-react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import { Pressable, TextInput as RNTextInput, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { tokens } from "../../tokens";
import { Icon } from "../icon";
import { applySlot } from "../slot-styles";
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
	placeholder,
	accessibilityLabel,
	incrementLabel = "Increase",
	decrementLabel = "Decrease",
	style,
	styles,
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

	const stepperStyle = (pressed: boolean) => [
		{
			minHeight: 44,
			minWidth: 40,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
		},
		applySlot({}, styles?.stepper),
	];

	return (
		<View
			testID={testID}
			style={[
				{
					flexDirection: "row",
					alignItems: "center",
					borderWidth: 1,
					borderRadius: tokens.radius.input,
					borderColor: hasError ? theme.destructive : theme.border,
					backgroundColor: theme.input,
					overflow: "hidden",
				},
				applySlot(applySlot({}, style), styles?.root),
			]}
		>
			<Pressable
				testID={`${testID}-decrement`}
				accessibilityRole="button"
				accessibilityLabel={decrementLabel}
				accessibilityState={disabled ? { disabled: true } : undefined}
				disabled={disabled}
				onPress={() => stepBy(-1)}
				style={({ pressed }) => stepperStyle(pressed)}
			>
				<Icon icon={Minus} size="sm" color="muted" />
			</Pressable>
			<RNTextInput
				testID={`${testID}-input`}
				value={display}
				keyboardType="number-pad"
				editable={disabled ? false : undefined}
				accessibilityState={disabled ? { disabled: true } : undefined}
				accessibilityLabel={accessibilityLabel}
				placeholder={placeholder}
				placeholderTextColor={theme.mutedForeground}
				onChangeText={(text) => {
					// digits, minus, dot — number-pad can still surface stray
					// characters on some keyboards
					const sanitized = text.replace(/[^0-9.-]/g, "");
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
					},
					applySlot({}, styles?.input),
				]}
			/>
			<Pressable
				testID={`${testID}-increment`}
				accessibilityRole="button"
				accessibilityLabel={incrementLabel}
				accessibilityState={disabled ? { disabled: true } : undefined}
				disabled={disabled}
				onPress={() => stepBy(1)}
				style={({ pressed }) => stepperStyle(pressed)}
			>
				<Icon icon={Plus} size="sm" color="muted" />
			</Pressable>
		</View>
	);
}
