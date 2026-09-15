/**
 * TagInput: chip-set field. RN has no keystroke-level keydown for text
 * entry, so separators are detected inside the changed text itself
 * ("beta," commits "beta"); backspace-on-empty rides onKeyPress, and
 * submit commits the pending text. Adding is batch-safe (dedupe,
 * maxTags, validate, transform) like the web port.
 */
import { X } from "lucide-react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import {
	Pressable,
	Text as RNText,
	TextInput as RNTextInput,
	View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { TagInputProps } from "./tag-input.types";

export function TagInput({
	value,
	defaultValue,
	onValueChange,
	separators = [","],
	allowDuplicates = false,
	maxTags,
	validateTag,
	transformTag = (tag) => tag.trim(),
	placeholder = "Type and press comma...",
	disabled = false,
	hasError = false,
	accessibilityLabel,
	style,
	styles,
	testID = "k-tag-input",
}: TagInputProps): ReactElement {
	const { theme } = useUnistyles() as unknown as {
		theme: Record<string, string>;
	};
	const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
	const [inputValue, setInputValue] = useState("");

	const isControlled = value !== undefined;
	const tags = isControlled ? value : internal;

	const commit = (next: string[]): void => {
		if (!isControlled) setInternal(next);
		onValueChange?.(next);
	};

	// batch add: dedupe (within the batch too), cap, validate, transform
	const addTags = (candidates: string[]): void => {
		const existing = allowDuplicates ? null : new Set(tags);
		const accepted: string[] = [];
		for (const candidate of candidates) {
			const transformed = transformTag(candidate);
			if (!transformed) continue;
			if (maxTags !== undefined && tags.length + accepted.length >= maxTags) {
				break;
			}
			if (existing?.has(transformed)) continue;
			if (validateTag && !validateTag(transformed)) continue;
			existing?.add(transformed);
			accepted.push(transformed);
		}
		if (accepted.length === 0) return;
		commit([...tags, ...accepted]);
		setInputValue("");
	};

	const removeTag = (index: number): void => {
		commit(tags.filter((_, i) => i !== index));
	};

	const handleChangeText = (text: string): void => {
		const hasSeparator = separators.some((sep) => text.includes(sep));
		if (!hasSeparator) {
			setInputValue(text);
			return;
		}
		const pattern = new RegExp(
			separators
				.map((sep) => sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
				.join("|"),
			"g",
		);
		addTags(text.split(pattern));
	};

	const handleKeyPress = (event: { nativeEvent: { key: string } }): void => {
		if (
			event.nativeEvent.key === "backspace" &&
			inputValue === "" &&
			tags.length > 0
		) {
			removeTag(tags.length - 1);
		}
	};

	return (
		<View style={{ position: "relative", alignSelf: "stretch" }}>
			<View
				testID={testID}
				style={[
					{
						flexDirection: "row",
						flexWrap: "wrap",
						alignItems: "center",
						gap: 6,
						minHeight: 44,
						paddingHorizontal: 12,
						paddingVertical: 6,
						borderWidth: 1,
						borderRadius: 8,
						borderColor: hasError ? theme.destructive : theme.border,
						backgroundColor: theme.input,
						opacity: disabled ? 0.6 : 1,
					},
					applySlot(applySlot({}, style), styles?.root),
				]}
			>
				{tags.map((tag, index) => (
					<View
						// biome-ignore lint/suspicious/noArrayIndexKey: duplicates are legal, so chip slot position is the identity
						key={`${tag}-${index}`}
						testID="k-tag"
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 4,
							paddingHorizontal: 8,
							height: 24,
							borderRadius: 12,
							backgroundColor: theme.secondary,
						}}
					>
						<RNText style={{ fontSize: 12, color: theme.foreground }}>
							{tag}
						</RNText>
						<Pressable
							testID="k-tag-remove"
							accessibilityRole="button"
							accessibilityLabel={`Remove ${tag}`}
							accessibilityState={{ disabled }}
							disabled={disabled}
							onPress={() => removeTag(index)}
							hitSlop={4}
							style={{ padding: 2 }}
						>
							<X size={12} color={theme.foreground} />
						</Pressable>
					</View>
				))}
				<RNTextInput
					testID="k-tag-input-field"
					value={inputValue}
					onChangeText={handleChangeText}
					onKeyPress={handleKeyPress}
					onSubmitEditing={() => addTags([inputValue])}
					editable={!disabled}
					placeholder={tags.length === 0 ? placeholder : ""}
					placeholderTextColor={theme.mutedForeground}
					accessibilityLabel={accessibilityLabel ?? placeholder}
					style={[
						{
							flex: 1,
							minWidth: 100,
							fontSize: 14,
							color: theme.foreground,
							paddingVertical: 6,
						},
						applySlot({}, styles?.field),
					]}
				/>
			</View>
			{tags.length > 0 && !disabled ? (
				<Pressable
					testID="k-tag-input-clear"
					accessibilityRole="button"
					accessibilityLabel="Clear all tags"
					onPress={() => commit([])}
					hitSlop={8}
					style={{
						position: "absolute",
						right: 8,
						top: 10,
						padding: 2,
					}}
				>
					<X size={16} color={theme.mutedForeground} />
				</Pressable>
			) : null}
		</View>
	);
}
