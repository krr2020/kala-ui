import { cn } from "../../lib/utils";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { Skeleton } from "../skeleton";
import type { TextareaProps } from "./textarea.types";

function Textarea({
	className,
	style,
	slotStyles,
	isLoading = false,
	rows,
	ref,
	...props
}: TextareaProps & { slotStyles?: SlotStyles }) {
	if (isLoading) {
		const skel = applySlot(
			cn("min-h-[80px] w-full rounded-md", className),
			slotStyles?.root,
		);
		return (
			<Skeleton
				data-kala-component="textarea"
				className={skel.className}
				style={mergeStyle(
					{ height: rows ? `${rows * 1.5}rem` : undefined },
					skel.style,
				)}
			/>
		);
	}

	const root = applySlot(
		cn(
			"cursor-text flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 kala-surface-input",
			"kala-focus-ring",
			className,
		),
		slotStyles?.root,
	);
	return (
		<textarea
			data-kala-component="textarea"
			ref={ref}
			data-slot="textarea"
			rows={rows}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

export { Textarea };
