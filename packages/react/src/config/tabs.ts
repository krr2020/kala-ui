export const tabsListStyles = {
	base: "flex items-center w-fit rounded-[var(--kala-radius-card)] text-muted-foreground relative",
	variants: {
		variant: {
			default: "bg-muted p-1 h-[var(--kala-control-h)]",
			line: "bg-transparent p-0 h-auto w-full rounded-none min-h-[44px] items-stretch gap-0 border-b border-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
			vertical: "flex-col h-auto bg-transparent p-0 items-stretch",
		},
		align: {
			start: "justify-start",
			center: "justify-center",
			end: "justify-end",
		},
	},
	defaultVariants: {
		variant: "default",
		align: "start",
	} as const,
};

export const tabsTriggerStyles = {
	base: "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all kala-focus-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
	variants: {
		variant: {
			default:
				"rounded-[var(--kala-radius-control)] data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm",
			line: "relative rounded-none shrink-0 min-h-[40px] px-4 py-2 font-semibold bg-transparent border-0 rounded-t-[var(--kala-radius-control)] text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:text-primary data-[state=active]:bg-primary/10 after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-transparent after:[clip-path:polygon(0_100%,4px_0,calc(100%_-_4px)_0,100%_100%)] after:content-[''] data-[state=active]:after:bg-primary",
			vertical:
				"justify-start rounded-md px-4 py-2 hover:bg-muted data-[state=active]:bg-muted data-[state=active]:text-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
	} as const,
};

export const tabsContentStyles = {
	base: "mt-4 kala-focus-ring",
};
