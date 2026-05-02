"use client";

import { useDisclosure } from "@kala-ui/react-hooks";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "../../primitives/command";
import { Button } from "../button";
import { Text } from "../text";

export interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface ComboboxProps {
	options: ComboboxOption[];
	value?: string;
	onValueChange?: (value: string) => void;
	/** @default "Select option..." */
	placeholder?: string;
	/** @default "Search..." */
	searchPlaceholder?: string;
	/** @default "No results found." */
	emptyText?: string;
	disabled?: boolean;
	className?: string;
	/** @default "default" */
	size?: "sm" | "default";
	/** @default true */
	matchTriggerWidth?: boolean;
	/** Show a clear button when a value is selected. @default false */
	clearable?: boolean;
	/**
	 * Called on every search input change. When provided, internal client-side
	 * filtering is disabled (use for server-side / async search).
	 */
	onSearchChange?: (search: string) => void;
	/**
	 * Label to show in the trigger for the selected value when it may not be
	 * present in the current options array (e.g. async search).
	 */
	selectedLabel?: string;
	/**
	 * Custom renderer for each option row. Receives the option and a boolean
	 * indicating whether it is currently selected.
	 */
	renderOption?: (option: ComboboxOption, selected: boolean) => React.ReactNode;
	/** Draw a separator line between each option. @default false */
	separateOptions?: boolean;
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
			clearable = false,
			onSearchChange,
			selectedLabel,
			renderOption,
			separateOptions = false,
		},
		ref,
	) => {
		const [open, { set: setOpen }] = useDisclosure(false);
		const [search, setSearch] = React.useState("");

		const isAsync = Boolean(onSearchChange);
		const selectedOption = options.find((o) => o.value === value);
		const displayLabel = selectedOption?.label ?? selectedLabel ?? placeholder;

		// In async mode, suppress stale options when the search input is empty
		// so that reopening always shows a clean state instead of previous results.
		const visibleOptions = isAsync && search.length === 0 ? [] : options;

		const handleSearchChange = (val: string) => {
			setSearch(val);
			onSearchChange?.(val);
		};

		const handleOpenChange = (next: boolean) => {
			setOpen(next);
			if (!next) {
				setSearch("");
				onSearchChange?.("");
			}
		};

		const handleClear = (e: React.MouseEvent) => {
			e.stopPropagation();
			onValueChange?.("");
		};

		return (
			<PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
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
							className={cn(
								"truncate",
								matchTriggerWidth && "flex-1 text-left",
							)}
						>
							{value ? displayLabel : placeholder}
						</Text>
						<span className="ml-2 flex items-center gap-1 shrink-0">
							{clearable && value && (
								<button
									type="button"
									aria-label="Clear selection"
									onClick={handleClear}
									className="opacity-50 hover:opacity-100 rounded-sm hover:bg-accent p-0.5"
								>
									<X className="size-3" />
								</button>
							)}
							<ChevronsUpDown className="size-4 opacity-50" />
						</span>
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
							shouldFilter={isAsync ? false : undefined}
							filter={
								isAsync
									? undefined
									: (itemValue, search) => {
											const option = options.find((o) => o.value === itemValue);
											const label = option?.label ?? "";
											const q = search.toLowerCase();
											return itemValue.toLowerCase().includes(q) ||
												label.toLowerCase().includes(q)
												? 1
												: 0;
										}
							}
						>
							<CommandInput
								placeholder={searchPlaceholder}
								value={search}
								onValueChange={handleSearchChange}
							/>
							<CommandList className="max-h-[300px] overflow-y-auto scrollbar-hide">
								<CommandEmpty>{emptyText}</CommandEmpty>
								<CommandGroup>
									{visibleOptions.map((option, index) => (
										<React.Fragment key={option.value}>
											<CommandItem
												value={option.value}
												disabled={option.disabled ?? false}
												onSelect={() => {
													onValueChange?.(
														option.value === value ? "" : option.value,
													);
													handleOpenChange(false);
												}}
												className={renderOption ? "py-2" : undefined}
											>
												{renderOption ? (
													renderOption(option, value === option.value)
												) : (
													<>
														<Check
															className={cn(
																"mr-2 size-4",
																value === option.value
																	? "opacity-100"
																	: "opacity-0",
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
													</>
												)}
											</CommandItem>
											{separateOptions && index < visibleOptions.length - 1 && (
												<CommandSeparator />
											)}
										</React.Fragment>
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
