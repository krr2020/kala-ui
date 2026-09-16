/**
 * Accordion: a stack of disclosure items. Single type keeps one item
 * open (pressing it again closes — the web collapsible arm); multiple
 * toggles independently. Variant arms mirror the web accordion
 * (default = divider rows, bordered/filled = boxed items whose open
 * trigger tints accent/primary). Content unmounts when closed, so
 * closed panels never reach the a11y tree.
 */

import { ChevronDown } from "lucide-react-native";
import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Icon } from "../icon";
import { applySlot } from "../slot-styles";
import type {
	AccordionContentProps,
	AccordionItemProps,
	AccordionProps,
	AccordionTriggerProps,
	AccordionType,
	AccordionVariant,
} from "./accordion.types";

interface GroupState {
	type: AccordionType;
	values: string[];
	variant: AccordionVariant;
	disabled: boolean;
	itemStyles?: StyleProp<ViewStyle>;
	triggerStyles?: StyleProp<ViewStyle>;
	contentStyles?: StyleProp<ViewStyle>;
	toggle: (value: string) => void;
}

interface ItemState {
	value: string;
	disabled: boolean;
}

const AccordionContext = createContext<GroupState | null>(null);
const ItemContext = createContext<ItemState | null>(null);

const toValues = (value: string | string[] | undefined): string[] =>
	Array.isArray(value) ? value : value === undefined ? [] : [value];

function Root(props: AccordionProps): ReactElement {
	const {
		children,
		type = "single",
		value,
		defaultValue,
		onValueChange,
		variant = "default",
		disabled = false,
		accessibilityLabel,
		slotStyles,
		testID = "k-accordion",
	} = props;
	// the public type discriminates the payload by `type`; internally one
	// call site widens the callback arg so both arms share it
	const notify = onValueChange as
		| ((value: string | string[]) => void)
		| undefined;
	// controlled lock: a provided value prop always wins over internal state
	const controlled = value !== undefined;
	const [internal, setInternal] = useState<string[]>(() =>
		toValues(defaultValue),
	);
	const values = controlled ? toValues(value) : internal;

	const toggle = (itemValue: string) => {
		const next =
			type === "single"
				? values[0] === itemValue
					? []
					: [itemValue]
				: values.includes(itemValue)
					? values.filter((v) => v !== itemValue)
					: [...values, itemValue];
		if (!controlled) setInternal(next);
		notify?.(type === "single" ? (next[0] ?? "") : next);
	};

	return (
		<AccordionContext.Provider
			value={{
				type,
				values,
				variant,
				disabled,
				itemStyles: slotStyles?.item,
				triggerStyles: slotStyles?.trigger,
				contentStyles: slotStyles?.content,
				toggle,
			}}
		>
			<View
				testID={testID}
				accessibilityLabel={accessibilityLabel}
				style={applySlot({}, slotStyles?.root)}
			>
				{children}
			</View>
		</AccordionContext.Provider>
	);
}

function Item({
	children,
	value,
	disabled = false,
	slotStyles,
	testID = "k-accordion-item",
}: AccordionItemProps): ReactElement {
	const group = useContext(AccordionContext);
	const { theme } = useUnistyles();
	const variant = group?.variant ?? "default";

	const base: ViewStyle = {
		backgroundColor: theme.card,
		borderColor: theme.border,
		// web's `last:border-b-0` has no RN selector — every default row
		// keeps its divider; boxed variants round and separate instead
		...(variant === "default"
			? { borderBottomWidth: 1 }
			: {
					borderWidth: 1,
					borderRadius: 8,
					marginBottom: 8,
					overflow: "hidden",
				}),
	};

	return (
		<ItemContext.Provider value={{ value, disabled }}>
			<View
				testID={testID}
				style={applySlot(applySlot(base, group?.itemStyles), slotStyles?.root)}
			>
				{children}
			</View>
		</ItemContext.Provider>
	);
}

function TriggerLabel({
	children,
	fg,
	size,
}: {
	children: ReactNode;
	fg: string;
	size: number;
}): ReactElement {
	return typeof children === "string" || typeof children === "number" ? (
		<RNText style={{ flex: 1, color: fg, fontSize: size, fontWeight: "600" }}>
			{children}
		</RNText>
	) : (
		<View style={{ flex: 1 }}>{children}</View>
	);
}

function Trigger({
	children,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-accordion-trigger",
}: AccordionTriggerProps): ReactElement {
	const group = useContext(AccordionContext);
	const item = useContext(ItemContext);
	const { theme } = useUnistyles();

	const value = item?.value ?? "";
	const open = group?.values.includes(value) ?? false;
	const variant = group?.variant ?? "default";
	const disabled = item?.disabled === true || group?.disabled === true;

	const base: ViewStyle = {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 12,
		minHeight: 44,
		paddingVertical: variant === "default" ? 16 : 14,
		...(variant !== "default" ? { paddingHorizontal: 16 } : {}),
	};
	// open tint per variant: none / accent / primary (web accordion arms)
	const openTint: ViewStyle =
		variant === "bordered"
			? { backgroundColor: theme.accent }
			: variant === "filled"
				? { backgroundColor: theme.primary }
				: {};
	// literal unions differ per token — widen to string for the variant swap
	let fg: string = theme.foreground;
	if (open && variant === "bordered") fg = theme.primary;
	if (open && variant === "filled") fg = theme.primaryForeground;

	return (
		<Pressable
			testID={testID}
			onPress={() => group?.toggle(value)}
			disabled={disabled}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			accessibilityState={{
				expanded: open,
				disabled: disabled || undefined,
			}}
			style={applySlot(
				applySlot(
					applySlot(
						applySlot(
							applySlot(base, openTint),
							disabled ? { opacity: 0.5 } : {},
						),
						style,
					),
					group?.triggerStyles,
				),
				slotStyles?.root,
			)}
		>
			<TriggerLabel fg={fg} size={variant === "default" ? 16 : 15}>
				{children}
			</TriggerLabel>
			<View
				testID="k-accordion-chevron"
				style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
			>
				<Icon icon={ChevronDown} size="sm" />
			</View>
		</Pressable>
	);
}

function Content({
	children,
	slotStyles,
	testID = "k-accordion-content",
}: AccordionContentProps): ReactElement | null {
	const group = useContext(AccordionContext);
	const item = useContext(ItemContext);
	const { theme } = useUnistyles();

	if (!group || !item || !group.values.includes(item.value)) return null;
	const variant = group.variant;

	const base: ViewStyle = {
		overflow: "hidden",
		paddingBottom: 16,
		paddingTop: variant === "default" ? 4 : 8,
		...(variant !== "default" ? { paddingHorizontal: 16 } : {}),
		...(variant === "filled" ? { backgroundColor: theme.muted } : {}),
	};

	return (
		<View
			testID={testID}
			style={applySlot(applySlot(base, group.contentStyles), slotStyles?.root)}
		>
			{/* bare strings must land on a Text host on RN — same wrap as Card */}
			{typeof children === "string" || typeof children === "number" ? (
				<RNText
					style={{ color: theme.foreground, fontSize: 14, lineHeight: 20 }}
				>
					{children}
				</RNText>
			) : (
				children
			)}
		</View>
	);
}

export const Accordion = Object.assign(Root, { Item, Trigger, Content });
