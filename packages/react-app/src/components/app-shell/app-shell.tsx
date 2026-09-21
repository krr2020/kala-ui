import { Box } from "@kala-ui/react/box";
import { useSlotStyles } from "@kala-ui/react/kala-provider";
import { applySlot } from "@kala-ui/react/lib/slot-styles";
import { cn } from "@kala-ui/react/lib/utils";
import * as React from "react";
import { appShellStyles } from "../../config/app-shell";
import type {
	AppShellAsideProps,
	AppShellFooterProps,
	AppShellHeaderProps,
	AppShellMainProps,
	AppShellNavbarProps,
	AppShellProps,
} from "./app-shell.types";

type ShellConfig = AppShellProps;
const AppShellContext = React.createContext<ShellConfig>({});

function AppShellBase({
	children,
	className,
	style,
	slotStyles: slotStylesRaw,
	header,
	navbar,
	aside,
	footer,
	padding = "md",
	ref,
	...props
}: AppShellProps) {
	const slotStyles = useSlotStyles("app-shell", slotStylesRaw);

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

	const root = applySlot(cn(appShellStyles.base, className), slotStyles?.root);

	return (
		<AppShellContext.Provider
			data-kala-component="app-shell-base"
			value={{ header, navbar, aside, footer, padding }}
		>
			<Box
				data-kala-component="app-shell"
				ref={ref}
				className={root.className}
				style={{ ...cssVars, ...root.style }}
				{...props}
			>
				{children}
			</Box>
		</AppShellContext.Provider>
	);
}

// --- Subcomponents ---

function AppShellHeader({
	ref,
	className,
	withBorder = true,
	slotStyles: slotStylesRaw,
	...props
}: AppShellHeaderProps) {
	const { header } = React.useContext(AppShellContext);
	const slotStyles = useSlotStyles("app-shell", slotStylesRaw);
	if (!header) return null;

	const part = applySlot(
		cn(
			appShellStyles.header,
			withBorder && appShellStyles.headerBorder,
			className,
		),
		slotStyles?.header,
	);

	return (
		<Box
			data-kala-component="app-shell-header"
			as="header"
			ref={ref}
			className={part.className}
			style={{ height: "var(--app-shell-header-height)", ...part.style }}
			{...props}
		/>
	);
}

function AppShellNavbar({
	ref,
	className,
	withBorder = true,
	slotStyles: slotStylesRaw,
	...props
}: AppShellNavbarProps) {
	const { navbar } = React.useContext(AppShellContext);
	const slotStyles = useSlotStyles("app-shell", slotStylesRaw);
	if (!navbar) return null;

	const variant = `${navbar.breakpoint ?? "md"}:`;
	const part = applySlot(
		cn(
			appShellStyles.navbar,
			withBorder && appShellStyles.navbarBorder,
			"-translate-x-full",
			`${variant}translate-x-0`,
			className,
		),
		slotStyles?.navbar,
	);

	return (
		<Box
			data-kala-component="app-shell-navbar"
			as="nav"
			ref={ref}
			className={part.className}
			style={{
				width: "var(--app-shell-navbar-width)",
				top: "var(--app-shell-header-height)",
				height: "calc(100vh - var(--app-shell-header-height))",
				...part.style,
			}}
			{...props}
		/>
	);
}

function AppShellAside({
	ref,
	className,
	withBorder = true,
	slotStyles: slotStylesRaw,
	...props
}: AppShellAsideProps) {
	const { aside } = React.useContext(AppShellContext);
	const slotStyles = useSlotStyles("app-shell", slotStylesRaw);
	if (!aside) return null;

	const variant = `${aside.breakpoint ?? "md"}:`;
	const part = applySlot(
		cn(
			appShellStyles.aside,
			withBorder && appShellStyles.asideBorder,
			"translate-x-full",
			`${variant}translate-x-0`,
			className,
		),
		slotStyles?.aside,
	);

	return (
		<Box
			data-kala-component="app-shell-aside"
			as="aside"
			ref={ref}
			className={part.className}
			style={{
				width: "var(--app-shell-aside-width)",
				top: "var(--app-shell-header-height)",
				height: "calc(100vh - var(--app-shell-header-height))",
				...part.style,
			}}
			{...props}
		/>
	);
}

function AppShellMain({
	ref,
	className,
	slotStyles: slotStylesRaw,
	...props
}: AppShellMainProps) {
	const { header, navbar, aside, footer, padding } =
		React.useContext(AppShellContext);
	const slotStyles = useSlotStyles("app-shell", slotStylesRaw);

	const part = applySlot(
		cn(
			appShellStyles.main,
			padding && appShellStyles.padding[padding],
			header && "pt-[var(--app-shell-header-height)]",
			footer && "pb-[var(--app-shell-footer-height)]",
			// Side offsets only reserve space while the fixed panels are
			// actually docked (breakpoint and up).
			navbar &&
				`${navbar.breakpoint ?? "md"}:pl-[var(--app-shell-navbar-width)]`,
			aside && `${aside.breakpoint ?? "md"}:pr-[var(--app-shell-aside-width)]`,
			className,
		),
		slotStyles?.main,
	);

	return (
		<Box
			data-kala-component="app-shell-main"
			as="main"
			ref={ref}
			className={part.className}
			style={part.style}
			{...props}
		/>
	);
}

function AppShellFooter({
	ref,
	className,
	withBorder = true,
	slotStyles: slotStylesRaw,
	...props
}: AppShellFooterProps) {
	const { footer } = React.useContext(AppShellContext);
	const slotStyles = useSlotStyles("app-shell", slotStylesRaw);
	if (!footer) return null;

	const part = applySlot(
		cn(
			appShellStyles.footer,
			withBorder && appShellStyles.footerBorder,
			className,
		),
		slotStyles?.footer,
	);

	return (
		<Box
			data-kala-component="app-shell-footer"
			as="footer"
			ref={ref}
			className={part.className}
			style={{ height: "var(--app-shell-footer-height)", ...part.style }}
			{...props}
		/>
	);
}

export const AppShell = Object.assign(AppShellBase, {
	Header: AppShellHeader,
	Navbar: AppShellNavbar,
	Main: AppShellMain,
	Aside: AppShellAside,
	Footer: AppShellFooter,
});

export type {
	AppShellAsideProps,
	AppShellFooterProps,
	AppShellHeaderProps,
	AppShellMainProps,
	AppShellNavbarProps,
	AppShellProps,
} from "./app-shell.types";
