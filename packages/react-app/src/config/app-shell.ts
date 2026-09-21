export const appShellStyles = {
	base: "flex min-h-screen flex-col bg-background text-foreground",
	header:
		"fixed top-0 left-0 right-0 z-50 flex items-center bg-background px-4",
	headerBorder: "border-b",
	navbar:
		"fixed left-0 z-40 flex flex-col bg-background transition-transform duration-300 ease-in-out",
	navbarBorder: "border-r",
	aside:
		"fixed right-0 z-40 flex flex-col bg-background transition-transform duration-300 ease-in-out",
	asideBorder: "border-l",
	main: "flex-1 transition-all duration-300 ease-in-out",
	footer:
		"fixed bottom-0 left-0 right-0 z-50 flex items-center bg-background px-4",
	footerBorder: "border-t",
	padding: {
		none: "p-0",
		xs: "p-2",
		sm: "p-3",
		md: "p-4",
		lg: "p-6",
		xl: "p-8",
	} as Record<string, string>,
};
