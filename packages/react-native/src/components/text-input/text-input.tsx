import type { ReactElement, ReactNode } from "react";
import { Text as RNText, TextInput as RNTextInput, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useState } from "react";
import { applySlot } from "../slot-styles";
import * as fieldStyle from "./text-input.styles";
import type { TextInputProps } from "./text-input.types";

/**
 * TextInput: token-driven single-line field with optional
 * leftSection/rightSection flanking views (the InputGroup replacement —
 * sections only introduce the k-text-input-group wrapper when at least
 * one is provided; the bare path renders exactly one RNTextInput).
 */
export function TextInput({
	hasError = false,
	hasSuccess = false,
	disabled = false,
	leftSection,
	rightSection,
	style,
	slotStyles,
	testID = "k-text-input",
	...rest
}: TextInputProps): ReactElement {
	const { theme } = useUnistyles();
	const [focused, setFocused] = useState(false);
	const grouped = Boolean(leftSection || rightSection);

	const inputStyle = [
		grouped
			? fieldStyle.fieldInGroup(theme)
			: fieldStyle.field(theme, { hasError, hasSuccess, disabled, focused }),
		applySlot(applySlot({}, style), slotStyles?.root),
	];

	// raw strings cannot render inside a View — wrap them like ListItem does
	const sectionNode = (node: ReactNode, testID: string): ReactElement =>
		typeof node === "string" || typeof node === "number" ? (
			<View testID={testID} style={applySlot({}, slotStyles?.section)}>
				<RNText style={fieldStyle.sectionText(theme)}>{node}</RNText>
			</View>
		) : (
			<View testID={testID} style={applySlot({}, slotStyles?.section)}>
				{node}
			</View>
		);

	const input = (
		<RNTextInput
			testID={testID}
			editable={disabled ? false : undefined}
			accessibilityState={disabled ? { disabled: true } : undefined}
			placeholderTextColor={theme.mutedForeground}
			onFocus={(e) => {
				setFocused(true);
				rest.onFocus?.(e);
			}}
			onBlur={(e) => {
				setFocused(false);
				rest.onBlur?.(e);
			}}
			style={inputStyle}
			{...rest}
		/>
	);

	if (!leftSection && !rightSection) {
		return input;
	}

	return (
		<View
			testID="k-text-input-group"
			style={[
				fieldStyle.group(theme, { hasError, hasSuccess, disabled, focused }),
				applySlot({}, slotStyles?.group),
			]}
		>
			{leftSection
				? sectionNode(leftSection, "k-text-input-section-left")
				: null}
			{input}
			{rightSection
				? sectionNode(rightSection, "k-text-input-section-right")
				: null}
		</View>
	);
}

export type { ReactNode as TextInputSectionContent };
