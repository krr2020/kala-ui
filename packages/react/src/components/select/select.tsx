"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "../icons";
import { useEffect, useRef } from "react";
import type * as React from "react";
import {
	selectChevronStyles,
	selectContentStyles,
	selectItemIndicatorStyles,
	selectItemStyles,
	selectLabelStyles,
	selectScrollButtonStyles,
	selectSeparatorStyles,
	selectTriggerStyles,
} from "../../config/select";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { IconComponent } from "../icons";
import { useSlotStyles } from "../kala-provider";
import { Skeleton } from "../skeleton";
import type {
	SelectContentProps,
	SelectItemProps,
	SelectTriggerProps,
} from "./select.types";

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
	return <SelectPrimitive.Root data-kala-component="select" {...props} />;
}

function SelectGroup({
	ref,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
	return (
		<SelectPrimitive.Group
			data-kala-component="select-group"
			ref={ref}
			{...props}
		/>
	);
}
function SelectValue({
	ref,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
	return (
		<SelectPrimitive.Value
			data-kala-component="select-value"
			ref={ref}
			{...props}
		/>
	);
}

import { cva } from "class-variance-authority";

const selectTriggerClasses = cva(selectTriggerStyles.base, {
	variants: selectTriggerStyles.variants,
	defaultVariants: selectTriggerStyles.defaultVariants,
});

function SelectTrigger({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	size = "md",
	isLoading = false,
	chevronIcon: Chevron = ChevronDown,
	children,
	...props
}: SelectTriggerProps) {
	const slotStyles = useSlotStyles("select", slotStylesRaw);
	const wasOpenAtPointerDown = useRef(false);
	const suppressForwardedOpen = useRef(false);
	const triggerRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		const armOnOutsidePress = (event: PointerEvent) => {
			const el = triggerRef.current;
			const target = event.target;
			if (
				el?.dataset.state === "open" &&
				target instanceof Element &&
				!el.contains(target) &&
				!target.closest('[data-slot="select-content"]')
			) {
				suppressForwardedOpen.current = true;
			}
		};
		document.addEventListener("pointerdown", armOnOutsidePress, true);
		return () =>
			document.removeEventListener("pointerdown", armOnOutsidePress, true);
	}, []);

	const setTriggerRef = (node: HTMLButtonElement | null) => {
		triggerRef.current = node;
		if (typeof ref === "function") {
			ref(node);
		} else if (ref) {
			ref.current = node;
		}
	};
	const root = applySlot(
		cn(selectTriggerClasses({ size }), className),
		slotStyles?.root ?? null,
	);
	if (isLoading) {
		return (
			<Skeleton
				data-kala-component="select-trigger"
				style={mergeStyle(style, root.style)}
				className={root.className}
			/>
		);
	}

	const chevron = applySlot(selectChevronStyles.base, slotStyles?.chevron);
	return (
		<SelectPrimitive.Trigger
			data-kala-component="select-trigger"
			ref={setTriggerRef}
			data-slot="select-trigger"
			data-size={size}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
			onPointerDown={(event) => {
				props.onPointerDown?.(event);
				wasOpenAtPointerDown.current = false;
				suppressForwardedOpen.current = false;
				// Radix re-opens on the same pointerdown that dismisses the content — swallow it so clicking an open trigger just closes
				if (
					event.button === 0 &&
					!event.ctrlKey &&
					event.currentTarget.dataset.state === "open"
				) {
					wasOpenAtPointerDown.current = true;
					event.preventDefault();
				}
			}}
			onClick={(event) => {
				props.onClick?.(event);
				// Label taps forward a synthetic click (detail 0) after the press already dismissed the content — swallow it too
				const forwardedFromLabel =
					suppressForwardedOpen.current && event.detail === 0;
				if (wasOpenAtPointerDown.current || forwardedFromLabel) {
					wasOpenAtPointerDown.current = false;
					suppressForwardedOpen.current = false;
					event.preventDefault();
					return;
				}
				suppressForwardedOpen.current = false;
			}}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<Chevron
					className={chevron.className}
					style={chevron.style}
					aria-hidden="true"
				/>
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}
function SelectScrollUpButton({
	ref,
	className,
	scrollUpIcon: ScrollUpIcon = ChevronUp,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton> & {
	/** Scroll-up glyph — any `{className, size}` icon component; defaults to kala's built-in chevron. */
	scrollUpIcon?: IconComponent;
}) {
	return (
		<SelectPrimitive.ScrollUpButton
			data-kala-component="select-scroll-up-button"
			ref={ref}
			data-slot="select-scroll-up-button"
			className={cn(selectScrollButtonStyles.base, className)}
			{...props}
		>
			<ScrollUpIcon className="size-4" aria-hidden="true" />
		</SelectPrimitive.ScrollUpButton>
	);
}
function SelectScrollDownButton({
	ref,
	className,
	scrollDownIcon: ScrollDownIcon = ChevronDown,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton> & {
	/** Scroll-down glyph — any `{className, size}` icon component; defaults to kala's built-in chevron. */
	scrollDownIcon?: IconComponent;
}) {
	return (
		<SelectPrimitive.ScrollDownButton
			data-kala-component="select-scroll-down-button"
			ref={ref}
			data-slot="select-scroll-down-button"
			className={cn(selectScrollButtonStyles.base, className)}
			{...props}
		>
			<ScrollDownIcon className="size-4" aria-hidden="true" />
		</SelectPrimitive.ScrollDownButton>
	);
}
SelectScrollDownButton.displayName =
	SelectPrimitive.ScrollDownButton.displayName;

function SelectContent({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	children,
	position = "popper",
	align = "center",
	matchTriggerWidth = false,
	...props
}: SelectContentProps) {
	const slotStyles = useSlotStyles("select", slotStylesRaw);
	const root = applySlot(
		cn(
			selectContentStyles.base,
			matchTriggerWidth ? "w-(--radix-select-trigger-width)" : "min-w-[8rem]",
			position === "popper" && selectContentStyles.popper,
			className,
		),
		slotStyles?.root,
	);
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				ref={ref}
				data-kala-component="select-content"
				data-slot="select-content"
				className={root.className}
				style={mergeStyle(style, root.style)}
				position={position}
				align={align}
				{...props}
			>
				<SelectScrollUpButton />
				<SelectPrimitive.Viewport
					className={cn(
						"p-1",
						position === "popper" &&
							`${selectContentStyles.viewportPopper} ${matchTriggerWidth ? "max-w-(--radix-select-trigger-width)" : "min-w-(--radix-select-trigger-width)"}`,
					)}
				>
					{children}
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
}
function SelectLabel({
	ref,
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
	return (
		<SelectPrimitive.Label
			data-kala-component="select-label"
			ref={ref}
			data-slot="select-label"
			className={cn(selectLabelStyles.base, className)}
			{...props}
		/>
	);
}
function SelectItem({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	checkIcon: CheckIcon = Check,
	children,
	...props
}: SelectItemProps) {
	const slotStyles = useSlotStyles("select", slotStylesRaw);
	const root = applySlot(
		cn(selectItemStyles.base, className),
		slotStyles?.root,
	);
	const itemIndicator = applySlot(
		selectItemIndicatorStyles.base,
		slotStyles?.itemIndicator,
	);
	return (
		<SelectPrimitive.Item
			data-kala-component="select-item"
			ref={ref}
			data-slot="select-item"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			<span className="absolute right-2 flex size-3.5 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<CheckIcon
						className={itemIndicator.className}
						style={itemIndicator.style}
						aria-hidden="true"
					/>
				</SelectPrimitive.ItemIndicator>
			</span>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}
function SelectSeparator({
	ref,
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
	return (
		<SelectPrimitive.Separator
			data-kala-component="select-separator"
			ref={ref}
			data-slot="select-separator"
			className={cn(selectSeparatorStyles.base, className)}
			{...props}
		/>
	);
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
