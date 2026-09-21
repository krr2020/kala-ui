import type { SlotStyles } from "@kala-ui/react/lib/slot-styles";
import type * as React from "react";

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

export interface FooterProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	linkSections?: FooterLinkSection[];
	socialLinks?: SocialLink[];
	copyright?: string;
	children?: React.ReactNode;
	centered?: boolean;
	/** Per-part overrides: root, inner, centeredContent, grid, sectionTitle,
	 * sectionList, sectionLink, customContent, bottomRow, copyright, socialList, socialLink. */
	slotStyles?: SlotStyles;
}
