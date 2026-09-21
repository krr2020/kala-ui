export const sessionCardStyles = {
	root: "relative",
	header: "pb-3",
	headerRow: "flex items-start justify-between gap-4",
	headerMain: "flex items-start gap-3 flex-1",
	deviceIcon: "size-6 text-muted-foreground mt-0.5",
	titleBlock: "flex-1 min-w-0",
	titleRow: "flex items-center gap-2 flex-wrap",
	title: "font-semibold text-sm",
	subtitle: "text-xs text-muted-foreground mt-0.5",
	currentBadge:
		"inline-flex items-center rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success border border-success/20",
	revokeButton:
		"text-destructive hover:text-destructive hover:bg-destructive/10",
	content: "pt-0",
	detailList: "space-y-1.5 text-xs text-muted-foreground",
	detailRow: "flex items-center gap-1.5",
	detailIcon: "size-3.5",
};

export const sessionCardSkeletonStyles = {
	root: "relative",
	headerRow: "flex items-start justify-between gap-4",
	headerMain: "flex items-start gap-3 flex-1",
	deviceIcon: "rounded-md",
	titleBlock: "flex-1 min-w-0",
	titleSkeleton: "h-4 w-32 mb-1",
	subtitleSkeleton: "h-3 w-48",
	badgeSkeleton: "h-5 w-24 rounded-md",
	revokeSkeleton: "h-8 w-16 rounded-md",
	detailList: "space-y-1.5",
	detailRowMedium: "h-4 w-48",
	detailRowNarrow: "h-4 w-40",
	detailRowWide: "h-4 w-56",
};
