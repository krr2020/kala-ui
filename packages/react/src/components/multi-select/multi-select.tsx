"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronsUpDown, X } from "lucide-react";
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
import { Checkbox } from "../checkbox";
import { Separator } from "../separator";

// ============================================================================
// MultiSelect
// ============================================================================

export interface MultiSelectOption {
	value: string;
	label: string;
	disabled?: boolean;
	icon?: React.ReactNode;
	group?: string;
}

export interface MultiSelectProps {
	/**
	 * Options to display
	 */
	options: MultiSelectOption[];
	/**
	 * Selected values (array)
	 */
	value?: string[];
	/**
	 * Callback when values change
	 */
	onValueChange?: (value: string[]) => void;
	/**
	 * Placeholder text when no values selected
	 * @default "Select options..."
	 */
	placeholder?: string;
	/**
	 * Placeholder for search input
	 * @default "Search..."
	 */
	searchPlaceholder?: string;
	/**
	 * Text when no results found
	 * @default "No results found."
	 */
	emptyText?: string;
	/**
	 * Maximum number of selections allowed
	 */
	maxSelected?: number;
	/**
	 * Disabled state
	 */
	disabled?: boolean;
	/**
	 * Additional CSS classes
	 */
	className?: string;
	/**
	 * Show "Select All" / "Clear All" actions
	 * @default true
	 * @deprecated Use showSelectAll and showClearAll instead
	 */
	showActions?: boolean;
	/**
	 * Show "Select All" action
	 * @default true
	 */
	showSelectAll?: boolean;
	/**
	 * Show "Clear All" action in the trigger
	 * @default true
	 */
	showClearAll?: boolean;
	/**
	 * Preserve the order of selection in the display
	 * @default false
	 */
	preserveSelectionOrder?: boolean;
	/**
	 * Maximum number of selected items to display.
	 * If selected items exceed this number, the rest will be hidden behind a "+X more" badge.
	 * @default 3
	 */
	maxVisibleSelections?: number;
	/**
	 * Show separators between options
	 * @default false
	 */
	showSeparators?: boolean;
	/**
	 * Match dropdown width to trigger width. When true, also wraps long text.
	 * @default true
	 */
	matchTriggerWidth?: boolean;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
	(
		{
			options,
			value = [],
			onValueChange,
			placeholder = "Select options...",
			searchPlaceholder = "Search...",
			emptyText = "No results found.",
			maxSelected,
			disabled = false,
			className,
			showActions = true,
			showSelectAll = showActions,
			showClearAll = showActions,
			preserveSelectionOrder = false,
			maxVisibleSelections = 3,
			showSeparators = false,
			matchTriggerWidth = true,
		},
		ref,
	) => {
		const [open, setOpen] = React.useState(false);
		const [search, setSearch] = React.useState("");

		// Group options
		const { groups, noGroup } = React.useMemo(() => {
			const groups: Record<string, MultiSelectOption[]> = {};
			const noGroup: MultiSelectOption[] = [];

			options.forEach((option) => {
				if (option.group) {
					if (!groups[option.group]) groups[option.group] = [];
					groups[option.group]?.push(option);
				} else {
					noGroup.push(option);
				}
			});

			return { groups, noGroup };
		}, [options]);

		const selectedOptions = React.useMemo(() => {
			if (preserveSelectionOrder) {
				return value
					.map((v) => options.find((o) => o.value === v))
					.filter((o): o is MultiSelectOption => !!o);
			}
			return options.filter((option) => value.includes(option.value));
		}, [value, options, preserveSelectionOrder]);

		const displayedOptions = React.useMemo(() => {
			if (
				maxVisibleSelections &&
				maxVisibleSelections > 0 &&
				selectedOptions.length > maxVisibleSelections
			) {
				return selectedOptions.slice(0, maxVisibleSelections);
			}
			return selectedOptions;
		}, [selectedOptions, maxVisibleSelections]);

		const remainingCount = selectedOptions.length - displayedOptions.length;

		const isMaxSelected = maxSelected ? value.length >= maxSelected : false;
		const availableOptions = options.filter((opt) => !opt.disabled);
		const isAllSelected =
			availableOptions.length > 0 &&
			availableOptions.every((opt) => value.includes(opt.value));
		const isIndeterminate =
			value.length > 0 &&
			!isAllSelected &&
			value.length < availableOptions.length;

		const handleSelect = (optionValue: string) => {
			const newValue = value.includes(optionValue)
				? value.filter((v) => v !== optionValue)
				: [...value, optionValue];
			onValueChange?.(newValue);
		};

		const handleRemove = (optionValue: string, e: React.MouseEvent) => {
			e.stopPropagation();
			onValueChange?.(value.filter((v) => v !== optionValue));
		};

		const handleSelectAll = () => {
			if (isAllSelected) {
				onValueChange?.([]);
			} else {
				const allValues = availableOptions.map((opt) => opt.value);
				onValueChange?.(allValues);
			}
		};

		const handleClearAll = (e: React.MouseEvent) => {
			e.stopPropagation();
			onValueChange?.([]);
		};

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
							"flex min-h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm transition-colors theme-input",
							"hover:bg-accent/50",
							"focus-ring",
							"disabled:cursor-not-allowed disabled:opacity-50",
							className,
						)}
					>
						<div className="flex flex-1 flex-wrap gap-1">
							{selectedOptions.length === 0 ? (
								<span className="text-muted-foreground">{placeholder}</span>
							) : (
								<>
									{displayedOptions.map((option) => (
										<span
											key={option.value}
											className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
										>
											{option.icon && (
												<span className="mr-1 flex size-3 items-center">
													{option.icon}
												</span>
											)}
											{option.label}
											<button
												type="button"
												onClick={(e) => handleRemove(option.value, e)}
												className="rounded-sm hover:bg-secondary-foreground/20"
												aria-label={`Remove ${option.label}`}
											>
												<X className="size-3" aria-hidden="true" />
											</button>
										</span>
									))}
									{remainingCount > 0 && (
										<span className="inline-flex items-center rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
											+{remainingCount} more
										</span>
									)}
								</>
							)}
						</div>
						<div className="flex items-center gap-1">
							{showClearAll && value.length > 0 && (
								<button
									type="button"
									onClick={handleClearAll}
									className="mr-1 rounded-sm opacity-50 hover:opacity-100"
									aria-label="Clear all"
								>
									<X className="size-4" />
								</button>
							)}
							<ChevronsUpDown
								className="size-4 shrink-0 opacity-50"
								aria-hidden="true"
							/>
						</div>
					</button>
				</PopoverPrimitive.Trigger>
				<PopoverPrimitive.Portal>
					<PopoverPrimitive.Content
						className="z-30 p-0"
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
							<CommandList>
								<CommandEmpty>{emptyText}</CommandEmpty>
								{showSelectAll && !maxSelected && (
									<CommandGroup className="sticky top-0 z-10 bg-popover p-0 theme-card">
										<CommandItem
											onSelect={handleSelectAll}
											className="cursor-pointer rounded-none border-b py-2"
										>
											<Checkbox
												checked={
													isAllSelected
														? true
														: isIndeterminate
															? "indeterminate"
															: false
												}
												className="mr-2 pointer-events-none"
											/>
											Select All
										</CommandItem>
									</CommandGroup>
								)}
								{noGroup.length > 0 && (
									<CommandGroup>
										{noGroup.map((option, index) => {
											const isSelected = value.includes(option.value);
											const isDisabled =
												option.disabled || (isMaxSelected && !isSelected);
											return (
												<React.Fragment key={option.value}>
													{showSeparators && index > 0 && (
														<Separator className="my-1" />
													)}
													<CommandItem
														value={option.label}
														disabled={isDisabled}
														onSelect={() => handleSelect(option.value)}
													>
														<Checkbox
															checked={isSelected}
															className="mr-2 pointer-events-none"
														/>
														{option.icon && (
															<span className="mr-2 flex size-4 items-center text-muted-foreground">
																{option.icon}
															</span>
														)}
														<span
															className={cn(!matchTriggerWidth && "truncate")}
														>
															{option.label}
														</span>
													</CommandItem>
												</React.Fragment>
											);
										})}
									</CommandGroup>
								)}

								{Object.entries(groups).map(([groupName, groupOptions]) => (
									<CommandGroup key={groupName} heading={groupName}>
										{groupOptions.map((option, index) => {
											const isSelected = value.includes(option.value);
											const isDisabled =
												option.disabled || (isMaxSelected && !isSelected);
											return (
												<React.Fragment key={option.value}>
													{showSeparators && index > 0 && (
														<Separator className="my-1" />
													)}
													<CommandItem
														value={option.label}
														disabled={isDisabled}
														onSelect={() => handleSelect(option.value)}
													>
														<Checkbox
															checked={isSelected}
															className="mr-2 pointer-events-none"
														/>
														{option.icon && (
															<span className="mr-2 flex size-4 items-center text-muted-foreground">
																{option.icon}
															</span>
														)}
														<span
															className={cn(!matchTriggerWidth && "truncate")}
														>
															{option.label}
														</span>
													</CommandItem>
												</React.Fragment>
											);
										})}
									</CommandGroup>
								))}
							</CommandList>
						</Command>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Root>
		);
	},
);
MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
