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
import { cn } from "../../lib/utils";

const TabsContext = React.createContext<{
	activeTab?: string | undefined;
	setActiveTab: (value: string) => void;
	uniqueId: string;
} | null>(null);

function Tabs({
	ref,
	className,
	value,
	onValueChange,
	defaultValue,
	orientation = "horizontal",
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
	const uniqueId = React.useId();
	const [activeTab, setActiveTab] = useUncontrolled({
		value,
		defaultValue,
		onChange: onValueChange,
	});

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
				className={cn(
					"flex",
					orientation === "vertical" ? "flex-row gap-6" : "flex-col",
					className,
				)}
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
	variant = "default",
	align,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
	VariantProps<typeof tabsListVariants>) {
	return (
		<TabsListContext.Provider
			data-kala-component="tabs-list"
			value={{ variant }}
		>
			<TabsPrimitive.List
				ref={ref}
				data-slot="tabs-list"
				className={cn(tabsListVariants({ variant, align }), className)}
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
	variant,
	children,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> &
	VariantProps<typeof tabsTriggerVariants>) {
	const { variant: listVariant } = React.useContext(TabsListContext);
	const finalVariant = variant || listVariant || "default";

	return (
		<TabsPrimitive.Trigger
			data-kala-component="tabs-trigger"
			ref={ref}
			data-slot="tabs-trigger"
			className={cn(tabsTriggerVariants({ variant: finalVariant }), className)}
			{...props}
		>
			<span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
		</TabsPrimitive.Trigger>
	);
}
function TabsContent({
	ref,
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return (
		<TabsPrimitive.Content
			data-kala-component="tabs-content"
			ref={ref}
			data-slot="tabs-content"
			className={cn(tabsContentStyles.base, className)}
			{...props}
		/>
	);
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
