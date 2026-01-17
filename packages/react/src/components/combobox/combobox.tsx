"use client";

import { useDisclosure } from "@kala-ui/react-hooks";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../../primitives/command";
import { Button } from "../button";
import { Text } from "../text";

// ============================================================================
// Combobox
// ============================================================================

export interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface ComboboxProps {
	/**
	 * Options to display in the combobox
	 */
	options: ComboboxOption[];
	/**
	 * Selected value
	 */
	value?: string;
	/**
	 * Callback when value changes
	 */
	onValueChange?: (value: string) => void;
	/**
	 * Placeholder text when no value is selected
	 * @default "Select option..."
	 */
	placeholder?: string;
	/**
	 * Placeholder text for search input
	 * @default "Search..."
	 */
	searchPlaceholder?: string;
	/**
	 * Text to show when no results found
	 * @default "No results found."
	 */
	emptyText?: string;
	/**
	 * Disabled state
	 */
	disabled?: boolean;
	/**
	 * Additional CSS classes for trigger button
	 */
	className?: string;
	/**
	 * Size variant
	 * @default "default"
	 */
	size?: "sm" | "default";
	/**
	 * Match dropdown width to trigger width. When true, also wraps long text.
	 * @default true
	 */
	matchTriggerWidth?: boolean;
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
	(
		{
			options,
			value,
			onValueChange,
			placeholder = "Select option...",
			searchPlaceholder = "Search...",
			emptyText = "No results found.",
			disabled = false,
			className,
			size = "default",
			matchTriggerWidth = true,
		},
		ref,
	) => {
		const [open, { set: setOpen }] = useDisclosure(false);
		const [search, setSearch] = React.useState("");

		const selectedOption = options.find((option) => option.value === value);

		return (
			<PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
				<PopoverPrimitive.Trigger asChild>
					<Button
						ref={ref}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						disabled={disabled}
						className={cn(
							"w-full justify-between font-normal",
							size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4",
							!value && "text-muted-foreground",
							className,
						)}
					>
						<Text
							className={cn("truncate", matchTriggerWidth && "flex-1 text-left")}
						>
							{selectedOption ? selectedOption.label : placeholder}
						</Text>
						<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
					</Button>
				</PopoverPrimitive.Trigger>
				<PopoverPrimitive.Portal>
					<PopoverPrimitive.Content
						className="p-0 z-30"
						align="start"
						sideOffset={4}
						style={
							matchTriggerWidth
								? { width: "var(--radix-popover-trigger-width)" }
								: undefined
						}
					>
						<Command
							className={cn(
								"rounded-lg border bg-popover text-popover-foreground theme-dropdown",
								matchTriggerWidth ? "w-full" : "min-w-[200px]",
							)}
							filter={(value, search) => {
								const option = options.find((opt) => opt.value === value);
								const label = option?.label ?? "";
								const searchLower = search.toLowerCase();
								if (
									value.toLowerCase().includes(searchLower) ||
									label.toLowerCase().includes(searchLower)
								) {
									return 1;
								}
								return 0;
							}}
						>
							<CommandInput
								placeholder={searchPlaceholder}
								value={search}
								onValueChange={setSearch}
							/>
							<CommandList className="max-h-[300px] overflow-y-auto scrollbar-hide">
								<CommandEmpty>{emptyText}</CommandEmpty>
								<CommandGroup>
									{options.map((option) => (
										<CommandItem
											key={option.value}
											value={option.value}
											disabled={option.disabled ?? false}
											onSelect={() => {
												const newValue =
													option.value === value ? "" : option.value;
												onValueChange?.(newValue);
												setOpen(false);
												setSearch("");
											}}
										>
											<Check
												className={cn(
													"mr-2 size-4",
													value === option.value ? "opacity-100" : "opacity-0",
												)}
												aria-hidden="true"
											/>
											<Text
												className={cn(
													!matchTriggerWidth && "truncate",
													"text-foreground",
												)}
											>
												{option.label}
											</Text>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Root>
		);
	},
);
Combobox.displayName = "Combobox";

export { Combobox };
