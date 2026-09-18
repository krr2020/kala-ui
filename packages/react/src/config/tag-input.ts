/** TagInput styles — per-part base classes keyed by slotStyles part name. */
export const tagInputStyles = {
	root: "flex min-h-[2.5rem] w-full flex-wrap gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm kala-surface-input",
	remove: "ml-0.5 rounded-sm p-0.5 hover:bg-muted-foreground/20",
	clear: "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm",
} as const;
