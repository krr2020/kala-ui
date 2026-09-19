import { ChevronDown } from "lucide-react-native";
import type { ComponentRef, ReactElement, ReactNode } from "react";
import { useRef, useState } from "react";
import { Pressable, Text as RNText, ScrollView, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useUncontrolled } from "../../lib/use-uncontrolled.utils";
import { Icon } from "../icon";
import { SURFACE_HEIGHTS, trigger } from "../input-surface.styles";
import { Sheet } from "../sheet";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import {
	emptyLabel,
	groupHeader,
	optionGap,
	optionLabel,
	optionRow,
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
	grouped = false,
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
	const triggerRef = useRef<ComponentRef<typeof Pressable> | null>(null);

	const selected = options.find((option) => option.value === current);

	const commit = (next: string): void => {
		setCurrent(next);
		onValueChange?.(next);
		setOpen(false);
	};

	const announced =
		accessibilityLabel ?? label ?? (selected ? selected.label : placeholder);

	// ungrouped options first, then each group in first-seen order —
	// the same ordering MultiSelect uses so the two pickers agree
	const renderRow = (option: SelectOption, key?: string): ReactNode => {
		const isSelected = option.value === current;
		return (
			<Pressable
				key={key ?? option.value}
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
	};
	const buildRows = (list: SelectOption[]): ReactNode[] => {
		if (!grouped) return list.map((option) => renderRow(option));
		const ungrouped = list.filter((o) => o.group === undefined);
		const groups: string[] = [];
		for (const option of list) {
			if (option.group && !groups.includes(option.group)) {
				groups.push(option.group);
			}
		}
		const rows: ReactNode[] = ungrouped.map((option) => renderRow(option));
		for (const group of groups) {
			rows.push(
				<RNText
					key={`group-${group}`}
					testID={`k-select-group-${group}`}
					style={groupHeader(theme)}
				>
					{group}
				</RNText>,
			);
			rows.push(
				...list
					.filter((o) => o.group === group)
					.map((option) => renderRow(option, `${group}-${option.value}`)),
			);
		}
		return rows;
	};

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
				ref={triggerRef}
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
				triggerRef={triggerRef}
				snap="auto"
				title={label ?? placeholder}
			>
				<View testID="k-select-sheet" style={{ flex: 1 }}>
					{options.length === 0 ? (
						<RNText testID="k-select-empty" style={emptyLabel(theme)}>
							No options
						</RNText>
					) : (
						<ScrollView
							testID="k-select-scroll"
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ gap: optionGap, paddingBottom: 8 }}
						>
							{buildRows(options)}
						</ScrollView>
					)}
				</View>
			</Sheet>
		</>
	);
}
