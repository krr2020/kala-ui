export const avatarStyles = {
	base: "relative flex shrink-0 items-center justify-center",
	variants: {
		size: {
			xs: "size-6 text-xs",
			sm: "size-8 text-sm",
			default: "size-10 text-sm",
			md: "size-12 text-base",
			lg: "size-14 text-lg",
			xl: "size-16 text-xl",
			xxl: "size-20 text-2xl",
		},
		shape: {
			circle: "rounded-full",
			rounded: "rounded-md",
			square: "rounded-none",
		},
		status: {
			none: "",
			online: "",
			offline: "",
		},
	},
	compoundVariants: [
		// Online status indicators scaled by size
		{
			status: "online",
			size: "xs",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-1.5 before:rounded-full before:bg-success before:ring-1 before:ring-background before:z-10',
		},
		{
			status: "online",
			size: "sm",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-2 before:rounded-full before:bg-success before:ring-1 before:ring-background before:z-10',
		},
		{
			status: "online",
			size: "default",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-2.5 before:rounded-full before:bg-success before:ring-2 before:ring-background before:z-10',
		},
		{
			status: "online",
			size: "md",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-3 before:rounded-full before:bg-success before:ring-2 before:ring-background before:z-10',
		},
		{
			status: "online",
			size: "lg",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-3.5 before:rounded-full before:bg-success before:ring-2 before:ring-background before:z-10',
		},
		{
			status: "online",
			size: "xl",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-4 before:rounded-full before:bg-success before:ring-2 before:ring-background before:z-10',
		},
		{
			status: "online",
			size: "xxl",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-5 before:rounded-full before:bg-success before:ring-2 before:ring-background before:z-10',
		},
		// Offline status indicators scaled by size
		{
			status: "offline",
			size: "xs",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-1.5 before:rounded-full before:bg-muted-foreground before:ring-1 before:ring-background before:z-10',
		},
		{
			status: "offline",
			size: "sm",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-2 before:rounded-full before:bg-muted-foreground before:ring-1 before:ring-background before:z-10',
		},
		{
			status: "offline",
			size: "default",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-2.5 before:rounded-full before:bg-muted-foreground before:ring-2 before:ring-background before:z-10',
		},
		{
			status: "offline",
			size: "md",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-3 before:rounded-full before:bg-muted-foreground before:ring-2 before:ring-background before:z-10',
		},
		{
			status: "offline",
			size: "lg",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-3.5 before:rounded-full before:bg-muted-foreground before:ring-2 before:ring-background before:z-10',
		},
		{
			status: "offline",
			size: "xl",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-4 before:rounded-full before:bg-muted-foreground before:ring-2 before:ring-background before:z-10',
		},
		{
			status: "offline",
			size: "xxl",
			className:
				'before:content-[""] before:absolute before:bottom-0 before:right-0 before:size-5 before:rounded-full before:bg-muted-foreground before:ring-2 before:ring-background before:z-10',
		},
	],
	defaultVariants: {
		size: "default",
		shape: "circle",
		status: "none",
	} as const,
};

export const avatarImageStyles = {
	base: "aspect-square size-full object-cover overflow-hidden",
	variants: {
		shape: {
			circle: "rounded-full",
			rounded: "rounded-md",
			square: "rounded-none",
		},
	},
	defaultVariants: {
		shape: "circle",
	} as const,
};

export const avatarFallbackStyles = {
	base: "flex size-full items-center justify-center font-medium uppercase overflow-hidden",
	variants: {
		shape: {
			circle: "rounded-full",
			rounded: "rounded-md",
			square: "rounded-none",
		},
		variant: {
			default: "bg-primary text-primary-foreground",
			primary: "bg-primary text-primary-foreground",
			secondary: "bg-secondary text-secondary-foreground",
			success: "bg-success text-success-foreground",
			warning: "bg-warning text-warning-foreground",
			danger: "bg-destructive text-destructive-foreground",
			destructive: "bg-destructive text-destructive-foreground",
			info: "bg-info text-info-foreground",
			muted: "bg-muted text-muted-foreground",
		},
	},
	defaultVariants: {
		shape: "circle",
		variant: "default",
	} as const,
};
