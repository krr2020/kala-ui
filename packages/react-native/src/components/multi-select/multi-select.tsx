/**
 * MultiSelect: sheet-based multi picker on the shared Sheet engine.
 * Toggling a row keeps the sheet open (multi-select semantics); the
 * trigger shows chips with a +N overflow badge. Select-all commits the
 * enabled values only and collapses to [] when complete.
 */
import { Check, X } from "lucide-react-native";
import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import { Pressable, Text as RNText, TextInput, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Sheet } from "../sheet";
import { applySlot } from "../slot-styles";
import type { MultiSelectOption, MultiSelectProps } from "./multi-select.types";
import { MultiSelectSkeleton } from "./multi-select-skeleton";

const HEIGHTS = { sm: 36, md: 44 } as const;

export function MultiSelect({
	options,
	value,
	defaultValue,
	onValueChange,
	placeholder = "Select options...",
	searchPlaceholder = "Search...",
	emptyText = "No results found.",
	maxSelected,
	maxVisibleSelections = 3,
	disabled = false,
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

	const selectedOptions = options.filter((o) => selected.includes(o.value));
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
					{
						minHeight: 44,
						flexDirection: "row",
						alignItems: "center",
						gap: 8,
						paddingHorizontal: 12,
						borderRadius: 8,
						backgroundColor: isSelected ? theme.primary : "transparent",
						opacity: isDisabled && !isSelected ? 0.5 : 1,
					},
					slotStyles?.option,
				)}
			>
				{isSelected ? (
					<Check size={14} color={theme.primaryForeground} />
				) : (
					<View
						style={{
							width: 14,
							height: 14,
							borderRadius: 7,
							borderWidth: 1,
							borderColor: theme.border,
						}}
					/>
				)}
				<RNText
					numberOfLines={1}
					style={{
						flex: 1,
						fontSize: 14,
						color: isSelected
							? theme.primaryForeground
							: option.disabled === true
								? theme.mutedForeground
								: theme.foreground,
					}}
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
		return <MultiSelectSkeleton testID="k-multi-select-skeleton" />;
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
					{
						minHeight: HEIGHTS[size],
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 8,
						paddingHorizontal: 12,
						borderWidth: 1,
						borderRadius: 8,
						borderColor: theme.border,
						backgroundColor: theme.input,
						opacity: disabled ? 0.5 : 1,
					},
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
				<RNText style={{ fontSize: 12, color: theme.mutedForeground }}>
					▾
				</RNText>
			</Pressable>
			<Sheet open={open} onClose={close}>
				<View testID="k-multi-select-content" style={{ gap: 2 }}>
					<TextInput
						testID="k-multi-select-search"
						value={search}
						onChangeText={setSearch}
						placeholder={searchPlaceholder}
						placeholderTextColor={theme.mutedForeground}
						accessibilityLabel={searchPlaceholder}
						style={{
							minHeight: 40,
							paddingHorizontal: 12,
							borderWidth: 1,
							borderRadius: 8,
							borderColor: theme.border,
							fontSize: 14,
							color: theme.foreground,
						}}
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
							{isAllSelected ? (
								<Check size={14} color={theme.primary} />
							) : (
								<View
									style={{
										width: 14,
										height: 14,
										borderRadius: 7,
										borderWidth: 1,
										borderColor: theme.border,
									}}
								/>
							)}
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
					{query.length > 0 && filtered.length === 0 ? (
						<RNText
							testID="k-multi-select-empty"
							style={{
								paddingVertical: 12,
								fontSize: 14,
								color: theme.mutedForeground,
							}}
						>
							{emptyText}
						</RNText>
					) : (
						rows
					)}
				</View>
			</Sheet>
		</>
	);
}
