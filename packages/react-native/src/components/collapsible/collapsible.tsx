/**
 * Collapsible: the raw disclosure pair — one trigger toggles one content
 * panel. Content unmounts when closed (Radix forceMount=false
 * semantics): no hidden panels in the a11y tree and nothing to animate
 * until motion tokens land.
 */

import type { ReactElement } from "react";
import { createContext, useContext, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type {
	CollapsibleContentProps,
	CollapsibleProps,
	CollapsibleTriggerProps,
} from "./collapsible.types";

interface CollapsibleState {
	open: boolean;
	disabled: boolean;
	toggle: () => void;
	triggerStyles?: StyleProp<ViewStyle>;
	contentStyles?: StyleProp<ViewStyle>;
}

const CollapsibleContext = createContext<CollapsibleState | null>(null);

function Root({
	children,
	open,
	defaultOpen = false,
	onOpenChange,
	disabled = false,
	accessibilityLabel,
	slotStyles,
	testID = "k-collapsible",
}: CollapsibleProps): ReactElement {
	// controlled lock: a provided open prop always wins over internal state
	const controlled = open !== undefined;
	const [internal, setInternal] = useState(defaultOpen);
	const isOpen = controlled ? open : internal;

	const toggle = () => {
		if (!controlled) setInternal(!isOpen);
		onOpenChange?.(!isOpen);
	};

	return (
		<CollapsibleContext.Provider
			value={{
				open: isOpen,
				disabled,
				toggle,
				triggerStyles: slotStyles?.trigger,
				contentStyles: slotStyles?.content,
			}}
		>
			<View
				testID={testID}
				accessibilityLabel={accessibilityLabel}
				style={applySlot({}, slotStyles?.root)}
			>
				{children}
			</View>
		</CollapsibleContext.Provider>
	);
}

function Trigger({
	children,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-collapsible-trigger",
}: CollapsibleTriggerProps): ReactElement {
	const group = useContext(CollapsibleContext);
	const { theme } = useUnistyles();
	const open = group?.open ?? false;
	const disabled = group?.disabled === true;

	return (
		<Pressable
			testID={testID}
			onPress={() => group?.toggle()}
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
						{
							flexDirection: "row",
							alignItems: "center",
							minHeight: 44,
							minWidth: 44,
						},
						style,
					),
					group?.triggerStyles,
				),
				slotStyles?.root,
			)}
		>
			{typeof children === "string" || typeof children === "number" ? (
				<RNText
					style={{ color: theme.foreground, fontSize: 15, fontWeight: "600" }}
				>
					{children}
				</RNText>
			) : (
				<View style={{ flex: 1 }}>{children}</View>
			)}
		</Pressable>
	);
}

function Content({
	children,
	slotStyles,
	testID = "k-collapsible-content",
}: CollapsibleContentProps): ReactElement | null {
	const group = useContext(CollapsibleContext);
	const { theme } = useUnistyles();
	if (!group?.open) return null;

	return (
		<View
			testID={testID}
			style={applySlot(
				applySlot({ overflow: "hidden", paddingTop: 4 }, group.contentStyles),
				slotStyles?.root,
			)}
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

export const Collapsible = Object.assign(Root, { Trigger, Content });
