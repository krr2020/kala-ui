export const tableHeaderStyles = {
	base: "bg-muted/50 [&_tr]:border-b [&_tr]:border-border",
};

export const tableBodyStyles = {
	base: "[&_tr:last-child]:border-0 text-foreground",
};

export const tableFooterStyles = {
	base: "bg-muted/50 border-t border-border font-medium [&>tr]:last:border-b-0",
};

export const tableRowStyles = {
	base: "hover:bg-muted/50 data-[state=selected]:bg-muted border-b border-border transition-colors",
};

export const tableHeadStyles = {
	base: "text-muted-foreground h-10 px-4 text-left align-middle font-semibold text-xs uppercase tracking-wider whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]",
};

export const tableCellStyles = {
	base: "px-4 py-3 align-middle text-sm whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]",
};

export const tableCaptionStyles = {
	base: "text-muted-foreground mt-4 text-sm",
};
