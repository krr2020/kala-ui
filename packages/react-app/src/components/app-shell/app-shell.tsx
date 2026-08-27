import { Box } from "@kala-ui/react/box";
import { cn } from "@kala-ui/react/lib/utils";
import * as React from "react";

// Context to share configuration if needed, or just rely on CSS variables/classes
// For simplicity and flexibility, we'll use a CSS-variable based approach for layout sizing

export interface AppShellProps extends React.ComponentProps<"div"> {
	/** Header configuration */
	header?: { height: number | string };
	/**
	 * Navbar configuration. The navbar sits off-canvas below `breakpoint`
	 * and reserves Main's left padding from it upward.
	 */
	navbar?: {
		width: number | string;
		breakpoint?: "sm" | "md" | "lg" | "xl";
	};
	/** Aside configuration. Mirrors the navbar on the right edge. */
	aside?: {
		width: number | string;
		breakpoint?: "sm" | "md" | "lg" | "xl";
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

	// Off-canvas below the configured breakpoint, docked from it upward.
	const variant = `${navbar.breakpoint ?? "md"}:`;

	return (
		<Box
			as="nav"
			ref={ref}
			className={cn(
				"fixed left-0 z-40 flex flex-col bg-background transition-transform duration-300 ease-in-out",
				withBorder && "border-r",
				"-translate-x-full",
				`${variant}translate-x-0`,
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

	const variant = `${aside.breakpoint ?? "md"}:`;

	return (
		<Box
			as="aside"
			ref={ref}
			className={cn(
				"fixed right-0 z-40 flex flex-col bg-background transition-transform duration-300 ease-in-out",
				withBorder && "border-l",
				"translate-x-full",
				`${variant}translate-x-0`,
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
				header && "pt-[var(--app-shell-header-height)]",
				footer && "pb-[var(--app-shell-footer-height)]",
				// Side offsets only reserve space while the fixed panels are
				// actually docked (breakpoint and up).
				navbar &&
					`${navbar.breakpoint ?? "md"}:pl-[var(--app-shell-navbar-width)]`,
				aside &&
					`${aside.breakpoint ?? "md"}:pr-[var(--app-shell-aside-width)]`,
				className,
			)}
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
