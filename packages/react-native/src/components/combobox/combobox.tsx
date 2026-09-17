/**
 * Combobox: searchable single picker on the shared Sheet engine. Client
 * mode filters options case-insensitively; providing onSearchChange
 * switches to async mode (rows come from the caller, empty search shows
 * none). Committing closes the sheet.
 */
import { ChevronDown, X } from "lucide-react-native";
import type { ReactElement } from "react";
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
import { optionLabel, optionRow, searchField } from "../select/select.styles";
import { Sheet } from "../sheet";
import { applySlot } from "../slot-styles";
import type { ComboboxProps } from "./combobox.types";
import { ComboboxSkeleton } from "./combobox-skeleton";

export function Combobox({
	options,
	value,
	defaultValue,
	onValueChange,
	placeholder = "Select an option",
	label,
	searchPlaceholder = "Search...",
	emptyText = "No results found.",
	disabled = false,
	hasError = false,
	size = "md",
	clearable = false,
	onSearchChange,
	selectedLabel,
	isLoading = false,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-combobox",
}: ComboboxProps): ReactElement {
	const { theme } = useUnistyles();
	const [internal, setInternal] = useState(defaultValue ?? "");
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const isControlled = value !== undefined;
	const current = isControlled ? value : internal;
	const isAsync = onSearchChange !== undefined;

	const selectedOption = options.find((o) => o.value === current);
	// an orphan value (not in options) renders its raw value, never a
	// blank trigger — the parent may be mid async load
	const displayLabel =
		selectedOption?.label ??
		(current ? (selectedLabel ?? current) : placeholder);

	const commit = (next: string): void => {
		if (!isControlled) setInternal(next);
		onValueChange?.(next);
	};

	const close = (): void => {
		setOpen(false);
		setSearch("");
		onSearchChange?.("");
	};

	if (isLoading) {
		return (
			<ComboboxSkeleton
				style={[
					{ width: "100%", height: SURFACE_HEIGHTS[size] },
					style,
					slotStyles?.root,
				]}
			/>
		);
	}

	const query = search.toLowerCase();
	const visible =
		isAsync && query.length === 0
			? []
			: isAsync
				? options
				: options.filter((o) => o.label.toLowerCase().includes(query));

	return (
		<>
			<Pressable
				testID={testID}
				accessibilityRole="button"
				accessibilityLabel={accessibilityLabel ?? displayLabel}
				accessibilityState={{ expanded: open, disabled }}
				disabled={disabled}
				onPress={() => setOpen((prev) => !prev)}
				style={[
					trigger(theme, { size, hasError, disabled }),
					// keep room for the floating clear affordance
					clearable && current ? { paddingRight: 44 } : undefined,
					applySlot(applySlot({}, style), slotStyles?.root),
				]}
			>
				<RNText
					testID="k-combobox-value"
					numberOfLines={1}
					style={{
						flex: 1,
						fontSize: 14,
						color:
							selectedOption || selectedLabel
								? theme.foreground
								: theme.mutedForeground,
					}}
				>
					{displayLabel}
				</RNText>
				<Icon
					icon={ChevronDown}
					size="sm"
					color="mutedForeground"
					testID="k-combobox-chevron"
				/>
			</Pressable>
			{clearable && current !== "" && !disabled ? (
				<Pressable
					testID="k-combobox-clear"
					accessibilityRole="button"
					accessibilityLabel="Clear selection"
					onPress={() => commit("")}
					hitSlop={8}
					style={{
						position: "absolute",
						right: 10,
						top: SURFACE_HEIGHTS[size] / 2 - 10,
					}}
				>
					<X size={16} color={theme.mutedForeground} />
				</Pressable>
			) : null}
			<Sheet
				open={open}
				onClose={close}
				snap="auto"
				title={label ?? placeholder}
				avoidKeyboard
			>
				<View testID="k-combobox-content" style={{ flex: 1 }}>
					<View testID="k-combobox-fixed" style={{ gap: 2 }}>
						<TextInput
							testID="k-combobox-search"
							value={search}
							onChangeText={(text) => {
								setSearch(text);
								onSearchChange?.(text);
							}}
							placeholder={searchPlaceholder}
							placeholderTextColor={theme.mutedForeground}
							accessibilityLabel={searchPlaceholder}
							style={searchField(theme)}
						/>
					</View>
					{!isAsync && query.length > 0 && visible.length === 0 ? (
						<RNText
							testID="k-combobox-empty"
							style={{
								paddingVertical: 12,
								fontSize: 14,
								color: theme.mutedForeground,
							}}
						>
							{emptyText}
						</RNText>
					) : (
						<ScrollView
							testID="k-combobox-scroll-content"
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ minHeight: 44 }}
						>
							{visible.map((option, index) => (
								<Pressable
									key={option.value}
									testID={`k-combobox-option-${index}`}
									accessibilityRole="button"
									accessibilityLabel={option.label}
									accessibilityState={{
										disabled: option.disabled ?? false,
										selected: option.value === current,
									}}
									disabled={option.disabled ?? false}
									onPress={() => {
										commit(option.value);
										close();
									}}
									style={applySlot(
										optionRow(theme, option.value === current),
										slotStyles?.option,
									)}
								>
									<RNText
										numberOfLines={1}
										style={optionLabel(theme, {
											isSelected: option.value === current,
											disabled: option.disabled ?? false,
										})}
									>
										{option.label}
									</RNText>
								</Pressable>
							))}
						</ScrollView>
					)}
				</View>
			</Sheet>
		</>
	);
}
