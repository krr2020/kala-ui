/**
 * TextInput: token-driven single-line field. Web Input's prefix/suffix
 * icons, password toggle, and InputGroup composition are deferred until
 * the native Icon-in-pressable patterns settle; this is the core field
 * surface (themed bg/border/radius, error arm, 44dp floor).
 */
import type { ReactElement } from "react";
import { TextInput as RNTextInput } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { tokens } from "../../tokens";
import type { TextInputProps } from "./text-input.types";

export function TextInput({
	hasError = false,
	disabled = false,
	style,
	testID = "k-text-input",
	...rest
}: TextInputProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNTextInput
			testID={testID}
			editable={disabled ? false : undefined}
			accessibilityState={disabled ? { disabled: true } : undefined}
			placeholderTextColor={theme.mutedForeground}
			style={[
				{
					minHeight: 44,
					backgroundColor: theme.input,
					color: theme.foreground,
					fontSize: 14,
					paddingHorizontal: tokens.space.controlPx,
					borderWidth: 1,
					borderRadius: tokens.radius.input,
					borderColor: hasError ? theme.destructive : theme.border,
					opacity: disabled ? 0.5 : 1,
				},
				style,
			]}
			{...rest}
		/>
	);
}
