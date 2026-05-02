import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../lib/utils";

const kbdVariants = cva(
	"inline-flex items-center justify-center font-mono font-medium rounded border border-b-2 bg-muted text-muted-foreground shadow-sm select-none",
	{
		variants: {
			size: {
				sm: "text-[10px] px-1 py-0.5 min-w-[1.25rem] h-5",
				default: "text-xs px-1.5 py-0.5 min-w-[1.5rem] h-6",
				lg: "text-sm px-2 py-1 min-w-[2rem] h-8",
			},
		},
		defaultVariants: {
			size: "default",
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

export interface KbdProps
	extends React.ComponentProps<"kbd">,
		VariantProps<typeof kbdVariants> {
	/** Key or array of keys to display as a chord */
	keys?: string | string[];
}

function Kbd({ className, size, keys, children, ...props }: KbdProps) {
	if (keys) {
		const keyArray = Array.isArray(keys) ? keys : [keys];

		if (keyArray.length > 1) {
			return (
				<span className="inline-flex items-center gap-0.5">
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
		return (
			<kbd
				data-slot="kbd"
				className={cn(kbdVariants({ size }), className)}
				{...props}
			>
				{KEY_SYMBOLS[key.toLowerCase()] ?? key}
			</kbd>
		);
	}

	return (
		<kbd
			data-slot="kbd"
			className={cn(kbdVariants({ size }), className)}
			{...props}
		>
			{children}
		</kbd>
	);
}

export { Kbd };
