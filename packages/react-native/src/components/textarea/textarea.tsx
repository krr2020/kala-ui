/**
 * Textarea: the multiline arm of the input surface. The 44dp single-line
 * floor is replaced by the web min-h-80 parity; rows is only a height
 * hint (no auto-grow — growth is the consumer's layout concern).
 */
import type { ReactElement } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { TextInput as RNTextInput, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { tokens } from "../../tokens";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
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
	const minHeight = rows ? Math.max(80, rows * 24) : 80;

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
			style={[
				{
					minHeight,
					backgroundColor: theme.input,
					color: theme.foreground,
					fontSize: 14,
					paddingHorizontal: tokens.space.controlPx,
					paddingVertical: 8,
					borderWidth: 1,
					borderRadius: tokens.radius.input,
					borderColor: hasError ? theme.destructive : theme.border,
					opacity: disabled ? 0.5 : 1,
				},
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
			{...rest}
		/>
	);
}
