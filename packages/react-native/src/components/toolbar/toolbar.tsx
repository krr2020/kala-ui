/**
 * Toolbar: action row composing Button and ToggleGroup rather than
 * re-skinning them — variants, disabled semantics, and selection state
 * all come from those engines; the Toolbar pieces add layout and their
 * own k-toolbar-* markers.
 */
import type { ReactElement } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Button } from "../button";
import { applySlot } from "../slot-styles";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";
import type {
	ToolbarButtonProps,
	ToolbarLinkProps,
	ToolbarProps,
	ToolbarSeparatorProps,
	ToolbarToggleGroupProps,
	ToolbarToggleItemProps,
} from "./toolbar.types";

export function Toolbar({
	children,
	accessibilityLabel,
	style,
	styles,
	testID = "k-toolbar",
}: ToolbarProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			accessibilityRole="toolbar"
			accessibilityLabel={accessibilityLabel}
			style={applySlot(
				{
					flexDirection: "row",
					alignItems: "center",
					gap: 4,
					minHeight: 40,
					padding: 4,
					borderWidth: 1,
					borderRadius: 8,
					borderColor: theme.border,
					backgroundColor: theme.card,
				},
				applySlot(styles?.root, style),
			)}
		>
			{children}
		</View>
	);
}

export function ToolbarButton({
	variant,
	color,
	size,
	disabled,
	onPress,
	accessibilityLabel,
	style,
	testID = "k-toolbar-button",
	children,
}: ToolbarButtonProps): ReactElement {
	return (
		<Button
			variant={variant}
			color={color}
			size={size}
			disabled={disabled}
			onPress={onPress}
			accessibilityLabel={accessibilityLabel}
			style={style}
			testID={testID}
		>
			{children}
		</Button>
	);
}

export function ToolbarSeparator({
	style,
	testID = "k-toolbar-separator",
}: ToolbarSeparatorProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={applySlot(
				{
					width: 1,
					alignSelf: "stretch",
					marginVertical: 6,
					backgroundColor: theme.separator,
				},
				style,
			)}
		/>
	);
}

export function ToolbarLink({
	children,
	disabled,
	onPress,
	accessibilityLabel,
	style,
	testID = "k-toolbar-link",
}: ToolbarLinkProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<Pressable
			testID={testID}
			accessibilityRole="link"
			accessibilityLabel={accessibilityLabel}
			accessibilityState={{ disabled: disabled ?? false }}
			disabled={disabled}
			onPress={onPress}
			style={applySlot(
				{ paddingHorizontal: 8, minHeight: 36, justifyContent: "center" },
				style,
			)}
		>
			<RNText
				style={{
					fontSize: 14,
					fontWeight: "500",
					color: disabled ? theme.mutedForeground : theme.primary,
				}}
			>
				{children}
			</RNText>
		</Pressable>
	);
}

export function ToolbarToggleGroup({
	type,
	value,
	defaultValue,
	onValueChange,
	size,
	variant,
	disabled,
	accessibilityLabel,
	styles,
	testID = "k-toolbar-toggle-group",
	children,
}: ToolbarToggleGroupProps): ReactElement {
	return (
		<ToggleGroup
			type={type}
			value={value}
			defaultValue={defaultValue}
			onValueChange={onValueChange}
			size={size}
			variant={variant}
			disabled={disabled}
			accessibilityLabel={accessibilityLabel}
			styles={styles}
			testID={testID}
		>
			{children}
		</ToggleGroup>
	);
}

export function ToolbarToggleItem({
	value,
	size,
	variant,
	disabled,
	accessibilityLabel,
	style,
	testID = "k-toolbar-toggle-item",
	children,
}: ToolbarToggleItemProps): ReactElement {
	return (
		<ToggleGroupItem
			value={value}
			size={size}
			variant={variant}
			disabled={disabled}
			accessibilityLabel={accessibilityLabel}
			style={style}
			testID={testID}
		>
			{children}
		</ToggleGroupItem>
	);
}
