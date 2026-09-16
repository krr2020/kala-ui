export const inputStyles = {
	base: "cursor-text flex h-[var(--kala-control-h)] w-full rounded-[var(--kala-radius-input,var(--kala-radius-control))] border bg-card px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 kala-focus-ring kala-surface-input",
	file: "file:mr-3 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-xs file:font-medium file:bg-muted file:text-muted-foreground hover:file:bg-accent",
	error: "border-destructive kala-focus-ring-destructive",
	success: "border-success kala-focus-ring-success",
};
