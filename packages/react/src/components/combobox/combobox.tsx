"use client";

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
		const [open, setOpen] = React.useState(false);
		const [search, setSearch] = React.useState("");

		const selectedOption = options.find((option) => option.value === value);

		return (
			<PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
				<PopoverPrimitive.Trigger asChild>
					<button
						ref={ref}
						type="button"
						role="combobox"
						aria-expanded={open}
						aria-disabled={disabled}
						disabled={disabled}
						className={cn(
							"flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm transition-colors theme-input",
							"hover:bg-accent hover:text-accent-foreground",
							"focus-ring",
							"disabled:pointer-events-none disabled:opacity-50",
							{
								"h-8 px-2 py-1 text-xs": size === "sm",
								"h-10": size === "default",
							},
							className,
						)}
					>
						<span
							className={cn(
								"truncate",
								!selectedOption && "text-muted-foreground",
							)}
						>
							{selectedOption ? selectedOption.label : placeholder}
						</span>
						<ChevronsUpDown
							className="ml-2 size-4 shrink-0 opacity-50"
							aria-hidden="true"
						/>
					</button>
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
											value={option.label}
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
											<span
												className={cn(
													!matchTriggerWidth && "truncate",
													"text-foreground",
												)}
											>
												{option.label}
											</span>
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

export {
	Combobox,
};
