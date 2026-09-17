import { ChevronDown } from "lucide-react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import { FlatList, Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useUncontrolled } from "../../lib/use-uncontrolled.utils";
import { Icon } from "../icon";
import { SURFACE_HEIGHTS, trigger } from "../input-surface.styles";
import { Sheet } from "../sheet";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import {
	emptyLabel,
	optionLabel,
	optionRow,
	optionSeparator,
} from "./select.styles";
import type { SelectOption, SelectProps } from "./select.types";

/**
 * Select: trigger + bottom-sheet options. The options surface is the
 * shared engine Sheet+FlatList (MultiSelect/Combobox build on it later);
 * value identity is the option `value`, never the label. An orphan value
 * (not in options) renders its raw value so async loads never blank the
 * trigger.
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
	hasSuccess = false,
	isLoading = false,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-select",
}: SelectProps): ReactElement {
	const { theme } = useUnistyles();
	const [current, setCurrent] = useUncontrolled<string | undefined>(
		value,
		defaultValue,
	);
	const [open, setOpen] = useState(false);

	const selected = options.find((option) => option.value === current);

	const commit = (next: string): void => {
		setCurrent(next);
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
					{ width: "100%", height: SURFACE_HEIGHTS[size] },
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
					trigger(theme, { size, hasError, hasSuccess, disabled }),
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
					{selected ? selected.label : (current ?? placeholder)}
				</RNText>
				<Icon
					icon={ChevronDown}
					size="sm"
					color="mutedForeground"
					testID="k-select-chevron"
					slotStyles={{ root: slotStyles?.chevron }}
				/>
			</Pressable>
			<Sheet
				open={open}
				onClose={() => setOpen(false)}
				snap="auto"
				title={label ?? placeholder}
			>
				<View testID="k-select-sheet" style={{ flex: 1 }}>
					{options.length === 0 ? (
						<RNText testID="k-select-empty" style={emptyLabel(theme)}>
							No options
						</RNText>
					) : (
						<FlatList
							data={options}
							initialNumToRender={options.length}
							keyExtractor={(option: SelectOption) => option.value}
							ItemSeparatorComponent={() => (
								<View
									testID="k-select-option-separator"
									style={optionSeparator(theme)}
								/>
							)}
							renderItem={({ item: option }) => {
								const isSelected = option.value === current;
								return (
									<Pressable
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
											optionRow(theme, isSelected),
											applySlot({}, slotStyles?.option),
										]}
									>
										<RNText
											style={optionLabel(theme, {
												isSelected,
												disabled: option.disabled ?? false,
											})}
										>
											{option.label}
										</RNText>
									</Pressable>
								);
							}}
						/>
					)}
				</View>
			</Sheet>
		</>
	);
}
