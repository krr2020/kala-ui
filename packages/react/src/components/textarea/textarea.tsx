import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import type { TextareaProps } from "./textarea.types";

function Textarea({
	className,
	isLoading = false,
	rows,
	...props
}: TextareaProps) {
	if (isLoading) {
		return (
			<Skeleton
				className={cn("min-h-[80px] w-full rounded-md", className)}
				style={{ height: rows ? `${rows * 1.5}rem` : undefined }}
			/>
		);
	}

	return (
		<textarea
			data-slot="textarea"
			rows={rows}
			className={cn(
				"cursor-text flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 theme-input",
				"focus-ring",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
