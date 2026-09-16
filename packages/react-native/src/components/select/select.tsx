import type { ReactElement } from "react";
import { useState } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Sheet } from "../sheet";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import type { SelectProps } from "./select.types";

const HEIGHTS = { sm: 36, md: 44 } as const;

/**
 * Select: trigger + bottom-sheet options. The options surface is the
 * shared engine Sheet+List variants (MultiSelect/Combobox build on it
 * later); value identity is the option `value`, never the label.
 */
export function Select({
	options,
	value,
	defaultValue,
	onValueChange,
	placeholder = "Select an option",
	label,
	size = "md",
	disabled = false,
	hasError = false,
	isLoading = false,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-select",
}: SelectProps): ReactElement {
	const { theme } = useUnistyles();
	const [internal, setInternal] = useState<string | undefined>(defaultValue);
	const [open, setOpen] = useState(false);

	const isControlled = value !== undefined;
	const current = isControlled ? value : internal;
	const selected = options.find((option) => option.value === current);

	const commit = (next: string): void => {
		if (!isControlled) setInternal(next);
		onValueChange?.(next);
		setOpen(false);
	};

	const announced =
		accessibilityLabel ?? label ?? (selected ? selected.label : placeholder);

	if (isLoading) {
		return (
			<Skeleton
				testID={testID}
				style={[
					{ width: "100%", height: HEIGHTS[size] },
					style,
					slotStyles?.root,
				]}
			/>
		);
	}

	return (
		<>
			<Pressable
				testID={testID}
				accessibilityRole="button"
				accessibilityLabel={announced}
				accessibilityState={{ disabled, expanded: open }}
				disabled={disabled}
				onPress={() => setOpen((prev) => !prev)}
				style={[
					{
						minHeight: HEIGHTS[size],
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 8,
						paddingHorizontal: 12,
						borderWidth: 1,
						borderRadius: 8,
						borderColor: hasError ? theme.destructive : theme.border,
						backgroundColor: theme.input,
						opacity: disabled ? 0.5 : 1,
					},
					applySlot(applySlot({}, style), slotStyles?.root),
				]}
			>
				<RNText
					testID="k-select-value"
					numberOfLines={1}
					style={[
						{
							flex: 1,
							fontSize: 14,
							color: selected ? theme.foreground : theme.mutedForeground,
						},
						applySlot({}, slotStyles?.value),
					]}
				>
					{selected ? selected.label : placeholder}
				</RNText>
				<RNText
					testID="k-select-chevron"
					accessibilityElementsHidden={false}
					style={applySlot(
						{ fontSize: 14, color: theme.mutedForeground },
						slotStyles?.chevron,
					)}
				>
					▾
				</RNText>
			</Pressable>
			<Sheet open={open} onClose={() => setOpen(false)}>
				<View testID="k-select-sheet" style={{ gap: 4 }}>
					{options.length === 0 ? (
						<RNText
							testID="k-select-empty"
							style={{ fontSize: 14, color: theme.mutedForeground }}
						>
							No options
						</RNText>
					) : (
						options.map((option) => {
							const isSelected = option.value === current;
							return (
								<Pressable
									key={option.value}
									testID="k-select-option"
									accessibilityRole="button"
									accessibilityLabel={option.label}
									accessibilityState={{
										disabled: option.disabled ?? false,
										selected: isSelected,
									}}
									disabled={option.disabled ?? false}
									onPress={() => commit(option.value)}
									style={[
										{
											minHeight: 44,
											justifyContent: "center",
											paddingHorizontal: 12,
											borderRadius: 8,
											backgroundColor: isSelected
												? theme.primary
												: "transparent",
										},
										applySlot({}, slotStyles?.option),
									]}
								>
									<RNText
										style={{
											fontSize: 14,
											color: isSelected
												? theme.primaryForeground
												: option.disabled
													? theme.mutedForeground
													: theme.foreground,
										}}
									>
										{option.label}
									</RNText>
								</Pressable>
							);
						})
					)}
				</View>
			</Sheet>
		</>
	);
}
