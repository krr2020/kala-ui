"use client";

import {
	useFocusTrap,
	useMediaQuery,
	useMergedRef,
	useScrollLock,
} from "@kala-ui/react-hooks";
import { ChevronDown } from "lucide-react";
import type * as React from "react";
import { type ReactNode, useEffect, useId, useState } from "react";
import { cn, isActivePath } from "../../lib/utils";
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

export interface SidebarProps
	extends Omit<React.ComponentProps<"aside">, "color"> {
	/**
	 * Logo or brand element to display at the top
	 */
	logo?: ReactNode;
	/**
	 * Navigation sections with links
	 */
	navSections?: SidebarSection[];
	/**
	 * Current pathname to highlight active links
	 */
	pathname?: string;
	/**
	 * Whether the sidebar is open
	 * @default true
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
	ref,
	...props
}: SidebarProps) {
	// Mobile overlay behavior: on small screens the sidebar acts as a modal
	// drawer (Escape to close, focus trap, background scroll lock).
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const overlayActive = isOpen && !isDesktop;
	const [, setScrollLocked] = useScrollLock();
	const trapRef = useFocusTrap(overlayActive);
	const headingBaseId = useId();

	useEffect(() => {
		setScrollLocked(overlayActive);
	}, [overlayActive, setScrollLocked]);

	useEffect(() => {
		if (!overlayActive) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose?.();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [overlayActive, onClose]);

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

	const isLinkActive = (href: string) => isActivePath(pathname, href);

	const renderLink = (link: SidebarLink) => {
		const active = isLinkActive(link.href);

		return (
			<a
				key={link.href}
				href={link.href}
				onClick={onClose}
				className={cn(
					"flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
					active
						? "bg-primary text-primary-foreground"
						: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
				)}
			>
				{link.icon && <span className="shrink-0">{link.icon}</span>}
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
	};

	const sidebarContent = (
		<>
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
					const panelId = `${headingBaseId}-section-${sectionIndex}`;

					return (
						<div
							key={section.title ?? `section-${sectionIndex}`}
							className="mb-6 last:mb-0"
						>
							{/* Section title: a real heading, or a toggle button for collapsible sections */}
							{hasTitle &&
								(isCollapsible ? (
									<Button
										variant="ghost"
										className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider h-auto py-0 hover:bg-transparent cursor-pointer hover:text-foreground"
										onClick={() => toggleSection(sectionIndex)}
										aria-expanded={isExpanded}
										aria-controls={panelId}
									>
										<span>{section.title}</span>
										<ChevronDown
											className={cn(
												"size-4 transition-transform",
												isExpanded && "rotate-180",
											)}
										/>
									</Button>
								) : (
									<h3 className="flex items-center justify-between px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
										{section.title}
									</h3>
								))}

							{/* Section links */}
							{!isCollapsible ? (
								<div className="space-y-1">
									{section.links.map((link) => renderLink(link))}
								</div>
							) : (
								<div id={panelId} className="space-y-1" hidden={!isExpanded}>
									{section.links.map((link) => renderLink(link))}
								</div>
							)}
						</div>
					);
				})}
			</nav>

			{/* Footer */}
			{footer && <div className="border-t p-4">{footer}</div>}
		</>
	);

	// The sidebar is a plain <aside> on desktop; on mobile it becomes a modal
	// dialog — role=dialog is not allowed on <aside>, so the element itself
	// switches with the viewport.
	const shellRef = useMergedRef(ref, trapRef);

	const shellClassName = cn(
		"fixed left-0 top-0 z-30 h-full w-64 bg-popover border-r text-foreground transition-transform duration-300 ease-out flex flex-col kala-surface-card",
		"md:translate-x-0 md:z-10",
		isOpen ? "animate-slide-in-from-left" : "-translate-x-full",
		className,
	);

	return (
		<>
			{/* Mobile overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-overlay z-30 md:hidden animate-fade-in transition-opacity duration-200 ease-out"
					onClick={onClose}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar */}
			{overlayActive ? (
				<div
					ref={shellRef}
					data-comp="sidebar"
					role="dialog"
					aria-modal="true"
					aria-label="Sidebar"
					className={shellClassName}
					{...props}
				>
					{sidebarContent}
				</div>
			) : (
				<aside
					ref={shellRef}
					data-comp="sidebar"
					className={shellClassName}
					{...props}
				>
					{sidebarContent}
				</aside>
			)}
		</>
	);
}
