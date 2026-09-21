"use client";

import { useUncontrolled } from "@kala-ui/react-hooks";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import {
	tabsContentStyles,
	tabsListStyles,
	tabsTriggerStyles,
} from "../../config/tabs";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import type { TabsProps } from "./tabs.types";

const TabsContext = React.createContext<{
	activeTab?: string | undefined;
	setActiveTab: (value: string) => void;
	uniqueId: string;
} | null>(null);

function Tabs({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	value,
	onValueChange,
	defaultValue,
	orientation = "horizontal",
	...props
}: TabsProps) {
	const slotStyles = useSlotStyles("tabs", slotStylesRaw);
	const uniqueId = React.useId();
	const [activeTab, setActiveTab] = useUncontrolled({
		value,
		defaultValue,
		onChange: onValueChange,
	});
	const root = applySlot(
		cn(
			"flex",
			orientation === "vertical" ? "flex-row gap-6" : "flex-col",
			className,
		),
		slotStyles?.root,
	);

	return (
		<TabsContext.Provider
			data-kala-component="tabs"
			value={{ activeTab, setActiveTab, uniqueId }}
		>
			<TabsPrimitive.Root
				ref={ref}
				value={activeTab}
				onValueChange={setActiveTab}
				orientation={orientation}
				data-slot="tabs"
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			/>
		</TabsContext.Provider>
	);
}
export const tabsListVariants = cva(tabsListStyles.base, {
	variants: tabsListStyles.variants,
	defaultVariants: tabsListStyles.defaultVariants,
});

const TabsListContext = React.createContext<{
	variant?: VariantProps<typeof tabsListVariants>["variant"];
}>({});

function TabsList({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	variant = "default",
	align,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
	VariantProps<typeof tabsListVariants> & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("tabs", slotStylesRaw);
	const root = applySlot(
		cn(tabsListVariants({ variant, align }), className),
		slotStyles?.root,
	);
	return (
		<TabsListContext.Provider
			data-kala-component="tabs-list"
			value={{ variant }}
		>
			<TabsPrimitive.List
				ref={ref}
				data-slot="tabs-list"
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			/>
		</TabsListContext.Provider>
	);
}
export const tabsTriggerVariants = cva(tabsTriggerStyles.base, {
	variants: tabsTriggerStyles.variants,
	defaultVariants: tabsTriggerStyles.defaultVariants,
});

function TabsTrigger({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	variant,
	children,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> &
	VariantProps<typeof tabsTriggerVariants> & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("tabs", slotStylesRaw, variant ?? undefined);
	const { variant: listVariant } = React.useContext(TabsListContext);
	const finalVariant = variant || listVariant || "default";
	const root = applySlot(
		cn(tabsTriggerVariants({ variant: finalVariant }), className),
		slotStyles?.root,
	);

	return (
		<TabsPrimitive.Trigger
			data-kala-component="tabs-trigger"
			ref={ref}
			data-slot="tabs-trigger"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			<span className="relative z-10 inline-flex items-center gap-1.5">
				{children}
			</span>
		</TabsPrimitive.Trigger>
	);
}
function TabsContent({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Content> & {
	slotStyles?: SlotStyles;
}) {
	const slotStyles = useSlotStyles("tabs", slotStylesRaw);
	const root = applySlot(
		cn(tabsContentStyles.base, className),
		slotStyles?.root,
	);
	return (
		<TabsPrimitive.Content
			data-kala-component="tabs-content"
			ref={ref}
			data-slot="tabs-content"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
