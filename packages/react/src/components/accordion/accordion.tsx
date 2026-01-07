"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";

const accordionVariants = cva("w-full", {
	variants: {
		variant: {
			default: "",
			bordered: "space-y-2",
			filled: "space-y-2",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const AccordionContext = React.createContext<
	VariantProps<typeof accordionVariants>
>({
	variant: "default",
});

function Accordion({
	className,
	variant,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> &
	VariantProps<typeof accordionVariants>) {
	return (
		<AccordionContext.Provider value={{ variant: variant || "default" }}>
			<AccordionPrimitive.Root
				data-slot="accordion"
				className={cn(accordionVariants({ variant }), className)}
				{...props}
			/>
		</AccordionContext.Provider>
	);
}

function AccordionItem({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
	const { variant } = React.useContext(AccordionContext);
	return (
		<AccordionPrimitive.Item
			data-slot="accordion-item"
			className={cn(
				"bg-card",
				variant === "default" && "border-b last:border-b-0",
				(variant === "bordered" || variant === "filled") &&
					"border rounded-md overflow-hidden",
				className,
			)}
			{...props}
		/>
	);
}

function AccordionTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
	const { variant } = React.useContext(AccordionContext);
	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				data-slot="accordion-trigger"
				className={cn(
					"flex flex-1 items-center justify-between gap-3 text-left font-semibold transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
					variant === "default" &&
						"py-4 text-base text-foreground hover:text-primary focus-visible:text-primary",
					variant === "bordered" &&
						"py-3.5 px-4 text-[15px] text-foreground hover:text-primary data-[state=open]:text-primary data-[state=open]:bg-accent focus-ring rounded-t-md",
					variant === "filled" &&
						"py-3.5 px-4 text-[15px] text-foreground hover:bg-accent data-[state=open]:bg-primary data-[state=open]:text-primary-foreground focus-ring",
					className,
				)}
				{...props}
			>
				{children}
				<ChevronDown className="pointer-events-none size-4 shrink-0 transition-all duration-200 opacity-80" />
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}

function AccordionContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
	const { variant } = React.useContext(AccordionContext);
	return (
		<AccordionPrimitive.Content
			data-slot="accordion-content"
			className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
			{...props}
		>
			<div
				className={cn(
					"text-sm text-foreground leading-relaxed",
					variant === "default" && "pb-4 pt-1",
					variant === "bordered" && "px-4 pb-4 pt-2",
					variant === "filled" && "px-4 pb-4 pt-2 bg-muted/50",
					className,
				)}
			>
				{children}
			</div>
		</AccordionPrimitive.Content>
	);
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
