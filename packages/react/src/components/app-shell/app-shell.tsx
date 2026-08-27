import * as React from "react";
import { cn } from "../../lib/utils";
import { Box } from "../box";

// Context to share configuration if needed, or just rely on CSS variables/classes
// For simplicity and flexibility, we'll use a CSS-variable based approach for layout sizing

export interface AppShellProps extends React.ComponentProps<"div"> {
	/** Header configuration */
	header?: { height: number | string };
	/** Navbar configuration */
	navbar?: {
		width: number | string;
		breakpoint?: "sm" | "md" | "lg" | "xl";
		collapsed?: { mobile?: boolean; desktop?: boolean };
	};
	/** Aside configuration */
	aside?: {
		width: number | string;
		breakpoint?: "sm" | "md" | "lg" | "xl";
		collapsed?: { mobile?: boolean; desktop?: boolean };
	};
	/** Footer configuration */
	footer?: { height: number | string };
	/** Padding for the main content */
	padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

const AppShellContext = React.createContext<AppShellProps>({});

function AppShellBase({
	children,
	className,
	header,
	navbar,
	aside,
	footer,
	padding = "md",
	ref,
	...props
}: AppShellProps) {
	// Convert padding to Tailwind class or CSS value
	const _paddingClasses = {
		none: "p-0",
		xs: "p-2",
		sm: "p-3",
		md: "p-4",
		lg: "p-6",
		xl: "p-8",
	};

	const cssVars = {
		"--app-shell-header-height":
			typeof header?.height === "number"
				? `${header.height}px`
				: (header?.height ?? "0px"),
		"--app-shell-footer-height":
			typeof footer?.height === "number"
				? `${footer.height}px`
				: (footer?.height ?? "0px"),
		"--app-shell-navbar-width":
			typeof navbar?.width === "number"
				? `${navbar.width}px`
				: (navbar?.width ?? "0px"),
		"--app-shell-aside-width":
			typeof aside?.width === "number"
				? `${aside.width}px`
				: (aside?.width ?? "0px"),
	} as React.CSSProperties;

	return (
		<AppShellContext.Provider
			value={{ header, navbar, aside, footer, padding }}
		>
			<Box
				ref={ref}
				className={cn(
					"flex min-h-screen flex-col bg-background text-foreground",
					className,
				)}
				style={cssVars}
				{...props}
			>
				{children}
			</Box>
		</AppShellContext.Provider>
	);
}

export const AppShell = Object.assign(AppShellBase, {
	Header: AppShellHeader,
	Navbar: AppShellNavbar,
	Main: AppShellMain,
	Aside: AppShellAside,
	Footer: AppShellFooter,
});

// --- Subcomponents ---

export interface AppShellHeaderProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	withBorder?: boolean;
}

function AppShellHeader({
	ref,
	className,
	withBorder = true,
	...props
}: AppShellHeaderProps) {
	const { header } = React.useContext(AppShellContext);
	if (!header) return null;

	return (
		<Box
			as="header"
			ref={ref}
			className={cn(
				"fixed top-0 left-0 right-0 z-50 flex items-center bg-background px-4",
				withBorder && "border-b",
				className,
			)}
			style={{ height: "var(--app-shell-header-height)" }}
			{...props}
		/>
	);
}
export interface AppShellNavbarProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	withBorder?: boolean;
}

function AppShellNavbar({
	ref,
	className,
	withBorder = true,
	...props
}: AppShellNavbarProps) {
	const { navbar } = React.useContext(AppShellContext);
	if (!navbar) return null;

	const collapsedMobile = navbar.collapsed?.mobile;
	const collapsedDesktop = navbar.collapsed?.desktop;

	return (
		<Box
			as="nav"
			ref={ref}
			className={cn(
				"fixed left-0 z-40 flex flex-col bg-background transition-transform duration-300 ease-in-out",
				withBorder && "border-r",
				// Mobile handling
				collapsedMobile ? "-translate-x-full" : "translate-x-0",
				// Desktop handling (simplified for now, ideally needs media query check or CSS media query)
				// For now we assume desktop is usually visible unless collapsedDesktop is true
				collapsedDesktop && "lg:-translate-x-full",
				className,
			)}
			style={{
				width: "var(--app-shell-navbar-width)",
				top: "var(--app-shell-header-height)",
				height: "calc(100vh - var(--app-shell-header-height))",
			}}
			{...props}
		/>
	);
}
export interface AppShellAsideProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	withBorder?: boolean;
}

function AppShellAside({
	ref,
	className,
	withBorder = true,
	...props
}: AppShellAsideProps) {
	const { aside } = React.useContext(AppShellContext);
	if (!aside) return null;

	const collapsedMobile = aside.collapsed?.mobile;
	const collapsedDesktop = aside.collapsed?.desktop;

	return (
		<Box
			as="aside"
			ref={ref}
			className={cn(
				"fixed right-0 z-40 flex flex-col bg-background transition-transform duration-300 ease-in-out",
				withBorder && "border-l",
				collapsedMobile ? "translate-x-full" : "translate-x-0",
				collapsedDesktop && "lg:translate-x-full",
				className,
			)}
			style={{
				width: "var(--app-shell-aside-width)",
				top: "var(--app-shell-header-height)",
				height: "calc(100vh - var(--app-shell-header-height))",
			}}
			{...props}
		/>
	);
}
export interface AppShellMainProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {}

function AppShellMain({ ref, className, ...props }: AppShellMainProps) {
	const { header, navbar, aside, footer, padding } =
		React.useContext(AppShellContext);

	const paddingClasses = {
		none: "p-0",
		xs: "p-2",
		sm: "p-3",
		md: "p-4",
		lg: "p-6",
		xl: "p-8",
	};

	return (
		<Box
			as="main"
			ref={ref}
			className={cn(
				"flex-1 transition-all duration-300 ease-in-out",
				padding && paddingClasses[padding],
				className,
			)}
			style={{
				paddingTop: header
					? "calc(var(--app-shell-header-height) + var(--padding-top, 0px))"
					: undefined,
				paddingBottom: footer
					? "calc(var(--app-shell-footer-height) + var(--padding-bottom, 0px))"
					: undefined,
				paddingLeft: navbar
					? "calc(var(--app-shell-navbar-width) + var(--padding-left, 0px))"
					: undefined,
				paddingRight: aside
					? "calc(var(--app-shell-aside-width) + var(--padding-right, 0px))"
					: undefined,
				// Note: Real responsive margin adjustment requires media queries matching the navbar breakpoint
				// For this basic implementation, we assume the navbar takes space.
				// Users can override margins with Tailwind classes if needed for responsive behavior.
			}}
			{...props}
		/>
	);
}
export interface AppShellFooterProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	withBorder?: boolean;
}

function AppShellFooter({
	ref,
	className,
	withBorder = true,
	...props
}: AppShellFooterProps) {
	const { footer } = React.useContext(AppShellContext);
	if (!footer) return null;

	return (
		<Box
			as="footer"
			ref={ref}
			className={cn(
				"fixed bottom-0 left-0 right-0 z-50 flex items-center bg-background px-4",
				withBorder && "border-t",
				className,
			)}
			style={{ height: "var(--app-shell-footer-height)" }}
			{...props}
		/>
	);
}
// Attach subcomponents
