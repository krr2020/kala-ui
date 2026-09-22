"use client";

import { useClickOutside } from "@kala-ui/react-hooks";
import { cn } from "@kala-ui/react/lib/utils";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { isActivePath } from "../../lib/active-path";
import type { NavigationLink, NavigationProps } from "./navigation.types";

export function Navigation({
	ref,
	className,
	links,
	orientation = "horizontal",
	mobileLayout = "dropdown",
	pathname = "",
	...props
}: NavigationProps) {
	const [isMobileOpen, setIsMobileOpen] = React.useState(false);

	const isActive = (href: string) => isActivePath(pathname, href);

	// Close mobile menu when clicking outside the wrapper (toggle + dropdown);
	// React bails out on the redundant setState while already closed.
	const mobileNavRef = useClickOutside<HTMLDivElement>(() => {
		setIsMobileOpen(false);
	});

	// Vertical desktop navigation (explicit opt-in via orientation)
	if (orientation === "vertical") {
		return (
			<nav
				data-kala-component="navigation"
				className={cn(
					orientation === "vertical"
						? "hidden md:flex md:flex-col gap-2"
						: "flex md:hidden flex-col gap-2",
					className,
				)}
				aria-label="Navigation"
				{...props}
				ref={ref}
			>
				{links.map((link) => (
					<a
						key={link.href}
						href={link.href}
						className={cn(
							"text-sm font-medium px-3 py-2 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
							isActive(link.href)
								? "bg-accent text-accent-foreground"
								: "text-foreground hover:bg-accent hover:text-accent-foreground",
						)}
						aria-current={isActive(link.href) ? "page" : undefined}
					>
						{link.label}
					</a>
				))}
			</nav>
		);
	}

	// Horizontal on desktop + stacked vertical list on mobile
	if (mobileLayout === "vertical") {
		return (
			<>
				<nav
					data-kala-component="navigation"
					className={cn(
						"hidden md:flex flex-row items-center gap-6",
						className,
					)}
					aria-label="Main navigation"
					{...props}
					ref={ref}
				>
					{links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className={cn(
								"text-sm font-medium transition-colors hover:text-primary outline-none focus-visible:underline",
								isActive(link.href) ? "text-primary" : "text-foreground",
							)}
							aria-current={isActive(link.href) ? "page" : undefined}
						>
							{link.label}
						</a>
					))}
				</nav>

				<nav
					data-kala-component="navigation"
					className={cn("flex md:hidden flex-col gap-2", className)}
					aria-label="Mobile navigation"
				>
					{links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className={cn(
								"text-sm font-medium px-3 py-2 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
								isActive(link.href)
									? "bg-accent text-accent-foreground"
									: "text-foreground hover:bg-accent hover:text-accent-foreground",
							)}
							aria-current={isActive(link.href) ? "page" : undefined}
						>
							{link.label}
						</a>
					))}
				</nav>
			</>
		);
	}

	// Horizontal desktop + dropdown mobile
	return (
		<>
			{/* Desktop Horizontal Navigation */}
			<nav
				data-kala-component="navigation"
				className={cn("hidden md:flex flex-row items-center gap-6", className)}
				aria-label="Main navigation"
				{...props}
				ref={ref}
			>
				{links.map((link) => (
					<a
						key={link.href}
						href={link.href}
						className={cn(
							"text-sm font-medium transition-colors hover:text-primary outline-none focus-visible:underline",
							isActive(link.href) ? "text-primary" : "text-foreground",
						)}
						aria-current={isActive(link.href) ? "page" : undefined}
					>
						{link.label}
					</a>
				))}
			</nav>

				{/* Mobile Dropdown Navigation */}
			<div
				data-kala-component="navigation"
				className="md:hidden"
				ref={mobileNavRef}
			>
				<button
					type="button"
					onClick={() => setIsMobileOpen(!isMobileOpen)}
					className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1"
					aria-label="Toggle mobile navigation"
					aria-expanded={isMobileOpen}
				>
					Menu
					<ChevronDown
						className={cn(
							"size-4 transition-transform",
							isMobileOpen && "rotate-180",
						)}
					/>
				</button>
					{isMobileOpen && (
					<nav
						className="mt-2 flex flex-col gap-2 bg-popover border rounded-md p-3 text-popover-foreground kala-surface-popover"
						aria-label="Mobile navigation"
					>
						{links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								onClick={() => setIsMobileOpen(false)}
								className={cn(
									"text-sm font-medium px-3 py-2 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
									isActive(link.href)
										? "bg-accent text-accent-foreground"
										: "text-foreground hover:bg-accent hover:text-accent-foreground",
								)}
								aria-current={isActive(link.href) ? "page" : undefined}
							>
								{link.label}
							</a>
						))}
					</nav>
				)}
			</div>
		</>
	);
}
