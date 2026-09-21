import { cva } from "class-variance-authority";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { KbdProps } from "./kbd.types";

export const kbdVariants = cva(
	"inline-flex items-center justify-center font-mono font-medium rounded border border-b-2 bg-muted text-muted-foreground shadow-sm select-none",
	{
		variants: {
			size: {
				sm: "text-[10px] px-1 py-0.5 min-w-[1.25rem] h-5",
				md: "text-xs px-1.5 py-0.5 min-w-[1.5rem] h-6",
				lg: "text-sm px-2 py-1 min-w-[2rem] h-8",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

/** Platform-aware key symbols */
const KEY_SYMBOLS: Record<string, string> = {
	cmd: "⌘",
	command: "⌘",
	ctrl: "Ctrl",
	control: "Ctrl",
	alt: "⌥",
	option: "⌥",
	shift: "⇧",
	enter: "↵",
	return: "↵",
	backspace: "⌫",
	delete: "⌦",
	escape: "Esc",
	esc: "Esc",
	tab: "⇥",
	space: "Space",
	up: "↑",
	down: "↓",
	left: "←",
	right: "→",
};

function Kbd({
	className,
	style,
	slotStyles,
	size,
	keys,
	children,
	...props
}: KbdProps) {
	if (keys) {
		const keyArray = Array.isArray(keys) ? keys : [keys];

		if (keyArray.length > 1) {
			const root = applySlot(
				"inline-flex items-center gap-0.5",
				slotStyles?.root,
			);
			return (
				<span
					data-kala-component="kbd"
					className={root.className}
					style={mergeStyle(style, root.style)}
				>
					{keyArray.map((k, i) => (
						<kbd
							key={i}
							data-slot="kbd"
							className={cn(kbdVariants({ size }), className)}
							{...props}
						>
							{KEY_SYMBOLS[k.toLowerCase()] ?? k}
						</kbd>
					))}
				</span>
			);
		}

		const key = keyArray[0];
		const root = applySlot(
			cn(kbdVariants({ size }), className),
			slotStyles?.root,
		);
		return (
			<kbd
				data-kala-component="kbd"
				data-slot="kbd"
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			>
				{KEY_SYMBOLS[key.toLowerCase()] ?? key}
			</kbd>
		);
	}

	const root = applySlot(
		cn(kbdVariants({ size }), className),
		slotStyles?.root,
	);
	return (
		<kbd
			data-kala-component="kbd"
			data-slot="kbd"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			{children}
		</kbd>
	);
}

export { Kbd };
