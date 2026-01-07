"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface FooterLink {
	label: string;
	href: string;
}

export interface FooterLinkSection {
	title: string;
	links: FooterLink[];
}

export interface SocialLink {
	name: string;
	href: string;
	icon: React.ReactNode;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
	/**
	 * Sections of links to display in columns
	 */
	linkSections?: FooterLinkSection[];
	/**
	 * Social media links with icons
	 */
	socialLinks?: SocialLink[];
	/**
	 * Copyright text
	 */
	copyright?: string;
	/**
	 * Additional content to display in footer (e.g., newsletter signup)
	 */
	children?: React.ReactNode;
	/**
	 * Center align all content
	 */
	centered?: boolean;
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
	(
		{
			className,
			linkSections = [],
			socialLinks = [],
			copyright,
			children,
			centered = false,
			...props
		},
		ref,
	) => {
		const currentYear = new Date().getFullYear();
		const copyrightText = copyright || `© ${currentYear} All rights reserved.`;

		return (
			<footer
				ref={ref}
				data-comp="footer"
				className={cn(
					"w-full bg-muted text-muted-foreground border-t",
					className,
				)}
				{...props}
			>
				<div className="container mx-auto px-4 py-8 md:py-12">
					{/* Centered Content (Top) */}
					{centered && children && (
						<div className="mb-12 flex flex-col items-center text-center">
							{children}
						</div>
					)}

					{/* Main Footer Content */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
						{/* Link Sections */}
						{linkSections.map((section) => (
							<nav key={section.title} aria-label={`${section.title} links`}>
								<h3 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-4">
									{section.title}
								</h3>
								<ul className="space-y-2">
									{section.links.map((link) => (
										<li key={`${link.href}-${link.label}`}>
											<a
												href={link.href}
												className="text-muted-foreground hover:text-primary transition-colors text-sm"
											>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</nav>
						))}

						{/* Custom Content (In-grid for non-centered) */}
						{!centered && children && (
							<div className="md:col-span-2 lg:col-span-1">{children}</div>
						)}
					</div>

					{/* Bottom Section */}
					<div
						className={cn(
							"border-t pt-8 flex flex-col gap-4",
							!centered && "md:flex-row md:justify-between md:items-center",
							centered && "items-center",
						)}
					>
						{/* Copyright */}
						<div className="text-sm text-muted-foreground order-2 md:order-1">
							{copyrightText}
						</div>

						{/* Social Links */}
						{socialLinks.length > 0 && (
							<div className="flex items-center gap-4 order-1 md:order-2">
								{socialLinks.map((social) => (
									<a
										key={social.href}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground hover:text-primary transition-colors"
										aria-label={social.name}
									>
										{social.icon}
									</a>
								))}
							</div>
						)}
					</div>
				</div>
			</footer>
		);
	},
);

Footer.displayName = "Footer";
