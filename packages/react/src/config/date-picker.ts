/**
 * DatePicker styles — per-part base classes keyed by slotStyles part name.
 * `trigger`/`triggerRange` compose over Button's outline variant; the picker
 * surfaces are PopoverContent composition.
 */
export const datePickerStyles = {
	trigger: "w-[280px] justify-start text-left font-normal",
	triggerRange: "w-[300px] justify-start text-left font-normal",
	icon: "mr-2 h-4 w-4",
	content: "w-auto p-0",
} as const;
