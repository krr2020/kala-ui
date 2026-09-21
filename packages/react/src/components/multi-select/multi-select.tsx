"use client";

import { useUncontrolled } from "@kala-ui/react-hooks";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

import { multiSelectStyles } from "../../config/multi-select";
import { cn } from "../../lib/utils";
import { type SlotStyles, applySlot, mergeStyle } from "../../lib/slot-styles";
import { Checkbox } from "../checkbox";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../command";
import { Separator } from "../separator";

export interface MultiSelectOption {
	value: string;
	label: string;
	disabled?: boolean;
	icon?: React.ReactNode;
	group?: string;
}

export interface MultiSelectProps {
	ref?: React.Ref<HTMLButtonElement>;
	/**
	 * Options to display
	 */
	options: MultiSelectOption[];
	/**
	 * Selected values (controlled)
	 */
	value?: string[];
	/**
	 * Initially selected values (uncontrolled)
	 */
	defaultValue?: string[];
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
	/**
	 * Inline styles for the trigger wrapper
	 */
	style?: React.CSSProperties;
	/**
	 * Overrides for the multi-select parts
	 */
	slotStyles?: SlotStyles;
}

function MultiSelect({
	ref,
	options,
	value,
	defaultValue,
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
	style,
	slotStyles,
}: MultiSelectProps) {
	const [selected, setSelected] = useUncontrolled<string[]>({
		value,
		defaultValue: defaultValue ?? [],
		onChange: onValueChange,
	});
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
			return selected
				.map((v) => options.find((o) => o.value === v))
				.filter((o): o is MultiSelectOption => !!o);
		}
		return options.filter((option) => selected.includes(option.value));
	}, [selected, options, preserveSelectionOrder]);

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

	const isMaxSelected = maxSelected ? selected.length >= maxSelected : false;
	const availableOptions = options.filter((opt) => !opt.disabled);
	const isAllSelected =
		availableOptions.length > 0 &&
		availableOptions.every((opt) => selected.includes(opt.value));
	const isIndeterminate =
		selected.length > 0 &&
		!isAllSelected &&
		selected.length < availableOptions.length;

	const handleSelect = (optionValue: string) => {
		const newValue = selected.includes(optionValue)
			? selected.filter((v) => v !== optionValue)
			: [...selected, optionValue];
		setSelected(newValue);
	};

	const handleRemove = (optionValue: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setSelected(selected.filter((v) => v !== optionValue));
	};

	const handleSelectAll = () => {
		if (isAllSelected) {
			setSelected([]);
		} else {
			const allValues = availableOptions.map((opt) => opt.value);
			setSelected(allValues);
		}
	};

	const handleClearAll = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelected([]);
	};

	const triggerLabel = selectedOptions.length
		? `Options selected: ${selectedOptions.map((o) => o.label).join(", ")}`
		: placeholder;

	// Stale search from a previous session must not leak into the next open.
	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
		if (!nextOpen) {
			setSearch("");
		}
	};

	const s = multiSelectStyles;
	const root = applySlot(
		cn(
			s.root,
			!disabled && s.rootHover,
			disabled && s.rootDisabled,
			className,
		),
		slotStyles?.root,
	);
	const trigger = applySlot(s.trigger, slotStyles?.trigger);
	const chipsContainer = applySlot(s.chipsContainer, slotStyles?.chipsContainer);
	const placeholderSlot = applySlot(s.placeholder, slotStyles?.placeholder);
	const chip = applySlot(s.chip, slotStyles?.chip);
	const chipIcon = applySlot(s.chipIcon, slotStyles?.chipIcon);
	const chipRemove = applySlot(s.chipRemove, slotStyles?.chipRemove);
	const chipRemoveIcon = applySlot(s.chipRemoveIcon, slotStyles?.chipRemoveIcon);
	const overflowChip = applySlot(s.overflowChip, slotStyles?.overflowChip);
	const controls = applySlot(s.controls, slotStyles?.controls);
	const clearAll = applySlot(s.clearAll, slotStyles?.clearAll);
	const clearAllIcon = applySlot(s.clearAllIcon, slotStyles?.clearAllIcon);
	const chevron = applySlot(s.chevron, slotStyles?.chevron);
	const popoverContent = applySlot(s.popoverContent, slotStyles?.popoverContent);
	const command = applySlot(
		cn(s.command, matchTriggerWidth ? s.commandMatched : s.commandFluid),
		slotStyles?.command,
	);
	const groupHeader = applySlot(s.groupHeader, slotStyles?.groupHeader);
	const groupHeaderItem = applySlot(
		s.groupHeaderItem,
		slotStyles?.groupHeaderItem,
	);
	const checkbox = applySlot(s.checkbox, slotStyles?.checkbox);
	const separator = applySlot(s.separator, slotStyles?.separator);
	const optionIcon = applySlot(s.optionIcon, slotStyles?.optionIcon);

	const renderOption = (option: MultiSelectOption, index: number) => {
		const isSelected = selected.includes(option.value);
		const isDisabled = option.disabled || (isMaxSelected && !isSelected);
		return (
			<React.Fragment key={option.value}>
				{showSeparators && index > 0 && (
					<Separator
						className={separator.className}
						style={separator.style}
					/>
				)}
				<CommandItem
						value={option.label}
						disabled={isDisabled}
						onSelect={() => handleSelect(option.value)}
					>
					<Checkbox
							checked={isSelected}
							className={checkbox.className}
							style={checkbox.style}
						/>
					{option.icon && (
						<span
							className={optionIcon.className}
							style={optionIcon.style}
						>
							{option.icon}
						</span>
					)}
					<span className={cn(!matchTriggerWidth && s.truncate)}>
						{option.label}
					</span>
				</CommandItem>
			</React.Fragment>
		);
	};

	return (
		<PopoverPrimitive.Root
			data-kala-component="multi-select"
			open={open}
			onOpenChange={handleOpenChange}
		>
			<div
				data-kala-component="multi-select"
				data-slot="multi-select"
				className={root.className}
				style={mergeStyle(style, root.style)}
			>
				<PopoverPrimitive.Trigger asChild>
					<button
						ref={ref}
						type="button"
						role="combobox"
						aria-expanded={open}
						aria-label={triggerLabel}
						disabled={disabled}
						className={trigger.className}
						style={trigger.style}
					/>
				</PopoverPrimitive.Trigger>
				<div className={chipsContainer.className} style={chipsContainer.style}>
					{selectedOptions.length === 0 ? (
						<span
							className={placeholderSlot.className}
							style={placeholderSlot.style}
						>
							{placeholder}
						</span>
					) : (
						<>
							{displayedOptions.map((option) => (
								<span
									key={option.value}
									className={chip.className}
									style={chip.style}
								>
									{option.icon && (
										<span
											className={chipIcon.className}
											style={chipIcon.style}
										>
											{option.icon}
										</span>
									)}
									{option.label}
									{!disabled && (
										<button
											type="button"
											onClick={(e) => handleRemove(option.value, e)}
											className={chipRemove.className}
											style={chipRemove.style}
											aria-label={`Remove ${option.label}`}
										>
											<X
												className={chipRemoveIcon.className}
												style={chipRemoveIcon.style}
												aria-hidden="true"
											/>
										</button>
									)}
								</span>
							))}
							{remainingCount > 0 && (
								<span
									className={overflowChip.className}
									style={overflowChip.style}
								>
									+{remainingCount} more
								</span>
							)}
						</>
					)}
				</div>
				<div className={controls.className} style={controls.style}>
					{showClearAll && selected.length > 0 && !disabled && (
						<button
							type="button"
							onClick={handleClearAll}
							className={clearAll.className}
							style={clearAll.style}
							aria-label="Clear all"
						>
							<X
								className={clearAllIcon.className}
								style={clearAllIcon.style}
								aria-hidden="true"
							/>
						</button>
					)}
					<ChevronsUpDown
						className={chevron.className}
						style={chevron.style}
						aria-hidden="true"
					/>
				</div>
			</div>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					className={popoverContent.className}
					style={mergeStyle(
						matchTriggerWidth
							? { width: "var(--radix-popover-trigger-width)" }
							: undefined,
						popoverContent.style,
					)}
					align="start"
					sideOffset={4}
				>
					<Command className={command.className} style={command.style}>
						<CommandInput
							placeholder={searchPlaceholder}
							value={search}
							onValueChange={setSearch}
						/>
						<CommandList>
							<CommandEmpty>{emptyText}</CommandEmpty>
							{showSelectAll && !maxSelected && (
								<CommandGroup
									className={groupHeader.className}
									style={groupHeader.style}
								>
									<CommandItem
										onSelect={handleSelectAll}
										className={groupHeaderItem.className}
										style={groupHeaderItem.style}
									>
										<Checkbox
											checked={
												isAllSelected
													? true
													: isIndeterminate
														? "indeterminate"
														: false
												}
											className={checkbox.className}
											style={checkbox.style}
										/>
										Select All
									</CommandItem>
								</CommandGroup>
							)}
							{noGroup.length > 0 && (
								<CommandGroup>
							{noGroup.map(renderOption)}
								</CommandGroup>
							)}

							{Object.entries(groups).map(([groupName, groupOptions]) => (
								<CommandGroup key={groupName} heading={groupName}>
							{groupOptions.map(renderOption)}
								</CommandGroup>
							))}
						</CommandList>
					</Command>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Root>
	);
}

export { MultiSelect };
