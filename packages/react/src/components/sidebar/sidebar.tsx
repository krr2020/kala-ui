"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../button";

export interface SidebarLink {
	label: string;
	href: string;
	icon?: ReactNode;
	badge?: string | number;
}

export interface SidebarSection {
	title?: string;
	links: SidebarLink[];
	collapsible?: boolean;
	defaultOpen?: boolean;
}

export interface SidebarProps {
	/**
	 * Logo or brand element to display at the top
	 */
	logo?: ReactNode;
	/**
	 * Navigation sections with links
	 */
	navSections?: SidebarSection[];
	/**
	 * Current pathname for active link detection
	 */
	pathname?: string;
	/**
	 * Whether sidebar is open (for mobile)
	 */
	isOpen?: boolean;
	/**
	 * Callback when sidebar should close (mobile)
	 */
	onClose?: () => void;
	/**
	 * Additional CSS classes
	 */
	className?: string;
	/**
	 * Footer content
	 */
	footer?: ReactNode;
}

export function Sidebar({
	logo,
	navSections = [],
	pathname = "",
	isOpen = true,
	onClose,
	className,
	footer,
}: SidebarProps) {
	// Track which sections are expanded
	const [expandedSections, setExpandedSections] = useState<Set<number>>(
		new Set(
			navSections
				.map((section, index) => (section.defaultOpen !== false ? index : -1))
				.filter((index) => index !== -1),
		),
	);

	const toggleSection = (index: number) => {
		setExpandedSections((prev) => {
			const next = new Set(prev);
			if (next.has(index)) {
				next.delete(index);
			} else {
				next.add(index);
			}
			return next;
		});
	};

	const isLinkActive = (href: string) => {
		if (href === "/") {
			return pathname === "/";
		}
		return pathname.startsWith(href);
	};

	return (
		<>
			{/* Mobile overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-30 md:hidden animate-fade-in transition-opacity duration-200 ease-out"
					onClick={onClose}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar */}
			<aside
				data-comp="sidebar"
				className={cn(
					"fixed left-0 top-0 z-30 h-full w-64 bg-popover border-r text-foreground transition-transform duration-300 ease-out flex flex-col theme-card",
					"md:translate-x-0 md:z-10",
					isOpen ? "animate-slide-in-from-left" : "-translate-x-full",
					className,
				)}
			>
				{/* Logo area */}
				{logo && (
					<div className="flex items-center h-16 px-6 border-b">{logo}</div>
				)}

				{/* Navigation */}
				<nav className="flex-1 overflow-y-auto py-4 px-3">
					{navSections.map((section, sectionIndex) => {
						const isExpanded = expandedSections.has(sectionIndex);
						const hasTitle = section.title;
						const isCollapsible = section.collapsible && hasTitle;

						return (
							<div
								key={section.title ?? `section-${sectionIndex}`}
								className="mb-6 last:mb-0"
							>
								{/* Section title */}
								{hasTitle && (
									<Button
										variant="ghost"
										className={cn(
											"w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider h-auto py-0 hover:bg-transparent",
											isCollapsible && "cursor-pointer hover:text-foreground",
											!isCollapsible && "cursor-default opacity-100",
										)}
										onClick={
											isCollapsible
												? () => toggleSection(sectionIndex)
												: undefined
										}
										disabled={!isCollapsible}
										aria-expanded={isCollapsible ? isExpanded : undefined}
									>
										<span>{section.title}</span>
										{isCollapsible && (
											<ChevronDown
												className={cn(
													"size-4 transition-transform",
													isExpanded && "rotate-180",
												)}
											/>
										)}
									</Button>
								)}

								{/* Section links */}
								{(!isCollapsible || isExpanded) && (
									<div className="space-y-1">
										{section.links.map((link) => {
											const active = isLinkActive(link.href);

											return (
												<a
													key={link.href}
													href={link.href}
													onClick={onClose}
													className={cn(
														"flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
														active
															? "bg-primary text-primary-foreground"
															: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
													)}
												>
													{link.icon && (
														<span className="shrink-0">{link.icon}</span>
													)}
													<span className="flex-1 truncate">{link.label}</span>
													{link.badge !== undefined && (
														<span
															className={cn(
																"shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full",
																active
																	? "bg-primary-foreground/20 text-primary-foreground"
																	: "bg-muted text-muted-foreground",
															)}
														>
															{link.badge}
														</span>
													)}
												</a>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
				</nav>

				{/* Footer */}
				{footer && <div className="border-t p-4">{footer}</div>}
			</aside>
		</>
	);
}
