"use client";

import { useSlotStyles } from "@kala-ui/react/kala-provider";
import { applySlot } from "@kala-ui/react/lib/slot-styles";
import { cn } from "@kala-ui/react/lib/utils";
import { footerStyles } from "../../config/footer";
import type { FooterProps } from "./footer.types";

export function Footer({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	linkSections = [],
	socialLinks = [],
	copyright,
	children,
	centered = false,
	...props
}: FooterProps) {
	const slotStyles = useSlotStyles("footer", slotStylesRaw);
	const currentYear = new Date().getFullYear();
	const copyrightText = copyright || `© ${currentYear} All rights reserved.`;

	const root = applySlot(cn(footerStyles.root, className), slotStyles?.root);
	const inner = applySlot(footerStyles.inner, slotStyles?.inner);
	const centeredContent = applySlot(
		footerStyles.centeredContent,
		slotStyles?.centeredContent,
	);
	const grid = applySlot(footerStyles.grid, slotStyles?.grid);
	const sectionTitle = applySlot(
		footerStyles.sectionTitle,
		slotStyles?.sectionTitle,
	);
	const sectionList = applySlot(
		footerStyles.sectionList,
		slotStyles?.sectionList,
	);
	const sectionLink = applySlot(
		footerStyles.sectionLink,
		slotStyles?.sectionLink,
	);
	const customContent = applySlot(
		footerStyles.customContent,
		slotStyles?.customContent,
	);
	const bottomRow = applySlot(footerStyles.bottomRow, slotStyles?.bottomRow);
	const copyrightPart = applySlot(
		footerStyles.copyright,
		slotStyles?.copyright,
	);
	const socialList = applySlot(footerStyles.socialList, slotStyles?.socialList);
	const socialLink = applySlot(footerStyles.socialLink, slotStyles?.socialLink);

	return (
		<footer
			data-kala-component="footer"
			ref={ref}
			className={root.className}
			style={root.style}
			{...props}
		>
			<div className={inner.className}>
				{centered && children && (
					<div className={centeredContent.className}>{children}</div>
				)}

				<div className={grid.className}>
					{linkSections.map((section) => (
						<nav key={section.title} aria-label={`${section.title} links`}>
							<h3 className={sectionTitle.className}>{section.title}</h3>
							<ul className={sectionList.className}>
								{section.links.map((link) => (
									<li key={`${link.href}-${link.label}`}>
										<a href={link.href} className={sectionLink.className}>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</nav>
					))}

					{!centered && children && (
						<div className={customContent.className}>{children}</div>
					)}
				</div>

				<div
					className={cn(
						bottomRow.className,
						!centered && footerStyles.bottomRowSide,
						centered && footerStyles.bottomRowCentered,
					)}
				>
					<div className={copyrightPart.className}>{copyrightText}</div>

					{socialLinks.length > 0 && (
						<div className={socialList.className}>
							{socialLinks.map((social) => (
								<a
									key={social.href}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className={socialLink.className}
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
}
