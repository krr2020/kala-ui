export const metricCardColorStyles: Record<string, string> = {
	primary:
		"bg-gradient-to-br from-primary to-primary/90 text-primary-foreground",
	secondary:
		"bg-gradient-to-br from-secondary to-secondary/90 text-secondary-foreground",
	destructive:
		"bg-gradient-to-br from-destructive to-destructive/90 text-destructive-foreground",
	success:
		"bg-gradient-to-br from-success to-success/90 text-success-foreground",
	warning:
		"bg-gradient-to-br from-warning to-warning/90 text-warning-foreground",
	info: "bg-gradient-to-br from-info to-info/90 text-info-foreground",
	muted: "bg-card border text-card-foreground",
};

export const metricCardStyles = {
	body: "p-6",
	head: "flex items-center justify-between mb-4",
	title: "text-xs font-semibold uppercase tracking-wide",
	icon: "",
	value: "text-4xl font-bold leading-none",
	meta: "text-sm",
	change: "flex items-center gap-1",
	subtitle: "",
};

export const metricCardChangeColors = {
	up: "text-success",
	down: "text-destructive",
	flat: "text-muted-foreground",
} as const;

export const metricCardSkeletonStyles = {
	body: "p-6",
	head: "flex items-center justify-between mb-4",
	title: "h-4 w-24",
	icon: "rounded-md",
	valueBlock: "mb-3",
	value: "h-10 w-32",
	meta: "text-sm",
	metaLine: "h-4 w-32",
};
