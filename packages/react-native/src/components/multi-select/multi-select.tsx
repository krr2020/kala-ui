/**
 * MultiSelect: sheet-based multi picker on the shared Sheet engine.
 * Toggling a row keeps the sheet open (multi-select semantics); the
 * trigger shows chips with a +N overflow badge. Select-all commits the
 * enabled values only and collapses to [] when complete.
 */
import { Check, ChevronDown, X } from "lucide-react-native";
import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import {
	Pressable,
	Text as RNText,
	ScrollView,
	TextInput,
	View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Icon } from "../icon";
import { SURFACE_HEIGHTS, trigger } from "../input-surface.styles";
import {
	emptyLabel,
	optionLabel,
	optionRow,
	searchField,
} from "../select/select.styles";
import { Sheet } from "../sheet";
import { applySlot } from "../slot-styles";
import type { MultiSelectOption, MultiSelectProps } from "./multi-select.types";
import { MultiSelectSkeleton } from "./multi-select-skeleton";

export function MultiSelect({
	options,
	value,
	defaultValue,
	onValueChange,
	label,
	placeholder = "Select options",
	searchPlaceholder = "Search...",
	emptyText = "No results found.",
	maxSelected,
	maxVisibleSelections = 3,
	disabled = false,
	hasError = false,
	size = "md",
	grouped = false,
	showActions = true,
	isLoading = false,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-multi-select",
}: MultiSelectProps): ReactElement {
	const { theme } = useUnistyles();
	const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const isControlled = value !== undefined;
	const selected = isControlled ? value : internal;

	const commit = (next: string[]): void => {
		if (!isControlled) setInternal(next);
		onValueChange?.(next);
	};

	const close = (): void => {
		setOpen(false);
		// stale search must not leak into the next open
		setSearch("");
	};

	// chips render from the SELECTION, not the option list — orphan values
	// (controlled value not yet in options, async load in flight) keep
	// their raw value instead of vanishing
	const selectedOptions = selected.map(
		(v) => options.find((o) => o.value === v) ?? { value: v, label: v },
	);
	const displayedChips =
		selectedOptions.length > maxVisibleSelections
			? selectedOptions.slice(0, maxVisibleSelections)
			: selectedOptions;
	const remainingCount = selectedOptions.length - displayedChips.length;

	const isMaxSelected =
		maxSelected !== undefined && selected.length >= maxSelected;
	const available = options.filter((o) => !o.disabled);
	const isAllSelected =
		available.length > 0 && available.every((o) => selected.includes(o.value));

	const toggle = (optionValue: string): void => {
		commit(
			selected.includes(optionValue)
				? selected.filter((v) => v !== optionValue)
				: [...selected, optionValue],
		);
	};

	const selectAll = (): void => {
		commit(isAllSelected ? [] : available.map((o) => o.value));
	};

	const query = search.toLowerCase();
	const filtered = options.filter((o) => o.label.toLowerCase().includes(query));

	// no-group options first, then each group in first-seen order (web order)
	const rows: ReactNode[] = [];
	let rowSlot = 0;
	const renderRow = (option: MultiSelectOption): void => {
		const slot = rowSlot++;
		const isSelected = selected.includes(option.value);
		const isDisabled =
			option.disabled === true || (isMaxSelected && !isSelected);
		rows.push(
			<Pressable
				key={option.value}
				testID={`k-multi-select-option-${slot}`}
				accessibilityRole="button"
				accessibilityLabel={option.label}
				accessibilityState={{ checked: isSelected, disabled: isDisabled }}
				disabled={isDisabled}
				onPress={() => toggle(option.value)}
				style={applySlot(
					[
						optionRow(theme, isSelected),
						{
							flexDirection: "row",
							alignItems: "center",
							gap: 8,
							opacity: isDisabled && !isSelected ? 0.5 : 1,
						},
					],
					slotStyles?.option,
				)}
			>
				{isSelected ? (
					<View
						testID={`k-multi-select-checkbox-${slot}`}
						style={{
							width: 18,
							height: 18,
							borderRadius: 4,
							borderWidth: 2,
							borderColor: theme.primary,
							backgroundColor: theme.primary,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Check size={12} color={theme.primaryForeground} />
					</View>
				) : (
					<View
						testID={`k-multi-select-checkbox-${slot}`}
						style={{
							width: 18,
							height: 18,
							borderRadius: 4,
							borderWidth: 2,
							borderColor: theme.border,
						}}
					/>
				)}
				<RNText
					numberOfLines={1}
					style={[
						optionLabel(theme, {
							isSelected,
							disabled: option.disabled === true,
						}),
						{ flex: 1 },
					]}
				>
					{option.label}
				</RNText>
			</Pressable>,
		);
	};

	if (query.length === 0 || filtered.length > 0 || !grouped) {
		if (grouped) {
			const seenGroups: string[] = [];
			const noGroup = filtered.filter((o) => o.group === undefined);
			noGroup.forEach(renderRow);
			for (const option of filtered) {
				if (option.group && !seenGroups.includes(option.group)) {
					seenGroups.push(option.group);
				}
			}
			for (const group of seenGroups) {
				rows.push(
					<RNText
						key={`group-${group}`}
						testID={`k-multi-select-group-${group}`}
						style={{
							marginTop: 8,
							fontSize: 12,
							fontWeight: "600",
							color: theme.mutedForeground,
						}}
					>
						{group}
					</RNText>,
				);
				filtered.filter((o) => o.group === group).forEach(renderRow);
			}
		} else {
			filtered.forEach(renderRow);
		}
	}

	if (isLoading) {
		return (
			<MultiSelectSkeleton
				style={[
					{ width: "100%", height: SURFACE_HEIGHTS[size] },
					style,
					slotStyles?.root,
				]}
			/>
		);
	}

	const triggerLabel =
		accessibilityLabel ??
		(selectedOptions.length > 0
			? `Options selected: ${selectedOptions.map((o) => o.label).join(", ")}`
			: placeholder);

	return (
		<>
			<Pressable
				testID={testID}
				accessibilityRole="button"
				accessibilityLabel={triggerLabel}
				accessibilityState={{ expanded: open, disabled }}
				disabled={disabled}
				onPress={() => setOpen((prev) => !prev)}
				style={[
					trigger(theme, { size, hasError, disabled }),
					applySlot(applySlot({}, style), slotStyles?.root),
				]}
			>
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						flexWrap: "wrap",
						alignItems: "center",
						gap: 4,
					}}
				>
					{selectedOptions.length === 0 ? (
						<RNText
							numberOfLines={1}
							style={{ fontSize: 14, color: theme.mutedForeground }}
						>
							{placeholder}
						</RNText>
					) : (
						<>
							{displayedChips.map((option) => (
								<View
									key={option.value}
									testID="k-multi-select-chip"
									style={applySlot(
										{
											flexDirection: "row",
											alignItems: "center",
											gap: 4,
											paddingHorizontal: 8,
											height: 24,
											borderRadius: 12,
											backgroundColor: theme.secondary,
										},
										slotStyles?.chip,
									)}
								>
									<RNText style={{ fontSize: 12, color: theme.foreground }}>
										{option.label}
									</RNText>
									{!disabled ? (
										<Pressable
											testID="k-multi-select-chip-remove"
											accessibilityRole="button"
											accessibilityLabel={`Remove ${option.label}`}
											onPress={() => toggle(option.value)}
											hitSlop={4}
											style={{ padding: 2 }}
										>
											<X size={12} color={theme.foreground} />
										</Pressable>
									) : null}
								</View>
							))}
							{remainingCount > 0 ? (
								<RNText
									testID="k-multi-select-overflow"
									style={{
										fontSize: 12,
										color: theme.mutedForeground,
									}}
								>
									{`+${remainingCount} more`}
								</RNText>
							) : null}
						</>
					)}
				</View>
				<Icon
					icon={ChevronDown}
					size="sm"
					color="mutedForeground"
					testID="k-multi-select-chevron"
				/>
			</Pressable>
			<Sheet
				open={open}
				onClose={close}
				snap="auto"
				title={label ?? placeholder}
				avoidKeyboard
			>
				<View testID="k-multi-select-content" style={{ flex: 1 }}>
					<View testID="k-multi-select-fixed" style={{ gap: 2 }}>
						<TextInput
							testID="k-multi-select-search"
							value={search}
							onChangeText={setSearch}
							placeholder={searchPlaceholder}
							placeholderTextColor={theme.mutedForeground}
							accessibilityLabel={searchPlaceholder}
							style={searchField(theme)}
						/>
						{showActions && maxSelected === undefined ? (
							<Pressable
								testID="k-multi-select-select-all"
								accessibilityRole="button"
								accessibilityLabel="Select all"
								accessibilityState={{ checked: isAllSelected }}
								onPress={selectAll}
								style={{
									minHeight: 44,
									flexDirection: "row",
									alignItems: "center",
									gap: 8,
									paddingHorizontal: 12,
									borderBottomWidth: 1,
									borderBottomColor: theme.border,
								}}
							>
								<View
									style={{
										width: 18,
										height: 18,
										borderRadius: 4,
										borderWidth: 2,
										borderColor: isAllSelected ? theme.primary : theme.border,
										backgroundColor: isAllSelected
											? theme.primary
											: "transparent",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{isAllSelected ? (
										<Check size={12} color={theme.primaryForeground} />
									) : null}
								</View>
								<RNText style={{ fontSize: 14, color: theme.foreground }}>
									Select all
								</RNText>
							</Pressable>
						) : null}
						{showActions && selected.length > 0 ? (
							<Pressable
								testID="k-multi-select-clear-all"
								accessibilityRole="button"
								accessibilityLabel="Clear all"
								onPress={() => commit([])}
								style={{
									minHeight: 44,
									justifyContent: "center",
									paddingHorizontal: 12,
									borderBottomWidth: 1,
									borderBottomColor: theme.border,
								}}
							>
								<RNText style={{ fontSize: 14, color: theme.destructive }}>
									Clear all
								</RNText>
							</Pressable>
						) : null}
					</View>
					{query.length > 0 && filtered.length === 0 ? (
						<RNText testID="k-multi-select-empty" style={emptyLabel(theme)}>
							{emptyText}
						</RNText>
					) : (
						<ScrollView
							testID="k-multi-select-scroll"
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ minHeight: 44 }}
						>
							{rows}
						</ScrollView>
					)}
				</View>
			</Sheet>
		</>
	);
}
