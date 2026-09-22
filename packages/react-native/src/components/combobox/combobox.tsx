/**
 * Combobox: searchable single picker on the shared Sheet engine. Client
 * mode filters options case-insensitively; providing onSearchChange
 * switches to async mode (rows come from the caller, empty search shows
 * none). Committing closes the sheet.
 */
import { ChevronDown, X } from "lucide-react-native";
import type { ComponentRef, ReactElement } from "react";
import { useRef, useState } from "react";
import {
	Pressable,
	Text as RNText,
	ScrollView,
	TextInput,
	View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Icon } from "../icon";
import { trigger } from "../input-surface.styles";
import {
	optionLabel,
	optionRow,
	searchBlock,
	searchField,
} from "../select/select.styles";
import { Sheet } from "../sheet";
import { applySlot } from "../slot-styles";
import type { ComboboxProps } from "./combobox.types";
import { ComboboxSkeleton } from "./combobox-skeleton";
import {
	clearStyle,
	emptyTextStyle,
	listContentStyle,
	skeletonStyle,
	valueTextStyle,
} from "./combobox.styles";

export function Combobox({
	options,
	value,
	defaultValue,
	onValueChange,
	placeholder = "Select an option",
	label,
	searchPlaceholder = "Search options",
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
	const triggerRef = useRef<ComponentRef<typeof Pressable> | null>(null);

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
				style={[skeletonStyle(size), style, slotStyles?.root]}
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
				ref={triggerRef}
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
					style={valueTextStyle(
						theme,
						Boolean(selectedOption || selectedLabel),
					)}
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
					style={clearStyle(size)}
				>
					<X size={16} color={theme.mutedForeground} />
				</Pressable>
			) : null}
			<Sheet
				open={open}
				onClose={close}
				triggerRef={triggerRef}
				snap="auto"
				title={label ?? placeholder}
				avoidKeyboard
			>
				<View testID="k-combobox-content" style={{ flex: 1 }}>
					<View testID="k-combobox-fixed" style={searchBlock(theme)}>
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
							style={emptyTextStyle(theme)}
						>
							{emptyText}
						</RNText>
					) : (
						<ScrollView
							testID="k-combobox-scroll-content"
							showsVerticalScrollIndicator={false}
							contentContainerStyle={listContentStyle}
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
