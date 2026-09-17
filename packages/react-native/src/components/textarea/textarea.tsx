/**
 * Textarea: the multiline arm of the input surface. The 44dp single-line
 * floor is replaced by the web min-h-80 parity; rows is only a height
 * hint (no auto-grow — growth is the consumer's layout concern).
 */
import type { ReactElement } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { TextInput as RNTextInput, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useState } from "react";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import * as textareaStyle from "./textarea.styles";
import type { TextareaProps } from "./textarea.types";

export function Textarea({
	hasError = false,
	disabled = false,
	rows,
	isLoading = false,
	style,
	slotStyles,
	testID = "k-textarea",
	...rest
}: TextareaProps): ReactElement {
	const { theme } = useUnistyles();
	const [focused, setFocused] = useState(false);
	const minHeight = textareaStyle.rowsToMinHeight(rows);

	if (isLoading) {
		return (
			<View
				testID={testID}
				style={[
					{ minHeight, justifyContent: "center" },
					applySlot(
						applySlot({}, style as StyleProp<TextStyle>),
						slotStyles?.root,
					),
				]}
			>
				<Skeleton animated style={{ height: minHeight - 16 }} />
			</View>
		);
	}

	return (
		<RNTextInput
			testID={testID}
			multiline
			textAlignVertical="top"
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
			style={[
				textareaStyle.field(theme, minHeight, {
					hasError,
					disabled,
					focused,
				}),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
			{...rest}
		/>
	);
}
