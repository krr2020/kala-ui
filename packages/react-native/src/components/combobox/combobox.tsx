/**
 * Combobox: searchable single picker on the shared Sheet engine. Client
 * mode filters options case-insensitively; providing onSearchChange
 * switches to async mode (rows come from the caller, empty search shows
 * none). Committing closes the sheet.
 */
import { X } from "lucide-react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import { Pressable, Text as RNText, TextInput, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Sheet } from "../sheet";
import { applySlot } from "../slot-styles";
import type { ComboboxProps } from "./combobox.types";
import { ComboboxSkeleton } from "./combobox-skeleton";

const HEIGHTS = { sm: 36, md: 44 } as const;

export function Combobox({
	options,
	value,
	defaultValue,
	onValueChange,
	placeholder = "Select option...",
	searchPlaceholder = "Search...",
	emptyText = "No results found.",
	disabled = false,
	size = "md",
	clearable = false,
	onSearchChange,
	selectedLabel,
	isLoading = false,
	accessibilityLabel,
	style,
	styles,
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
	const displayLabel =
		selectedOption?.label ??
		(current ? (selectedLabel ?? placeholder) : placeholder);

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
		return <ComboboxSkeleton testID="k-combobox-skeleton" />;
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
					{
						minHeight: HEIGHTS[size],
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 8,
						paddingHorizontal: 12,
						paddingRight: clearable && current ? 44 : 12,
						borderWidth: 1,
						borderRadius: 8,
						borderColor: theme.border,
						backgroundColor: theme.input,
						opacity: disabled ? 0.5 : 1,
					},
					applySlot(applySlot({}, style), styles?.root),
				]}
			>
				<RNText
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
				<RNText style={{ fontSize: 12, color: theme.mutedForeground }}>
					▾
				</RNText>
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
						top: HEIGHTS[size] / 2 - 10,
					}}
				>
					<X size={16} color={theme.mutedForeground} />
				</Pressable>
			) : null}
			<Sheet open={open} onClose={close}>
				<View testID="k-combobox-content" style={{ gap: 2 }}>
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
						visible.map((option, index) => (
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
									{
										minHeight: 44,
										justifyContent: "center",
										paddingHorizontal: 12,
										borderRadius: 8,
										backgroundColor:
											option.value === current ? theme.primary : "transparent",
										opacity: option.disabled ? 0.5 : 1,
									},
									styles?.option,
								)}
							>
								<RNText
									numberOfLines={1}
									style={{
										fontSize: 14,
										color:
											option.value === current
												? theme.primaryForeground
												: option.disabled
													? theme.mutedForeground
													: theme.foreground,
									}}
								>
									{option.label}
								</RNText>
							</Pressable>
						))
					)}
				</View>
			</Sheet>
		</>
	);
}
