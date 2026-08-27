"use client";

import { useDisclosure, useUncontrolled } from "@kala-ui/react-hooks";
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
import type { ComboboxProps } from "./combobox.types";

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
	(
		{
			options,
			value,
			defaultValue,
			onValueChange,
			placeholder = "Select option...",
			searchPlaceholder = "Search...",
			emptyText = "No results found.",
			disabled = false,
			className,
			size = "md",
			matchTriggerWidth = true,
			clearable = false,
			onSearchChange,
			selectedLabel,
			renderOption,
			separateOptions = false,
			"aria-label": ariaLabel,
		},
		ref,
	) => {
		const [open, { set: setOpen }] = useDisclosure(false);
		const [internalValue, setInternalValue] = useUncontrolled<string>({
			value,
			defaultValue,
			onChange: onValueChange,
		});
		const [search, setSearch] = React.useState("");

		const isAsync = Boolean(onSearchChange);
		const selectedOption = options.find((o) => o.value === internalValue);
		const displayLabel = selectedOption?.label ?? selectedLabel ?? placeholder;

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

		const handleClear = () => {
			setInternalValue("");
		};

		return (
			<PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
				<div className="relative w-full">
					<PopoverPrimitive.Trigger asChild>
						<Button
							ref={ref}
							variant="outline"
							role="combobox"
							aria-expanded={open}
							aria-label={ariaLabel ?? placeholder}
							disabled={disabled}
							className={cn(
								"w-full justify-between font-normal overflow-hidden",
								size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4",
								!internalValue && "text-muted-foreground",
								clearable && internalValue && "pr-16",
								className,
							)}
						>
							<Text
								className={cn(
									"truncate min-w-0",
									matchTriggerWidth && "flex-1 text-left",
								)}
							>
								{internalValue ? displayLabel : placeholder}
							</Text>
							<ChevronsUpDown
								className="size-4 opacity-50 shrink-0"
								aria-hidden="true"
							/>
						</Button>
					</PopoverPrimitive.Trigger>
					{clearable && internalValue && !disabled && (
						<button
							type="button"
							aria-label="Clear selection"
							onClick={(e) => {
								// sibling of the trigger, but stop bubbling for overlay layouts
								e.stopPropagation();
								handleClear();
							}}
							className="kala-touch absolute inset-y-0 right-8 my-auto flex h-6 w-6 items-center justify-center rounded-sm opacity-50 hover:opacity-100 hover:bg-accent cursor-pointer outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
						>
							<X className="size-3" aria-hidden="true" />
						</button>
					)}
				</div>
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
								"rounded-lg border bg-popover text-popover-foreground kala-surface-popover",
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
							<CommandList
								className="max-h-[300px] overflow-y-auto"
								onWheel={(e) => e.stopPropagation()}
							>
								<CommandEmpty>{emptyText}</CommandEmpty>
								<CommandGroup>
									{visibleOptions.map((option, index) => (
										<React.Fragment key={option.value}>
											<CommandItem
												value={option.value}
												disabled={option.disabled ?? false}
												onSelect={() => {
													setInternalValue(
														option.value === internalValue ? "" : option.value,
													);
													handleOpenChange(false);
												}}
												className={renderOption ? "py-2" : undefined}
											>
												{renderOption ? (
													renderOption(option, internalValue === option.value)
												) : (
													<>
														<Check
															className={cn(
																"mr-2 size-4",
																internalValue === option.value
																	? "opacity-100"
																	: "opacity-0",
															)}
															aria-hidden="true"
														/>
														<Text
															className={cn(
																!matchTriggerWidth && "truncate min-w-0",
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
