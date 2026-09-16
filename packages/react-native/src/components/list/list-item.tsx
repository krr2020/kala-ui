/**
 * ListItem: a single row. `interactive`/`href` arms render a Pressable
 * (button/link role); the static arm is a plain View. `active` tints
 * with primary, `disabled` dims to 0.5 and blocks presses.
 */
import type { ReactElement } from "react";
import { Linking, Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { ListItemProps } from "./list.types";

export function ListItem({
	interactive = false,
	href,
	active = false,
	disabled = false,
	dense = false,
	onPress,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-list-item",
	children,
}: ListItemProps): ReactElement {
	const { theme } = useUnistyles();

	const base = {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		gap: 12,
		width: "100%" as const,
		paddingHorizontal: dense ? 12 : 16,
		paddingVertical: dense ? 8 : 12,
		backgroundColor: active ? `${String(theme.primary)}1A` : undefined,
	};
	const slot = applySlot(applySlot({}, style), slotStyles?.root);
	// raw strings cannot render inside a View — wrap them like Badge does
	const content =
		typeof children === "string" || typeof children === "number" ? (
			<RNText style={{ fontSize: 14, color: String(theme.foreground) }}>
				{children}
			</RNText>
		) : (
			children
		);

	if (href) {
		return (
			<Pressable
				testID={testID}
				accessibilityRole="link"
				accessibilityLabel={accessibilityLabel}
				disabled={disabled}
				accessibilityState={disabled ? { disabled: true } : undefined}
				onPress={() => Linking.openURL(href)}
				style={({ pressed }) => [
					base,
					slot,
					(disabled || pressed) && { opacity: disabled ? 0.5 : 0.7 },
				]}
			>
				{content}
			</Pressable>
		);
	}

	if (interactive) {
		return (
			<Pressable
				testID={testID}
				accessibilityRole="button"
				accessibilityLabel={accessibilityLabel}
				disabled={disabled}
				accessibilityState={disabled ? { disabled: true } : undefined}
				onPress={onPress}
				style={({ pressed }) => [
					base,
					slot,
					(disabled || pressed) && { opacity: disabled ? 0.5 : 0.7 },
				]}
			>
				{content}
			</Pressable>
		);
	}

	return (
		<View
			testID={testID}
			accessibilityRole={undefined}
			accessibilityLabel={accessibilityLabel}
			style={[base, slot, disabled && { opacity: 0.5 }]}
		>
			{content}
		</View>
	);
}
